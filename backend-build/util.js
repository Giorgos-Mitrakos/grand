"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSuperAdmin = exports.isAdmin = exports.isAuth = exports.getToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getToken = function getToken(user) {
  return _jsonwebtoken["default"].sign({
    //_id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin
  }, _config["default"].JWT_SECRET, {
    expiresIn: '2h'
  });
};

exports.getToken = getToken;

var isAuth = function isAuth(req, res, next) {
  var token = req.headers.authorization;

  if (token) {
    var onlyToken = token.slice(7, token.length);

    _jsonwebtoken["default"].verify(onlyToken, _config["default"].JWT_SECRET, function (err, decode) {
      if (err) {
        return res.status(403).send({
          msg: 'Invalid Token.'
        });
      }

      req.user = decode;
      next();
      return;
    });
  } else {
    return res.status(401).send({
      msg: 'Token is not supplied.'
    });
  }
};

exports.isAuth = isAuth;

var isAdmin = function isAdmin(req, res, next) {
  if (req.user && (parseInt(req.user.isAdmin) == 1 || parseInt(req.user.isAdmin) == 2)) {
    return next();
  } else {
    return res.status(401).send({
      msg: ' Admin Token is not valid.'
    });
  }
};

exports.isAdmin = isAdmin;

var isSuperAdmin = function isSuperAdmin(req, res, next) {
  if (req.user && parseInt(req.user.isAdmin) == 2) {
    return next();
  } else {
    return res.status(401).send({
      msg: ' Admin Token is not valid.'
    });
  }
};

exports.isSuperAdmin = isSuperAdmin;
//# sourceMappingURL=util.js.map