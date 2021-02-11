"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _util = require("../util.js");

var _connection = _interopRequireDefault(require("../connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fs = require('fs');

var router = _express["default"].Router();

var storageB = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'frontend/public/images/makeyourcase');
  },
  filename: function filename(req, file, cb) {
    var fileName = Date.now() + '-' + req.body.model.replace(/ /g, "-") + '-' + req.body.email + '-' + file.originalname;
    cb(null, fileName);
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
  }
};

var uploadCaseImage = (0, _multer["default"])({
  storage: storageB,
  fileFilter: fileFilter
});
router.post("/insert_item", _util.isAuth, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "INSERT INTO cart (user_email, product_id, model, quantity) VALUES (?,?,?,?)";
              connection.query(sql, [req.body.email, req.body.product_id, req.body.model, req.body.qty], function (err, result, fields) {
                if (err & err != "ER_DUP_ENTRY") {
                  console.log("Entry is already");
                }

                console.log("Item inserted successfully");
              });
              sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.price, products.countInStock, cart.model, cart.quantity FROM products LEFT JOIN cart ON products._id = cart.product_id WHERE cart.user_email=?";
              connection.query(sql, [req.body.email], function (err, result) {
                if (err) throw err;
                res.send(result);
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post("/insert_image_case_item", _util.isAuth, uploadCaseImage.single('image'), /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "SELECT products._id FROM products WHERE products.category='Φτιάξε τη Θήκη σου'";
                connection.query(sql, function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var productId = result[0]._id;
                  sql = "INSERT INTO cart (product_id,user_email, model, quantity, image_case) VALUES (?, ?, ?, ?, ?)";
                  connection.query(sql, [productId, req.body.email, req.body.model, req.body.qty, req.file.path.slice(15, req.file.path.length)], function (err, result, fields) {
                    if (err & err != "ER_DUP_ENTRY") {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.price, products.countInStock, cart.model, cart.quantity, cart.image_case FROM products LEFT JOIN cart ON products._id = cart.product_id WHERE cart.user_email=?";
                    connection.query(sql, [req.body.email], function (err, result) {
                      if (err) throw err;
                      res.send(result);
                      connection.commit(function (err) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        console.log('Transaction Completed Successfully.');
                        connection.release();
                      });
                    });
                  });
                });
              });
              /* End transaction */
            });

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
router.post("/update_item", _util.isAuth, /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "UPDATE cart SET model=?, quantity=? WHERE user_email=? && cart_id=?";
              connection.query(sql, [req.body.model, req.body.qty, req.body.user_email, req.body.cart_id], function (err, result, fields) {
                if (err) throw err;
                console.log("Item updated successfully");
              });
              sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.totalPrice, products.countInStock, products.percentage, cart.cart_id, cart.model, cart.quantity, cart.image_case FROM cart LEFT JOIN products ON cart.product_id = products._id WHERE cart.user_email=?";
              connection.query(sql, [req.body.user_email], function (err, result) {
                if (err) throw err;
                res.send(result);
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}());
router.post("/remove_item", _util.isAuth, /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              if (req.body.image_case) {
                fs.unlink("frontend/public" + req.body.image_case, function (err) {
                  if (err) throw err;
                  console.log("successfully deleted ".concat(req.body.image_case));
                });
              }

              var sql = "DELETE FROM cart WHERE cart_id=?";
              connection.query(sql, [req.body.cart_id], function (err, result, fields) {
                if (err) throw err;
                console.log("Product deleted from cart");
              });
              sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.totalPrice, products.countInStock,cart.cart_id, cart.model, cart.quantity, cart.image_case FROM cart INNER JOIN products ON cart.product_id = products._id WHERE cart.user_email=?";
              connection.query(sql, [req.body.user_email], function (err, result) {
                if (err) throw err;
                res.send(result);
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}());
router.post("/get_cart", _util.isAuth, /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.totalPrice, products.countInStock, products.percentage, cart.cart_id, cart.model, cart.quantity, cart.image_case FROM cart LEFT JOIN products ON cart.product_id = products._id WHERE cart.user_email=?";
              connection.query(sql, [req.body.user_email], function (err, result) {
                if (err) throw err;
                res.send(result);
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=cartRoute.js.map