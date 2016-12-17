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
  if (req.query.type === 'fresh') return get_user(req.session.openid)
  client.getAccessToken(req.query.code, (err, result) => {
    if (err) return res.json({ "state": 0, "err": err })
    get_user(result.data.openid)
  })
  function get_user (openid) {
    api.getUser({openid: openid, lang: 'zh_CN'}, (err, result) => {
      if (result.subscribe) return upsert_user(result)
      client.getUser({openid: openid, lang: 'zh_CN'}, (err, result) => {
        if (err) return res.json({"state": 0, "turnUrl" : client.getAuthorizeURL(req.headers.referer, 'wxoauth', 'snsapi_userinfo')})
        upsert_user(result)
      })
    })
  }
  function upsert_user (result) {
    User
      .findOne({ openid: result.openid })
      .then(user => {
        if (user) {
          user.nickname = result.nickname
          user.headimgurl = result.headimgurl.replace(/http:/g, "")
          user.sex = result.sex
          user.province = result.province
          user.city = result.city
          if (result.remark) user.remark = result.remark
          user.save()
          req.session.userId = user._id
          req.session.openid = user.openid
          req.session.type = user.type
          res.json({ "state": 1 })
          return
        }
        User
          .create({
            openid: result.openid,
            nickname: result.nickname,
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
        .select('-comments -content -charger')
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
        .select('-comments -content -charger')
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
    .populate({
      select: 'headimgurl',
      path: 'charger'
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
    .populate({
      select: 'headimgurl',
      path: 'charger'
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
  User
    .find({type: 9})
    .then(user => {
      var index = parseInt(Math.random() * user.length, 10)
      api.sendText(user[index].openid, '[VOD论坛]有人发帖，请查阅后处理', (err, result) => {
        console.log(result)
      })
      return user[index]._id
    })
    .then(chargerId => {
      return Post
        .create({
          title: req.session.type > 8 ? req.body.title : tc.filter(req.body.title),
          content: tc.filter(req.body.content),
          plantform: req.body.plantform,
          poster: req.session.userId,
          charger: chargerId
        })
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
      if (req.body.type === 1.2) return user.openid
      api.sendText(user.openid, '[VOD论坛]有人处理了你的请求', (err, result) => {
        res.json({ "state": 1, "notice": result })
      })
      return user.openid
    })
    .then((openid) => {
      // 通知关注帖子的人
      Post
        .findById(req.body.postId)
        .then(post => {
            return User.find({'_id': { $in: post.favoriters }})
        })
        .then(favoriters => {
          for (favoriter of favoriters) {
            if (favoriter.openid = openid) continue
            api.sendText(favoriter.openid, '[VOD论坛]有人处理了你收藏的帖子', (err, result) => {
              if (err) return err
              return result
            })
          }
        })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
    })
}

exports.insertComment = function (req, res) {
  var detail = {
    content: req.session.type > 8 ? req.body.content : tc.filter(req.body.content),
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
      api.sendText(user.openid, '[VOD论坛]有人回复了你', (err, result) => {
        res.json({ "state": 1, "notice": result })
      })
    })
    .catch(err => {
      res.json({ "state": 0, "err": err })
      console.log(err)
    })
}