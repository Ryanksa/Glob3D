const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const config = require("../config");

let isAuthenticated = function (req, res, next) {
  req.isAuth = false;

  // extract jsonwebtoken from cookie
  const cookies = cookie.parse(req.headers.cookie || "");
  if (!cookies.token) return next();

  // verify jsonwebtoken
  const decodedToken = jwt.verify(cookies.token, config.jwtSecret);
  if (!decodedToken) return next();

  // authentication successful, update request fields
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};

module.exports = isAuthenticated;
