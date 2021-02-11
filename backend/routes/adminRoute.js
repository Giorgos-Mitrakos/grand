import express from 'express';
import multer from 'multer';
import {isAdmin, isAuth} from '../util';
import mysqlConnection from '../connection';

const router= express.Router();

const storageA = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'frontend/public/images/products')
    },
    filename: (req, file, cb) => {
      const fileName = Date.now() + '-' + file.originalname;
      cb(null, fileName);
    }
});
 
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
    }
  }
  
const upload = multer({ storage: storageA, fileFilter: fileFilter });



router.get("/",isAdmin, async (req, res) =>{
    const products = await Product.find({});
    res.send(products);
})

router.post("/createproduct", isAuth, isAdmin,  upload.single('image'), async (req,res,next) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql = "INSERT INTO products (name, category, brand, subcategory, image, price, percentage, description, countInStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 10)";
    connection.query(sql, [req.body.name, req.body.category, req.body.brand, req.body.subcategory, req.file.path.slice(15,req.file.path.length),
      req.body.price, req.body.percentage, req.body.description, req.body.countInStock], function (err, result, fields) {
    if (err) throw err;
    res.status(201).send({message:'New product Created'});
    });

    connection.release();

    // Handle error after the release.
    if (err) throw err;
  });  
 
})

router.post("/getcollectionList", isAuth, isAdmin,  upload.single('image'), async (req,res,next) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql = "SELECT * FROM products WHERE category=?";
    connection.query(sql,["Συλλογή"], function (err, result, fields) {
    if (err) throw err;
    console.log("Get collection list");
    res.status(200).send(result);
    });

    connection.release();

    // Handle error after the release.
    if (err) throw err;
  });  
 
})

router.post("/insertcollectionproduct", isAuth, isAdmin,  upload.single('image'), async (req,res,next) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql = "INSERT INTO products (name, image, price, description, category) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql, [req.body.name, req.file.path.slice(15,req.file.path.length),
      req.body.price, req.body.description, "Συλλογή"], function (err, result, fields) {
    if (err) throw err;
    console.log("1 record inserted");
    res.status(201).send({message:'New collection product Created'});
    });

    connection.release();

    // Handle error after the release.
    if (err) throw err;
  });  
 
})

router.put("/insertcollectionproduct/:id", isAuth, isAdmin,  upload.single('image'), async (req,res,next) =>{
  const collectionId = req.params.id;  
  
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql ='SELECT * FROM products WHERE _id=?';
    connection.query(sql, [collectionId], function (err, result, fields) {
      if (err) throw err;
    
      if(Object.keys(result).length===0){
        console.log("Product not found");
        res.send({message:'Product not found'});
      }
      else
      {
        sql = "UPDATE products SET name=?, image=?, price=?, description=? WHERE _id=?";
        connection.query(sql, [req.body.name,req.body.image,req.body.price, req.body.description,collectionId], function (err, result, fields) {
          if (err) throw err;

          console.log("1 record updated");
        });

        sql = "SELECT * FROM products WHERE _id=?";
        connection.query(sql, [collectionId], function (err, result, fields) {
          if (err) throw err;

          res.send(result);
        });
      }
    });

    connection.release();

    // Handle error after the release.
    if (err) throw err;
  });  
 
})

router.put("/changeCollectionVisibility", isAuth, isAdmin, async (req,res,next) =>{
  
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    var sql ='UPDATE products SET visibility=? WHERE _id=?';
    connection.query(sql, [req.body.productVisibility,req.body.collectionId], function (err, result, fields) {
      if (err) throw err;
    
      console.log("1 record updated");
      sql = "SELECT * FROM products WHERE _id=?";
      connection.query(sql, [req.body.collectionId], function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      })

    });

      connection.release();

      // Handle error after the release.
      if (err) throw err;
  });
});

router.put("/changeVisibility", isAuth, isAdmin, async (req,res,next) =>{
  
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql ='UPDATE products SET visibility=? WHERE _id=?';
    connection.query(sql, [req.body.productVisibility,req.body.productID], function (err, result, fields) {
      if (err) throw err;
    
      console.log("1 record updated");
      sql = "SELECT * FROM products WHERE _id=?";
      connection.query(sql, [req.body.productID], function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      })

    });

      connection.release();

      // Handle error after the release.
      if (err) throw err;
  });
});

