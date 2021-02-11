import express from 'express';
import { getToken, isAuth } from '../util.js';
import mysqlConnection from '../connection';

const router= express.Router();

router.post("/additem", isAuth, async (req,res) =>{ 
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "INSERT INTO wishlists (user_email, product_id, model) VALUES (?,?,?)";
        connection.query(sql, [req.body.user_email,req.body.product_id,req.body.model], function (err, result, fields) {
            if( err & err != "ER_DUP_ENTRY" ){
                console.log("Entry is already");
            }
        })
                
        sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.price FROM wishlists INNER JOIN products ON wishlists.product_id = products._id WHERE wishlists.user_email=?";
        connection.query(sql, [req.body.user_email], function(err, result) {
            if (err) throw err;

            res.send(result);
        });

        connection.release();
        // Handle error after the release.
        if (err) throw err;
         
    });

});

router.post("/removeitem", isAuth, async (req,res) =>{ 
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "DELETE FROM wishlists WHERE user_email=? && product_id=?";
        connection.query(sql, [req.body.user_email,req.body.product_id], function (err, result, fields) {
            if (err) throw err;

            res.status(200).send({message:"Product deleted from wishlist"});
        })
    });

    connection.release();
        // Handle error after the release.
        if (err) throw err;
    
});

router.post("/getwishlist", isAuth, async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "SELECT products._id, products.name, products.category, products.brand, products.image, products.description, products.price FROM wishlists INNER JOIN products ON wishlists.product_id = products._id WHERE wishlists.user_email=?";
        connection.query(sql,[req.body.user_email], function (err, result, fields) {
        if (err) throw err;
        console.log("Read products succeed");
        res.send(result);
        connection.release();

        // Handle error after the release.
        if (err) throw err;
        })
    });
})

router.post("/movetocart", isAuth, async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        /* Begin transaction */
        connection.beginTransaction(function(err) {
            if (err) { throw err; }

            var sql = "INSERT INTO cart (user_email, product_id, model, quantity) VALUES (?, ?, ?, 1)";
            connection.query(sql, [req.body.user_email, req.body.product_id, req.body.model], function(err, result) {
                if( err & err != "ER_DUP_ENTRY" ){
                    console.log("Entry is already");
                }
                
                sql = "DELETE FROM wishlists WHERE user_email=? && product_id=? && model=?";
                connection.query(sql, [req.body.user_email, req.body.product_id, req.body.model], function(err, result) {
                    if (err) { 
                    connection.rollback(function() {
                        throw err;
                    });
                    }
                    
                    connection.commit(function(err) {
                    if (err) { 
                        connection.rollback(function() {
                        throw err;
                        });
                    }
                    console.log('Transaction Completed Successfully.');
                    res.status(200).send("Transaction Completed Successfully.")
                    
                    connection.release();
                    });
                });
            });
        });
    /* End transaction */
    })
});

export default router;