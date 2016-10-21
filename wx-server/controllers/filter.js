exports.login = function (req, res, next) {
  if (req.session.userId) {
    next()
  } else {
    res.json({"turnUrl" : "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcf692473c3e08053&redirect_uri=" + req.headers.referer + "&response_type=code&scope=snsapi_userinfo&state=wxoauth#wechat_redirect"})
  }
}
exports.admin = function (req, res, next) {
  if (req.session.type==9) {
    next()
  } else {
    res.json({ "state" : 0 })
  }
}