router.put("/category_percentage_change", isAuth, isAdmin, async (req,res,next) =>{
  
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    if(req.body.subcategory===''||req.body.subcategory==='Επέλεξε Υποκατηγορία'|| req.body.subcategory===null)
    {
      var sql ='UPDATE products SET percentage=? WHERE category=?';
      connection.query(sql, [req.body.pricePercentage,req.body.category], function (err, result, fields) {
        if (err) throw err;
      
        res.send({message:"OK"});
        
      });
    }
    else
    {
      var sql ='UPDATE products SET percentage=? WHERE category=? && subcategory=?';
      connection.query(sql, [req.body.pricePercentage,req.body.category, req.body.subcategory], function (err, result, fields) {
        if (err) throw err;
      
        res.send({message:"OK"});
        
      });
    }

      connection.release();

      // Handle error after the release.
      if (err) throw err;
  });
});

router.put("/createproduct/:id", isAuth, isAdmin, upload.single('image'), async (req,res,next) =>{
  const productId = req.params.id;  
  
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql ='SELECT * FROM products WHERE _ID=?';
    connection.query(sql, [productId], function (err, result, fields) {
      if (err) throw err;
    
      if(Object.keys(result).length===0){
        console.log("Product not found");
        res.send({message:'Product not found'});
      }
    });

    sql = "UPDATE products SET name=?, category=?, brand=?, subcategory=?, image=?, price=?, percentage=?, description=? WHERE _id=?";
        connection.query(sql, [req.body.name,req.body.category,req.body.brand, req.body.subcategory,
          req.body.image,req.body.price,req.body.percentage, req.body.description,productId], function (err, result, fields) {
          if (err) throw err;

          console.log("1 record updated");
        });

        sql = "SELECT * FROM products WHERE _id=?";
        connection.query(sql, [productId], function (err, result, fields) {
          if (err) throw err;

          if(Object.keys(result).length!==0){
            Object.keys(result).forEach(function(key) {
                var row = result[key];
                const product = {
                    name: row.name,
                    category: row.category,
                    brand: row.brand,
                    //image: row.image,
                    price: row.price,
                    percentage: row.percentage,
                    description: row.description,
                    countInStock: row.countInStock
                };

                res.send({
                    product
                })
            });
        }
        });

    connection.release();

    // Handle error after the release.
    if (err) throw err;
  });
});

router.post("/createcategory", isAuth, isAdmin, upload.single('image'), async (req,res,next) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql = "INSERT INTO categories (category, image) VALUES (?, ?)";
    connection.query(sql, [req.body.category, req.file.path.slice(15,req.file.path.length)], function (err, result, fields) {
      if (err) throw err;
      console.log("1 record inserted");
      res.status(201).send({message:'New product Created'});
    });

    connection.release();

    // Handle error after the release.
    if (err) throw err;
  });  
 
})

router.post("/manufacturerslist", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      connection.query('SELECT * FROM manufacturers ORDER BY name', function (err, result, fields) {
      if (err) throw err;
      console.log("Read manufacturers succeed");
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
      })
  });
})

