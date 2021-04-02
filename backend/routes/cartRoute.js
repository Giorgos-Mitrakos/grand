import express from 'express';
import multer from 'multer';
import { isAuth } from '../util.js';
import mysqlConnection from '../connection';
const fs = require('fs');

const router= express.Router();

const storageB = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'frontend/public/images/makeyourcase')
    },
    filename: (req, file, cb) => {
      const fileName = Date.now()  + '-' + req.body.model.replace(/ /g,"-") + '-' + req.body.email+  '-' + file.originalname;
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

const uploadCaseImage = multer({ storage: storageB, fileFilter: fileFilter });

router.post("/insert_item", isAuth, async (req,res) =>{ 
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "INSERT INTO cart (user_email, product_id, model, quantity) VALUES (?,?,?,?)";
        connection.query(sql, [req.body.email, req.body.product_id, req.body.model, req.body.qty], function (err, result, fields) {
                if( err & err != "ER_DUP_ENTRY" ){
                    
            }

        })
          
        sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.price, products.countInStock, cart.model, cart.quantity FROM products LEFT JOIN cart ON products._id = cart.product_id WHERE cart.user_email=?";
        connection.query(sql, [req.body.email], function(err, result) {
            if (err) throw err;
            res.send(result);
        });

        
        
        connection.release();
        // Handle error after the release.
        if (err) throw err;
         
    });

});

router.post("/insert_image_case_item", isAuth, uploadCaseImage.single('image'), async (req,res,next) =>{
    mysqlConnection.getConnection(function(err, connection){
        if (err) throw err; // not connected!
    
        /* Begin transaction */
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
    
            let sql = "SELECT products._id FROM products WHERE products.category='Φτιάξε τη Θήκη σου'";
            connection.query(sql, function(err, result, fields) {
            if (err) { 
                connection.rollback(function() {
                throw err;
                });
            }

            var productId=result[0]._id;
        
            sql = "INSERT INTO cart (product_id,user_email, model, quantity, image_case) VALUES (?, ?, ?, ?, ?)";
                connection.query(sql, [productId, req.body.email, req.body.model, req.body.qty, req.file.path.slice(15,req.file.path.length)],
                function (err, result, fields) {
                    if( err & err != "ER_DUP_ENTRY" ){
                        connection.rollback(function() {
                        throw err;
                    });
                }
                
                sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.price, products.countInStock, cart.model, cart.quantity, cart.image_case FROM products LEFT JOIN cart ON products._id = cart.product_id WHERE cart.user_email=?";
                    connection.query(sql, [req.body.email], function(err, result) {
                        if (err) throw err;
                        res.send(result);
                    

                    connection.commit(function(err) {
                    if (err) { 
                        connection.rollback(function() {
                        throw err;
                        });
                    }
                    
                    connection.release();
                    });
                });
            });
            });
        });
        /* End transaction */
    })   
  })

router.post("/update_item", isAuth, async (req,res) =>{ 
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "UPDATE cart SET model=?, quantity=? WHERE user_email=? && cart_id=?";
        connection.query(sql, [req.body.model, req.body.qty, req.body.user_email, req.body.cart_id], function (err, result, fields) {
            if (err) throw err;

        })

        sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.totalPrice, products.countInStock, products.percentage, cart.cart_id, cart.model, cart.quantity, cart.image_case FROM cart LEFT JOIN products ON cart.product_id = products._id WHERE cart.user_email=?";
        connection.query(sql, [req.body.user_email], function(err, result) {
            if (err) throw err;
            
            res.send(result);
        });
               
        
        connection.release();
        // Handle error after the release.
        if (err) throw err;
         
    });

});

router.post("/remove_item", isAuth, async (req,res) =>{ 
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        if(req.body.image_case)
        {
            fs.unlink("frontend/public"+req.body.image_case, (err) => {
                if (err) throw err;
                
            });
        }

        let sql = "DELETE FROM cart WHERE cart_id=?";
        connection.query(sql, [req.body.cart_id], function (err, result, fields) {
            if (err) throw err;
            
        })

        sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.totalPrice, products.countInStock,cart.cart_id, cart.model, cart.quantity, cart.image_case FROM cart INNER JOIN products ON cart.product_id = products._id WHERE cart.user_email=?";
        connection.query(sql, [req.body.user_email], function(err, result) {
            if (err) throw err;
            
            res.send(result);
        });
        
        connection.release();
        // Handle error after the release.
        if (err) throw err;
         
    });
});

router.post("/get_cart", isAuth, async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.totalPrice, products.countInStock, products.percentage, cart.cart_id, cart.model, cart.quantity, cart.image_case FROM cart LEFT JOIN products ON cart.product_id = products._id WHERE cart.user_email=?";
        connection.query(sql, [req.body.user_email], function(err, result) {
            if (err) throw err;
            res.send(result);
        });
        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
})

export default router;