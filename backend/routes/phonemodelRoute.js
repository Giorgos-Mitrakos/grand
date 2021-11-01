import express from 'express';
import { isAdmin, isAuth } from '../util';
import mysqlConnection from '../connection';

const router = express.Router();

router.get("/", async (req, res) => {

  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    connection.query('SELECT * FROM phone_brands INNER JOIN phone_models ON phone_brands.phone_brand_id=phone_models.phone_brand_id ORDER BY phone_brands.brand', function (err, result, fields) {
      if (err) throw err;
      console.log("Read user succeed");
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
    })
  });
})

router.get("/phoneBrands", async (req, res) => {

  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    connection.query('SELECT * FROM phone_brands ORDER BY brand', function (err, result, fields) {
      if (err) throw err;
      console.log("Read phone brand succeed");
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
    })
  });
})

router.post("/insertbrand/", isAuth, isAdmin, async (req, res, next) => {

  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    /* Begin transaction */
    connection.beginTransaction(function (err) {
      if (err) { throw err; }

      let sql = `SELECT COUNT(*) as count FROM phone_brands WHERE brand=?`;
      connection.query(sql, [req.body.brand], function (err, result, fields) {
        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }

        let countBrands = result[0].count;

        if (countBrands === 0) {

          let sql = `INSERT INTO phone_brands (brand) VALUES (?)`;
          connection.query(sql, [req.body.brand], function (err, result, fields) {
            if (err) {
              connection.rollback(function () {
                throw err;
              });
            }

            sql = `SELECT COUNT(*) as count FROM compatibility_company WHERE company=?`;
            connection.query(sql, [req.body.brand], function (err, result, fields) {
              if (err) {
                connection.rollback(function () {
                  throw err;
                });
              }

              let countCompany = result[0].count;

              if (countCompany === 0) {
                sql = "INSERT INTO compatibility_company (company) VALUES (?)";
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
              }
              else {
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
          })
        }
        else {
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
  })
});

router.post("/deletebrand/", isAuth, isAdmin, async (req, res, next) => {

  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    /* Begin transaction */
    connection.beginTransaction(function (err) {
      if (err) { throw err; }

      let sql = `DELETE FROM phone_models WHERE phone_brand_id=?`;
      connection.query(sql, [req.body.brand_id], function (err, result, fields) {
        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }

        sql = `DELETE FROM phone_brands WHERE phone_brand_id=?`;
        connection.query(sql, [req.body.brand_id], function (err, result, fields) {
          if (err) {
            connection.rollback(function () {
              throw err;
            });
          }

          sql = `SELECT compatibility_company_id FROM compatibility_company WHERE company=?`;
          connection.query(sql, [req.body.phone_brand], function (err, result, fields) {
            if (err) {
              connection.rollback(function () {
                throw err;
              });
            }

            let brandID = result[0]?.compatibility_company_id;

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
                  })
                });
              });
            }
            else {
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
              })
            }
          });
        })
      });
    });
    /* End transaction */
  })
});

router.post("/phoneModels", async (req, res) => {

  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    var sql = 'SELECT * FROM phone_models WHERE phone_brand_id=? ORDER BY model';
    connection.query(sql, [req.body.phoneBrandId], function (err, result, fields) {
      if (err) throw err;
      console.log("Read models succeed");
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
    })
  });
})

router.post("/insertphonemodel/", isAuth, isAdmin, async (req, res, next) => {

  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    /* Begin transaction */
    connection.beginTransaction(function (err) {
      if (err) { throw err; }

      let sql = `SELECT COUNT(*) as count FROM phone_models WHERE model=?`;
      connection.query(sql, [req.body.model], function (err, result, fields) {
        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }

        let countModels = result[0].count;

        if (countModels === 0) {

          sql = "INSERT INTO phone_models (phone_brand_id, model) VALUES (?, ?)";
          connection.query(sql, [req.body.brandId, req.body.model], function (err, result, fields) {
            if (err) {
              connection.rollback(function () {
                throw err;
              });
            }

            sql = `SELECT brand FROM phone_brands WHERE phone_brand_id=?`;
            connection.query(sql, [req.body.brandId], function (err, result, fields) {
              if (err) {
                connection.rollback(function () {
                  throw err;
                });
              }

              let phoneBrand = result[0]?.brand;

              if (phoneBrand && phoneBrand !== undefined) {

                sql = `SELECT compatibility_company_id FROM compatibility_company WHERE company=?`;
                connection.query(sql, [phoneBrand], function (err, result, fields) {
                  if (err) {
                    connection.rollback(function () {
                      throw err;
                    });
                  }

                  let companyID = result[0]?.compatibility_company_id;

                  if (companyID && companyID > 0) {

                    let sql = `SELECT COUNT(*) as count FROM compatibility_model 
                    WHERE compatibility_company_id=?
                    AND model=?`;
                    connection.query(sql, [companyID, req.body.model], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      let countCompModels = result[0].count;

                      if (countCompModels === 0) {

                        sql = "INSERT INTO compatibility_model (compatibility_company_id, model) VALUES (?, ?)";
                        connection.query(sql, [companyID, req.body.model], function (err, result, fields) {
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

                        })

                      }
                      else {
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

                    })

                  }
                  else {

                    sql = "INSERT INTO compatibility_company (company) VALUES (?)";
                    connection.query(sql, [phoneBrand], function (err, result, fields) {
                      if (err) {
                        connection.rollback(function () {
                          throw err;
                        });
                      }

                      let companyId = result.insertId;

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

                      })

                    })


                  }

                })

              }
              else {

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

            })

          });
        }
        else {
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
      })
    });
    /* End transaction */
  })
});

router.post("/deletephonemodel/", isAuth, isAdmin, async (req, res, next) => {

  mysqlConnection.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    /* Begin transaction */
    connection.beginTransaction(function (err) {
      if (err) { throw err; }
        
          let sql = "SELECT compatibility_company_id FROM compatibility_company WHERE company=? ";
          connection.query(sql, [req.body.phone_brand], function (err, result) {
            if (err) {
              connection.rollback(function () {
                throw err;
              });
            }

            let companyID = result[0]?.compatibility_company_id;

            sql = "DELETE FROM phone_models WHERE phone_model_id=?";
            connection.query(sql, [req.body.phone_model_id], function (err, result, fields) {
              if (err) {
                connection.rollback(function () {
                  throw err;
                });
              }

              sql = "SELECT compatibility_model_id FROM compatibility_model WHERE model=? AND compatibility_company_id=? ";
              connection.query(sql, [req.body.phone_model, companyID], function (err, result) {
                if (err) {
                  connection.rollback(function () {
                    throw err;
                  });
                }

                let modelID = result[0]?.compatibility_model_id;

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
                  })
                }
                else {
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

          })

    });
    /* End transaction */
  })
});


export default router;