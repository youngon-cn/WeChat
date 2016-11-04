var History = require('../models/history')
var fs = require('fs')
var request = require("request")
var wx = require('./key/wx.json')
var WechatAPI = require('wechat-api')
var api = new WechatAPI(wx.appid, wx.appsecret)

exports.material = function(req, res) {
  api.getMaterials("news", req.query.number, 1, (err, result) => {
    if (err) {
      return res.json({ "state" : 0 })
    }
    var news_item = result.item[0].content.news_item[0]
    res.json({
      "material": {
        "total_count": result.total_count,
        "item_count": 1 - (-req.query.number)
      },
      "infos": {
        title: news_item.title,
        subtitle: news_item.author,
        subject: news_item.digest,
        link: news_item.url,
        img: news_item.thumb_url,
        create_time: result.item[0].content.create_time,
        update_time: result.item[0].content.update_time
      },
      "state": 1
    })
  })
}

exports.artInfo = function(req, res) {
  History
    .find({ type: 'art'})
    .sort({update_time: -1, _id: -1})
    .exec(function(err, histories) {
      if (histories) {
        res.send(histories)
      } else {
        res.status(404)
      }
    })
}

exports.artInsert = function(req, res) {
  var infos = req.body.infos
  var imgPath = "/upload/" + infos.img.substr(-44,30)
  request(infos.img).pipe(fs.createWriteStream("./public" + imgPath))
  History.create({
    type: 'art',
    artType: req.body.artType,
    title: infos.title,
    subtitle: infos.subtitle,
    subject: infos.subject,
    link: infos.link,
    img: imgPath,
    create_time: infos.create_time,
    update_time: infos.update_time
  }, function(err) {
    if (err) {
      return res.json({ "state": 0, "err": err })
    }
    res.json({ "state": 1 })
  })
}

exports.barInfo = function(req, res) {
  History
    .find({ type: 'bar'})
    .exec(function(err, histories) {
      if (histories) {
        res.send(histories)
      } else {
        res.status(404)
      }
    })
}

exports.barInsert = function(req, res) {
  History.create({
    type: 'bar',
    title: req.body.title,
    link: req.body.link,
    img: '/upload/' + req.file.filename
  }, function(err) {
    if (err) {
      return res.json({ "state": 0, "err": err })
    }
    res.json({ "state": 1 })
  })
}

exports.historyDelete = function(req, res) {
  History
    .findByIdAndRemove(req.query._id)
    .exec(function(err, history) {
      if (err) {
        res.status(500)
      } else {
        fs.unlink('./public' + history.img, (err) => {
          if (err) {
            console.log(err)
          }
        })
        res.json({ "state": 1 })
      }
    })
}
