"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _util = require("../util.js");

var _connection = _interopRequireDefault(require("../connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express["default"].Router();

router.post("/additem", _util.isAuth, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "INSERT INTO wishlists (user_email, product_id, model) VALUES (?,?,?)";
              connection.query(sql, [req.body.user_email, req.body.product_id, req.body.model], function (err, result, fields) {
                if (err & err != "ER_DUP_ENTRY") {
                  console.log("Entry is already");
                }
              });
              sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.price FROM wishlists INNER JOIN products ON wishlists.product_id = products._id WHERE wishlists.user_email=?";
              connection.query(sql, [req.body.user_email], function (err, result) {
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
router.post("/removeitem", _util.isAuth, /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "DELETE FROM wishlists WHERE user_email=? && product_id=?";
              connection.query(sql, [req.body.user_email, req.body.product_id], function (err, result, fields) {
                if (err) throw err;
                res.status(200).send({
                  message: "Product deleted from wishlist"
                });
              });
            });

            connection.release(); // Handle error after the release.

            if (!err) {
              _context2.next = 4;
              break;
            }

            throw err;

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.post("/getwishlist", _util.isAuth, /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.price FROM wishlists INNER JOIN products ON wishlists.product_id = products._id WHERE wishlists.user_email=?";
              connection.query(sql, [req.body.user_email], function (err, result, fields) {
                if (err) throw err;
                console.log("Read products succeed");
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.post("/movetocart", _util.isAuth, /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO cart (user_email, product_id, model, quantity) VALUES (?, ?, ?, 1)";
                connection.query(sql, [req.body.user_email, req.body.product_id, req.body.model], function (err, result) {
                  if (err & err != "ER_DUP_ENTRY") {
                    console.log("Entry is already");
                  }

                  sql = "DELETE FROM wishlists WHERE user_email=? && product_id=? && model=?";
                  connection.query(sql, [req.body.user_email, req.body.product_id, req.body.model], function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    connection.commit(function (err) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      console.log('Transaction Completed Successfully.');
                      res.status(200).send("Transaction Completed Successfully.");
                      connection.release();
                    });
                  });
                });
              });
              /* End transaction */
            });

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=wishlistRoute.js.map