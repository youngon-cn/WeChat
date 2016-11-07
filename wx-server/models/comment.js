var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  content: String,
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  commentDate: {
    type: Date,
    default: Date.now
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  belong: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
})

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
