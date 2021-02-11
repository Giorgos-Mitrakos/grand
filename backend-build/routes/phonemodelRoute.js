"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _util = require("../util");

var _connection = _interopRequireDefault(require("../connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express["default"].Router();

router.get("/", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM phone_brands INNER JOIN phone_models ON phone_brands.phone_brand_id=phone_models.phone_brand_id ORDER BY phone_brands.brand', function (err, result, fields) {
                if (err) throw err;
                console.log("Read user succeed");
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
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
router.get("/phoneBrands", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM phone_brands ORDER BY brand', function (err, result, fields) {
                if (err) throw err;
                console.log("Read phone brand succeed");
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
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
router.post("/insertbrand/", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO phone_brands (brand) VALUES (?)";
                connection.query(sql, [req.body.brand], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "SELECT * FROM phone_brands ORDER BY brand";
                  connection.query(sql, function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    console.log("Read phone brands succeed");
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
              /* End transaction */
            });

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}());
router.post("/phoneModels", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = 'SELECT * FROM phone_models WHERE phone_brand_id=? ORDER BY model';
              connection.query(sql, [req.body.phoneBrandId], function (err, result, fields) {
                if (err) throw err;
                console.log("Read models succeed");
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
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
router.post("/insertphonemodel/", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO phone_models (phone_brand_id, model) VALUES (?, ?)";
                connection.query(sql, [req.body.brandId, req.body.model], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "SELECT * FROM phone_models WHERE phone_brand_id=? ORDER BY model ";
                  connection.query(sql, [req.body.brandId], function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    console.log("Read phone brands succeed");
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
              /* End transaction */
            });

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x10, _x11, _x12) {
    return _ref5.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=phonemodelRoute.js.map