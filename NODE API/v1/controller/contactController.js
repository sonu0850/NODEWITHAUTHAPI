const contactModel = require('../../model/contactModel')

const contactController = {

    async contact(req, res) {
        try {
            let createContact = contactModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                email: req.body.email,
                message:req.body.message,
                
            })
            createContact.save().then((data) => {
                res.status(200).json({
                    success: true,
                    message: "Thank You for Contact Us, We received your Message"
                })
            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    message: "Sorry, Something went wrong"
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



}

module.exports = contactController