router.post("/insertmanufacturer", isAuth, isAdmin, async (req,res,next) =>{
  
  mysqlConnection.getConnection(function(err, connection){
    if (err) throw err; // not connected!
    
    /* Begin transaction */
    connection.beginTransaction(function(err) {
      if (err) { throw err; }

      let sql = "INSERT INTO manufacturers (name) VALUES (?)";
      connection.query(sql, [req.body.manufacturer], function(err, result, fields) {
        if (err) { 
          connection.rollback(function() {
            throw err;
          });
        }
    
        sql="SELECT * FROM manufacturers ORDER BY name";
        connection.query(sql, function(err, result) {
          if (err) { 
            connection.rollback(function() {
              throw err;
            });
          }
            console.log("Read manufacturers succeed");
            res.send(result);

          connection.commit(function(err) {
            if (err) { 
              connection.rollback(function() {
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
  })  
}); 

router.post("/featuretitlelist", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      connection.query('SELECT * FROM feature_titles ORDER BY feature_title', function (err, result, fields) {
      if (err) throw err;
      console.log("Read feature titles succeed");
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
      })
  });
})

router.post("/insertfeaturetitle", isAuth, isAdmin, async (req,res,next) =>{
  
  mysqlConnection.getConnection(function(err, connection){
    if (err) throw err; // not connected!
    
    /* Begin transaction */
    connection.beginTransaction(function(err) {
      if (err) { throw err; }

      let sql = "INSERT INTO feature_titles (feature_title) VALUES (?)";
      connection.query(sql, [req.body.featureTitle], function(err, result, fields) {
        if (err) { 
          connection.rollback(function() {
            throw err;
          });
        }
    
        sql="SELECT * FROM feature_titles ORDER BY feature_title";
        connection.query(sql, function(err, result) {
          if (err) { 
            connection.rollback(function() {
              throw err;
            });
          }
            console.log("Read feature titles succeed");
            res.send(result);

          connection.commit(function(err) {
            if (err) { 
              connection.rollback(function() {
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
  })  
}); 

router.post("/featurenames", isAuth, isAdmin, async (req, res)=>{

  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!

      var sql='SELECT DISTINCT feature_name FROM feature_names WHERE feature_title_id=? ORDER BY feature_name';
      connection.query(sql, [req.body.featureTitleId], function (err, result, fields) {
      if (err) throw err;
      console.log("Read feature names succeed");
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
      })
  });
})

router.post("/insertfeaturename", isAuth, isAdmin, async (req,res,next) =>{
  
  mysqlConnection.getConnection(function(err, connection){
    if (err) throw err; // not connected!
    /* Begin transaction */
    connection.beginTransaction(function(err) {
      if (err) { throw err; }

      let sql = "INSERT INTO feature_names (feature_title_id, feature_name) VALUES (?, ?)";
      connection.query(sql, [req.body.titleId, req.body.name], function(err, result, fields) {
        if (err) { 
          connection.rollback(function() {
            throw err;
          });
        }
    
        sql="SELECT * FROM feature_names WHERE feature_title_id=? ORDER BY feature_name ";
        connection.query(sql,[req.body.titleId], function(err, result) {
          if (err) { 
            connection.rollback(function() {
              throw err;
            });
          }
          console.log("Read feature names succeed");
            res.send(result);

          connection.commit(function(err) {
            if (err) { 
              connection.rollback(function() {
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
  })  
}); 

router.post("/sendinglist", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      connection.query('SELECT * FROM sendingMethods', function (err, result, fields) {
      if (err) throw err;
      
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
      })
  });
})

router.post("/editsendingmethod", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      connection.query('UPDATE sendingMethods SET sendingMethod=?, sendingMethodCost=? WHERE sendingMethod_id=?', 
        [req.body.method,req.body.cost,req.body.methodId],function (err, result, fields) {
        if (err) throw err;

        let sql = "SELECT * FROM sendingMethods";
        connection.query(sql, function (err, result, fields) {
          if (err) throw err;
          
          res.send(result);
        })
        
        connection.release();

        // Handle error after the release.
        if (err) throw err;
      })
  });
})

router.post("/createsendingmethod", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      let sql = "INSERT INTO sendingMethods (sendingMethod, sendingMethodCost) VALUES (?, ?)";
      connection.query(sql,[req.body.method,req.body.cost],function (err, result, fields) {
        if (err) throw err;

        sql = "SELECT * FROM sendingMethods";
        connection.query(sql, function (err, result, fields) {
          if (err) throw err;
          
          res.send(result);
        })
        
        connection.release();

        // Handle error after the release.
        if (err) throw err;
      })
  });
})

router.post("/removesendingmethod", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      let sql = "DELETE FROM sendingMethods WHERE sendingMethod_id=?";
      connection.query(sql,[req.body.methodId],function (err, result, fields) {
        if (err) throw err;

        sql = "SELECT * FROM sendingMethods";
        connection.query(sql, function (err, result, fields) {
          if (err) throw err;
          
          res.send(result);
        })
        
        connection.release();

        // Handle error after the release.
        if (err) throw err;
      })
  });
})

router.post("/paymentlist", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      let sql="SELECT * FROM paymentMethods WHERE sendingMethod_id=? ";
      connection.query(sql,[req.body.methodId], function (err, result, fields) {
      if (err) throw err;
      
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
      })
  });
})

router.post("/editpaymentlist", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      connection.query('UPDATE paymentMethods SET paymentMethod=?, paymentMethodCost=? WHERE paymentMethod_id=?', 
        [req.body.paymentMethod,req.body.paymentMethodCost,req.body.paymentMethodId],function (err, result, fields) {
        if (err) throw err;

        let sql = "SELECT * FROM paymentMethods WHERE sendingMethod_id=? ";
        connection.query(sql,[req.body.sendingMethodId], function (err, result, fields) {
          if (err) throw err;
          
          res.send(result);
        })
        
        connection.release();

        // Handle error after the release.
        if (err) throw err;
      })
  });
})

router.post("/createpaymentlist", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      let sql="INSERT INTO paymentMethods (paymentMethod, paymentMethodCost,sendingMethod_id) VALUES (?, ?, ?)";
      connection.query(sql,[req.body.paymentMethod,req.body.paymentMethodCost,req.body.sendingMethodId],function (err, result, fields) {
        if (err) throw err;

        sql = "SELECT * FROM paymentMethods WHERE sendingMethod_id=? ";
        connection.query(sql,[req.body.sendingMethodId], function (err, result, fields) {
          if (err) throw err;
          
          res.send(result);
        })
        
        connection.release();

        // Handle error after the release.
        if (err) throw err;
      })
  });
})

router.post("/removepaymentlist", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      let sql="DELETE FROM paymentMethods WHERE paymentMethod_id=?";
      connection.query(sql,[req.body.paymentMethodId],function (err, result, fields) {
        if (err) throw err;

        sql = "SELECT * FROM paymentMethods WHERE sendingMethod_id=? ";
        connection.query(sql,[req.body.sendingMethodId], function (err, result, fields) {
          if (err) throw err;
          
          res.send(result);
        })
        
        connection.release();

        // Handle error after the release.
        if (err) throw err;
      })
  });
})

router.post("/featurelist", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      connection.query('SELECT * FROM features WHERE product_id=?', [req.body.productId], function (err, result, fields) {
      if (err) throw err;
      console.log("Read product features succeed");
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
      })
  });
})

router.post("/insertfeature", isAuth, isAdmin, async (req,res,next) =>{
  
  mysqlConnection.getConnection(function(err, connection){
    if (err) throw err; // not connected!
    /* Begin transaction */
    connection.beginTransaction(function(err) {
      if (err) { throw err; }

      let sql = "INSERT INTO features (product_id, feature_title, feature) VALUES (?, ?, ?)";
      connection.query(sql, [req.body.productId, req.body.title, req.body.name], function(err, result, fields) {
        if (err) { 
          connection.rollback(function() {
            throw err;
          });
        }
    
        sql="SELECT * FROM features WHERE product_id=?";
        connection.query(sql,[req.body.productId], function(err, result) {
          if (err) { 
            connection.rollback(function() {
              throw err;
            });
          }
          console.log("Read product feature succeed");
            res.send(result);

          connection.commit(function(err) {
            if (err) { 
              connection.rollback(function() {
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
  })  
}); 

router.post("/deletefeature", isAuth, isAdmin, async (req,res,next) =>{
  
  mysqlConnection.getConnection(function(err, connection){
    if (err) throw err; // not connected!

    /* Begin transaction */
    connection.beginTransaction(function(err) {
  if (err) { throw err; }

  let sql = "DELETE FROM features WHERE features_id=?";
  connection.query(sql, [req.body.featureId], function(err, result, fields) {
    if (err) { 
      connection.rollback(function() {
        throw err;
      });
    }
 
    sql="SELECT * FROM features WHERE product_id=?";
    connection.query(sql, [req.body.productId], function(err, result) {
      if (err) { 
        connection.rollback(function() {
          throw err;
        });
      }
      console.log("Read product features succeed");
        res.send(result);

      connection.commit(function(err) {
        if (err) { 
          connection.rollback(function() {
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
  })  
}); 

router.post("/categories", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      
      connection.query('SELECT * FROM categories', function (err, result, fields) {
      if (err) throw err;
      console.log("Read categories succeed");
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
      })
  });
})

router.post("/subcategories", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      connection.query('SELECT * FROM categories WHERE parent_id=?',[req.body.parentId], function (err, result, fields) {
      if (err) throw err;
      console.log("Read subcategories succeed");
      res.send(result);
      connection.release();

      // Handle error after the release.
      if (err) throw err;
      })
  });
})

router.post("/compatibilitycompanylist", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query('SELECT * FROM compatibility_company ORDER BY company', function (err, result, fields) {
    if (err) throw err;
    console.log("Read compatibility companies succeed");
    res.send(result);
    connection.release();

    // Handle error after the release.
    if (err) throw err;
    })
});
})

router.post("/compatibilitymodelslist", isAuth, isAdmin, async (req, res) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query('SELECT * FROM compatibility_model WHERE compatibility_company_id=? ORDER BY model',[req.body.companyId], function (err, result, fields) {
    if (err) throw err;
    console.log("Read compatibility models succeed");
    res.send(result);
    connection.release();

    // Handle error after the release.
    if (err) throw err;
    })
});
})

router.post("/insertcompatibilitycompany", isAuth, isAdmin, async (req,res,next) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql = "INSERT INTO compatibility_company (company) VALUES (?)";
    connection.query(sql, [req.body.company], function (err, result, fields) {
    if (err) throw err;

    let compatibility_company_id=result.insertId;

    sql = "SELECT * FROM compatibility_company WHERE compatibility_company_id=?";
    connection.query(sql, [compatibility_company_id], function (err, result, fields) {
      if (err) throw err;

      res.status(201).send(result);
      });
    });
    

    connection.release();

    // Handle error after the release.
    if (err) throw err;
  });  
 
})

router.post("/insertcompatibilitymodel", isAuth, isAdmin, async (req,res,next) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql = "INSERT INTO compatibility_model (compatibility_company_id,model) VALUES (?,?)";
    connection.query(sql, [req.body.companyId, req.body.model], function (err, result, fields) {
    if (err) throw err;

    let compatibility_model_id=result.insertId;

    sql = "SELECT * FROM compatibility_model WHERE compatibility_model_id=?";
    connection.query(sql, [compatibility_model_id], function (err, result, fields) {
      if (err) throw err;

      res.status(201).send(result);
      });
    });
    

    connection.release();

    // Handle error after the release.
    if (err) throw err;
  });  
 
})

router.post("/insertcompatibility", isAuth, isAdmin, async (req,res,next) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql = "INSERT INTO compatibilities (product_id,compatibility_company,compatibility_model) VALUES (?,?,?)";
    connection.query(sql, [req.body.productId, req.body.company, req.body.model], function (err, result, fields) {
    if (err) throw err;

    let compat_id=result.insertId;

    sql = "SELECT * FROM compatibilities WHERE compatibility_id=?";
    connection.query(sql, [compat_id], function (err, result, fields) {
      if (err) throw err;

      res.status(201).send(result);
      });
    });
    

    connection.release();

    // Handle error after the release.
    if (err) throw err;
  });  
 
})

router.post("/getproductcompatibilities", isAuth, isAdmin, async (req,res,next) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql = "SELECT * FROM compatibilities WHERE product_id=? ORDER BY compatibility_model";
    connection.query(sql, [req.body.productId], function (err, result, fields) {
    if (err) throw err;

    res.status(200).send(result);
    connection.release();
    })

    // Handle error after the release.
    if (err) throw err;
  });  
 
})

router.post("/deletecompatibility", isAuth, isAdmin, async (req,res,next) =>{
  mysqlConnection.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    var sql = "DELETE FROM compatibilities WHERE compatibility_id=?";
    connection.query(sql, [req.body.compatId], function (err, result, fields) {
    if (err) throw err;

    res.status(200).send({message:"OK"});
    connection.release();
    })

    // Handle error after the release.
    if (err) throw err;
  });  
 
})


export default router;