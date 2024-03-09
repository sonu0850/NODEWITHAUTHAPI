const express = require('express')
const userController = require('../controller/userController')
// import express from 'express'
const {upload} = require('../../utils/uploadImage')
// const { secret } = require('../../token/config')
const token = require('../../token/config').secret
const tokenValid = require('../../token/varifyToken')

const router = express.Router()             

router.post('/login' , userController.login)
router.post('/register', userController.register) //,upload.fields([{name: 'image', maxCount: 1 },{name:'coverImage'}, 2])
router.post('/forgotPassword', userController.forgotPassword)
router.get('/resetPassword/:token',userController.resetPassword)
router.get('/getUser',tokenValid,userController.getUser)
router.put('/updatePassword/:token',userController.updatePassword)
router.put('/updateUser',tokenValid,userController.updateUser)
router.get('/aggregateData', userController.aggregateData)

// export default express

module.exports = router