var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  nickname: String,
  headimgurl: String,
  sex: Number,
  province: String,
  city: String,
  openid: {
    type: String,
    unique: true
  },
  regDate: {
    type: Date,
    default: Date.now
  },
  type: {
    type: Number,
    default: 1
  }
})

var User = mongoose.model('User', userSchema);

module.exports = User;
