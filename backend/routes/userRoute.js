import express from 'express';
import { getToken, isAuth } from '../util.js';
import mysqlConnection from '../connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

const router= express.Router();

router.get("/", (req, res)=>{
    
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query('SELECT * FROM users', function (err, result, fields) {
        if (err) throw err;
        console.log("Read user succeed");
        res.send(result);
        connection.release();

        // Handle error after the release.
        if (err) throw err;
        })
    });
})

router.get("/createadmin", async (req, res)=>{
    try{
        mysqlConnection.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
    
            bcrypt.hash("TryGra20#@", 10, (err, hash) => {
                // Store hash in your password DB.
                var sql = "INSERT INTO users (username, email, password, isAdmin) VALUES ('grand', 'grandmobile@grandmobile.gr',?, 1)";
                connection.query(sql,[hash], function (err, result, fields) {
                if (err) throw err;
                console.log("1 record inserted");
                res.send(result);
                connection.release();
        
                // Handle error after the release.
                if (err) throw err;
                })
            })
        });
    }
    catch(error){
        res.send({message: error.message});
    }
})

router.post("/signin", async (req, res) =>{

    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        var sql = "SELECT password FROM users WHERE email=? LIMIT 1";
        connection.query(sql, [req.body.email],function (err, result, fields) {
            if (err) throw err;
            
            if(result.length!==0){
                let hash=result[0].password;
                bcrypt.compare(req.body.password, hash, function(err, response) {
                    if(response===true)
                    {
                        sql = "SELECT username,email,isAdmin,name,subname,phoneNumber FROM users WHERE email=? AND password=?";
                        connection.query(sql, [req.body.email,hash],function (err, result, fields) {
                        if (err) throw err;
                        
                            console.log("Query executed successfully");
                            Object.keys(result).forEach(function(key) {
                                var row = result[key];
                                const user = {
                                    username: row.username,
                                    email: row.email,
                                    isAdmin: row.isAdmin
                                };

                                res.send({
                                    username: row.username,
                                    email: row.email,
                                    isAdmin: row.isAdmin,
                                    token: getToken(user)
                                })
                            });            
                        
                        // Handle error after the release.
                        if (err) throw err;
                        })
                    }
                    else{
                        res.status(401).send({message:'Λάθος password'});
                    }
                });
            }
            else{
                res.status(401).send({message:'Δεν υπάρχει εγγραφή με αυτό το email!'});
            }
        })
    });
})
 
router.post("/register", async (req, res) =>{

    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "SELECT email FROM users WHERE email=?";
        connection.query(sql, [req.body.email], function (err, result, fields) {
            if (err) throw err;

            if(Object.keys(result).length!==0){
                res.status(401).send({message:'Υπάρχει ήδη καταχώρηση με αυτό το email', success:false});                       
            }
            else{
                /* Begin transaction */
                connection.beginTransaction(function(err) {
                    if (err) { throw err; }

                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                            // Store hash in your password DB.
                   
                            sql = "INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?,?, 0)";
                            connection.query(sql, [req.body.name,req.body.email,hash], function(err, result, fields) {
                            if (err) { 
                                connection.rollback(function() {
                                throw err;
                                });
                            }
                    
                              
                                sql = "INSERT INTO addresses (user_email,user_id) VALUES (?,?)";
                                connection.query(sql, [req.body.email,req.body.email], function(err, result, fields) {
                                    if (err) { 
                                    connection.rollback(function() {
                                        throw err;
                                    });
                                    }

                                    sql = "SELECT * FROM users WHERE email=?";
                                    connection.query(sql, [req.body.email], function(err, result, fields) {
                                        if (err) { 
                                        connection.rollback(function() {
                                            throw err;
                                        });
                                        }

                                        if(Object.keys(result).length!==0){
                                            Object.keys(result).forEach(function(key) {
                                                var row = result[key];
                                                const user = {
                                                    username: row.username,
                                                    email: row.email,
                                                    isAdmin: row.isAdmin
                                                };
                                
                                                res.send({
                                                    username: row.username,
                                                    email: row.email,
                                                    isAdmin: row.isAdmin,
                                                    token: getToken(user),
                                                    success:true
                                                })
                                            });
                                        }
                                    
                                        connection.commit(function(err) {
                                        if (err) { 
                                            connection.rollback(function() {
                                            throw err;
                                            });
                                        }
                                        console.log('Transaction Completed Successfully.');
                                        });
                                    });
                                });
                            });
                        
                    });
                });
                /* End transaction */
                    
                    sql = "SELECT * FROM users WHERE email=?";
                    connection.query(sql, [req.body.email], function (err, result, fields) {
                    if (err) throw err;
                    
                    console.log("Query executed successfully");
                    
                });
        
            }
        });

        
        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
});

