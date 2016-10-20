var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  title: String,
  content: String,
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  postDate: {
    type: Date,
    default: Date.now()
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  type: {
    type: Number,
    default: 0
  }
})

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
