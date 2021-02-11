import express from 'express';
import { getToken, isAuth, isAdmin } from '../util.js';
import mysqlConnection from '../connection';

const router= express.Router();

router.get("/sendingmethods", async (req, res)=>{
    
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

router.post("/paymentmethods", async (req, res) =>{
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "SELECT paymentMethod,paymentMethodCost FROM paymentMethods WHERE sendingMethod_id=?";
        connection.query(sql, [req.body.sendingMethodId], function(err, result) {
            if (err) throw err;
            
            res.send(result);
        });
        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
})


export default router;