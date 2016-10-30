var fs = require('fs')
var History = require('../models/history')

exports.artInfo = function(req, res) {
  History
    .find({ type: 'art'})
    .exec(function(err, histories) {
      if (histories) {
        res.send(histories)
      } else {
        res.status(404)
      }
    })
}

exports.artInsert = function(req, res) {
  History.create({
    type: 'art',
    artType: req.body.artType,
    title: req.body.title,
    subtitle: req.body.subtitle,
    subject: req.body.subject,
    link: req.body.link,
    img: '/upload/' + req.file.filename
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
