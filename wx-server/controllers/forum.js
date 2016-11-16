var User = require('../models/user')
var Post = require('../models/post')
var Comment = require('../models/comment')

var wx = require('./key/wx.json')
var OAuth = require('wechat-oauth')
var client = new OAuth(wx.appid, wx.appsecret)
var WechatAPI = require('wechat-api')
var api = new WechatAPI(wx.appid, wx.appsecret)

var tc = require('text-censor')

exports.wxoauth = function (req, res) {
  function upsert_user (result) {
    User
      .findOne({ openid: result.openid })
      .then(user => {
        if (user) {
          user.nickname = result.nickname
          user.remark = result.remark
          user.headimgurl = result.headimgurl.replace(/http:/g, "")
          user.sex = result.sex
          user.province = result.province
          user.city = result.city
          user.save()
          req.session.userId = user._id
          req.session.openid = user.openid
          req.session.type = user.type
          res.json({ "state": 1 })
        }
        User
          .create({
            openid: result.openid,
            nickname: result.nickname,
            remark: result.remark,
            headimgurl: result.headimgurl.replace(/http:/g, ""),
            sex: result.sex,
            province: result.province,
            city: result.city
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
      })
  }
  if (req.query.type === 'fresh' || req.session.openid) {
    api.getUser({openid: req.session.openid, lang: 'zh_CN'}, (err, result) => {
      upsert_user(result)
      return
    })
  } else if (req.query.code) {
    client.getAccessToken(req.query.code, (err, result) => {
      if (err || !result.data.openid) return res.json({ "state": 0 })
      api.getUser({openid: result.data.openid, lang: 'zh_CN'}, (err, result) => {
        upsert_user(result)
      })
    })
  } else {
    res.json({ "state": 0 })
  }
}

exports.favorites = function (req, res) {
  User
    .findById(req.session.userId)
    .select('favorites')
    .populate({
      path: 'favorites',
      populate: {
        select: 'nickname headimgurl type',
        path: 'poster'
      }
    })
    .then(user => {
      res.json({ "state": 1, "favorites": user.favorites })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.info = function (req, res) {
  User
    .findById(req.session.userId)
    .select('-openid')
    .then(user => {
      res.send(user)
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.getFirstPageReplyPosts = function (req, res) {
  Comment
    .find({'commenter': req.query.commenter})
    .then(comments => {
      var posts = []
      for (let comment of comments) {
        posts.push(comment.belong)
      }
      return posts
    })
    .then(posts => {
      return Post.find({"_id": { "$in": posts }})
        .select('-comments -content')
        .sort({updateDate: -1, _id: -1})
        .limit(10)
        .populate({
          select: 'nickname headimgurl type',
          path: 'poster'
        })
    })
    .then(posts => {
      res.send(posts)
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.getNextPageReplyPosts = function (req, res) {
  Comment
    .find({
      'commenter': req.query.commenter,
      'updateDate': { '$lt': req.query.updateDate}
    })
    .then(comments => {
      var posts = []
      for (let comment of comments) {
        posts.push(comment.belong)
      }
      return posts
    })
    .then(posts => {
      return Post.find({"_id": { "$in": posts }})
        .select('-comments -content')
        .sort({updateDate: -1, _id: -1})
        .limit(10)
        .populate({
          select: 'nickname headimgurl type',
          path: 'poster'
        })
    })
    .then(posts => {
      res.send(posts)
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.getFirstPagePosts = function (req, res) {
  var term = {}
  if (req.query.poster) term.poster = req.query.poster
  if (req.query.type !== "9") term.type = req.query.type
  Post
    .find(term)
    .select('-comments -content')
    .sort({updateDate: -1, _id: -1})
    .limit(10)
    .populate({
      select: 'nickname headimgurl type',
      path: 'poster'
    })
    .then(posts => {
      res.send(posts)
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.getNextPagePosts = function (req, res) {
  var term = {}
  if (req.query.poster) term.poster = req.query.poster
  if (req.query.type !== "9") {
    term = {
      'updateDate': { '$lt': req.query.updateDate},
      'type': req.query.type
    }
  } else {
    term = {
      'updateDate': { '$lt': req.query.updateDate}
    }
  }
  Post
    .find(term)
    .select('-comments -content')
    .sort({updateDate: -1, _id: -1})
    .limit(10)
    .populate({
      select: 'nickname headimgurl type',
      path: 'poster'
    })
    .then(posts => {
      res.send(posts)
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
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
    .then(post => {
      if (req.query.type === 'init') {
        post.pv++
        post.save()
      }
      res.send(post)
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.favorPost = function (req, res) {
  var operate = {}
  if (req.query.type === 'true') {
    operate = {$pull: {"favorites": req.query.postId}}
    Post
      .update({'_id': req.query.postId}, {$pull: {"favoriters": req.session.userId}})
      .exec()
  } else {
    operate = {$addToSet: {"favorites": req.query.postId}}
    Post
      .update({'_id': req.query.postId}, {$addToSet: {"favoriters": req.session.userId}})
      .exec()
  }
  User
    .findByIdAndUpdate(req.session.userId, operate, { new: true })
    .then(user => {
      res.json({ "state": 1, "favorites": user.favorites})
    })
    .catch((err) => {
      res.json({ "state": 0 })
    })
}

exports.delPost = function (req, res) {
  Post
    .findByIdAndRemove(req.query.postId)
    .then(post => {
      Comment
        .remove({"_id": { "$in": post.comments }})
        .exec()
      User
        .update({"_id": { "$in": post.favoriters }}, {$pull: {"favorites": post._id}})
        .exec()
      res.json({ "state": 1 })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.insertPost = function (req, res) {
  Post
    .create({
      title: tc.filter(req.body.title),
      content: tc.filter(req.body.content),
      plantform: req.body.plantform,
      poster: req.session.userId
    })
    .then(() => {
      res.json({ "state": 1 })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
  User
    .find({type: 9})
    .then(user => {
      var index = parseInt(Math.random() * user.length, 10)
      api.sendText(user[index].openid, 'VOD论坛里有人发帖，请查阅后处理')
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
  if (req.body.type === 1.2) {
    detail.content += '已更新'
  }
  if (req.body.type === 2) {
    detail.content += '已上传'
  }
  if (req.body.type === -1) {
    detail.content += '禁止上传'
  }
  Comment
    .create(detail)
    .then(comment => {
      return Post
        .findById(req.body.postId)
        .then(post => {
          post.comments.push(comment._id)
          post.type = parseInt(req.body.type)
          post.updateDate = Date.now()
          post.nc++
          post.save()
          return post.poster
        })
    })
    .then(poster => {
      return User.findById(poster)
    })
    .then(user => {
      api.sendText(user.openid, 'VOD论坛里有人处理了你的请求')
      res.json({ "state": 1 })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.insertComment = function (req, res) {
  var detail = {
    content: tc.filter(req.body.content),
    commenter: req.session.userId,
    belong: req.body.postId
  }
  if (req.body.to) {
    detail.to = req.body.to
  }
  Comment
    .create(detail)
    .then(comment => {
      return Post
        .findById(req.body.postId)
        .then(post => {
          post.comments.push(comment._id)
          post.updateDate = Date.now()
          post.nc++
          post.save()
          return post.poster
        })
    })
    .then(poster => {
      return User.findById(poster)
    })
    .then(user => {
      api.sendText(user.openid, 'VOD论坛里有人回复了你')
      res.json({ "state": 1 })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
      console.log(err)
    })
}