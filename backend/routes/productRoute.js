import express from 'express';
import mysqlConnection from '../connection';

const router= express.Router();

router.get("/", async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query('SELECT * FROM products', function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
        connection.release();

        // Handle error after the release.
        if (err) throw err;
        })
    });
})

router.get("/collectionlist", async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
    
        var sql = "SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice FROM products WHERE category=? && visibility=1";
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

router.get("/collectionDetails/:id", async (req, res) =>{
    const collectionId = req.params.id;
    mysqlConnection.getConnection(function(err, connection) {
       if (err) throw err; // not connected!

       /* Begin transaction */
       connection.beginTransaction(function(err) {
           if (err) { throw err; }

           var sql ='UPDATE products set numReview= numReview+1 WHERE _id=?';
           connection.query(sql, collectionId, function(err, result) {
           if (err) { 
               connection.rollback(function() {
               throw err;
               });
           }
                   
           var sql ='SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice FROM products WHERE _id=?';
           connection.query(sql,collectionId, function (err, result, fields) {
               if (err) { 
               connection.rollback(function() {
                   throw err;
               });
               }
               
               res.status(200).send(result[0]);
               connection.commit(function(err) {
               if (err) { 
                   connection.rollback(function() {
                   throw err;
                   });
               }
               console.log('Transaction Completed Successfully.');
               connection.release();

               // Handle error after the release.
               if (err) throw err;
               });
           });
           });
       });
       /* End transaction */
   });
})

router.post("/products_by_category", async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query('SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice FROM products WHERE products.category=? && products.subcategory=? && products.visibility=1',
        [req.body.category,req.body.subcategory], function (err, result, fields) {
        if (err) throw err;
        console.log("Read products succeed");
        res.send(result);
        connection.release();

        // Handle error after the release.
        if (err) throw err;
        })
    });
})

router.get("/featurelist", async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        
        connection.query('SELECT * FROM features', function (err, result, fields) {
        if (err) throw err;
        console.log("Read product features succeed");
        res.send(result);
        connection.release();
  
        // Handle error after the release.
        if (err) throw err;
        })
    });
  })

router.post("/feature_title_by_category", async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query('SELECT DISTINCT features.feature_title FROM products LEFT JOIN features ON products._id=features.product_id WHERE products.category=? && products.subcategory=? && products.visibility=1 && features.feature_title IS NOT NULL',
        [req.body.category,req.body.subcategory], function (err, result, fields) {
        if (err) throw err;
        console.log("Read products succeed");
        res.send(result);
        connection.release();

        // Handle error after the release.
        if (err) throw err;
        })
    });
})

router.post("/feature_name_by_category", async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query('SELECT DISTINCT features.feature_title,features.feature FROM products LEFT JOIN features ON products._id=features.product_id WHERE products.category=? && products.subcategory=? && products.visibility=1 && features.feature_title IS NOT NULL',
        [req.body.category,req.body.subcategory], function (err, result, fields) {
        if (err) throw err;
        console.log("Read products succeed");
        res.send(result);
        connection.release();

        // Handle error after the release.
        if (err) throw err;
        })
    });
})

router.post("/compatibilities_by_category", async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query('SELECT * FROM products LEFT JOIN compatibilities ON products._id=compatibilities.product_id WHERE products.category=? && products.subcategory=? && products.visibility=1 && compatibilities.compatibility_company IS NOT NULL ORDER BY compatibilities.compatibility_company,compatibilities.compatibility_model ',
        [req.body.category,req.body.subcategory], function (err, result, fields) {
        if (err) throw err;
        console.log("Read compatibility companies succeed");
        res.send(result);
        connection.release();

        // Handle error after the release.
        if (err) throw err;
        })
    });
})


router.post("/products_by_category_admin", async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        if(req.body.subcategory==='' || req.body.subcategory==='Επέλεξε Υποκατηγορία'|| req.body.subcategory===null || req.body.subcategory===undefined)
        {
            connection.query('SELECT * FROM products WHERE category=?',
            [req.body.category,req.body.subcategory], function (err, result, fields) {
            if (err) throw err;
            console.log("Read products succeed");
            res.send(result);
            })
        }
        else
        {
            connection.query('SELECT * FROM products WHERE category=? && subcategory=?',
            [req.body.category,req.body.subcategory], function (err, result, fields) {
            if (err) throw err;
            console.log("Read products succeed");
            res.send(result);
            })
        }
        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
})

router.get("/:id", async (req, res) =>{
         const productId = req.params.id;
         mysqlConnection.getConnection(function(err, connection) {
            if (err) throw err; // not connected!

            /* Begin transaction */
            connection.beginTransaction(function(err) {
                if (err) { throw err; }

                var sql ='UPDATE products set numReview= numReview+1 WHERE _id=?';
                connection.query(sql, productId, function(err, result) {
                if (err) { 
                    connection.rollback(function() {
                    throw err;
                    });
                }
                        
                var sql ='SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice FROM products WHERE _id=?';
                connection.query(sql,productId, function (err, result, fields) {
                    if (err) { 
                    connection.rollback(function() {
                        throw err;
                    });
                    }
                    
                    res.status(200).send(result[0]);
                    connection.commit(function(err) {
                    if (err) { 
                        connection.rollback(function() {
                        throw err;
                        });
                    }
                    console.log('Transaction Completed Successfully.');
                    connection.release();

                    // Handle error after the release.
                    if (err) throw err;
                    });
                });
                });
            });
            /* End transaction */
        });
    })

router.post("/most_viewed", async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query('SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice FROM products WHERE visibility=1 ORDER BY numReview DESC LIMIT 10', function (err, result, fields) {
        if (err) throw err;
        console.log("Most viewed products succeed");
        res.send(result);
        connection.release();

        // Handle error after the release.
        if (err) throw err;
        })
    });
})
    
export default router;