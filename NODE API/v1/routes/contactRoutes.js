const express = require('express')
const contactController = require('../controller/contactController')

const router = express.Router()

router.post('/contact', contactController.contact)


module.exports = router
