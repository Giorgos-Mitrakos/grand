"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _connection = _interopRequireDefault(require("../connection"));

var _util = require("../util");

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

              connection.query('SELECT * FROM products WHERE visibility=1', function (err, result, fields) {
                if (err) throw err;
                console.log(result);
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
router.get("/collectionlist", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT _id, name, category, brand, image, description,\n        countInStock, numReview, subcategory, weight, supplier, availability, \n        visibility, totalPrice FROM products WHERE category=? && visibility=1";
              connection.query(sql, ["Συλλογή"], function (err, result, fields) {
                if (err) throw err;
                res.status(200).send(result);
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

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.get("/collectionrandomlist", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var sql = "SELECT _id, name, category, brand, image, description,\n        countInStock, numReview, subcategory, weight, supplier, availability, \n        visibility, totalPrice FROM products WHERE category=? && visibility=1\n        ORDER BY RAND() LIMIT 10";
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

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.get("/collectionDetails/:id", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var collectionId;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            collectionId = req.params.id;

            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = 'UPDATE products set numReview= numReview+1 WHERE _id=?';
                connection.query(sql, collectionId, function (err, result) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var sql = 'SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice FROM products WHERE _id=?';
                  connection.query(sql, collectionId, function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    res.status(200).send(result[0]);
                    connection.commit(function (err) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      console.log('Transaction Completed Successfully.');
                      connection.release(); // Handle error after the release.

                      if (err) throw err;
                    });
                  });
                });
              });
              /* End transaction */
            });

          case 2:
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
router.post("/products_by_category", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var brandsStr, filt, i, brand, features, _filt, _i, feature, compCompanyStr, compCompFilter, compModelFilter, _i2, company, _i3, _company, j, model, _j, _model, page, iPerPage, offset, sortedBy;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            brandsStr = "";

            if (req.body.brandFilters.length != 0) {
              filt = req.body.brandFilters;

              for (i = 0; i < filt.length; i++) {
                brand = filt[i];

                if (i === 0) {
                  brandsStr += "&& (products.brand= '".concat(brand, "'");
                } else {
                  brandsStr += " OR products.brand= '".concat(brand, "'");
                }
              }

              brandsStr += ")";
            }

            features = "";

            if (req.body.filter.length != 0) {
              features += "EXISTS\n        ( SELECT product_id \n            FROM features \n            WHERE products._id=features.product_id";
              _filt = req.body.filter;

              for (_i = 0; _i < _filt.length; _i++) {
                feature = _filt[_i].split('_');

                if (_i === 0) {
                  features += " AND ((feature_title= '".concat(feature[0], "' \n                AND feature= '").concat(feature[1], "')");
                } else {
                  features += " OR (feature_title= '".concat(feature[0], "' \n                AND feature= '").concat(feature[1], "')");
                }
              }

              features += ")) AND";
            }

            compCompanyStr = "";

            if (req.body.compCompanyFilter.length > 0) {
              compCompFilter = req.body.compCompanyFilter;
              compModelFilter = req.body.compModelFilter;
              compCompanyStr += "EXISTS\n        ( SELECT product_id \n            FROM compatibilities \n            WHERE products._id=compatibilities.product_id";

              if (req.body.compModelFilter.length === 0) {
                for (_i2 = 0; _i2 < compCompFilter.length; _i2++) {
                  company = compCompFilter[_i2];

                  if (_i2 === 0) {
                    compCompanyStr += " AND ((compatibility_company= '".concat(company, "')");
                  } else {
                    compCompanyStr += " OR (compatibility_company= '".concat(company, "')");
                  }
                }

                compCompanyStr += ")) AND";
              } else {
                for (_i3 = 0; _i3 < compCompFilter.length; _i3++) {
                  _company = compCompFilter[_i3];

                  if (_i3 === 0) {
                    for (j = 0; j < compModelFilter.length; j++) {
                      model = compModelFilter[j];

                      if (j === 0) {
                        compCompanyStr += " AND ((";
                      } else {
                        compCompanyStr += " OR (";
                      }

                      compCompanyStr += "compatibility_company= '".concat(_company, "'\n                        AND compatibility_model='").concat(model, "')");
                    }
                  } else {
                    for (_j = 0; _j < compModelFilter.length; _j++) {
                      _model = compModelFilter[_j];
                      compCompanyStr += " OR (";
                      compCompanyStr += "compatibility_company= '".concat(_company, "'\n                        AND compatibility_model='").concat(_model, "')");
                    }
                  }
                }

                compCompanyStr += ")) AND";
              }

              console.log(compCompanyStr);
            }

            page = parseInt(req.body.page) || 0;
            iPerPage = parseInt(req.body.itemsPerPage) || 12;
            offset = page * iPerPage;
            sortedBy = "";
            _context5.t0 = req.body.sortType;
            _context5.next = _context5.t0 === "alphabetic" ? 13 : _context5.t0 === "alphabeticDESC" ? 15 : _context5.t0 === "price" ? 17 : _context5.t0 === "priceDESC" ? 19 : 21;
            break;

          case 13:
            sortedBy = "ORDER BY name";
            return _context5.abrupt("break", 23);

          case 15:
            sortedBy = "ORDER BY name DESC";
            return _context5.abrupt("break", 23);

          case 17:
            sortedBy = "ORDER BY totalPrice";
            return _context5.abrupt("break", 23);

          case 19:
            sortedBy = "ORDER BY totalPrice DESC";
            return _context5.abrupt("break", 23);

          case 21:
            sortedBy = "ORDER BY name";
            return _context5.abrupt("break", 23);

          case 23:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "SELECT Count(*) as count\n            FROM products\n            WHERE \n            ".concat(features, " \n            ").concat(compCompanyStr, "\n            products.category=? \n            && products.subcategory=? \n            && products.visibility=1\n            ").concat(brandsStr, "\n            ");
                connection.query(sql, [req.body.category, req.body.subcategory], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var count = result[0].count;
                  connection.query("SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice \n                FROM products\n                WHERE \n                ".concat(features, "\n                ").concat(compCompanyStr, "\n                products.category=? \n                && products.subcategory=? \n                && products.visibility=1\n                ").concat(brandsStr, "\n                ").concat(sortedBy, "\n                LIMIT ?\n                OFFSET ?"), [req.body.category, req.body.subcategory, iPerPage, offset], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var products = result;
                    connection.query("SELECT DISTINCT brand\n                            FROM products\n                            WHERE products.category=? \n                            && products.subcategory=? \n                            && products.visibility=1", [req.body.category, req.body.subcategory], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var dictinctBrands = result;
                      connection.query("SELECT DISTINCT brand\n                                        FROM products                                        \n                                        WHERE \n                                        ".concat(features, "\n                                        ").concat(compCompanyStr, "\n                                        products.category=? \n                                        && products.subcategory=? \n                                        && products.visibility=1"), [req.body.category, req.body.subcategory], function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var excludedBrands = result;
                        connection.commit(function (err) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          res.status(200).send({
                            products: products,
                            count: count,
                            dictinctBrands: dictinctBrands,
                            excludedBrands: excludedBrands
                          });
                          console.log('Transaction Completed Successfully.');
                        });
                      });
                    });
                  });
                  connection.release(); // Handle error after the release.

                  if (err) throw err;
                });
              });
            });

          case 24:
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
router.get("/featurelist", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT * FROM features', function (err, result, fields) {
                if (err) throw err;
                console.log("Read product features succeed");
                res.send(result);
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

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
router.post("/feature_title_by_category", /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT DISTINCT features.feature_title FROM products LEFT JOIN features ON products._id=features.product_id WHERE products.category=? && products.subcategory=? && products.visibility=1 && features.feature_title IS NOT NULL', [req.body.category, req.body.subcategory], function (err, result, fields) {
                if (err) throw err;
                console.log("Read products succeed");
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
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
router.post("/feature_name_by_category", /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT DISTINCT features.feature_title,features.feature FROM products LEFT JOIN features ON products._id=features.product_id WHERE products.category=? && products.subcategory=? && products.visibility=1 && features.feature_title IS NOT NULL', [req.body.category, req.body.subcategory], function (err, result, fields) {
                if (err) throw err;
                console.log("Read products succeed");
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
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
router.post("/compatibilities_by_category", /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query("SELECT compatibility_id,product_id,compatibility_company,compatibility_model \n        FROM compatibilities LEFT JOIN products \n        ON products._id=compatibilities.product_id \n        WHERE products.category=? && products.subcategory=? && products.visibility=1 && compatibilities.compatibility_company IS NOT NULL \n        ORDER BY compatibilities.compatibility_company,compatibilities.compatibility_model ", [req.body.category, req.body.subcategory], function (err, result, fields) {
                if (err) throw err;
                console.log("Read compatibility companies succeed");
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
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
router.post("/products_by_category_admin", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res) {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              if (req.body.supplier === '' || req.body.supplier === 'Επέλεξε Προμηθευτή' || req.body.supplier === null || req.body.supplier === undefined) {
                if (req.body.subcategory === '' || req.body.subcategory === 'Επέλεξε Υποκατηγορία' || req.body.subcategory === null || req.body.subcategory === undefined) {
                  connection.query('SELECT * FROM products WHERE category=? LIMIT 20 OFFSET ? ', [req.body.category, req.body.offset], function (err, result, fields) {
                    if (err) throw err;
                    var resp = result;
                    connection.query('SELECT COUNT(*) AS count FROM products WHERE category=?', [req.body.category], function (err, result, fields) {
                      if (err) throw err;
                      var count = result;
                      res.send({
                        resp: resp,
                        count: count
                      });
                    });
                  });
                } else {
                  connection.query('SELECT * FROM products WHERE category=? && subcategory=? LIMIT 20 OFFSET ?', [req.body.category, req.body.subcategory, req.body.offset], function (err, result, fields) {
                    if (err) throw err;
                    var resp = result;
                    connection.query('SELECT COUNT(*) AS count FROM products WHERE category=? && subcategory=?', [req.body.category, req.body.subcategory], function (err, result, fields) {
                      if (err) throw err;
                      var count = result;
                      res.send({
                        resp: resp,
                        count: count
                      });
                    });
                  });
                }
              } else {
                if (req.body.category === '' || req.body.category === 'Επέλεξε Κατηγορία' || req.body.category === null || req.body.category === undefined) {
                  connection.query('SELECT * FROM products WHERE  supplier=? LIMIT 20 OFFSET ?', [req.body.supplier, req.body.offset], function (err, result, fields) {
                    if (err) throw err;
                    var resp = result;
                    connection.query('SELECT COUNT(*) AS count FROM products WHERE supplier=?', [req.body.supplier], function (err, result, fields) {
                      if (err) throw err;
                      var count = result;
                      res.send({
                        resp: resp,
                        count: count
                      });
                    });
                  });
                } else {
                  if (req.body.subcategory === '' || req.body.subcategory === 'Επέλεξε Υποκατηγορία' || req.body.subcategory === null || req.body.subcategory === undefined) {
                    connection.query('SELECT * FROM products WHERE category=? && supplier=? LIMIT 20 OFFSET ?', [req.body.category, req.body.supplier, req.body.offset], function (err, result, fields) {
                      if (err) throw err;
                      var resp = result;
                      connection.query('SELECT COUNT(*) AS count FROM products WHERE category=? && supplier=?', [req.body.category, req.body.supplier], function (err, result, fields) {
                        if (err) throw err;
                        var count = result;
                        res.send({
                          resp: resp,
                          count: count
                        });
                      });
                    });
                  } else {
                    connection.query('SELECT * FROM products WHERE category=? && subcategory=? && supplier=? LIMIT 20 OFFSET ?', [req.body.category, req.body.subcategory, req.body.supplier, req.body.offset], function (err, result, fields) {
                      if (err) throw err;
                      var resp = result;
                      connection.query('SELECT COUNT(*) AS count FROM products WHERE category=? && subcategory=? && supplier=?', [req.body.category, req.body.subcategory, req.body.supplier], function (err, result, fields) {
                        if (err) throw err;
                        var count = result;
                        res.send({
                          resp: resp,
                          count: count
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
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}());
router.post("/product_by_name_admin", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res) {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              var nameSearch = "%".concat(req.body.productName.trim(), "%");
              connection.query('SELECT * FROM products WHERE name LIKE ? LIMIT 20 OFFSET ? ', [nameSearch, req.body.offset], function (err, result, fields) {
                if (err) throw err;
                var resp = result;
                connection.query('SELECT COUNT(*) AS count FROM products WHERE name LIKE ?', [nameSearch], function (err, result, fields) {
                  if (err) throw err;
                  var count = result;
                  res.send({
                    resp: resp,
                    count: count
                  });
                });
              });
              connection.release(); // Handle error after the release.

              if (err) throw err;
            });

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
router.get("/:id", /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res) {
    var productId;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            productId = req.params.id;

            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = 'UPDATE products set numReview= numReview+1 WHERE _id=?';
                connection.query(sql, productId, function (err, result) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = 'SELECT _id, name, category, brand, image, typicalImage, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice FROM products WHERE _id=?';
                  connection.query(sql, productId, function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    var product = result[0];
                    sql = 'SELECT compatibility_company, compatibility_model FROM compatibilities WHERE product_id=?';
                    connection.query(sql, productId, function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var compatibilities = result;
                      sql = 'SELECT feature_title, feature FROM features WHERE product_id=?';
                      connection.query(sql, productId, function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var features = result;
                        res.status(200).send({
                          product: product,
                          compatibilities: compatibilities,
                          features: features
                        });
                        connection.commit(function (err) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          console.log('Transaction Completed Successfully.');
                          connection.release(); // Handle error after the release.

                          if (err) throw err;
                        });
                      });
                    });
                  });
                });
              });
              /* End transaction */
            });

          case 2:
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
router.post("/most_viewed", /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res) {
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              connection.query('SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice FROM products WHERE visibility=1 ORDER BY numReview DESC LIMIT 10', function (err, result, fields) {
                if (err) throw err;
                console.log("Most viewed products succeed");
                res.send(result);
                connection.release(); // Handle error after the release.

                if (err) throw err;
              });
            });

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
router.post("/searchForItems", /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(req, res) {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              var sp = req.body.searchText.trim().split(" ");
              var search = '(';

              for (var i = 0; i < sp.length; i++) {
                if (i !== 0) {
                  search += ' && ';
                }

                search += 'name LIKE ' + "'%" + sp[i] + "%'";
              }

              ;
              search += ' OR( ';

              for (var _i4 = 0; _i4 < sp.length; _i4++) {
                if (_i4 !== 0) {
                  search += ' && ';
                }

                search += 'subcategory LIKE ' + "'%" + sp[_i4] + "%'";
              }

              ;
              search += ' ) ';
              search += ' OR( ';

              for (var _i5 = 0; _i5 < sp.length; _i5++) {
                if (_i5 !== 0) {
                  search += ' && ';
                }

                search += 'category LIKE ' + "'%" + sp[_i5] + "%'";
              }

              ;
              search += ' )) ';
              var filters = '';

              if (req.body.filters !== null && req.body.filters.length !== 0) {
                filters += '&&(';

                for (var _i6 = 0; _i6 < req.body.filters.length; _i6++) {
                  if (_i6 !== 0) {
                    filters += ' OR (category="' + req.body.filters[_i6].category + '" && subcategory="' + req.body.filters[_i6].subcategory + '")';
                  } else {
                    filters += ' (category="' + req.body.filters[_i6].category + '" && subcategory="' + req.body.filters[_i6].subcategory + '")';
                  }
                }

                filters += ')';
              }

              var sortBy = '';

              switch (req.body.sortType) {
                case 'Αλφαβητικά: Α-Ω':
                  sortBy = 'name';
                  break;

                case 'Αλφαβητικά: Ω-Α':
                  sortBy = 'name DESC';
                  break;

                case 'Τιμή αύξουσα':
                  sortBy = 'totalPrice';
                  break;

                case 'Τιμή φθίνουσα':
                  sortBy = 'totalPrice DESC';
                  break;

                default:
                  sortBy = 'numReview DESC';
                  break;
              }

              if (err) throw err; // not connected!

              connection.query("SELECT _id, name, category, brand, image, description,\n        countInStock, numReview, subcategory, weight, supplier, availability, \n        visibility, totalPrice FROM products \n        WHERE visibility=1 &&\n        ".concat(search, " \n        ").concat(filters, "         \n        ORDER BY ").concat(sortBy, " LIMIT ").concat(req.body.itemsPerPage, " OFFSET ").concat(req.body.offset), function (err, result, fields) {
                if (err) throw err;
                var resp = result;
                connection.query("SELECT COUNT(*) AS count FROM products \n                    WHERE visibility=1 && \n                    ".concat(search, " \n                    ").concat(filters), function (err, result, fields) {
                  if (err) throw err;
                  var count = result;
                  connection.query("SELECT DISTINCT category FROM products \n                            WHERE visibility=1 && \n                            ".concat(search), function (err, result, fields) {
                    if (err) throw err;
                    var categories = result;
                    connection.query("SELECT DISTINCT category, subcategory FROM products \n                            WHERE visibility=1 && \n                            ".concat(search), function (err, result, fields) {
                      if (err) throw err;
                      var subcategories = result;
                      res.send({
                        resp: resp,
                        count: count,
                        categories: categories,
                        subcategories: subcategories
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
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=productRoute.js.map