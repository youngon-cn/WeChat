var express = require('express')
var router = express.Router()
var Forum = require('../controllers/forum')
var Filter = require('../controllers/filter')

router.get('/wxoauth', Forum.wxoauth)
router.get('/user', Filter.login, Forum.info)
router.get('/posts', Forum.getPosts)
router.get('/post', Forum.getPost)
router.post('/post', Filter.login, Forum.insertPost)
router.post('/comment', Filter.login, Forum.insertComment)

module.exports = router
