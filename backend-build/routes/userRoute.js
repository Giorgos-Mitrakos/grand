"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _util = require("../util.js");

var _connection = _interopRequireDefault(require("../connection"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express["default"].Router();

router.get("/", function (req, res) {
  _connection["default"].getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    connection.query('SELECT * FROM users', function (err, result, fields) {
      if (err) throw err;
      console.log("Read user succeed");
      res.send(result);
      connection.release(); // Handle error after the release.

      if (err) throw err;
    });
  });
});
router.get("/createadmin", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              _connection["default"].getConnection(function (err, connection) {
                if (err) throw err; // not connected!

                _bcrypt["default"].hash("TryGra20#@", 10, function (err, hash) {
                  // Store hash in your password DB.
                  var sql = "INSERT INTO users (username, email, password, isAdmin) VALUES ('grand', 'grandmobile@grandmobile.gr',?, 1)";
                  connection.query(sql, [hash], function (err, result, fields) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    connection.release(); // Handle error after the release.

                    if (err) throw err;
                  });
                });

                _bcrypt["default"].hash("TsiGra20#@", 10, function (err, hash) {
                  // Store hash in your password DB.
                  var sql = "INSERT INTO users (username, email, password, isAdmin) VALUES ('grand1', 'grandmobile1@grandmobile.gr',?, 1)";
                  connection.query(sql, [hash], function (err, result, fields) {
                    if (err) throw err;
                    connection.release(); // Handle error after the release.

                    if (err) throw err;
                  });
                });

                res.send("OK");
              });
            } catch (error) {
              res.send({
                message: error.message
              });
            }

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
router.post("/signin", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT password FROM users WHERE email=? LIMIT 1";
              connection.query(sql, [req.body.email], function (err, result, fields) {
                if (err) throw err;

                if (result.length !== 0) {
                  var hash = result[0].password;

                  _bcrypt["default"].compare(req.body.password, hash, function (err, response) {
                    if (response === true) {
                      sql = "SELECT username,email,isAdmin,name,subname,phoneNumber FROM users WHERE email=? AND password=?";
                      connection.query(sql, [req.body.email, hash], function (err, result, fields) {
                        if (err) throw err;
                        console.log("Query executed successfully");
                        Object.keys(result).forEach(function (key) {
                          var row = result[key];
                          var user = {
                            username: row.username,
                            email: row.email,
                            isAdmin: row.isAdmin
                          };
                          res.send({
                            username: row.username,
                            email: row.email,
                            isAdmin: row.isAdmin,
                            token: (0, _util.getToken)(user)
                          });
                        }); // Handle error after the release.

                        if (err) throw err;
                      });
                    } else {
                      res.status(401).send({
                        message: 'Λάθος password'
                      });
                    }
                  });
                } else {
                  res.status(401).send({
                    message: 'Δεν υπάρχει εγγραφή με αυτό το email!'
                  });
                }
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
router.post("/register", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT email FROM users WHERE email=?";
              connection.query(sql, [req.body.email], function (err, result, fields) {
                if (err) throw err;

                if (Object.keys(result).length !== 0) {
                  res.status(401).send({
                    message: 'Υπάρχει ήδη καταχώρηση με αυτό το email',
                    success: false
                  });
                } else {
                  /* Begin transaction */
                  connection.beginTransaction(function (err) {
                    if (err) {
                      throw err;
                    }

                    _bcrypt["default"].hash(req.body.password, 10, function (err, hash) {
                      // Store hash in your password DB.
                      sql = "INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?,?, 0)";
                      connection.query(sql, [req.body.name, req.body.email, hash], function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        sql = "INSERT INTO addresses (user_email,user_id) VALUES (?,?)";
                        connection.query(sql, [req.body.email, req.body.email], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          sql = "SELECT * FROM users WHERE email=?";
                          connection.query(sql, [req.body.email], function (err, result, fields) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            if (Object.keys(result).length !== 0) {
                              Object.keys(result).forEach(function (key) {
                                var row = result[key];
                                var user = {
                                  username: row.username,
                                  email: row.email,
                                  isAdmin: row.isAdmin
                                };
                                res.send({
                                  username: row.username,
                                  email: row.email,
                                  isAdmin: row.isAdmin,
                                  token: (0, _util.getToken)(user),
                                  success: true
                                });
                              });
                            }

                            connection.commit(function (err) {
                              if (err) {
                                connection.rollback(function () {
                                  throw err;
                                });
                              }

                              console.log('Transaction Completed Successfully.');
                            });
                          });
                        });
                      });
                    });
                  });
                  /* End transaction */

                  sql = "SELECT * FROM users WHERE email=?";
                  connection.query(sql, [req.body.email], function (err, result, fields) {
                    if (err) throw err;
                    console.log("Query executed successfully");
                  });
                }
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

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.put("/accountInfo", _util.isAuth, /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "UPDATE addresses SET name=?, subname=?, phoneNumber=?,country=?, district=?, city=?, street=?, postalCode=? WHERE user_id=?";
              connection.query(sql, [req.body.name, req.body.subname, req.body.phoneNumber, req.body.country, req.body.district, req.body.city, req.body.address, req.body.postalCode, req.body.email], function (err, result, fields) {
                if (err) throw err;
                res.status(200).send({
                  message: "Οι αλλαγές αποθηκεύτηκαν"
                });
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

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router.post("/accountInfo", _util.isAuth, /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT * FROM addresses WHERE user_id=?";
              connection.query(sql, [req.body.email], function (err, result, fields) {
                if (err) throw err;

                if (Object.keys(result).length !== 0) {
                  Object.keys(result).forEach(function (key) {
                    var row = result[key];
                    res.send({
                      name: row.name,
                      subname: row.subname,
                      phoneNumber: row.phoneNumber,
                      country: row.country,
                      district: row.district,
                      city: row.city,
                      email: row.user_email,
                      address: row.street,
                      postalCode: row.postalCode,
                      companyName: row.companyName,
                      bussiness: row.bussiness,
                      afm: row.afm,
                      doy: row.doy,
                      success: true
                    });
                  });
                }
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

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
router.put("/changePassword", _util.isAuth, /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT password FROM users WHERE email=? LIMIT 1";
              connection.query(sql, [req.body.email], function (err, result, fields) {
                if (err) throw err;

                if (result.length !== 0) {
                  var hash = result[0].password;

                  _bcrypt["default"].compare(req.body.password, hash, function (err, response) {
                    if (response === true) {
                      _bcrypt["default"].hash(req.body.newPassword, 10, function (err, newhash) {
                        sql = "UPDATE users SET password=? WHERE email=?";
                        connection.query(sql, [newhash, req.body.email], function (err, result, fields) {
                          if (err) throw err;
                          console.log("Query executed successfully");
                          res.status(201).send({
                            message: 'Ο κωδικός άλλαξε επιτυχώς'
                          });
                        });
                      });
                    } else {
                      res.status(401).send({
                        message: 'Λάθος password'
                      });
                    }
                  });
                } else {
                  res.status(401).send({
                    message: 'Δεν υπάρχει εγγραφή με αυτό το email!'
                  });
                }

                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11, _x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}());
router.post("/addForNewsletter", /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT email FROM newsletters WHERE email=?";
              connection.query(sql, [req.body.email], function (err, result, fields) {
                if (err) throw err;

                if (Object.keys(result).length !== 0) {
                  console.log("email already existed");
                  res.send({
                    message: 'email already existed',
                    success: false
                  });
                } else {
                  sql = "INSERT INTO newsletters (email) VALUES (?)";
                  connection.query(sql, [req.body.email], function (err, result, fields) {
                    if (err) throw err;
                    console.log("Query executed successfully");
                    res.status(200).send({
                      message: 'Email inserted Successfully',
                      success: true
                    });
                  });
                }
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x14, _x15) {
    return _ref7.apply(this, arguments);
  };
}());
router.post("/removeFromNewsletter", /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT * FROM newsletters WHERE email=?";
              connection.query(sql, [req.body.email], function (err, result, fields) {
                if (err) throw err;

                if (Object.keys(result).length === 0) {
                  res.send({
                    message: 'No such email exists',
                    success: false
                  });
                } else {
                  var _sql = "DELETE FROM newsletters WHERE email=?";
                  connection.query(_sql, [req.body.email], function (err, result, fields) {
                    if (err) throw err;
                    res.send({
                      message: 'email deleted successfully',
                      success: true
                    });
                  });
                }
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}());
router.post("/updatepassword", /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = 'SELECT * FROM users WHERE email=?';
              connection.query(sql, [req.body.email], function (err, result, fields) {
                if (err) throw err;

                if (Object.keys(result).length === 0) {
                  console.log("User not found");
                  res.status(404).send({
                    message: 'Δεν βρέθηκε χρήστης με αυτό το email!'
                  });
                } else {
                  _jsonwebtoken["default"].verify(req.body.token, _config["default"].JWT_SECRET, function (err, decode) {
                    if (err) {
                      return res.status(403).send({
                        msg: 'Ο σύνδεσμος που χρησιμοποιήσατε έχει λήξει\n Παρακαλώ επαναλάβετε τη διαδικασία επανάκτησης του κωδικού.'
                      });
                    }

                    if (decode.username === result.username && decode.password === result.password) {
                      _bcrypt["default"].hash(req.body.password, 10, function (err, hash) {
                        var sql = 'UPDATE users SET password=? WHERE email=?';
                        connection.query(sql, [hash, req.body.email], function (err, result, fields) {
                          if (err) throw err;
                          res.status(200).send({
                            message: "Password Updated"
                          });
                        });
                      });
                    }
                  });
                }
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}());
router.post("/deleteAccount", _util.isAuth, /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res) {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT email FROM users WHERE email=?";
              connection.query(sql, [req.body.email], function (err, result, fields) {
                if (err) throw err;

                if (Object.keys(result).length === 0) {
                  console.log("No user with this email existed");
                  res.send({
                    message: 'No user with this email existed',
                    success: false
                  });
                } else {
                  /* Begin transaction */
                  connection.beginTransaction(function (err) {
                    if (err) {
                      throw err;
                    }

                    var sql = "DELETE FROM wishlists WHERE user_email=?";
                    connection.query(sql, [req.body.email], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      sql = "DELETE FROM cart WHERE user_email=?";
                      connection.query(sql, [req.body.email], function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        sql = "UPDATE addresses SET user_id='' WHERE user_email=?";
                        connection.query(sql, [req.body.email], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          sql = "DELETE FROM users WHERE email=?";
                          connection.query(sql, [req.body.email], function (err, result, fields) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            res.status(200).send({
                              message: 'Account deleted successfully',
                              success: true
                            });
                            connection.commit(function (err) {
                              if (err) {
                                connection.rollback(function () {
                                  throw err;
                                });
                              }
                            });
                          });
                        });
                      });
                    });
                  });
                  /* End transaction */
                }
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=userRoute.js.map