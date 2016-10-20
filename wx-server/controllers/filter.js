exports.login = function (req, res, next) {
  if (req.session.userId) {
    next()
  } else {
    res.json({"turnUrl" : "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3eb86a311c6b9da4&redirect_uri=" + req.headers.referer + "&response_type=code&scope=snsapi_base&state=wxoauth&connect_redirect=1#wechat_redirect"})
  }
}
exports.admin = function (req, res, next) {
  if (req.session.type==9) {
    next()
  } else {
    res.json({ "state" : 0 })
  }
}
