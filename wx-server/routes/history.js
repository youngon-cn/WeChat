var express = require('express')
var router = express.Router()
var multer  = require('multer')
var upload = multer({ dest: './public/upload/' })
var History = require('../controllers/history')
var Filter = require('../controllers/filter')

router.get('/material', Filter.admin, History.material)
router.get('/article', History.artInfo)
router.post('/article', Filter.admin, History.artInsert)
router.get('/banner', History.barInfo)
router.post('/banner', Filter.admin, upload.single('img'), History.barInsert)
router.delete('/', Filter.admin, History.historyDelete)

module.exports = router
