import express from 'express';
import {isAdmin, isAuth} from '../util';
import mysqlConnection from '../connection';

const router= express.Router();

router.get("/", async (req, res)=>{
    
    mysqlConnection.getConnection(function(err, connection) {
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

router.get("/phoneBrands", async (req, res)=>{
    
    mysqlConnection.getConnection(function(err, connection) {
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

router.post("/insertbrand/", isAuth, isAdmin, async (req,res,next) =>{
  
    mysqlConnection.getConnection(function(err, connection){
      if (err) throw err; // not connected!
      /* Begin transaction */
      connection.beginTransaction(function(err) {
        if (err) { throw err; }
  
        let sql = "INSERT INTO phone_brands (brand) VALUES (?)";
        connection.query(sql, [req.body.brand], function(err, result, fields) {
          if (err) { 
            connection.rollback(function() {
              throw err;
            });
          }
      
          sql="SELECT * FROM phone_brands ORDER BY brand";
          connection.query(sql, function(err, result) {
            if (err) { 
              connection.rollback(function() {
                throw err;
              });
            }
            console.log("Read phone brands succeed");
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
  
router.post("/phoneModels", isAuth, isAdmin, async (req, res)=>{

    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        var sql='SELECT * FROM phone_models WHERE phone_brand_id=? ORDER BY model';
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

router.post("/insertphonemodel/", isAuth, isAdmin, async (req,res,next) =>{
  
    mysqlConnection.getConnection(function(err, connection){
      if (err) throw err; // not connected!
      /* Begin transaction */
      connection.beginTransaction(function(err) {
        if (err) { throw err; }
  
        let sql = "INSERT INTO phone_models (phone_brand_id, model) VALUES (?, ?)";
        connection.query(sql, [req.body.brandId, req.body.model], function(err, result, fields) {
          if (err) { 
            connection.rollback(function() {
              throw err;
            });
          }
      
          sql="SELECT * FROM phone_models WHERE phone_brand_id=? ORDER BY model ";
          connection.query(sql,[req.body.brandId], function(err, result) {
            if (err) { 
              connection.rollback(function() {
                throw err;
              });
            }
            console.log("Read phone brands succeed");
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


export default router;