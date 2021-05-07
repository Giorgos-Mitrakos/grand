"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _config = _interopRequireDefault(require("./config"));

var _path = _interopRequireDefault(require("path"));

require("regenerator-runtime/runtime");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _helmet = _interopRequireDefault(require("helmet"));

var _userRoute = _interopRequireDefault(require("./routes/userRoute"));

var _adminRoute = _interopRequireDefault(require("./routes/adminRoute"));

var _productRoute = _interopRequireDefault(require("./routes/productRoute"));

var _cartRoute = _interopRequireDefault(require("./routes/cartRoute.js"));

var _wishlistRoute = _interopRequireDefault(require("./routes/wishlistRoute.js"));

var _phonemodelRoute = _interopRequireDefault(require("./routes/phonemodelRoute.js"));

var _orderRoute = _interopRequireDefault(require("./routes/orderRoute.js"));

var _xmlRoute = _interopRequireDefault(require("./routes/xmlRoute.js"));

var _phoneHellasXmlRoute = _interopRequireDefault(require("./routes/phoneHellasXmlRoute.js"));

var _emailRoute = _interopRequireDefault(require("./routes/emailRoute.js"));

var _paymentRoute = _interopRequireDefault(require("./routes/paymentRoute.js"));

var _getProductsFromHellasphone = _interopRequireDefault(require("./routes/getProductsFromHellasphone.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])();
app.use(_helmet["default"].contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://www.googletagmanager.com/gtag/js?id=G-2E0012DK1M", "'unsafe-inline'", "'unsafe-eval'"],
    fontSrc: ["'self'", 'https://fonts.googleapis.com/icon?family=Material+Icons'],
    imgSrc: ["'self'"]
  }
}));
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json());
app.use(_express["default"]["static"](_path["default"].join(__dirname + '/public')));
app.use("/api/users/", _userRoute["default"]);
app.use("/api/admin/", _adminRoute["default"]);
app.use("/api/products/", _productRoute["default"]);
app.use("/api/cart/", _cartRoute["default"]);
app.use("/api/wishlist/", _wishlistRoute["default"]);
app.use("/api/phoneModels/", _phonemodelRoute["default"]);
app.use("/api/orders/", _orderRoute["default"]);
app.use("/api/isispc-xml", _xmlRoute["default"]);
app.use("/api/hellasphone-xml/", _phoneHellasXmlRoute["default"]);
app.use("/api/email/", _emailRoute["default"]);
app.use("/api/payment/", _paymentRoute["default"]);
app.use("/api/getProducts/", _getProductsFromHellasphone["default"]);
app.get('*', function (req, res) {
  res.sendFile(_path["default"].join("".concat(__dirname, "/../frontend/public/index.html")));
});
var port = _config["default"].PORT;
app.listen(port, function () {
  console.log("Server started at http://localhost:".concat(port));
});
//# sourceMappingURL=server.js.map