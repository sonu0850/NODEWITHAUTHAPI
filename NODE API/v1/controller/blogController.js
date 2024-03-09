const blogModal = require('../../model/blogModel')
const fs = require("fs")
const cron = require('node-cron');
const User = require('../../model/userModel');
const { decode } = require('punycode');
const config = require('../../token/config').secret
const jwt = require('jsonwebtoken')


const blogController = {

    //Create Blog
    async blogs(req, res) {
        let tokenauth = req.headers.authorization
        const tokenWithoutBearerin = tokenauth.replace("Bearer ", "");
        try {
            let userID
            await jwt.verify(tokenWithoutBearerin, config, function (err, decode) {
                if (err) {
                    console.log(err);
                } else {
                    userID = decode.id
                    const { body, title, category } = req.body
                    let createBlog = blogModal({
                        body: body,
                        title: title,
                        userId: userID,
                        category: category,
                        image: req.file.filename
                    })
                    createBlog.save().then((data) => {
                        res.status(200).json({
                            success: true,
                            message: "Your Blog has been created Successfully"
                        })
                    }).catch((err) => {
                        res.status(400).json({
                            success: false,
                            message: "Sorry, Something went wrong"
                        })
                    })
                }
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                success: false,
                message: `Server Error`,
                error: err
            })
        }
    },

    // Get Blog 
    async getBlog(req, res) {
        try {

            const { type } = req.params
            if (type !== "All") {
                blogModal.find({ category: type }).then((result) => {
                    if (result.length) {
                        result.forEach((el) => {
                            const img = fs.readFileSync(`uploads/${el.image}`, 'base64')
                            el._doc['img'] = img
                        })
                    }

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
            } else {
                blogModal.find().then((result) => {
                    if (result.length) {

                        result.forEach((el) => {
                            try {
                                const img = fs.readFileSync(`uploads/${el.image}`, 'base64');
                                el._doc['img'] = img;
                            } catch (error) {
                                console.error(`Error reading file: ${el.image}`, error);
                            }
                        });


                    }
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

        } catch (err) {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                error: err
            })
        }
    },

    // Delete Blog
    async deleteBlog(req, res) {
        try {
            const id = req.params.id;
            await blogModal.findOneAndDelete({ _id: id }).then((result) => {
                res.status(200).json({
                    status: true,
                    Message: "Blog Deleted Successfully"
                })

            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    message: "Sorry, Something went Wrong"
                })
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                error: err
            })
        }
    },

    //Update Blog
    async updateBlog(req, res) {
        try {
            const id = req.params.id;
            const userblog = {
                body: req.body.content,
                subject: req.body.subject,
                userId: req.body.userId,
            }
            blogModal.findByIdAndUpdate({ _id: id }, userblog, { new: true }).then((result) => {
                res.status(200).json({
                    success: true,
                    message: "Your blog has been Updated"
                })
            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    message: "Sorry, Something went Wrong"
                })
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                error: err
            })
        }
    },

    // get blogs by user id
    async getuserBlog(req, res) {
        let tokenauth = req.headers.authorization
        const tokenWithoutBearer = tokenauth.replace("Bearer ", "");
        try {
            let userId
            await jwt.verify(tokenWithoutBearer, config, function (err, decode) {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("decode", decode);
                    userId = decode.id
                    blogModal.find({ userId: userId }).then((result) => {
                        if (result.length) {
                            result.forEach((el) => {
                                const img = fs.readFileSync(`uploads/${el.image}`, 'base64')
                                el._doc['img'] = img
                            })
                        }
                        res.status(200).json({
                            success: true,
                            data: result
                        })
                    }).catch((err) => {
                        res.status(400).json({
                            success: false,
                            message: "No Blog Found"
                        })
                    })
                }
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                error: err
            })
        }

    }


    // console.log("req.header", req.headers);
    //     if (req.headers.authorization === `Bearer ${null}`) {
    //         res.status(401).json({ success: false, message: "user Authenticate" })
    //     } else {
    //         await jwt.verify(req.headers.authorization, config, function (err, decode) {
    //             if (err) {
    //                 console.log("error", err);
    //             } else {
    //                 console.log(decode)
    //             }
    //         });
    //     }


}




module.exports = blogController