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

                var sql = "SELECT COUNT(*) as count FROM phone_brands WHERE brand=?";
                connection.query(sql, [req.body.brand], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var countBrands = result[0].count;

                  if (countBrands === 0) {
                    var _sql = "INSERT INTO phone_brands (brand) VALUES (?)";
                    connection.query(_sql, [req.body.brand], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      _sql = "SELECT COUNT(*) as count FROM compatibility_company WHERE company=?";
                      connection.query(_sql, [req.body.brand], function (err, result, fields) {
                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var countCompany = result[0].count;

                        if (countCompany === 0) {
                          _sql = "INSERT INTO compatibility_company (company) VALUES (?)";
                          connection.query(_sql, [req.body.brand], function (err, result, fields) {
                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            _sql = "SELECT * FROM phone_brands ORDER BY brand";
                            connection.query(_sql, function (err, result) {
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
                        } else {
                          _sql = "SELECT * FROM phone_brands ORDER BY brand";
                          connection.query(_sql, function (err, result) {
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
                        }
                      });
                    });
                  } else {
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
                  }
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
router.post("/deletebrand/", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
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

                var sql = "DELETE FROM phone_models WHERE phone_brand_id=?";
                connection.query(sql, [req.body.brand_id], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  sql = "DELETE FROM phone_brands WHERE phone_brand_id=?";
                  connection.query(sql, [req.body.brand_id], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    sql = "SELECT compatibility_company_id FROM compatibility_company WHERE company=?";
                    connection.query(sql, [req.body.phone_brand], function (err, result, fields) {
                      var _result$;

                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var brandID = (_result$ = result[0]) === null || _result$ === void 0 ? void 0 : _result$.compatibility_company_id;

                      if (brandID > 0) {
                        sql = "DELETE FROM compatibility_model WHERE compatibility_company_id=?";
                        connection.query(sql, [brandID], function (err, result, fields) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          sql = "DELETE FROM compatibility_company WHERE compatibility_company_id=?";
                          connection.query(sql, [brandID], function (err, result) {
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
                      } else {
                        sql = "SELECT * FROM phone_brands ORDER BY brand";
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
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}());
router.post("/phoneModels", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
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
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x11, _x12) {
    return _ref5.apply(this, arguments);
  };
}());
router.post("/insertphonemodel/", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "SELECT COUNT(*) as count FROM phone_models WHERE model=?";
                connection.query(sql, [req.body.model], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var countModels = result[0].count;

                  if (countModels === 0) {
                    sql = "INSERT INTO phone_models (phone_brand_id, model) VALUES (?, ?)";
                    connection.query(sql, [req.body.brandId, req.body.model], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      sql = "SELECT brand FROM phone_brands WHERE phone_brand_id=?";
                      connection.query(sql, [req.body.brandId], function (err, result, fields) {
                        var _result$2;

                        if (err) {
                          connection.rollback(function () {
                            throw err;
                          });
                        }

                        var phoneBrand = (_result$2 = result[0]) === null || _result$2 === void 0 ? void 0 : _result$2.brand;

                        if (phoneBrand && phoneBrand !== undefined) {
                          sql = "SELECT compatibility_company_id FROM compatibility_company WHERE company=?";
                          connection.query(sql, [phoneBrand], function (err, result, fields) {
                            var _result$3;

                            if (err) {
                              connection.rollback(function () {
                                throw err;
                              });
                            }

                            var companyID = (_result$3 = result[0]) === null || _result$3 === void 0 ? void 0 : _result$3.compatibility_company_id;

                            if (companyID && companyID > 0) {
                              var _sql2 = "SELECT COUNT(*) as count FROM compatibility_model \n                    WHERE compatibility_company_id=?\n                    AND model=?";
                              connection.query(_sql2, [companyID, req.body.model], function (err, result, fields) {
                                if (err) {
                                  connection.rollback(function () {
                                    throw err;
                                  });
                                }

                                var countCompModels = result[0].count;

                                if (countCompModels === 0) {
                                  _sql2 = "INSERT INTO compatibility_model (compatibility_company_id, model) VALUES (?, ?)";
                                  connection.query(_sql2, [companyID, req.body.model], function (err, result, fields) {
                                    if (err) {
                                      connection.rollback(function () {
                                        throw err;
                                      });
                                    }

                                    _sql2 = "SELECT * FROM phone_models WHERE phone_brand_id=? ORDER BY model ";
                                    connection.query(_sql2, [req.body.brandId], function (err, result) {
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
                                } else {
                                  _sql2 = "SELECT * FROM phone_models WHERE phone_brand_id=? ORDER BY model ";
                                  connection.query(_sql2, [req.body.brandId], function (err, result) {
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
                                }
                              });
                            } else {
                              sql = "INSERT INTO compatibility_company (company) VALUES (?)";
                              connection.query(sql, [phoneBrand], function (err, result, fields) {
                                if (err) {
                                  connection.rollback(function () {
                                    throw err;
                                  });
                                }

                                var companyId = result.insertId;
                                sql = "INSERT INTO compatibility_model (compatibility_company_id,model) VALUES (?,?)";
                                connection.query(sql, [companyId, req.body.model], function (err, result, fields) {
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
                            }
                          });
                        } else {
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
                        }
                      });
                    });
                  } else {
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
                  }
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

  return function (_x13, _x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}());
router.post("/deletephonemodel/", _util.isAuth, _util.isAdmin, /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _connection["default"].getConnection(function (err, connection) {
              if (err) throw err; // not connected!

              /* Begin transaction */

              connection.beginTransaction(function (err) {
                if (err) {
                  throw err;
                }

                var sql = "SELECT compatibility_company_id FROM compatibility_company WHERE company=? ";
                connection.query(sql, [req.body.phone_brand], function (err, result) {
                  var _result$4;

                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  var companyID = (_result$4 = result[0]) === null || _result$4 === void 0 ? void 0 : _result$4.compatibility_company_id;
                  sql = "DELETE FROM phone_models WHERE phone_model_id=?";
                  connection.query(sql, [req.body.phone_model_id], function (err, result, fields) {
                    if (err) {
                      connection.rollback(function () {
                        throw err;
                      });
                    }

                    sql = "SELECT compatibility_model_id FROM compatibility_model WHERE model=? AND compatibility_company_id=? ";
                    connection.query(sql, [req.body.phone_model, companyID], function (err, result) {
                      var _result$5;

                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      var modelID = (_result$5 = result[0]) === null || _result$5 === void 0 ? void 0 : _result$5.compatibility_model_id;

                      if (modelID > 0) {
                        sql = "DELETE FROM compatibility_model WHERE compatibility_model_id=? ";
                        connection.query(sql, [modelID], function (err, result) {
                          if (err) {
                            connection.rollback(function () {
                              throw err;
                            });
                          }

                          sql = "SELECT * FROM phone_models WHERE phone_brand_id=? ORDER BY model ";
                          connection.query(sql, [req.body.brand_id], function (err, result) {
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
                      } else {
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
                      }
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

  return function (_x16, _x17, _x18) {
    return _ref7.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=phonemodelRoute.js.map