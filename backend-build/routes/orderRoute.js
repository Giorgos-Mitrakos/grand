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

router.post("/insert_order_company_shippingTo", _util.isAuth, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "UPDATE addresses SET name=?, subname=?, phoneNumber=?,country=?, district=?, city=?, street=?, postalCode=?, companyName=?, bussiness=?, doy=?, afm=? WHERE user_id=?";
                connection.query(sql, [req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country, req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode, req.body.company.companyName, req.body.company.bussiness, req.body.company.doy, req.body.company.afm, req.body.charger.email], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var sql = "Select address_id FROM addresses WHERE user_id=?";
                  connection.query(sql, [req.body.charger.email], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var chargerAddress_id = result[0].address_id;
                    sql = "INSERT INTO addresses (name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.phoneNumber, req.body.shippingTo.country, req.body.shippingTo.district, req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.postalCode], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var shippingAddress_id = result.insertId;
                      sql = "INSERT INTO orders (user_email, billingAddress, shippingAddress, paymentType, paymentMethod, paymentMethodPrice, sendingMethod,shippingPrice, comments, itemsPrice, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                      connection.query(sql, [req.body.charger.email, chargerAddress_id, shippingAddress_id, req.body.methods.typeOfPayment, req.body.methods.paymentMethod, req.body.methods.paymentMethodCost, req.body.methods.sendingMethod, req.body.methods.sendingMethodCost, req.body.methods.comments, req.body.itemsCost, req.body.charger.email], function (err, result) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var order_id = result.insertId;
                        sql = "INSERT INTO order_products (order_id, product_id, model, quantity, image_case) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case FROM cart WHERE user_email=?";
                        connection.query(sql, [order_id, req.body.charger.email], function (err, result) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          sql = "DELETE FROM cart WHERE user_email=?";
                          connection.query(sql, [req.body.charger.email], function (err, result) {
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
                              var response = {
                                order_id: order_id
                              };
                              res.status(200).send(response);
                              connection.release();
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
              /* End transaction */
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
router.post("/insert_no_user_order_company_shippingTo", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO addresses (user_email, name, subname, phoneNumber, country, district, city, street, postalCode, companyName, bussiness, afm, doy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [req.body.charger.email, req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country, req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode, req.body.company.companyName, req.body.company.bussiness, req.body.company.afm, req.body.company.doy], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var chargerAddress_id = result.insertId;
                  sql = "INSERT INTO addresses (name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                  connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.phoneNumber, req.body.shippingTo.country, req.body.shippingTo.district, req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.postalCode], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var shippingAddress_id = result.insertId;
                    sql = "INSERT INTO orders (user_email, billingAddress, shippingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice,shippingPrice ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.charger.email, chargerAddress_id, shippingAddress_id, req.body.methods.typeOfPayment, req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments, req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost], function (err, result) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var order_id = result.insertId;
                      var mapCartItems = req.body.cartItems.map(function (x) {
                        var rObj = [];
                        rObj[0] = order_id;
                        rObj[1] = x._id;
                        rObj[2] = x.model;
                        rObj[3] = x.quantity;
                        return rObj;
                      });
                      sql = "INSERT INTO order_products (order_id,product_id,model,quantity) VALUES ?";
                      connection.query(sql, [mapCartItems], function (err, result) {
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
                          var response = {
                            order_id: order_id
                          };
                          res.status(200).send(response);
                          connection.release();
                        });
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

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.post("/insert_order_company", _util.isAuth, /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "UPDATE addresses SET name=?, subname=?, phoneNumber=?, country=?, district=?, city=?, street=?, postalCode=?, companyName=?, bussiness=?, doy=?, afm=? WHERE user_id=?";
                connection.query(sql, [req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country, req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode, req.body.company.companyName, req.body.company.bussiness, req.body.company.doy, req.body.company.afm, req.body.charger.email], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var sql = "Select address_id FROM addresses WHERE user_id=?";
                  connection.query(sql, [req.body.charger.email], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var chargerAddress_id = result[0].address_id;
                    sql = "INSERT INTO orders (user_email, billingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.charger.email, chargerAddress_id, req.body.methods.typeOfPayment, req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments, req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost, req.body.charger.email], function (err, result) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var order_id = result.insertId;
                      sql = "INSERT INTO order_products (order_id, product_id, model, quantity, image_case) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case FROM cart WHERE user_email=?";
                      connection.query(sql, [order_id, req.body.charger.email], function (err, result) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        sql = "DELETE FROM cart WHERE user_email=?";
                        connection.query(sql, [req.body.charger.email], function (err, result) {
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
                            var response = {
                              order_id: order_id
                            };
                            res.status(200).send(response);
                            connection.release();
                          });
                        });
                      });
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

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.post("/insert_no_user_order_company", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO addresses (user_email, name, subname, phoneNumber,country, district, city, street, postalCode, companyName, bussiness, afm, doy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [req.body.charger.email, req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country, req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode, req.body.company.companyName, req.body.company.bussiness, req.body.company.afm, req.body.company.doy], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var chargerAddress_id = result.insertId;
                  sql = "INSERT INTO orders (user_email, billingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                  connection.query(sql, [req.body.charger.email, chargerAddress_id, req.body.methods.typeOfPayment, req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments, req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost], function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var order_id = result.insertId;
                    var mapCartItems = req.body.cartItems.map(function (x) {
                      var rObj = [];
                      rObj[0] = order_id;
                      rObj[1] = x._id;
                      rObj[2] = x.model;
                      rObj[3] = x.quantity;
                      return rObj;
                    });
                    sql = "INSERT INTO order_products (order_id,product_id,model,quantity) VALUES ?";
                    connection.query(sql, [mapCartItems], function (err, result) {
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
                        var response = {
                          order_id: order_id
                        };
                        res.status(200).send(response);
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
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router.post("/insert_order_shippingTo", _util.isAuth, /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "UPDATE addresses SET name=?, subname=?, phoneNumber=?,country=?, district=?, city=?, street=?, postalCode=? WHERE user_id=?";
                connection.query(sql, [req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country, req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode, req.body.charger.email], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var sql = "Select address_id FROM addresses WHERE user_id=?";
                  connection.query(sql, [req.body.charger.email], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var chargerAddress_id = result[0].address_id;
                    sql = "INSERT INTO addresses (name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.phoneNumber, req.body.shippingTo.country, req.body.shippingTo.district, req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.postalCode], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var shippingAddress_id = result.insertId;
                      sql = "INSERT INTO orders (user_email, billingAddress, shippingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                      connection.query(sql, [req.body.charger.email, chargerAddress_id, shippingAddress_id, req.body.methods.typeOfPayment, req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments, req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost, req.body.charger.email], function (err, result) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var order_id = result.insertId;
                        sql = "INSERT INTO order_products (order_id, product_id, model, quantity, image_case) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case FROM cart WHERE user_email=?";
                        connection.query(sql, [order_id, req.body.charger.email], function (err, result) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          sql = "DELETE FROM cart WHERE user_email=?";
                          connection.query(sql, [req.body.charger.email], function (err, result) {
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
                              var response = {
                                order_id: order_id
                              };
                              res.status(200).send(response);
                              connection.release();
                            });
                          });
                        });
                      });
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

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
router.post("/insert_no_user_order_shippingTo", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO addresses (user_email, name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [req.body.charger.email, req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country, req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var chargerAddress_id = result.insertId;
                  sql = "INSERT INTO addresses (name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                  connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.phoneNumber, req.body.shippingTo.country, req.body.shippingTo.district, req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.postalCode], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var shippingAddress_id = result.insertId;
                    sql = "INSERT INTO orders (user_email, billingAddress, shippingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.charger.email, chargerAddress_id, shippingAddress_id, req.body.methods.typeOfPayment, req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments, req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost], function (err, result) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var order_id = result.insertId;
                      var mapCartItems = req.body.cartItems.map(function (x) {
                        var rObj = [];
                        rObj[0] = order_id;
                        rObj[1] = x._id;
                        rObj[2] = x.model;
                        rObj[3] = x.quantity;
                        return rObj;
                      });
                      sql = "INSERT INTO order_products (order_id,product_id,model,quantity) VALUES ?";
                      connection.query(sql, [mapCartItems], function (err, result) {
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
                          var response = {
                            order_id: order_id
                          };
                          res.status(200).send(response);
                          connection.release();
                        });
                      });
                    });
                  });
                });
              });
              /* End transaction */
            });

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
router.post("/insert_order", _util.isAuth, /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "UPDATE addresses SET name=?, subname=?, phoneNumber=?,country=?, district=?, city=?, street=?, postalCode=? WHERE user_id=?";
                connection.query(sql, [req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country, req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode, req.body.charger.email], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var sql = "Select address_id FROM addresses WHERE user_id=?";
                  connection.query(sql, [req.body.charger.email], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var chargerAddress_id = result[0].address_id;
                    sql = "INSERT INTO orders (user_email, billingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.charger.email, chargerAddress_id, req.body.methods.typeOfPayment, req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments, req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost, req.body.charger.email], function (err, result) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var order_id = result.insertId;
                      sql = "INSERT INTO order_products (order_id, product_id, model, quantity, image_case) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case FROM cart WHERE user_email=?";
                      connection.query(sql, [order_id, req.body.charger.email], function (err, result) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        sql = "DELETE FROM cart WHERE user_email=?";
                        connection.query(sql, [req.body.charger.email], function (err, result) {
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
                            var response = {
                              order_id: order_id
                            };
                            res.status(200).send(response);
                            connection.release();
                          });
                        });
                      });
                    });
                  });
                });
              });
              /* End transaction */
            });

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());
router.post("/insert_no_user_order", /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO addresses (user_email, name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [req.body.charger.email, req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country, req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var chargerAddress_id = result.insertId;
                  sql = "INSERT INTO orders (user_email, billingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                  connection.query(sql, [req.body.charger.email, chargerAddress_id, req.body.methods.typeOfPayment, req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments, req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost], function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var order_id = result.insertId;
                    var mapCartItems = req.body.cartItems.map(function (x) {
                      var rObj = [];
                      rObj[0] = order_id;
                      rObj[1] = x._id;
                      rObj[2] = x.model;
                      rObj[3] = x.quantity;
                      return rObj;
                    });
                    sql = "INSERT INTO order_products (order_id,product_id,model,quantity) VALUES ?";
                    connection.query(sql, [mapCartItems], function (err, result) {
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
                        var response = {
                          order_id: order_id
                        };
                        res.status(200).send(response);
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
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}());
router.get("/", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT * FROM orders ORDER BY orderDate DESC";
              connection.query(sql, function (err, result) {
                if (err) throw err;
                res.send(result);
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

  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());
router.get("/:id", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res) {
    var orderId;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            orderId = req.params.id;

            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "SELECT * FROM orders WHERE order_id=?";
                connection.query(sql, [orderId], function (err, result) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var order = result[0];
                  sql = "SELECT addresses.* FROM addresses INNER JOIN orders ON addresses.address_id = orders.billingAddress WHERE orders.order_id=?";
                  connection.query(sql, [orderId], function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var billingAddress = result[0];
                    sql = "SELECT addresses.* FROM addresses INNER JOIN orders ON addresses.address_id = orders.shippingAddress WHERE orders.order_id=?";
                    connection.query(sql, [orderId], function (err, result) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var shippingAddress = result[0];
                      sql = "SELECT products._id, products.name, products.image, products.category,products.subcategory, products.totalPrice, products.countInStock, order_products.quantity, order_products.model, order_products.image_case FROM products INNER JOIN order_products ON products._id = order_products.product_id WHERE order_products.order_id=?";
                      connection.query(sql, [orderId], function (err, result) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var products = result;
                        var response = {
                          order: order,
                          billingAddress: billingAddress,
                          shippingAddress: shippingAddress,
                          products: products
                        };
                        res.send(response);
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
              });
              /* End transaction */
              // Handle error after the release.

              if (err) throw err;
            });

          case 2:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}());
router.put("/changeStatus", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res) {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            try {
              _connection["default"].getConnection(function (err, connection) {
                if (err) throw err; // not connected!

                switch (req.body.dates.dateIndex) {
                  case 0:
                    var sql = "UPDATE orders SET status=?, proccessDate=?, delayDate=?, shippingDate=?, cancelDate=? WHERE order_id=?";
                    connection.query(sql, [req.body.newStatus, req.body.dates.proccessDate, req.body.dates.delayDate, req.body.dates.shippingDate, req.body.dates.cancelDate, req.body.orderId], function (err, result, fields) {
                      if (err) throw err;
                      console.log("Order Status updated");
                      res.status(200).send("OK");
                      connection.release(); // Handle error after the release.

                      if (err) throw err;
                    });
                    break;

                  case 1:
                    var sql = "UPDATE orders SET status=?, delayDate=?, shippingDate=?, cancelDate=? WHERE order_id=?";
                    connection.query(sql, [req.body.newStatus, req.body.dates.delayDate, req.body.dates.shippingDate, req.body.dates.cancelDate, req.body.orderId], function (err, result, fields) {
                      if (err) throw err;
                      console.log("Order Status updated");
                      res.status(200).send("OK");
                      connection.release(); // Handle error after the release.

                      if (err) throw err;
                    });
                    break;

                  case 2:
                    var sql = "UPDATE orders SET status=?, shippingDate=?, cancelDate=? WHERE order_id=?";
                    connection.query(sql, [req.body.newStatus, req.body.dates.shippingDate, req.body.dates.cancelDate, req.body.orderId], function (err, result, fields) {
                      if (err) throw err;
                      console.log("Order Status updated");
                      res.status(200).send("OK");
                      connection.release(); // Handle error after the release.

                      if (err) throw err;
                    });
                    break;

                  case 3:
                    var sql = "UPDATE orders SET status=?, cancelDate=? WHERE order_id=?";
                    connection.query(sql, [req.body.newStatus, req.body.dates.cancelDate, req.body.orderId], function (err, result, fields) {
                      if (err) throw err;
                      console.log("Order Status updated");
                      res.status(200).send("OK");
                      connection.release(); // Handle error after the release.

                      if (err) throw err;
                    });
                    break;

                  default:
                    break;
                }
              });
            } catch (error) {
              res.send({
                message: error.message
              });
            }

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}());
router.put("/updateStatus", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res) {
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            try {
              _connection["default"].getConnection(function (err, connection) {
                if (err) throw err; // not connected!

                switch (req.body.StatusIndex) {
                  case 1:
                    var sql = "UPDATE orders SET status=?, proccessDate=? WHERE order_id=?";
                    connection.query(sql, [req.body.newStatus, new Date(), req.body.orderId], function (err, result, fields) {
                      if (err) throw err;
                      console.log("Order Status updated");
                      res.status(200).send("OK");
                      connection.release(); // Handle error after the release.

                      if (err) throw err;
                    });
                    break;

                  case 2:
                    var sql = "UPDATE orders SET status=?, delayDate=? WHERE order_id=?";
                    connection.query(sql, [req.body.newStatus, new Date(), req.body.orderId], function (err, result, fields) {
                      if (err) throw err;
                      console.log("Order Status updated");
                      res.status(200).send("OK");
                      connection.release(); // Handle error after the release.

                      if (err) throw err;
                    });
                    break;

                  case 3:
                    var sql = "UPDATE orders SET status=?, shippingDate=? WHERE order_id=?";
                    connection.query(sql, [req.body.newStatus, new Date(), req.body.orderId], function (err, result, fields) {
                      if (err) throw err;
                      console.log("Order Status updated");
                      res.status(200).send("OK");
                      connection.release(); // Handle error after the release.

                      if (err) throw err;
                    });
                    break;

                  case 4:
                    var sql = "UPDATE orders SET status=?, cancelDate=? WHERE order_id=?";
                    connection.query(sql, [req.body.newStatus, new Date(), req.body.orderId], function (err, result, fields) {
                      if (err) throw err;
                      console.log("Order Status updated");
                      res.status(200).send("OK");
                      connection.release(); // Handle error after the release.

                      if (err) throw err;
                    });
                    break;

                  default:
                    break;
                }
              });
            } catch (error) {
              res.send({
                message: error.message
              });
            }

          case 1:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}());
router.put("/changeOrderDetails", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res) {
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            try {
              _connection["default"].getConnection(function (err, connection) {
                if (err) throw err; // not connected!

                var sql = "UPDATE orders SET sendingMethod=?, shippingPrice=?, paymentMethod=?,paymentMethodPrice=?, paymentType=? WHERE order_id=?";
                connection.query(sql, [req.body.sendingMethod, req.body.shippingPrice, req.body.paymentMethod, req.body.paymentMethodCost, req.body.paymentType, req.body.orderId], function (err, result, fields) {
                  if (err) throw err;
                  console.log("Order Details updated");
                  res.status(200).send("OK");
                  connection.release(); // Handle error after the release.

                  if (err) throw err;
                });
              });
            } catch (error) {
              res.send({
                message: error.message
              });
            }

          case 1:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}());
router.put("/updateChargerAddress", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(req, res) {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            try {
              _connection["default"].getConnection(function (err, connection) {
                if (err) throw err; // not connected!

                if (req.body.paymentType === 'Τιμολόγιο') {
                  var sql = "UPDATE addresses INNER JOIN orders ON addresses.address_id=orders.billingAddress SET companyName=?, bussiness=?, afm=?, doy=?, country=?, district=?, city=?, street=?, phoneNumber=?, postalCode=?, comments=? WHERE orders.order_id=?";
                  connection.query(sql, [req.body.charger.companyName, req.body.charger.bussiness, req.body.charger.afm, req.body.charger.doy, req.body.charger.country, req.body.charger.district, req.body.charger.city, req.body.charger.street, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.charger.comments, req.body.orderId], function (err, result, fields) {
                    if (err) throw err;
                    console.log("Order Details updated");
                    res.status(200).send("OK");
                    connection.release(); // Handle error after the release.

                    if (err) throw err;
                  });
                } else if (req.body.paymentType === 'Απόδειξη') {
                  var sql = "UPDATE addresses INNER JOIN orders ON addresses.address_id=orders.billingAddress SET name=?, subname=?, country=?, district=?, city=?, street=?, phoneNumber=?, postalCode=?, comments=? WHERE orders.order_id=?";
                  connection.query(sql, [req.body.charger.name, req.body.charger.subname, req.body.charger.country, req.body.charger.district, req.body.charger.city, req.body.charger.street, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.charger.comments, req.body.orderId], function (err, result, fields) {
                    if (err) throw err;
                    console.log("Order Details updated");
                    res.status(200).send("OK");
                    connection.release(); // Handle error after the release.

                    if (err) throw err;
                  });
                }
              });
            } catch (error) {
              res.send({
                message: error.message
              });
            }

          case 1:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}());
router.put("/updateShippingAddress", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(req, res) {
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            try {
              _connection["default"].getConnection(function (err, connection) {
                if (err) throw err; // not connected!

                if (req.body.shippingAddress) {
                  var sql = "UPDATE addresses INNER JOIN orders ON addresses.address_id=orders.shippingAddress SET name=?, subname=?, country=?, district=?, city=?, street=?, postalCode=? WHERE orders.order_id=?";
                  connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.country, req.body.shippingTo.district, req.body.shippingTo.city, req.body.shippingTo.street, req.body.shippingTo.postalCode, req.body.orderId], function (err, result, fields) {
                    if (err) throw err;
                    console.log("Order Details updated");
                    res.status(200).send("OK");
                    connection.release(); // Handle error after the release.

                    if (err) throw err;
                  });
                } else {
                  /* Begin transaction */
                  connection.beginTransaction(function (err) {
                    if (err) {
                      throw err;
                    }

                    var sql = "INSERT INTO addresses (name, subname, country, district, city, street, postalCode) VALUE (?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.country, req.body.shippingTo.district, req.body.shippingTo.city, req.body.shippingTo.street, req.body.shippingTo.postalCode], function (err, result) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var shippingAddress_id = result.insertId;
                      sql = "UPDATE orders SET shippingAddress=? WHERE order_id=?";
                      connection.query(sql, [shippingAddress_id, req.body.orderId], function (err, result) {
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
                          connection.release();
                        });
                      });
                    });
                  });
                  /* End transaction */
                }
              });
            } catch (error) {
              res.send({
                message: error.message
              });
            }

          case 1:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x29, _x30) {
    return _ref15.apply(this, arguments);
  };
}());
router.put("/updateOrder", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(req, res) {
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            try {
              _connection["default"].getConnection(function (err, connection) {
                if (err) throw err; // not connected!

                var sql = "UPDATE order_products SET quantity=? WHERE order_id=? && model=? && product_id=?";
                connection.query(sql, [req.body.quantity, req.body.order_id, req.body.model, req.body.product_id], function (err, result, fields) {
                  if (err) throw err;
                  console.log("Order updated");
                  res.status(200).send("OK");
                  connection.release(); // Handle error after the release.

                  if (err) throw err;
                });
              });
            } catch (error) {
              res.send({
                message: error.message
              });
            }

          case 1:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function (_x31, _x32) {
    return _ref16.apply(this, arguments);
  };
}());
router.post("/removeOrderItem", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(req, res) {
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            try {
              _connection["default"].getConnection(function (err, connection) {
                if (err) throw err; // not connected!

                var sql = "DELETE FROM order_products WHERE order_id=? && model=? && product_id=?";
                connection.query(sql, [req.body.order_id, req.body.model, req.body.product_id], function (err, result, fields) {
                  if (err) throw err;
                  console.log("Item deleted");
                  res.status(200).send("OK");
                  connection.release(); // Handle error after the release.

                  if (err) throw err;
                });
              });
            } catch (error) {
              res.send({
                message: error.message
              });
            }

          case 1:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function (_x33, _x34) {
    return _ref17.apply(this, arguments);
  };
}());
router.post("/customerOrders", _util.isAuth, /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(req, res) {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT * FROM orders WHERE user_id=? ORDER BY orderDate DESC";
              connection.query(sql, [req.body.email], function (err, result) {
                if (err) throw err;
                res.send(result);
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function (_x35, _x36) {
    return _ref18.apply(this, arguments);
  };
}());
router.get("/customerOrders/:id", _util.isAuth, /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(req, res) {
    var orderId;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            orderId = req.params.id;

            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "SELECT * FROM orders WHERE order_id=?";
                connection.query(sql, [orderId], function (err, result) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var order = result[0];
                  sql = "SELECT addresses.* FROM addresses INNER JOIN orders ON addresses.address_id = orders.billingAddress WHERE orders.order_id=?";
                  connection.query(sql, [orderId], function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var billingAddress = result[0];
                    sql = "SELECT addresses.* FROM addresses INNER JOIN orders ON addresses.address_id = orders.shippingAddress WHERE orders.order_id=?";
                    connection.query(sql, [orderId], function (err, result) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var shippingAddress = result[0];
                      sql = "SELECT products._id, products.name, products.image, products.category,products.subcategory, products.totalPrice, products.countInStock, order_products.quantity, order_products.model FROM products INNER JOIN order_products ON products._id = order_products.product_id WHERE order_products.order_id=?";
                      connection.query(sql, [orderId], function (err, result) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var products = result;
                        var response = {
                          order: order,
                          billingAddress: billingAddress,
                          shippingAddress: shippingAddress,
                          products: products
                        };
                        res.send(response);
                        connection.commit(function (err) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          connection.release();
                        });
                      });
                    });
                  });
                });
              });
              /* End transaction */
              // Handle error after the release.

              if (err) throw err;
            });

          case 2:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function (_x37, _x38) {
    return _ref19.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=orderRoute.js.map