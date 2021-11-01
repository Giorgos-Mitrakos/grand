"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _util = require("../util");

var _connection = _interopRequireDefault(require("../connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fs = require('fs');

var router = _express["default"].Router();

var storageA = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'frontend/public/images/products');
  },
  filename: function filename(req, file, cb) {
    var fileName = Date.now() + '-' + file.originalname;
    cb(null, fileName);
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif" || file.mimetype == "image/webp") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
  }
};

var upload = (0, _multer["default"])({
  storage: storageA,
  fileFilter: fileFilter
});
router.get("/", _util.isAdmin, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var products;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Product.find({});

          case 2:
            products = _context.sent;
            res.send(products);

          case 4:
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
router.post("/createproduct", _util.isAuth, _util.isAdmin, upload.single('image'), /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "INSERT INTO products (name, category, brand, subcategory, supplier, image, typicalImage, price, percentage,availability, description, CreatedBy, CreatedAt, countInStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 10)";
              connection.query(sql, [req.body.name, req.body.category, req.body.brand, req.body.subcategory, req.body.supplier, req.file.path.slice(15, req.file.path.length), req.body.typicalImage, req.body.price, req.body.percentage, req.body.availability, req.body.description, req.user.username, new Date(), req.body.countInStock], function (err, result, fields) {
                if (err) throw err;
                var insertedId = result.insertId;
                sql = "INSERT INTO productsHistory (product_id, name, category, brand, subcategory, supplier, image, typicalImage, price, percentage, availability, description, CreatedBy, CreatedAt, countInStock) SELECT _id, name, category, brand, subcategory, supplier, image, price, percentage, availability, description, CreatedBy, CreatedAt, countInStock FROM products WHERE _id=?";
                connection.query(sql, [insertedId], function (err, result, fields) {
                  if (err) throw err;
                });
                res.status(201).send({
                  message: 'New product Created'
                });
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
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
router.post("/getcollectionList", _util.isAuth, _util.isAdmin, upload.single('image'), /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT * FROM products WHERE category=?";
              connection.query(sql, ["Συλλογή"], function (err, result, fields) {
                if (err) throw err;
                res.status(200).send(result);
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

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());
router.post("/insertcollectionproduct", _util.isAuth, _util.isAdmin, upload.single('image'), /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "INSERT INTO products (name, image, price, description, category) VALUES (?, ?, ?, ?, ?)";
              connection.query(sql, [req.body.name, req.file.path.slice(15, req.file.path.length), req.body.price, req.body.description, "Συλλογή"], function (err, result, fields) {
                if (err) throw err;
                res.status(201).send({
                  message: 'New collection product Created'
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

  return function (_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}());
router.put("/insertcollectionproduct/:id", _util.isAuth, _util.isAdmin, upload.single('image'), /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    var collectionId;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            collectionId = req.params.id;

            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = 'SELECT * FROM products WHERE _id=?';
              connection.query(sql, [collectionId], function (err, result, fields) {
                if (err) throw err;

                if (Object.keys(result).length === 0) {
                  res.send({
                    message: 'Product not found'
                  });
                } else {
                  var imagePath = '';

                  if (req.body.image === result[0].image) {
                    imagePath = req.body.image;
                  } else {
                    fs.unlink('frontend/public' + result[0].image, function (err) {
                      if (err) {
                        console.error(err);
                        return;
                      } //file removed

                    });
                    imagePath = req.file.path.slice(15, req.file.path.length);
                  }

                  sql = "UPDATE products SET name=?, image=?, price=?, description=? WHERE _id=?";
                  connection.query(sql, [req.body.name, imagePath, req.body.price, req.body.description, collectionId], function (err, result, fields) {
                    if (err) throw err;
                  });
                  sql = "SELECT * FROM products WHERE _id=?";
                  connection.query(sql, [collectionId], function (err, result, fields) {
                    if (err) throw err;
                    res.send(result);
                  });
                }
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}());
router.put("/changeCollectionVisibility", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = 'UPDATE products SET visibility=? WHERE _id=?';
              connection.query(sql, [req.body.productVisibility, req.body.collectionId], function (err, result, fields) {
                if (err) throw err;
                sql = "SELECT * FROM products WHERE _id=?";
                connection.query(sql, [req.body.collectionId], function (err, result, fields) {
                  if (err) throw err;
                  res.send(result);
                });
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x15, _x16, _x17) {
    return _ref6.apply(this, arguments);
  };
}());
router.put("/changeVisibility", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = 'UPDATE products SET visibility=? WHERE _id=?';
                connection.query(sql, [req.body.productVisibility, req.body.productID], function (err, result, fields) {
                  if (err) throw err; // sql = "INSERT INTO productsHistory (product_id, name, category, brand, subcategory, supplier, image, price, percentage, availability, visibility, description, CreatedBy, CreatedAt, countInStock, UpdatedBy, UpdatedAt) SELECT _id, name, category, brand, subcategory, supplier, image, price, percentage, availability, visibility, description, CreatedBy, CreatedAt, countInStock, ?, ? FROM products WHERE _id=?";
                  // connection.query(sql, [req.user.username, new Date, req.body.productID], function (err, result, fields) {
                  //   if (err) {
                  //     connection.rollback(function () {
                  //       throw err;
                  //     });
                  //   }

                  sql = "SELECT * FROM products WHERE _id=?";
                  connection.query(sql, [req.body.productID], function (err, result, fields) {
                    if (err) throw err;
                    connection.commit(function (err) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      res.send(result);
                    }); // })
                  });
                });
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

  return function (_x18, _x19, _x20) {
    return _ref7.apply(this, arguments);
  };
}());
router.put("/category_percentage_change", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res, next) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              if (req.body.supplier === '' || req.body.supplier === 'Επέλεξε Προμηθευτή' || req.body.supplier === null) {
                if (req.body.subcategory === '' || req.body.subcategory === 'Επέλεξε Υποκατηγορία' || req.body.subcategory === null) {
                  connection.beginTransaction(function (err) {
                    var sql = 'UPDATE products SET percentage=? WHERE category=?';
                    connection.query(sql, [req.body.pricePercentage, req.body.category], function (err, result, fields) {
                      if (err) throw err;
                      sql = "INSERT INTO productsHistory (product_id, name, category, brand, subcategory, supplier, image, price, percentage, description, CreatedBy, CreatedAt, countInStock, UpdatedBy, UpdatedAt) SELECT _id, name, category, brand, subcategory, supplier, image, price, percentage, description, CreatedBy, CreatedAt, countInStock, ?, ? FROM products WHERE category=?";
                      connection.query(sql, [req.user.username, new Date(), req.body.category], function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        sql = "SELECT _id FROM products WHERE category=?";
                        connection.query(sql, [req.body.category], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          var product = result;

                          var _loop = function _loop(i) {
                            sql = "SELECT ID FROM productsHistory WHERE product_id=? ORDER BY UpdatedAt DESC LIMIT 5";
                            connection.query(sql, [product[i]._id], function (err, result, fields) {
                              if (err) {
                                connection.rollback(function () {
                                  throw err;
                                });
                              }

                              var idArray = [];

                              for (var _i = 0; _i < result.length; _i++) {
                                idArray.push(result[_i].ID);
                              }

                              sql = "DELETE FROM productsHistory WHERE product_id=? && ID NOT IN (?)";
                              connection.query(sql, [product[i]._id, idArray], function (err, result, fields) {
                                if (err) {
                                  connection.rollback(function () {
                                    throw err;
                                  });
                                }
                              });
                            });
                          };

                          for (var i = 0; i < product.length; i++) {
                            _loop(i);
                          }

                          connection.commit(function (err) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            console.log('Transaction Completed Successfully.');
                            res.send({
                              message: "OK"
                            });
                          });
                        });
                      });
                    });
                  });
                } else {
                  connection.beginTransaction(function (err) {
                    var sql = 'UPDATE products SET percentage=? WHERE category=? && subcategory=?';
                    connection.query(sql, [req.body.pricePercentage, req.body.category, req.body.subcategory], function (err, result, fields) {
                      if (err) throw err;
                      sql = "INSERT INTO productsHistory (product_id, name, category, brand, subcategory, supplier, image, price, percentage, description, CreatedBy, CreatedAt, countInStock, UpdatedBy, UpdatedAt) SELECT _id, name, category, brand, subcategory, supplier, image, price, percentage, description, CreatedBy, CreatedAt, countInStock, ?, ? FROM products WHERE category=? && subcategory=?";
                      connection.query(sql, [req.user.username, new Date(), req.body.category, req.body.subcategory], function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        sql = "SELECT _id FROM products WHERE category=? && subcategory=?";
                        connection.query(sql, [req.body.category, req.body.subcategory], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          var product = result;

                          var _loop2 = function _loop2(i) {
                            sql = "SELECT ID FROM productsHistory WHERE product_id=? ORDER BY UpdatedAt DESC LIMIT 5";
                            connection.query(sql, [product[i]._id], function (err, result, fields) {
                              if (err) {
                                connection.rollback(function () {
                                  throw err;
                                });
                              }

                              var idArray = [];

                              for (var _i2 = 0; _i2 < result.length; _i2++) {
                                idArray.push(result[_i2].ID);
                              }

                              sql = "DELETE FROM productsHistory WHERE product_id=? && ID NOT IN (?)";
                              connection.query(sql, [product[i]._id, idArray], function (err, result, fields) {
                                if (err) {
                                  connection.rollback(function () {
                                    throw err;
                                  });
                                }
                              });
                            });
                          };

                          for (var i = 0; i < product.length; i++) {
                            _loop2(i);
                          }

                          connection.commit(function (err) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            console.log('Transaction Completed Successfully.');
                            res.send({
                              message: "OK"
                            });
                          });
                        });
                      });
                    });
                  });
                }
              } else {
                if (req.body.category === '' || req.body.category === 'Επέλεξε Κατηγορία' || req.body.category === null) {
                  connection.beginTransaction(function (err) {
                    var sql = 'UPDATE products SET percentage=? WHERE supplier=?';
                    connection.query(sql, [req.body.pricePercentage, req.body.supplier], function (err, result, fields) {
                      if (err) throw err;
                      sql = "INSERT INTO productsHistory (product_id, name, category, brand, subcategory, supplier, image, price, percentage, description, CreatedBy, CreatedAt, countInStock, UpdatedBy, UpdatedAt) SELECT _id, name, category, brand, subcategory, supplier, image, price, percentage, description, CreatedBy, CreatedAt, countInStock, ?, ? FROM products WHERE supplier=?";
                      connection.query(sql, [req.user.username, new Date(), req.body.supplier], function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        sql = "SELECT _id FROM products WHERE supplier=?";
                        connection.query(sql, [req.body.supplier], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          var product = result;

                          var _loop3 = function _loop3(i) {
                            sql = "SELECT ID FROM productsHistory WHERE product_id=? ORDER BY UpdatedAt DESC LIMIT 5";
                            connection.query(sql, [product[i]._id], function (err, result, fields) {
                              if (err) {
                                connection.rollback(function () {
                                  throw err;
                                });
                              }

                              var idArray = [];

                              for (var _i3 = 0; _i3 < result.length; _i3++) {
                                idArray.push(result[_i3].ID);
                              }

                              sql = "DELETE FROM productsHistory WHERE product_id=? && ID NOT IN (?)";
                              connection.query(sql, [product[i]._id, idArray], function (err, result, fields) {
                                if (err) {
                                  connection.rollback(function () {
                                    throw err;
                                  });
                                }
                              });
                            });
                          };

                          for (var i = 0; i < product.length; i++) {
                            _loop3(i);
                          }

                          connection.commit(function (err) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            console.log('Transaction Completed Successfully.');
                            res.send({
                              message: "OK"
                            });
                          });
                        });
                      });
                    });
                  });
                } else {
                  if (req.body.subcategory === '' || req.body.subcategory === 'Επέλεξε Υποκατηγορία' || req.body.subcategory === null) {
                    connection.beginTransaction(function (err) {
                      var sql = 'UPDATE products SET percentage=? WHERE category=? && supplier=?';
                      connection.query(sql, [req.body.pricePercentage, req.body.category, req.body.supplier], function (err, result, fields) {
                        if (err) throw err;
                        sql = "INSERT INTO productsHistory (product_id, name, category, brand, subcategory, supplier, image, price, percentage, description, CreatedBy, CreatedAt, countInStock, UpdatedBy, UpdatedAt) SELECT _id, name, category, brand, subcategory, supplier, image, price, percentage, description, CreatedBy, CreatedAt, countInStock, ?, ? FROM products WHERE category=? && supplier=?";
                        connection.query(sql, [req.user.username, new Date(), req.body.category, req.body.supplier], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          sql = "SELECT _id FROM products WHERE category=? && supplier=?";
                          connection.query(sql, [req.body.category, req.body.supplier], function (err, result, fields) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            var product = result;

                            var _loop4 = function _loop4(i) {
                              sql = "SELECT ID FROM productsHistory WHERE product_id=? ORDER BY UpdatedAt DESC LIMIT 5";
                              connection.query(sql, [product[i]._id], function (err, result, fields) {
                                if (err) {
                                  connection.rollback(function () {
                                    throw err;
                                  });
                                }

                                var idArray = [];

                                for (var _i4 = 0; _i4 < result.length; _i4++) {
                                  idArray.push(result[_i4].ID);
                                }

                                sql = "DELETE FROM productsHistory WHERE product_id=? && ID NOT IN (?)";
                                connection.query(sql, [product[i]._id, idArray], function (err, result, fields) {
                                  if (err) {
                                    connection.rollback(function () {
                                      throw err;
                                    });
                                  }
                                });
                              });
                            };

                            for (var i = 0; i < product.length; i++) {
                              _loop4(i);
                            }

                            connection.commit(function (err) {
                              if (err) {
                                connection.rollback(function () {
                                  throw err;
                                });
                              }

                              console.log('Transaction Completed Successfully.');
                              res.send({
                                message: "OK"
                              });
                            });
                          });
                        });
                      });
                    });
                  } else {
                    connection.beginTransaction(function (err) {
                      var sql = 'UPDATE products SET percentage=? WHERE category=? && subcategory=? && supplier=?';
                      connection.query(sql, [req.body.pricePercentage, req.body.category, req.body.subcategory, req.body.supplier], function (err, result, fields) {
                        if (err) throw err;
                        sql = "INSERT INTO productsHistory (product_id, name, category, brand, subcategory, supplier, image, price, percentage, description, CreatedBy, CreatedAt, countInStock, UpdatedBy, UpdatedAt) SELECT _id, name, category, brand, subcategory, supplier, image, price, percentage, description, CreatedBy, CreatedAt, countInStock, ?, ? FROM products WHERE category=? && subcategory=? && supplier=?";
                        connection.query(sql, [req.user.username, new Date(), req.body.category, req.body.subcategory, req.body.supplier], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          sql = "SELECT _id FROM products WHERE category=? && subcategory=? && supplier=?";
                          connection.query(sql, [req.body.category, req.body.subcategory, req.body.supplier], function (err, result, fields) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            var product = result;

                            var _loop5 = function _loop5(i) {
                              sql = "SELECT ID FROM productsHistory WHERE product_id=? ORDER BY UpdatedAt DESC LIMIT 5";
                              connection.query(sql, [product[i]._id], function (err, result, fields) {
                                if (err) {
                                  connection.rollback(function () {
                                    throw err;
                                  });
                                }

                                var idArray = [];

                                for (var _i5 = 0; _i5 < result.length; _i5++) {
                                  idArray.push(result[_i5].ID);
                                }

                                sql = "DELETE FROM productsHistory WHERE product_id=? && ID NOT IN (?)";
                                connection.query(sql, [product[i]._id, idArray], function (err, result, fields) {
                                  if (err) {
                                    connection.rollback(function () {
                                      throw err;
                                    });
                                  }
                                });
                              });
                            };

                            for (var i = 0; i < product.length; i++) {
                              _loop5(i);
                            }

                            connection.commit(function (err) {
                              if (err) {
                                connection.rollback(function () {
                                  throw err;
                                });
                              }

                              console.log('Transaction Completed Successfully.');
                              res.send({
                                message: "OK"
                              });
                            });
                          });
                        });
                      });
                    });
                  }
                }
              }

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

  return function (_x21, _x22, _x23) {
    return _ref8.apply(this, arguments);
  };
}());
router.put("/createproduct/:id", _util.isAuth, _util.isAdmin, upload.single('image'), /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res, next) {
    var productId;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            productId = req.params.id;

            _connection["default"].getConnection(function (err, connection) {
              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = 'SELECT * FROM products WHERE _ID=?';
                connection.query(sql, [productId], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  if (Object.keys(result).length === 0) {
                    res.send({
                      message: 'Product not found'
                    });
                    return;
                  }

                  var imagePath = "";

                  if (req.body.image === result[0].image) {
                    imagePath = req.body.image;
                  } else {
                    fs.unlink('frontend/public' + result[0].image, function (err) {
                      if (err) {
                        console.error(err);
                        return;
                      } //file removed

                    });
                    imagePath = req.file.path.slice(15, req.file.path.length);
                  }

                  var typicalImage = false;

                  if (req.body.typicalImage === 'true') {
                    typicalImage = true;
                  }

                  console.log(typicalImage);
                  sql = "UPDATE products SET name=?, category=?, brand=?, subcategory=?, \n        supplier=?, image=?, price=?, percentage=?, availability=?, description=?, \n        typicalImage=? WHERE _id=?";
                  connection.query(sql, [req.body.name, req.body.category, req.body.brand, req.body.subcategory, req.body.supplier, imagePath, req.body.price, req.body.percentage, req.body.availability, req.body.description, typicalImage, productId], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    sql = "INSERT INTO productsHistory (product_id, name, category, brand, subcategory, supplier, image, typicalImage, price, percentage, availability, visibility, description, CreatedBy, CreatedAt, countInStock, UpdatedBy, UpdatedAt) SELECT _id, name, category, brand, subcategory, supplier, image, typicalImage, price, percentage, availability, visibility, description, CreatedBy, CreatedAt, countInStock, ?, ? FROM products WHERE _id=?";
                    connection.query(sql, [req.user.username, new Date(), productId], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      sql = "SELECT ID FROM productsHistory WHERE product_id=? ORDER BY UpdatedAt DESC LIMIT 5";
                      connection.query(sql, [productId], function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var idArray = [];

                        for (var i = 0; i < result.length; i++) {
                          idArray.push(result[i].ID);
                        }

                        sql = "DELETE FROM productsHistory WHERE product_id=? && ID NOT IN (?)";
                        connection.query(sql, [productId, idArray], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          sql = "SELECT * FROM products WHERE _id=?";
                          connection.query(sql, [productId], function (err, result, fields) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            var product = {};

                            if (Object.keys(result).length !== 0) {
                              Object.keys(result).forEach(function (key) {
                                var row = result[key];
                                product = {
                                  name: row.name,
                                  category: row.category,
                                  brand: row.brand,
                                  subcategory: row.subcategory,
                                  supplier: row.supplier,
                                  price: row.price,
                                  percentage: row.percentage,
                                  description: row.description,
                                  countInStock: row.countInStock,
                                  typicalImage: row.typicalImage
                                };
                              });
                            }

                            connection.commit(function (err) {
                              if (err) {
                                connection.rollback(function () {
                                  throw err;
                                });
                              }

                              console.log('Transaction Completed Successfully.');
                              res.status(200).send(product);
                              connection.release();
                            });
                          });
                        });
                      });
                    });
                  });
                });
              }); // Handle error after the release.

              if (err) throw err;
            });

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x24, _x25, _x26) {
    return _ref9.apply(this, arguments);
  };
}());
router.post("/createcategory", _util.isAuth, _util.isAdmin, upload.single('image'), /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res, next) {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "INSERT INTO categories (category, image) VALUES (?, ?)";
              connection.query(sql, [req.body.category, req.file.path.slice(15, req.file.path.length)], function (err, result, fields) {
                if (err) throw err;
                res.status(201).send({
                  message: 'New product Created'
                });
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

  return function (_x27, _x28, _x29) {
    return _ref10.apply(this, arguments);
  };
}());
router.post("/manufacturerslist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res) {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM manufacturers ORDER BY name', function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x30, _x31) {
    return _ref11.apply(this, arguments);
  };
}());
router.post("/insertmanufacturer", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res, next) {
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO manufacturers (name) VALUES (?)";
                connection.query(sql, [req.body.manufacturer], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "SELECT * FROM manufacturers ORDER BY name";
                  connection.query(sql, function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    res.send(result);
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
              /* End transaction */
            });

          case 1:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x32, _x33, _x34) {
    return _ref12.apply(this, arguments);
  };
}());
router.post("/deletemanufacturer", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res, next) {
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "DELETE FROM manufacturers WHERE manufacturer_id=?";
                connection.query(sql, [req.body.manufacturer_id], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "SELECT * FROM manufacturers ORDER BY name";
                  connection.query(sql, function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    res.send(result);
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
              /* End transaction */
            });

          case 1:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x35, _x36, _x37) {
    return _ref13.apply(this, arguments);
  };
}());
router.post("/featuretitlelist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(req, res) {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM feature_titles ORDER BY feature_title', function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x38, _x39) {
    return _ref14.apply(this, arguments);
  };
}());
router.post("/insertfeaturetitle", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(req, res, next) {
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO feature_titles (feature_title) VALUES (?)";
                connection.query(sql, [req.body.featureTitle], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "SELECT * FROM feature_titles ORDER BY feature_title";
                  connection.query(sql, function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    res.send(result);
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
              /* End transaction */
            });

          case 1:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x40, _x41, _x42) {
    return _ref15.apply(this, arguments);
  };
}());
router.post("/featurenames", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(req, res) {
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = 'SELECT DISTINCT feature_name FROM feature_names WHERE feature_title_id=? ORDER BY feature_name';
              connection.query(sql, [req.body.featureTitleId], function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function (_x43, _x44) {
    return _ref16.apply(this, arguments);
  };
}());
router.post("/insertfeaturename", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(req, res, next) {
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO feature_names (feature_title_id, feature_name) VALUES (?, ?)";
                connection.query(sql, [req.body.titleId, req.body.name], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "SELECT * FROM feature_names WHERE feature_title_id=? ORDER BY feature_name ";
                  connection.query(sql, [req.body.titleId], function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    res.send(result);
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
              /* End transaction */
            });

          case 1:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function (_x45, _x46, _x47) {
    return _ref17.apply(this, arguments);
  };
}());
router.post("/sendinglist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(req, res) {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM sendingMethods', function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function (_x48, _x49) {
    return _ref18.apply(this, arguments);
  };
}());
router.post("/editsendingmethod", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(req, res) {
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('UPDATE sendingMethods SET sendingMethod=?, sendingMethodCost=? WHERE sendingMethod_id=?', [req.body.method, req.body.cost, req.body.methodId], function (err, result, fields) {
                if (err) throw err;
                var sql = "SELECT * FROM sendingMethods";
                connection.query(sql, function (err, result, fields) {
                  if (err) throw err;
                  res.send(result);
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function (_x50, _x51) {
    return _ref19.apply(this, arguments);
  };
}());
router.post("/createsendingmethod", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(req, res) {
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "INSERT INTO sendingMethods (sendingMethod, sendingMethodCost) VALUES (?, ?)";
              connection.query(sql, [req.body.method, req.body.cost], function (err, result, fields) {
                if (err) throw err;
                sql = "SELECT * FROM sendingMethods";
                connection.query(sql, function (err, result, fields) {
                  if (err) throw err;
                  res.send(result);
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));

  return function (_x52, _x53) {
    return _ref20.apply(this, arguments);
  };
}());
router.post("/removesendingmethod", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(req, res) {
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "DELETE FROM sendingMethods WHERE sendingMethod_id=?";
              connection.query(sql, [req.body.methodId], function (err, result, fields) {
                if (err) throw err;
                sql = "SELECT * FROM sendingMethods";
                connection.query(sql, function (err, result, fields) {
                  if (err) throw err;
                  res.send(result);
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function (_x54, _x55) {
    return _ref21.apply(this, arguments);
  };
}());
router.post("/paymentlist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(req, res) {
    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT * FROM paymentMethods WHERE sendingMethod_id=? ";
              connection.query(sql, [req.body.methodId], function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function (_x56, _x57) {
    return _ref22.apply(this, arguments);
  };
}());
router.post("/editpaymentlist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(req, res) {
    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('UPDATE paymentMethods SET paymentMethod=?, paymentMethodCost=? WHERE paymentMethod_id=?', [req.body.paymentMethod, req.body.paymentMethodCost, req.body.paymentMethodId], function (err, result, fields) {
                if (err) throw err;
                var sql = "SELECT * FROM paymentMethods WHERE sendingMethod_id=? ";
                connection.query(sql, [req.body.sendingMethodId], function (err, result, fields) {
                  if (err) throw err;
                  res.send(result);
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));

  return function (_x58, _x59) {
    return _ref23.apply(this, arguments);
  };
}());
router.post("/createpaymentlist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(req, res) {
    return regeneratorRuntime.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "INSERT INTO paymentMethods (paymentMethod, paymentMethodCost,sendingMethod_id) VALUES (?, ?, ?)";
              connection.query(sql, [req.body.paymentMethod, req.body.paymentMethodCost, req.body.sendingMethodId], function (err, result, fields) {
                if (err) throw err;
                sql = "SELECT * FROM paymentMethods WHERE sendingMethod_id=? ";
                connection.query(sql, [req.body.sendingMethodId], function (err, result, fields) {
                  if (err) throw err;
                  res.send(result);
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24);
  }));

  return function (_x60, _x61) {
    return _ref24.apply(this, arguments);
  };
}());
router.post("/removepaymentlist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(req, res) {
    return regeneratorRuntime.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "DELETE FROM paymentMethods WHERE paymentMethod_id=?";
              connection.query(sql, [req.body.paymentMethodId], function (err, result, fields) {
                if (err) throw err;
                sql = "SELECT * FROM paymentMethods WHERE sendingMethod_id=? ";
                connection.query(sql, [req.body.sendingMethodId], function (err, result, fields) {
                  if (err) throw err;
                  res.send(result);
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25);
  }));

  return function (_x62, _x63) {
    return _ref25.apply(this, arguments);
  };
}());
router.post("/featurelist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(req, res) {
    return regeneratorRuntime.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM features WHERE product_id=? ORDER BY feature_title,feature', [req.body.productId], function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26);
  }));

  return function (_x64, _x65) {
    return _ref26.apply(this, arguments);
  };
}());
router.post("/insertfeature", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(req, res, next) {
    return regeneratorRuntime.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO features (product_id, feature_title, feature) VALUES (?, ?, ?)";
                connection.query(sql, [req.body.productId, req.body.title, req.body.name], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var sql = "INSERT INTO featuresHistory (product_id, feature_title, feature, UpdatedBy, UpdatedAt, actions) VALUES (?,?,?,?,?,?)";
                  connection.query(sql, [req.body.productId, req.body.title, req.body.name, req.user.username, new Date(), "Προσθήκη"], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    sql = "SELECT * FROM features WHERE product_id=? ORDER BY feature_title,feature";
                    connection.query(sql, [req.body.productId], function (err, result) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      res.send(result);
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
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
              /* End transaction */
            });

          case 1:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27);
  }));

  return function (_x66, _x67, _x68) {
    return _ref27.apply(this, arguments);
  };
}());
router.post("/deletefeature", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(req, res, next) {
    return regeneratorRuntime.wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO featuresHistory (product_id, feature_title, feature, UpdatedBy, UpdatedAt, actions) SELECT  features.product_id, features.feature_title, features.feature, ?, ? , ? FROM features WHERE features_id=?";
                connection.query(sql, [req.user.username, new Date(), "Διαγραφή", req.body.featureId], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var sql = "DELETE FROM features WHERE features_id=?";
                  connection.query(sql, [req.body.featureId], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    sql = "SELECT * FROM features WHERE product_id=?";
                    connection.query(sql, [req.body.productId], function (err, result) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      res.send(result);
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
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
              /* End transaction */
            });

          case 1:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28);
  }));

  return function (_x69, _x70, _x71) {
    return _ref28.apply(this, arguments);
  };
}());
router.post("/categories", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(req, res) {
    return regeneratorRuntime.wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM categories ORDER BY category', function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29);
  }));

  return function (_x72, _x73) {
    return _ref29.apply(this, arguments);
  };
}());
router.post("/subcategories", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(req, res) {
    return regeneratorRuntime.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM categories WHERE parent_id=? ORDER BY category', [req.body.parentId], function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30);
  }));

  return function (_x74, _x75) {
    return _ref30.apply(this, arguments);
  };
}());
router.post("/suppliers", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(req, res) {
    return regeneratorRuntime.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM suppliers ORDER BY supplier', function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31);
  }));

  return function (_x76, _x77) {
    return _ref31.apply(this, arguments);
  };
}());
router.post("/insertsupplier", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(req, res, next) {
    return regeneratorRuntime.wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO suppliers (supplier) VALUES (?)";
                connection.query(sql, [req.body.supplier], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "SELECT * FROM suppliers ORDER BY supplier";
                  connection.query(sql, function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    res.send(result);
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
              /* End transaction */
            });

          case 1:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32);
  }));

  return function (_x78, _x79, _x80) {
    return _ref32.apply(this, arguments);
  };
}());
router.post("/deletesupplier", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref33 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(req, res, next) {
    return regeneratorRuntime.wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "DELETE FROM suppliers WHERE supplier_id=?";
                connection.query(sql, [req.body.supplier_id], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "SELECT * FROM suppliers ORDER BY supplier";
                  connection.query(sql, function (err, result) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    res.send(result);
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
              /* End transaction */
            });

          case 1:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33);
  }));

  return function (_x81, _x82, _x83) {
    return _ref33.apply(this, arguments);
  };
}());
router.post("/compatibilitycompanylist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref34 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34(req, res) {
    return regeneratorRuntime.wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM compatibility_company ORDER BY company', function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context34.stop();
        }
      }
    }, _callee34);
  }));

  return function (_x84, _x85) {
    return _ref34.apply(this, arguments);
  };
}());
router.post("/compatibilitymodelslist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref35 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(req, res) {
    return regeneratorRuntime.wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM compatibility_model WHERE compatibility_company_id=? ORDER BY model', [req.body.companyId], function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35);
  }));

  return function (_x86, _x87) {
    return _ref35.apply(this, arguments);
  };
}());
router.post("/insertcompatibilitycompany", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref36 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36(req, res, next) {
    return regeneratorRuntime.wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "INSERT INTO compatibility_company (company) VALUES (?)";
              connection.query(sql, [req.body.company], function (err, result, fields) {
                if (err) throw err;
                var compatibility_company_id = result.insertId;
                sql = "SELECT * FROM compatibility_company WHERE compatibility_company_id=?";
                connection.query(sql, [compatibility_company_id], function (err, result, fields) {
                  if (err) throw err;
                  res.status(201).send(result);
                });
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context36.stop();
        }
      }
    }, _callee36);
  }));

  return function (_x88, _x89, _x90) {
    return _ref36.apply(this, arguments);
  };
}());
router.post("/deletecompatibilitycompany", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref37 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37(req, res, next) {
    return regeneratorRuntime.wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "DELETE FROM compatibility_model WHERE compatibility_company_id=?";
                connection.query(sql, [req.body.companyID], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "DELETE FROM compatibility_company WHERE compatibility_company_id=?";
                  connection.query(sql, [req.body.companyID], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var sql = "SELECT phone_brand_id FROM phone_brands WHERE brand=? ";
                    connection.query(sql, [req.body.company], function (err, result) {
                      var _result$;

                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var phoneID = (_result$ = result[0]) === null || _result$ === void 0 ? void 0 : _result$.phone_brand_id;

                      if (phoneID > 0) {
                        sql = "DELETE FROM phone_models WHERE phone_brand_id=?";
                        connection.query(sql, [phoneID], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          sql = "DELETE FROM phone_brands WHERE phone_brand_id=?";
                          connection.query(sql, [phoneID], function (err, result, fields) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            sql = "SELECT * FROM compatibility_company ORDER BY company ";
                            connection.query(sql, [req.body.companyID], function (err, result) {
                              if (err) {
                                connection.rollback(function () {
                                  throw err;
                                });
                              }

                              console.log("Read phone brands succeed");
                              connection.commit(function (err) {
                                if (err) {
                                  connection.rollback(function () {
                                    throw err;
                                  });
                                }
                              });
                              res.send(result);
                              console.log('Transaction Completed Successfully.');
                              connection.release();
                            });
                          });
                        });
                      } else {
                        sql = "SELECT * FROM compatibility_company ORDER BY company ";
                        connection.query(sql, [req.body.companyID], function (err, result) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          console.log("Read phone brands succeed");
                          connection.commit(function (err) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            res.send(result);
                            console.log('Transaction Completed Successfully.');
                            connection.release();
                          });
                        });
                      }
                    });
                  });
                });
              });
              /* End transaction */
            });

          case 1:
          case "end":
            return _context37.stop();
        }
      }
    }, _callee37);
  }));

  return function (_x91, _x92, _x93) {
    return _ref37.apply(this, arguments);
  };
}());
router.post("/insertcompatibilitymodel", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref38 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38(req, res, next) {
    return regeneratorRuntime.wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "INSERT INTO compatibility_model (compatibility_company_id,model) VALUES (?,?)";
              connection.query(sql, [req.body.companyId, req.body.model], function (err, result, fields) {
                if (err) throw err;
                var compatibility_model_id = result.insertId;
                sql = "SELECT * FROM compatibility_model WHERE compatibility_model_id=?";
                connection.query(sql, [compatibility_model_id], function (err, result, fields) {
                  if (err) throw err;
                  res.status(201).send(result);
                });
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context38.stop();
        }
      }
    }, _callee38);
  }));

  return function (_x94, _x95, _x96) {
    return _ref38.apply(this, arguments);
  };
}());
router.post("/deletecompatibilitymodel/", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref39 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39(req, res, next) {
    return regeneratorRuntime.wrap(function _callee39$(_context39) {
      while (1) {
        switch (_context39.prev = _context39.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "DELETE FROM compatibility_model WHERE compatibility_model_id=?";
                connection.query(sql, [req.body.modelID], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "SELECT phone_brand_id FROM phone_brands WHERE brand=?";
                  connection.query(sql, [req.body.company], function (err, result) {
                    var _result$2;

                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var brandID = (_result$2 = result[0]) === null || _result$2 === void 0 ? void 0 : _result$2.phone_brand_id;

                    if (brandID > 0) {
                      sql = "DELETE FROM phone_models WHERE phone_brand_id=? AND model=? ";
                      connection.query(sql, [brandID, req.body.model], function (err, result) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        sql = "SELECT * FROM compatibility_model WHERE compatibility_company_id=? ORDER BY model ";
                        connection.query(sql, [req.body.compatibilityCompanyId], function (err, result) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          console.log("Read phone brands succeed");
                          connection.commit(function (err) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            res.send(result);
                            console.log('Transaction Completed Successfully.');
                            connection.release();
                          });
                        });
                      });
                    } else {
                      sql = "SELECT * FROM compatibility_model WHERE compatibility_company_id=? ORDER BY model ";
                      connection.query(sql, [req.body.compatibilityCompanyId], function (err, result) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        console.log("Read phone brands succeed");
                        connection.commit(function (err) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          res.send(result);
                          console.log('Transaction Completed Successfully.');
                          connection.release();
                        });
                      });
                    }
                  });
                });
              });
              /* End transaction */
            });

          case 1:
          case "end":
            return _context39.stop();
        }
      }
    }, _callee39);
  }));

  return function (_x97, _x98, _x99) {
    return _ref39.apply(this, arguments);
  };
}());
router.post("/insertcompatibility", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref40 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee40(req, res, next) {
    return regeneratorRuntime.wrap(function _callee40$(_context40) {
      while (1) {
        switch (_context40.prev = _context40.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "SELECT COUNT(*) as count FROM compatibilities\n                WHERE product_id=? \n                AND compatibility_company=?\n                AND compatibility_model=?";
                connection.query(sql, [req.body.productId, req.body.company, req.body.model], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var count = result[0];

                  if (count.count === 0) {
                    var sql = "INSERT INTO compatibilities (product_id,compatibility_company,compatibility_model) VALUES (?,?,?)";
                    connection.query(sql, [req.body.productId, req.body.company, req.body.model], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var compat_id = result.insertId;
                      var sql = "INSERT INTO compatibilitiesHistory (product_id, compatibility_company, compatibility_model, UpdatedBy, UpdatedAt, actions) VALUES (?,?,?,?,?,?)";
                      connection.query(sql, [req.body.productId, req.body.company, req.body.model, req.user.username, new Date(), "Προσθήκη"], function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        sql = "SELECT * FROM compatibilities WHERE product_id=? ORDER BY compatibility_company ASC, compatibility_model ASC";
                        connection.query(sql, [req.body.productId], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          var compatibilities = result;
                          connection.commit(function (err) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            res.status(201).send(compatibilities);
                            console.log('Transaction Completed Successfully.');
                          });
                        });
                      });
                    });
                  } else {
                    var _sql = "SELECT * FROM compatibilities WHERE product_id=? ORDER BY compatibility_company ASC, compatibility_model ASC";
                    connection.query(_sql, [req.body.productId], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      res.status(200).send(result);
                    });
                  }
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context40.stop();
        }
      }
    }, _callee40);
  }));

  return function (_x100, _x101, _x102) {
    return _ref40.apply(this, arguments);
  };
}());
router.post("/insertallphonescompatibility", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref41 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee41(req, res, next) {
    return regeneratorRuntime.wrap(function _callee41$(_context41) {
      while (1) {
        switch (_context41.prev = _context41.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO compatibilities (product_id,compatibility_company,compatibility_model)\n                SELECT ".concat(req.body.productId, ",phone_brands.brand,phone_models.model \n                FROM phone_brands\n                INNER JOIN phone_models\n                ON phone_brands.phone_brand_id=phone_models.phone_brand_id\n                WHERE (SELECT COUNT(*) FROM compatibilities\n                WHERE product_id=").concat(req.body.productId, "\n                AND compatibility_company=phone_brands.brand\n                AND compatibility_model=phone_models.model )=0");
                connection.query(sql, function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var sql = "INSERT INTO compatibilitiesHistory (product_id, compatibility_company, compatibility_model, UpdatedBy, UpdatedAt, actions)\n                  SELECT ".concat(req.body.productId, ",phone_brands.brand,phone_models.model, ?, ?, \"\u039C\u03B1\u03B6\u03B9\u03BA\u03AE \u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7\" FROM phone_brands\n                  INNER JOIN phone_models\n                  ON phone_brands.phone_brand_id=phone_models.phone_brand_id\n                  WHERE (SELECT COUNT(*) FROM compatibilitiesHistory\n                  WHERE product_id=").concat(req.body.productId, "\n                  AND compatibility_company=phone_brands.brand\n                  AND compatibility_model=phone_models.model )=0");
                  connection.query(sql, [req.user.username, new Date()], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var sql = "SELECT * FROM compatibilities WHERE product_id=? ORDER BY compatibility_company ASC,compatibility_model ASC";
                    connection.query(sql, [req.body.productId], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var compatibilities = result;
                      connection.commit(function (err) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        res.status(201).send(compatibilities);
                        console.log('Transaction Completed Successfully.');
                      });
                    });
                  });
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context41.stop();
        }
      }
    }, _callee41);
  }));

  return function (_x103, _x104, _x105) {
    return _ref41.apply(this, arguments);
  };
}());
router.post("/deleteallcompatibilities", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref42 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee42(req, res, next) {
    return regeneratorRuntime.wrap(function _callee42$(_context42) {
      while (1) {
        switch (_context42.prev = _context42.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "DELETE FROM compatibilities WHERE product_id=?";
              connection.query(sql, [req.body.product_id], function (err, result, fields) {
                if (err) throw err;
                sql = "SELECT * FROM compatibilities WHERE product_id=? ORDER BY compatibility_company ASC,compatibility_model ASC";
                connection.query(sql, [req.body.product_id], function (err, result, fields) {
                  if (err) throw err;
                  res.status(201).send(result);
                });
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context42.stop();
        }
      }
    }, _callee42);
  }));

  return function (_x106, _x107, _x108) {
    return _ref42.apply(this, arguments);
  };
}());
router.post("/getproductcompatibilities", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref43 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee43(req, res, next) {
    return regeneratorRuntime.wrap(function _callee43$(_context43) {
      while (1) {
        switch (_context43.prev = _context43.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT * FROM compatibilities WHERE product_id=? ORDER BY compatibility_company ASC,compatibility_model ASC";
              connection.query(sql, [req.body.productId], function (err, result, fields) {
                if (err) throw err;
                res.status(200).send(result);
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context43.stop();
        }
      }
    }, _callee43);
  }));

  return function (_x109, _x110, _x111) {
    return _ref43.apply(this, arguments);
  };
}());
router.post("/deletecompatibility", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref44 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee44(req, res, next) {
    return regeneratorRuntime.wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "INSERT INTO compatibilitiesHistory (product_id, compatibility_company, compatibility_model, UpdatedBy, UpdatedAt, actions) SELECT  compatibilities.product_id, compatibilities.compatibility_company, compatibilities.compatibility_model, ?, ? , ? FROM compatibilities WHERE compatibility_id=?";
                connection.query(sql, [req.user.username, new Date(), "Διαγραφή", req.body.compatId], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var sql = "DELETE FROM compatibilities WHERE compatibility_id=?";
                  connection.query(sql, [req.body.compatId], function (err, result, fields) {
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

                      res.status(200).send({
                        message: "OK"
                      });
                      console.log('Transaction Completed Successfully.');
                    });
                  });
                });
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

          case 1:
          case "end":
            return _context44.stop();
        }
      }
    }, _callee44);
  }));

  return function (_x112, _x113, _x114) {
    return _ref44.apply(this, arguments);
  };
}());
router.post("/getAdmins", _util.isAuth, _util.isAdmin, _util.isSuperAdmin, /*#__PURE__*/function () {
  var _ref45 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee45(req, res) {
    return regeneratorRuntime.wrap(function _callee45$(_context45) {
      while (1) {
        switch (_context45.prev = _context45.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = 'SELECT username, email, isAdmin FROM users WHERE isAdmin=1 ORDER BY username';
              connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context45.stop();
        }
      }
    }, _callee45);
  }));

  return function (_x115, _x116) {
    return _ref45.apply(this, arguments);
  };
}());
router.post("/insertAdmin", _util.isAuth, _util.isAdmin, _util.isSuperAdmin, /*#__PURE__*/function () {
  var _ref46 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee46(req, res) {
    return regeneratorRuntime.wrap(function _callee46$(_context46) {
      while (1) {
        switch (_context46.prev = _context46.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                _bcrypt["default"].hash(req.body.password, 10, function (err, hash) {
                  // Store hash in your password DB.
                  var sql = "INSERT INTO users (username,email,password,isAdmin) VALUES (?,?,?,?)";
                  connection.query(sql, [req.body.username, req.body.email, hash, "1"], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    sql = 'SELECT username, email, isAdmin FROM users WHERE isAdmin=1 ORDER BY username';
                    connection.query(sql, function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var admins = result;
                      connection.commit(function (err) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        res.send(admins);
                      });
                    });
                  });
                });

                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context46.stop();
        }
      }
    }, _callee46);
  }));

  return function (_x117, _x118) {
    return _ref46.apply(this, arguments);
  };
}());
router.post("/deleteAdmin", _util.isAuth, _util.isAdmin, _util.isSuperAdmin, /*#__PURE__*/function () {
  var _ref47 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee47(req, res) {
    return regeneratorRuntime.wrap(function _callee47$(_context47) {
      while (1) {
        switch (_context47.prev = _context47.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "DELETE FROM users WHERE email=?";
                connection.query(sql, [req.body.email], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = 'SELECT username, email, isAdmin FROM users WHERE isAdmin=1 ORDER BY username';
                  connection.query(sql, function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var admins = result;
                    connection.commit(function (err) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      res.send(admins);
                    });
                  });
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 1:
          case "end":
            return _context47.stop();
        }
      }
    }, _callee47);
  }));

  return function (_x119, _x120) {
    return _ref47.apply(this, arguments);
  };
}());
router.post("/getProductHistory", _util.isAuth, _util.isAdmin, _util.isSuperAdmin, /*#__PURE__*/function () {
  var _ref48 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee48(req, res) {
    var productId;
    return regeneratorRuntime.wrap(function _callee48$(_context48) {
      while (1) {
        switch (_context48.prev = _context48.next) {
          case 0:
            productId = req.body.productId;

            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "SELECT * FROM productsHistory WHERE product_id=? ORDER BY UpdatedAt DESC";
                connection.query(sql, [productId], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var productHistory = result;
                  sql = "SELECT * FROM compatibilitiesHistory WHERE product_id=? ORDER BY UpdatedAt DESC";
                  connection.query(sql, [productId], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var compHistory = result;
                    sql = "SELECT * FROM featuresHistory WHERE product_id=? ORDER BY UpdatedAt DESC";
                    connection.query(sql, [productId], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var featHistory = result;
                      connection.commit(function (err) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var resp = {
                          productHistory: productHistory,
                          compHistory: compHistory,
                          featHistory: featHistory
                        };
                        res.send(resp);
                      });
                    });
                  });
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 2:
          case "end":
            return _context48.stop();
        }
      }
    }, _callee48);
  }));

  return function (_x121, _x122) {
    return _ref48.apply(this, arguments);
  };
}());
router.post("/getOrderHistory", _util.isAuth, _util.isAdmin, _util.isSuperAdmin, /*#__PURE__*/function () {
  var _ref49 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee49(req, res) {
    var orderId;
    return regeneratorRuntime.wrap(function _callee49$(_context49) {
      while (1) {
        switch (_context49.prev = _context49.next) {
          case 0:
            orderId = req.body.orderId;

            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "SELECT * FROM orderStatusHistory WHERE order_id=? ORDER BY UpdatedAt DESC";
                connection.query(sql, [orderId], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var orderStatusHistory = result;
                  sql = "SELECT * FROM orderSendingPaymentHistory WHERE order_id=? ORDER BY UpdatedAt DESC";
                  connection.query(sql, [orderId], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var orderSendingPaymentHistory = result;
                    sql = "SELECT * FROM billingAddressHistory WHERE order_id=? ORDER BY UpdatedAt DESC";
                    connection.query(sql, [orderId], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var billingAddressHistory = result;
                      sql = "SELECT * FROM shippingAddressHistory WHERE order_id=? ORDER BY UpdatedAt DESC";
                      connection.query(sql, [orderId], function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var shippingAddressHistory = result;
                        sql = "SELECT orderProductHistory.product_id, orderProductHistory.model, orderProductHistory.quantity, orderProductHistory.image_case, orderProductHistory.UpdatedBy, orderProductHistory.UpdatedAt, orderProductHistory.actions, products.name, products.category, products.brand, products.image FROM orderProductHistory INNER JOIN products ON orderProductHistory.product_id=products._id  WHERE orderProductHistory.order_id=? ORDER BY orderProductHistory.product_id , UpdatedAt DESC";
                        connection.query(sql, [orderId], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          var orderProductHistory = result;
                          connection.commit(function (err) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            var resp = {
                              orderStatusHistory: orderStatusHistory,
                              orderSendingPaymentHistory: orderSendingPaymentHistory,
                              billingAddressHistory: billingAddressHistory,
                              shippingAddressHistory: shippingAddressHistory,
                              orderProductHistory: orderProductHistory
                            };
                            res.send(resp);
                          });
                        });
                      });
                    });
                  });
                });
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

          case 2:
          case "end":
            return _context49.stop();
        }
      }
    }, _callee49);
  }));

  return function (_x123, _x124) {
    return _ref49.apply(this, arguments);
  };
}());
router.post("/newsletterlist", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref50 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee50(req, res) {
    return regeneratorRuntime.wrap(function _callee50$(_context50) {
      while (1) {
        switch (_context50.prev = _context50.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = 'SELECT * FROM newsletters ORDER BY email LIMIT ? OFFSET ?';
                connection.query(sql, [req.body.itemsPerPage, req.body.offset], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var newsletterList = result;
                  connection.query('SELECT COUNT(*) AS count FROM newsletters', function (err, result, fields) {
                    if (err) throw err;
                    var count = result;
                    connection.commit(function (err) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      res.send({
                        newsletterList: newsletterList,
                        count: count
                      });
                    });
                    connection.release(); // Handle error after the release.

                    if (err) throw err;
                  });
                });
              });
            });

          case 1:
          case "end":
            return _context50.stop();
        }
      }
    }, _callee50);
  }));

  return function (_x125, _x126) {
    return _ref50.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=adminRoute.js.map