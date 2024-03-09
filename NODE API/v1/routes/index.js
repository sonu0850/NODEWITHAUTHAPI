const express = require('express')

const router = express.Router()

router.use('/users', require('./userRoutes'))
router.use('/blog', require('./blogRoutes'))
router.use('/contact', require('./contactRoutes'))

module.exports = router