router.put("/accountInfo", isAuth, async (req,res) =>{ 
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "UPDATE addresses SET name=?, subname=?, phoneNumber=?,country=?, district=?, city=?, street=?, postalCode=? WHERE user_id=?";
        connection.query(sql, [req.body.name,req.body.subname,req.body.phoneNumber,req.body.country,
            req.body.district,req.body.city,req.body.address,req.body.postalCode,req.body.email], function (err, result, fields) {
            if (err) throw err;
    
            res.status(200).send({message:"Οι αλλαγές αποθηκεύτηκαν"})
        });

        connection.release();
        // Handle error after the release.
        if (err) throw err;
    });            
});
                
router.post("/accountInfo", isAuth, async (req,res) =>{ 
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "SELECT * FROM addresses WHERE user_id=?";
        connection.query(sql,[req.body.email], function (err, result, fields) {
            if (err) throw err;
    
            if(Object.keys(result).length!==0){
                Object.keys(result).forEach(function(key) {
                    var row = result[key];
                        
                    res.send({
                        name: row.name,
                        subname: row.subname,
                        phoneNumber: row.phoneNumber,
                        country: row.country,
                        district: row.district,
                        city: row.city,
                        email: row.user_email,
                        address: row.street,
                        postalCode: row.postalCode,
                        companyName:row.companyName,
                        bussiness:row.bussiness,
                        afm:row.afm,
                        doy:row.doy,
                        success:true
                    })
                });
            }
        });
        connection.release();
        // Handle error after the release.
        if (err) throw err;
    });            
});

router.put("/changePassword", isAuth, async (req,res,next) =>{
  
    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        var sql = "SELECT password FROM users WHERE email=? LIMIT 1";
        connection.query(sql, [req.body.email],function (err, result, fields) {
            if (err) throw err;
            
            if(result.length!==0){
                let hash=result[0].password;
                bcrypt.compare(req.body.password, hash, function(err, response) {
                    if(response===true)
                    {
                        bcrypt.hash(req.body.newPassword, 10, (err, newhash) => {
                            sql = "UPDATE users SET password=? WHERE email=?";
                            connection.query(sql, [newhash, req.body.email],function (err, result, fields) {
                                if (err) throw err;
                            
                                console.log("Query executed successfully");
                                res.status(201).send({message:'Ο κωδικός άλλαξε επιτυχώς'});
                            })
                        })
                    }
                    else{
                        res.status(401).send({message:'Λάθος password'});
                    }
                });
            }
            else{
                res.status(401).send({message:'Δεν υπάρχει εγγραφή με αυτό το email!'});
            }
            connection.release();
            // Handle error after the release.
            if (err) throw err;
        })
    });

})

router.post("/addForNewsletter", async (req, res) =>{

    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "SELECT email FROM newsletters WHERE email=?";
        connection.query(sql, [req.body.email], function (err, result, fields) {
            if (err) throw err;

            if(Object.keys(result).length!==0){
                console.log("email already existed");
                res.send({message:'email already existed', success:false});                       
            }
            else{              
                sql = "INSERT INTO newsletters (email) VALUES (?)";
                connection.query(sql, [req.body.email], function (err, result, fields) {
                if (err) throw err;
                
                console.log("Query executed successfully");
                res.status(200).send({message:'Email inserted Successfully', success:true});
                })
            }
        });

        
        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
});

