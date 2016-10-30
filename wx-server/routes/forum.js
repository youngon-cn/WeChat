var express = require('express')
var router = express.Router()
var Forum = require('../controllers/forum')
var Filter = require('../controllers/filter')

router.get('/wxoauth', Forum.wxoauth)
router.get('/user', Filter.login, Forum.info)
router.get('/posts/firstPage', Forum.getFirstPagePosts)
router.get('/posts/nextPage', Forum.getNextPagePosts)
router.get('/post', Forum.getPost)
router.delete('/post', Filter.admin, Forum.delPost)
router.post('/post/operate', Filter.admin, Forum.postOperate)
router.post('/post', Filter.login, Forum.insertPost)
router.post('/comment', Filter.login, Forum.insertComment)

module.exports = router
