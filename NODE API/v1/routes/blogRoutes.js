const express = require('express')
const blogController = require('../controller/blogController')

const router = express.Router()
const {upload} = require('../../utils/uploadImage')


router.post('/createBlog',upload.single('image'), blogController.blogs)
// router.post('/createBlog', blogController.blogs)
router.get('/getBlog/:type', blogController.getBlog)
router.delete('/deleteBlog/:id', blogController.deleteBlog)
router.put('/updateBlog/:id', blogController.updateBlog)
router.get('/getuserBlog', blogController.getuserBlog)

module.exports = router
