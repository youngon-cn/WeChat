var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var admin = require('./controllers/key/mongodb.json')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://'+admin.name+':'+admin.pwd+'@115.159.119.147/wx')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'youngon',
  resave: false,
  saveUninitialized: true,
  name: 'wx',
  cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
  store: new mongoStore({
    url: 'mongodb://'+admin.name+':'+admin.pwd+'@115.159.119.147/wx',
    collection: 'sessions'
  })
}))

app.use('/request/history', require('./routes/history'))
app.use('/request/forum', require('./routes/forum'))

app.get('*', function (req, res){
  res.header('Content-Type', 'text/html')
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

module.exports = app
