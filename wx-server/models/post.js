var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  title: String,
  plantform: [String],
  content: String,
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  favoriters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  charger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  postDate: {
    type: Date,
    default: Date.now
  },
  updateDate: {
    type: Date,
    default: Date.now
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  pv: {
    type: Number,
    default: 0
  },
  nc: {
    type: Number,
    default: 0
  },
  type: {
    type: Number,
    default: 0
  }
})

var Post = mongoose.model('Post', postSchema)

module.exports = Post
