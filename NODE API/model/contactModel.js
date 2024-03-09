const mongoose = require('mongoose')

const contactUs = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    email: { type: String },
    message: { type: String },

})

module.exports = mongoose.model('userContact', contactUs)