router.post("/removeFromNewsletter", async (req, res) =>{

    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "SELECT * FROM newsletters WHERE email=?";
        connection.query(sql, [req.body.email], function (err, result, fields) {
            if (err) throw err;

            if(Object.keys(result).length===0)
            {
                res.send({message:'No such email exists', success:false});                       
            }
            else{
                let sql = "DELETE FROM newsletters WHERE email=?";
                connection.query(sql, [req.body.email], function (err, result, fields) {
                if (err) throw err;

                res.send({message:'email deleted successfully', success:true})
                });
            }

        })
        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
});

router.post("/updatepassword", async (req,res) =>{
  
    mysqlConnection.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
  
      var sql ='SELECT * FROM users WHERE email=?';
      connection.query(sql, [req.body.email], function (err, result, fields) {
        if (err) throw err;
      
        if(Object.keys(result).length===0){
          console.log("User not found");
          res.status(404).send({message:'Δεν βρέθηκε χρήστης με αυτό το email!'});          
        }
        else
        {
            jwt.verify(req.body.token, config.JWT_SECRET, (err, decode)=>{
                if(err)
                {
                    return res.status(403).send({msg: 'Ο σύνδεσμος που χρησιμοποιήσατε έχει λήξει\n Παρακαλώ επαναλάβετε τη διαδικασία επανάκτησης του κωδικού.'});
                }
                if(decode.username===result.username && decode.password===result.password)
                {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        var sql = 'UPDATE users SET password=? WHERE email=?';
                        connection.query(sql, [hash,req.body.email], function (err, result, fields) {
                        if (err) throw err;
                
                        res.status(200).send({message:"Password Updated"})
                        });

                    })
                }
            })
            
        }
      });   
      
      connection.release();
  
      // Handle error after the release.
      if (err) throw err;
    });
})

router.post("/deleteAccount", isAuth, async (req, res) =>{

    mysqlConnection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        let sql = "SELECT email FROM users WHERE email=?";
        connection.query(sql, [req.body.email], function (err, result, fields) {
            if (err) throw err;

            if(Object.keys(result).length===0){
                console.log("No user with this email existed");
                res.send({message:'No user with this email existed', success:false});                       
            }
            else{
                /* Begin transaction */
                connection.beginTransaction(function(err) {
                    if (err) { throw err; }

                    let sql = "DELETE FROM wishlists WHERE user_email=?";
                        connection.query(sql, [req.body.email], function(err, result, fields) {
                            if (err) { 
                                connection.rollback(function() {
                                throw err;
                                });
                            }
                            sql = "DELETE FROM cart WHERE user_email=?";
                            connection.query(sql, [req.body.email], function(err, result, fields) {
                                if (err) { 
                                    connection.rollback(function() {
                                    throw err;
                                    });
                                }
                                sql = "UPDATE addresses SET user_id='' WHERE user_email=?";
                                connection.query(sql, [req.body.email], function(err, result, fields) {
                                if (err) { 
                                    connection.rollback(function() {
                                    throw err;
                                    });
                                }
                                    sql = "DELETE FROM users WHERE email=?";
                                    connection.query(sql, [req.body.email], function(err, result, fields) {
                                    if (err) { 
                                        connection.rollback(function() {
                                        throw err;
                                        });
                                    }
                                    res.status(200).send({message:'Account deleted successfully', success:true})
                                    connection.commit(function(err) {
                                        if (err) { 
                                            connection.rollback(function() {
                                            throw err;
                                            });
                                        }
                                    })
                                })
                            })
                        })
                    })

                });
                /* End transaction */
            }
        });

        
        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
});


export default router;