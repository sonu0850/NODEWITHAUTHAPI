const mongoose = require('mongoose')

const userBlog = new mongoose.Schema({
    title: { type: String, require:true },
    body: { type: String, require:true },
    userId: { type: mongoose.ObjectId, require:true },
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()},
    image:{type:String},
    category:{type:String}
})

module.exports = mongoose.model('userBlog', userBlog)
