const User = require('../../model/userModel')
const bcrypt = require("bcrypt")
const saltRounds = 10;
const config = require('../../token/config').secret
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const userModel = require('../../model/userModel');
const cron = require('node-cron');
const msg = require('../../utils/constants')



const userController = {

    //login Api
    async login(req, res) {
        await User.findOne({ email: req.body.email }).then((resp) => {
            // console.log()
            bcrypt.compare(req.body.password, resp.password, function (err, result) {
                if (result) {
                    var token = jwt.sign({ id: resp._id, firstName: resp.firstName, lastName: resp.lastName, phone: resp.phone, city: resp.city, email: resp.email }, config, { expiresIn: '24h' })
                    res.status(200).json({
                        success: true,
                        token,
                        message: msg.WEL_DASHBD
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "Invalid Password",
                    });
                }

            })

        }).catch((err) => {
            res.status(400).json({
                success: false,
                message: msg.USER_NOTEXIST,
            });
        })


    },

    //Register Api
    async register(req, res) {
        // console.log(req.body)
        // console.log(req.files)
        console.log(req.files)

        await User.findOne({ email: req.body.email }).then((result) => {
            if (result) {
                res.status(400).json({

                    success: false,
                    message: msg.USER_EXIST,
                });
            } else {
                let user
                const hashPass = bcrypt.hashSync(req.body.password, saltRounds)
                // for(let i=0;i<req.files.length;i++){

                user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phone: req.body.phone,
                    city: req.body.city,
                    email: req.body.email,
                    password: hashPass,
                  
                });


                user.save().then(ress => {
                    res.status(200).json({
                        success: true,
                        message: msg.USER_CRT,
                    });
                })

            }
        }).catch((err) => {
            console.log(err);
            res.status(400).json({ success: false, message: msg.ERR_400 });

        })
    },

    //Get User
    async getUser(req, res) {
         try {
            let tokenauth = req.headers.authorization
            const tokenWithoutBearer = tokenauth.replace("Bearer ", "");
            await jwt.verify(tokenWithoutBearer, config, function (err, decode) {
                if(err){
                    res.status(401).json({
                        success: false,
                        message: "Sorry, Something went Wrong"
                    })
                }else{
                    User.findById({ _id: decode.id }).then((result) => {
                        res.status(200).json({
                            success: true,
                            data: result
                        })
                    
                }).catch((err) => {
                    res.status(400).json({
                        success: false,
                        message: "Sorry, Something went Wrong"
                    })
                })
                }
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                error: err
            })
        }
    },

    // Update User
    async updateUser(req, res) {
        console.log("req.header", req.headers.authorization);
        let tokenauth = req.headers.authorization
        const updateUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone
        }
        const tokenWithoutBearer = tokenauth.replace("Bearer ", "");
        try {
            let userID
            await jwt.verify(tokenWithoutBearer, config, function (err, decode) {
                if (err) {
                    console.log("error", err);
                } else {
                    userID = decode.id
                    userModel.findByIdAndUpdate({ _id: userID }, updateUser, { new: true }).then((result) => {
                        res.status(200).json({
                            success: true,
                            message: msg.USER_UPDATED
                        })
                    }).catch((err) => {
                        res.status(400).json({

                            success: false,
                            message: msg.ERR_400
                        })
                    })
                }
            });

        } catch (error) {
            console.error("error", error);
            res.status(500).json({ message: 'Internal Server Error' });
        }


    },

    // Forget Password
    async forgotPassword(req, res) {
        const email = req.body.email
        try {
            const user = await User.findOne({ email: email });
            if (user) {
                // Email exists in the database
                const resetToken = jwt.sign({ id: user._id }, config, { expiresIn: '1h' });
                const link = `http://localhost:8080/users/resetPassword/${resetToken}`;


                const transporter = nodemailer.createTransport({
                    pool: true, // Use a pool for sending multiple emails
                    host: "smtp.gmail.com",
                    port: 465, // Port for secure email (TLS)
                    secure: true, // Use Gmail as the email service provider
                    auth: {
                        user: "sharmashubha713@gmail.com", // Your Gmail email address
                        pass: "gcqt vlpv pcck ukwt", // Your Gmail password or an app-specific password
                    },
                });

                transporter.verify(function (error, success) {
                    if (error) {
                        console.error("err", error);
                    } else {
                        console.log('Email transporter is ready to send emails');
                    }
                });

                const ejsFilePath = path.join(__dirname, '..', '..', 'ejs', 'forgetPassword.ejs');
                const template = await ejs.renderFile(ejsFilePath, { link });
                ejs.renderFile(ejsFilePath, { link }, (err, html) => {
                    if (err) {
                        console.error('EJS rendering error:', err);
                    } else {
                        console.log('Rendered HTML:', html);
                    }
                })

                // const template = await ejs.renderFile('resetPassword.ejs', { link });

                const mailOptions = {
                    from: "sharmashubha713@gmail.com", // sender address
                    to: email,
                    subject: 'Password Reset',
                    // html: `Click <a href="${link}">here</a> to reset your password.`,
                    html: template,
                };
                await transporter.sendMail(mailOptions);
                res.status(200).json({ success: true, message: 'Link sent to your email. Please check it.' });
            } else {
                // Email does not exist in the database
                res.status(404).json({ success: false, message: 'Email not found in the database.' });
            }


        } catch (err) {
            res.status(500).json({ message: 'Internal server error, Please try again' });
        }
    },

    // reset password
    async resetPassword(req, res) {

        try {
            const { token } = req.params;
            console.log("token", token);
            res.redirect(`http://localhost:5173/updatePassword/${token}`)



        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }


    },

    // Update password
    async updatePassword(req, res) {
        const { token } = req.params
       await jwt.verify(token, config, function (err, decode) {
            if(err){
                console.log("err",err);
                res.status(401).json({success:false, message:"unAutherized"})
            } else{
                const hashPass = bcrypt.hashSync(req.body.password, saltRounds)
                const password = {
                    password: hashPass
                }
                try {
                    userModel.findByIdAndUpdate({ _id:decode.id }, password, { new: true }).then((result) => {
                        res.status(200).json({
                            success: true,
                            message: msg.PASS_UPDATED
                        })
                    }).catch((err) => {
                        res.status(400).json({
                            success: false,
                            message: msg.ERR_400
                        })
                    })
                } catch (error) {
                    console.error("error", error);
                    res.status(500).json({success:false, message: 'Internal Server Error' });
                }
            }
            

        })
       

    },

    //aggregation
    async aggregateData(req, res) {
        // const ww = ObjectId('65421d32aada70c06be80fb3')

        const ww = new mongoose.Types.ObjectId(req.body._id)
        await User.aggregate([
            {
                $match: { _id: { $eq: ww } }
            },
            // { phone: { $gt: 0 } } 

            // {
            //     $lookup:
            //       {
            //         from: "userblogs",
            //         localField: "_id",
            //         foreignField: 'userId',
            //         as: "allData"
            //       }
            // },
            // {$project:{_id:1,createdAt:0,updatedAt:0,password:0}},
            // {$sort:{createdAt:1}}
            // { allData: { $gt: '2023-11-15T08:01:21.715+00:00' } }

        ]).then(resp => {
            console.log(resp)
            res.json({
                data: resp
            })
        })
    },


}





module.exports = userController