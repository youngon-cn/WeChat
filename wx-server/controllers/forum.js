var wx = require('./key/wx.json')
var OAuth = require('wechat-oauth')
var client = new OAuth(wx.appid, wx.appsecret)
var WechatAPI = require('wechat-api')
var api = new WechatAPI(wx.appid, wx.appsecret)
var User = require('../models/user')
var Post = require('../models/post')
var Comment = require('../models/comment')

exports.wxoauth = function (req, res) {
  if (req.session.openid) {
    res.json({ "state": 1 })
  } else {
    client.getUserByCode(req.query.code, (err, result) => {
      if (err) {
        return res.send(err)
      } else if (result.openid) {
        User
          .findOne({ openid: result.openid })
          .exec((err, user) => {
            if (user) {
              req.session.userId = user._id
              req.session.openid = user.openid
              req.session.type = user.type
              res.json({ "state": 1 })
            } else {
              User
                .create({
                  openid: result.openid,
                  nickname: result.nickname,
                  headimgurl: result.headimgurl
                })
                .then((user) => {
                  req.session.userId = user._id
                  req.session.openid = user.openid
                  req.session.type = user.type
                  res.json({ "state": 1 })
                })
                .catch(err => {
                  res.json({ "state": 0, "err": err })
                })
            }
          })
      } else {
        res.json({ "state": 0, "result": result })
      }
    })
  }
}

exports.info = function (req, res) {
  User
    .findById(req.session.userId)
    .exec((err, user) => {
      user ? res.send(user) : res.status(404)
    })
}

exports.getFirstPagePosts = function (req, res) {
  var type = req.query.type
  Post
    .find(type === "9" ? null : {'type': type})
    .select('-comments -content')
    .sort({updateDate: -1, _id: -1})
    .limit(10)
    .populate({
      select: 'nickname headimgurl type',
      path: 'poster'
    })
    .exec((err, posts) => {
      res.send(posts)
    })
}

exports.getNextPagePosts = function (req, res) {
  var type = req.query.type
  Post
    .find(type === "9" ? {'updateDate': { '$lt': req.query.updateDate}} : {'updateDate': { '$lt': req.query.updateDate}, 'type': type})
    .select('-comments -content')
    .sort({updateDate: -1, _id: -1})
    .limit(10)
    .populate({
      select: 'nickname headimgurl type',
      path: 'poster'
    })
    .exec((err, posts) => {
      res.send(posts)
    })
}

exports.getPost = function (req, res) {
  Post
    .findById(req.query.postId)
    .populate({
      select: 'nickname headimgurl type',
      path: 'poster'
    })
    .populate({
      path: 'comments',
      populate: {
        select: 'nickname headimgurl type',
        path: 'commenter to'
      }
    })
    .exec((err, post) => {
      if (req.query.type === 'init') {
        post.pv++
        post.save()
      }
      res.send(post)
    })
}

exports.delPost = function (req, res) {
  Post
    .findByIdAndRemove(req.query.postId)
    .exec((err, post) => {
      if (err) return res.json({ "state": 0, "err": err })
      res.json({ "state": 1 })
      Comment.remove({"_id": { "$in": post.comments }}, (err) => {
        console.log(err)
      })
    })
}

exports.insertPost = function (req, res) {
  Post
    .create({
      title: req.body.title,
      content: req.body.content,
      poster: req.session.userId
    })
    .then(() => {
      res.json({ "state": 1 })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.postOperate = function (req, res) {
  var detail = {
    content: '标记该申请',
    commenter: req.session.userId
  }
  if (req.body.type === 1) {
    detail.content += '连载中'
  }
  if (req.body.type === 2) {
    detail.content += '已上传'
  }
  if (req.body.type === -1) {
    detail.content += '禁止上传'
  }
  Comment
    .create(detail)
    .then((comment) => {
      Post
        .findById(req.body.postId)
        .exec((err, post) => {
          post.comments.push(comment._id)
          post.type = req.body.type
          post.updateDate = Date.now()
          post.nc++
          post.save()
          res.json({ "state": 1 })
          User
            .findById(post.poster)
            .exec((err, user) => {
              api.sendText(user.openid, 'VOD论坛里有人回复了你：' + req.body.comment)
            })
        })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.insertComment = function (req, res) {
  var detail = {
      content: req.body.comment,
      commenter: req.session.userId
    }
  if (req.body.to) {
    detail.to = req.body.to
  }
  Comment
    .create(detail)
    .then((comment) => {
      Post
        .findById(req.body.postId)
        .exec((err, post) => {
          post.comments.push(comment._id)
          post.updateDate = Date.now()
          post.nc++
          post.save()
          res.json({ "state": 1 })
          User
            .findById(post.poster)
            .exec((err, user) => {
              api.sendText(user.openid, 'VOD论坛里有人回复了你：' + req.body.comment)
            })
        })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}