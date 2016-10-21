var wx = require('./key/wx.json')
var OAuth = require('wechat-oauth')
var client = new OAuth(wx.appid, wx.appsecret)
var WechatAPI = require('wechat-api')
var api = new WechatAPI(wx.appid, wx.appsecret)
var User = require('../models/user')
var Post = require('../models/post')
var Comment = require('../models/comment')

var url = client.getAuthorizeURL('http://wx.youngon.com.cn/forum', 'wxoauth', 'snsapi_userinfo');
console.log(url)

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

exports.getPosts = function (req, res) {
  Post
    .find()
    .populate({
      select: 'nickname headimgurl',
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
      select: 'nickname headimgurl',
      path: 'poster'
    })
    .populate({
      path: 'comments',
      populate: {
        select: 'nickname headimgurl',
        path: 'commenter'
      }
    })
    .exec((err, post) => {
      post.pv++
      post.save()
      res.send(post)
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

exports.insertComment = function (req, res) {
  Comment
    .create({
      content: req.body.comment,
      commenter: req.session.userId
    })
    .then((comment) => {
      Post
        .findById(req.body.postId)
        .exec((err, post) => {
          post.comments.push(comment._id)
          post.save()
          res.json({ "state": 1 })
        })
        .catch(err => {
          res.json({ "state": 0, "err": err })
        })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}