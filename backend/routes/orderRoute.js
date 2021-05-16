import express from 'express';
import { getToken, isAuth, isAdmin } from '../util.js';
import mysqlConnection from '../connection';

const router = express.Router();

router.post("/insert_order_company_shippingTo", isAuth, async (req, res) => {

    mysqlConnection.getConnection(function (err, connection) {
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            let sql = "UPDATE addresses SET name=?, subname=?, phoneNumber=?,country=?, district=?, city=?, street=?, postalCode=?, companyName=?, bussiness=?, doy=?, afm=? WHERE user_id=?";
            connection.query(sql, [req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country,
            req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode,
            req.body.company.companyName, req.body.company.bussiness, req.body.company.doy, req.body.company.afm, req.body.charger.email], function (err, result, fields) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                let sql = "Select address_id FROM addresses WHERE user_id=?";
                connection.query(sql, [req.body.charger.email], function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    const chargerAddress_id = result[0].address_id;

                    sql = "INSERT INTO addresses (name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.phoneNumber, req.body.shippingTo.country,
                    req.body.shippingTo.district, req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.postalCode], function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        const shippingAddress_id = result.insertId;

                        sql = "INSERT INTO orders (user_email, billingAddress, shippingAddress, paymentType, paymentMethod, paymentMethodPrice, sendingMethod,shippingPrice, comments, itemsPrice, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [req.body.charger.email, chargerAddress_id, shippingAddress_id, req.body.methods.typeOfPayment,
                        req.body.methods.paymentMethod, req.body.methods.paymentMethodCost, req.body.methods.sendingMethod, req.body.methods.sendingMethodCost, req.body.methods.comments, req.body.itemsCost, req.body.charger.email], function (err, result) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            const order_id = result.insertId;

                            sql = "INSERT INTO ordersendingpaymenthistory (order_id, sendingMethod, paymentMethod, paymentType, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?)";
                            connection.query(sql, [order_id, req.body.methods.sendingMethod, req.body.methods.paymentMethod, req.body.methods.typeOfPayment, req.user.email, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                sql = "INSERT INTO billingAddressHistory (order_id, companyName, bussiness, afm, doy, country, district, city, street, phoneNumber, postalCode, comments, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                connection.query(sql, [order_id, req.body.company.companyName, req.body.company.bussiness, req.body.company.afm, req.body.company.doy, req.body.charger.country, req.body.charger.district,
                                    req.body.charger.city, req.body.charger.address, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.charger.comments, req.user.username, new Date], function (err, result, fields) {
                                        if (err) {
                                            connection.rollback(function () {
                                                throw err;
                                            });
                                        }

                                        sql = "INSERT INTO shippingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                        connection.query(sql, [order_id, req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.country, req.body.shippingTo.district,
                                            req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.phoneNumber, req.body.shippingTo.postalCode, req.user.username, new Date], function (err, result, fields) {
                                                if (err) {
                                                    connection.rollback(function () {
                                                        throw err;
                                                    });
                                                }

                                                sql = "INSERT INTO order_products (order_id, product_id, model, quantity, image_case) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case FROM cart WHERE user_email=?";
                                                connection.query(sql, [order_id, req.body.charger.email], function (err, result) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            throw err;
                                                        });
                                                    }

                                                    sql = "INSERT INTO orderProductHistory (order_id, product_id, model, quantity, image_case, UpdatedBy, UpdatedAt, actions) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case, ?, ?, ? FROM cart WHERE user_email=?";
                                                    connection.query(sql, [order_id, req.body.charger.email, new Date, "Αρχική Παραγγελία", req.body.charger.email], function (err, result) {
                                                        if (err) {
                                                            connection.rollback(function () {
                                                                throw err;
                                                            });
                                                        }

                                                        sql = "DELETE FROM cart WHERE user_email=?";
                                                        connection.query(sql, [req.body.charger.email], function (err, result) {
                                                            if (err) {
                                                                connection.rollback(function () {
                                                                    throw err;
                                                                });
                                                            }

                                                            connection.commit(function (err) {
                                                                if (err) {
                                                                    connection.rollback(function () {
                                                                        throw err;
                                                                    });
                                                                }
                                                                console.log('Transaction Completed Successfully.');
                                                                var response = { order_id }
                                                                res.status(200).send(response);
                                                            });
                                                        });
                                                    });
                                                });
                                            })
                                    });
                            });
                        });
                    });
                });
            });
            connection.release();
            // Handle error after the release.
            if (err) throw err;
        });
        /* End transaction */
    });
});

router.post("/insert_no_user_order_company_shippingTo", async (req, res) => {

    mysqlConnection.getConnection(function (err, connection) {
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            let sql = "INSERT INTO addresses (user_email, name, subname, phoneNumber, country, district, city, street, postalCode, companyName, bussiness, afm, doy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [req.body.charger.email, req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country,
            req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode,
            req.body.company.companyName, req.body.company.bussiness, req.body.company.afm, req.body.company.doy], function (err, result, fields) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                const chargerAddress_id = result.insertId;

                sql = "INSERT INTO addresses (name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.phoneNumber, req.body.shippingTo.country,
                req.body.shippingTo.district, req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.postalCode], function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    const shippingAddress_id = result.insertId;

                    sql = "INSERT INTO orders (user_email, billingAddress, shippingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice,shippingPrice ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.charger.email, chargerAddress_id, shippingAddress_id, req.body.methods.typeOfPayment,
                    req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments,
                    req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost], function (err, result) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        const order_id = result.insertId;

                        sql = "INSERT INTO ordersendingpaymenthistory (order_id, sendingMethod, paymentMethod, paymentType, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [order_id, req.body.methods.sendingMethod, req.body.methods.paymentMethod, req.body.methods.typeOfPayment, req.body.charger.email, new Date], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            sql = "INSERT INTO billingAddressHistory (order_id, companyName, bussiness, afm, doy, country, district, city, street, phoneNumber, postalCode, comments, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                            connection.query(sql, [order_id, req.body.company.companyName, req.body.company.bussiness, req.body.company.afm, req.body.company.doy, req.body.charger.country, req.body.charger.district,
                                req.body.charger.city, req.body.charger.address, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.charger.comments, req.body.charger.email, new Date], function (err, result, fields) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }

                                    sql = "INSERT INTO shippingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                    connection.query(sql, [order_id, req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.country, req.body.shippingTo.district,
                                        req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.phoneNumber, req.body.shippingTo.postalCode, req.body.charger.email, new Date], function (err, result, fields) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    throw err;
                                                });
                                            }

                                            const mapCartItems = req.body.cartItems.map(x => {
                                                let rObj = [];
                                                rObj[0] = order_id;
                                                rObj[1] = x._id;
                                                rObj[2] = x.model;
                                                rObj[3] = x.quantity;
                                                return rObj
                                            })

                                            sql = "INSERT INTO order_products (order_id,product_id,model,quantity) VALUES ?"
                                            connection.query(sql, [mapCartItems], function (err, result) {
                                                if (err) {
                                                    connection.rollback(function () {
                                                        throw err;
                                                    });
                                                }

                                                const mapCartItemsHistory = req.body.cartItems.map(x => {
                                                    let rObj = [];
                                                    rObj[0] = order_id;
                                                    rObj[1] = x._id;
                                                    rObj[2] = x.model;
                                                    rObj[3] = x.quantity;
                                                    rObj[4] = req.body.charger.email;
                                                    rObj[5] = new Date;
                                                    rObj[6] = "Αρχική Παραγγελία";
                                                    return rObj
                                                })

                                                sql = "INSERT INTO orderProductHistory (order_id, product_id, model, quantity, UpdatedBy, UpdatedAt, actions) VALUES ?";
                                                connection.query(sql, [mapCartItemsHistory], function (err, result) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            throw err;
                                                        });
                                                    }

                                                    connection.commit(function (err) {
                                                        if (err) {
                                                            connection.rollback(function () {
                                                                throw err;
                                                            });
                                                        }
                                                        console.log('Transaction Completed Successfully.');
                                                        var response = { order_id }
                                                        res.status(200).send(response);
                                                    });
                                                });
                                            });
                                        })
                                });
                        });
                    });
                });
            });
            connection.release();
            // Handle error after the release.
            if (err) throw err;
        });
        /* End transaction */
    });
});

router.post("/insert_order_company", isAuth, async (req, res) => {

    mysqlConnection.getConnection(function (err, connection) {
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            let sql = "UPDATE addresses SET name=?, subname=?, phoneNumber=?, country=?, district=?, city=?, street=?, postalCode=?, companyName=?, bussiness=?, doy=?, afm=? WHERE user_id=?";
            connection.query(sql, [req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country,
            req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode,
            req.body.company.companyName, req.body.company.bussiness, req.body.company.doy, req.body.company.afm, req.body.charger.email], function (err, result, fields) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                let sql = "Select address_id FROM addresses WHERE user_id=?";
                connection.query(sql, [req.body.charger.email], function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    const chargerAddress_id = result[0].address_id;

                    sql = "INSERT INTO orders (user_email, billingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.charger.email, chargerAddress_id, req.body.methods.typeOfPayment,
                    req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments,
                    req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost, req.body.charger.email], function (err, result) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        const order_id = result.insertId;

                        sql = "INSERT INTO ordersendingpaymenthistory (order_id, sendingMethod, paymentMethod, paymentType, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [order_id, req.body.methods.sendingMethod, req.body.methods.paymentMethod, req.body.methods.typeOfPayment, req.user.email, new Date], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            sql = "INSERT INTO billingAddressHistory (order_id, companyName, bussiness, afm, doy, country, district, city, street, phoneNumber, postalCode, comments, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                            connection.query(sql, [order_id, req.body.company.companyName, req.body.company.bussiness, req.body.company.afm, req.body.company.doy, req.body.charger.country, req.body.charger.district,
                                req.body.charger.city, req.body.charger.address, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.charger.comments, req.user.username, new Date], function (err, result, fields) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }

                                    sql = "INSERT INTO order_products (order_id, product_id, model, quantity, image_case) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case FROM cart WHERE user_email=?";
                                    connection.query(sql, [order_id, req.body.charger.email], function (err, result) {
                                        if (err) {
                                            connection.rollback(function () {
                                                throw err;
                                            });
                                        }

                                        sql = "INSERT INTO orderProductHistory (order_id, product_id, model, quantity, image_case, UpdatedBy, UpdatedAt, actions) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case, ?, ?, ? FROM cart WHERE user_email=?";
                                        connection.query(sql, [order_id, req.body.charger.email, new Date, "Αρχική Παραγγελία", req.body.charger.email], function (err, result) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    throw err;
                                                });
                                            }

                                            sql = "DELETE FROM cart WHERE user_email=?";
                                            connection.query(sql, [req.body.charger.email], function (err, result) {
                                                if (err) {
                                                    connection.rollback(function () {
                                                        throw err;
                                                    });
                                                }

                                                connection.commit(function (err) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            throw err;
                                                        });
                                                    }
                                                    console.log('Transaction Completed Successfully.');
                                                    var response = { order_id }
                                                    res.status(200).send(response);
                                                });
                                            });
                                        });
                                    });
                                });
                        })
                    });
                });
            });
            connection.release();
            // Handle error after the release.
            if (err) throw err;
        });
        /* End transaction */
    });
});

router.post("/insert_no_user_order_company", async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            let sql = "INSERT INTO addresses (user_email, name, subname, phoneNumber,country, district, city, street, postalCode, companyName, bussiness, afm, doy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [req.body.charger.email, req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country,
            req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode,
            req.body.company.companyName, req.body.company.bussiness, req.body.company.afm, req.body.company.doy], function (err, result, fields) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                const chargerAddress_id = result.insertId;

                sql = "INSERT INTO orders (user_email, billingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [req.body.charger.email, chargerAddress_id, req.body.methods.typeOfPayment,
                req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments,
                req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost], function (err, result) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    const order_id = result.insertId;

                    sql = "INSERT INTO ordersendingpaymenthistory (order_id, sendingMethod, paymentMethod, paymentType, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [order_id, req.body.methods.sendingMethod, req.body.methods.paymentMethod, req.body.methods.typeOfPayment, req.body.charger.email, new Date], function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        sql = "INSERT INTO billingAddressHistory (order_id, companyName, bussiness, afm, doy, country, district, city, street, phoneNumber, postalCode, comments, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [order_id, req.body.company.companyName, req.body.company.bussiness, req.body.company.afm, req.body.company.doy, req.body.charger.country, req.body.charger.district,
                            req.body.charger.city, req.body.charger.address, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.charger.comments, req.body.charger.email, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                const mapCartItems = req.body.cartItems.map(x => {
                                    let rObj = [];
                                    rObj[0] = order_id;
                                    rObj[1] = x._id;
                                    rObj[2] = x.model;
                                    rObj[3] = x.quantity;
                                    return rObj
                                })

                                sql = "INSERT INTO order_products (order_id,product_id,model,quantity) VALUES ?"
                                connection.query(sql, [mapCartItems], function (err, result) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }

                                    const mapCartItemsHistory = req.body.cartItems.map(x => {
                                        let rObj = [];
                                        rObj[0] = order_id;
                                        rObj[1] = x._id;
                                        rObj[2] = x.model;
                                        rObj[3] = x.quantity;
                                        rObj[4] = req.body.charger.email;
                                        rObj[5] = new Date;
                                        rObj[6] = "Αρχική Παραγγελία";
                                        return rObj
                                    })

                                    sql = "INSERT INTO orderProductHistory (order_id, product_id, model, quantity, UpdatedBy, UpdatedAt, actions) VALUES ?";
                                    connection.query(sql, [mapCartItemsHistory], function (err, result) {
                                        if (err) {
                                            connection.rollback(function () {
                                                throw err;
                                            });
                                        }

                                        connection.commit(function (err) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    throw err;
                                                });
                                            }
                                            console.log('Transaction Completed Successfully.');
                                            var response = { order_id }
                                            res.status(200).send(response);
                                        });
                                    });
                                });
                            });
                    })
                });
            });
            connection.release();
            // Handle error after the release.
            if (err) throw err;
        });
        /* End transaction */
    });
});

router.post("/insert_order_shippingTo", isAuth, async (req, res) => {

    mysqlConnection.getConnection(function (err, connection) {
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            let sql = "UPDATE addresses SET name=?, subname=?, phoneNumber=?,country=?, district=?, city=?, street=?, postalCode=? WHERE user_id=?";
            connection.query(sql, [req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country,
            req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode, req.body.charger.email], function (err, result, fields) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                let sql = "Select address_id FROM addresses WHERE user_id=?";
                connection.query(sql, [req.body.charger.email], function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    const chargerAddress_id = result[0].address_id;

                    sql = "INSERT INTO addresses (name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.phoneNumber, req.body.shippingTo.country,
                    req.body.shippingTo.district, req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.postalCode], function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        const shippingAddress_id = result.insertId;

                        sql = "INSERT INTO orders (user_email, billingAddress, shippingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [req.body.charger.email, chargerAddress_id, shippingAddress_id, req.body.methods.typeOfPayment,
                        req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments,
                        req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost, req.body.charger.email], function (err, result) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            const order_id = result.insertId;

                            sql = "INSERT INTO ordersendingpaymenthistory (order_id, sendingMethod, paymentMethod, paymentType, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?)";
                            connection.query(sql, [order_id, req.body.methods.sendingMethod, req.body.methods.paymentMethod, req.body.methods.typeOfPayment, req.user.email, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                sql = "INSERT INTO billingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, comments, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                connection.query(sql, [order_id, req.body.charger.name, req.body.charger.subname, req.body.charger.country, req.body.charger.district,
                                    req.body.charger.city, req.body.charger.address, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.methods.comments, req.body.charger.email, new Date], function (err, result, fields) {
                                        if (err) {
                                            connection.rollback(function () {
                                                throw err;
                                            });
                                        }

                                        sql = "INSERT INTO shippingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                        connection.query(sql, [order_id, req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.country, req.body.shippingTo.district,
                                            req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.phoneNumber, req.body.shippingTo.postalCode, req.user.username, new Date], function (err, result, fields) {
                                                if (err) {
                                                    connection.rollback(function () {
                                                        throw err;
                                                    });
                                                }

                                                sql = "INSERT INTO order_products (order_id, product_id, model, quantity, image_case) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case FROM cart WHERE user_email=?";
                                                connection.query(sql, [order_id, req.body.charger.email], function (err, result) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            throw err;
                                                        });
                                                    }

                                                    sql = "INSERT INTO orderProductHistory (order_id, product_id, model, quantity, image_case, UpdatedBy, UpdatedAt, actions) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case, ?, ?, ? FROM cart WHERE user_email=?";
                                                    connection.query(sql, [order_id, req.body.charger.email, new Date, "Αρχική Παραγγελία", req.body.charger.email], function (err, result) {
                                                        if (err) {
                                                            connection.rollback(function () {
                                                                throw err;
                                                            });
                                                        }

                                                        sql = "DELETE FROM cart WHERE user_email=?";
                                                        connection.query(sql, [req.body.charger.email], function (err, result) {
                                                            if (err) {
                                                                connection.rollback(function () {
                                                                    throw err;
                                                                });
                                                            }

                                                            connection.commit(function (err) {
                                                                if (err) {
                                                                    connection.rollback(function () {
                                                                        throw err;
                                                                    });
                                                                }
                                                                console.log('Transaction Completed Successfully.');
                                                                var response = { order_id }
                                                                res.status(200).send(response);
                                                            });
                                                        });
                                                    });
                                                });
                                            })
                                    })
                            })
                        });
                    });
                });
            });
            connection.release();
            // Handle error after the release.
            if (err) throw err;
        });
        /* End transaction */
    });
});

router.post("/insert_no_user_order_shippingTo", async (req, res) => {

    mysqlConnection.getConnection(function (err, connection) {
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            let sql = "INSERT INTO addresses (user_email, name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [req.body.charger.email, req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country,
            req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode], function (err, result, fields) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                const chargerAddress_id = result.insertId;

                sql = "INSERT INTO addresses (name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.phoneNumber, req.body.shippingTo.country,
                req.body.shippingTo.district, req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.postalCode], function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    const shippingAddress_id = result.insertId;

                    sql = "INSERT INTO orders (user_email, billingAddress, shippingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.charger.email, chargerAddress_id, shippingAddress_id, req.body.methods.typeOfPayment,
                    req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments,
                    req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost], function (err, result) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        const order_id = result.insertId;

                        sql = "INSERT INTO ordersendingpaymenthistory (order_id, sendingMethod, paymentMethod, paymentType, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [order_id, req.body.methods.sendingMethod, req.body.methods.paymentMethod, req.body.methods.typeOfPayment, req.body.charger.email, new Date], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            sql = "INSERT INTO billingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, comments, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                            connection.query(sql, [order_id, req.body.charger.name, req.body.charger.subname, req.body.charger.country, req.body.charger.district,
                                req.body.charger.city, req.body.charger.address, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.methods.comments, req.body.charger.email, new Date], function (err, result, fields) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }

                                    sql = "INSERT INTO shippingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                    connection.query(sql, [order_id, req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.country, req.body.shippingTo.district,
                                        req.body.shippingTo.city, req.body.shippingTo.address, req.body.shippingTo.phoneNumber, req.body.shippingTo.postalCode, req.body.charger.email, new Date], function (err, result, fields) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    throw err;
                                                });
                                            }

                                            const mapCartItems = req.body.cartItems.map(x => {
                                                let rObj = [];
                                                rObj[0] = order_id;
                                                rObj[1] = x._id;
                                                rObj[2] = x.model;
                                                rObj[3] = x.quantity;
                                                return rObj
                                            }
                                            )

                                            sql = "INSERT INTO order_products (order_id,product_id,model,quantity) VALUES ?"
                                            connection.query(sql, [mapCartItems], function (err, result) {
                                                if (err) {
                                                    connection.rollback(function () {
                                                        throw err;
                                                    });
                                                }

                                                const mapCartItemsHistory = req.body.cartItems.map(x => {
                                                    let rObj = [];
                                                    rObj[0] = order_id;
                                                    rObj[1] = x._id;
                                                    rObj[2] = x.model;
                                                    rObj[3] = x.quantity;
                                                    rObj[4] = req.body.charger.email;
                                                    rObj[5] = new Date;
                                                    rObj[6] = "Αρχική Παραγγελία";
                                                    return rObj
                                                })

                                                sql = "INSERT INTO orderProductHistory (order_id, product_id, model, quantity, UpdatedBy, UpdatedAt, actions) VALUES ?";
                                                connection.query(sql, [mapCartItemsHistory], function (err, result) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            throw err;
                                                        });
                                                    }

                                                    connection.commit(function (err) {
                                                        if (err) {
                                                            connection.rollback(function () {
                                                                throw err;
                                                            });
                                                        }
                                                        console.log('Transaction Completed Successfully.');
                                                        var response = { order_id }
                                                        res.status(200).send(response);
                                                    });
                                                });
                                            });
                                        })
                                });
                        })
                    });
                });
            });
            connection.release();
            // Handle error after the release.
            if (err) throw err;
        });
        /* End transaction */
    });
})

router.post("/insert_order", isAuth, async (req, res) => {

    mysqlConnection.getConnection(function (err, connection) {
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            let sql = "UPDATE addresses SET name=?, subname=?, phoneNumber=?,country=?, district=?, city=?, street=?, postalCode=? WHERE user_id=?";
            connection.query(sql, [req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country,
            req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode, req.body.charger.email], function (err, result, fields) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                let sql = "Select address_id FROM addresses WHERE user_id=?";
                connection.query(sql, [req.body.charger.email], function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    const chargerAddress_id = result[0].address_id;

                    sql = "INSERT INTO orders (user_email, billingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.charger.email, chargerAddress_id, req.body.methods.typeOfPayment,
                    req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments,
                    req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost, req.body.charger.email], function (err, result) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        const order_id = result.insertId;

                        sql = "INSERT INTO ordersendingpaymenthistory (order_id, sendingMethod, paymentMethod, paymentType, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [order_id, req.body.methods.sendingMethod, req.body.methods.paymentMethod, req.body.methods.typeOfPayment, req.user.email, new Date], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            sql = "INSERT INTO billingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, comments, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                            connection.query(sql, [order_id, req.body.charger.name, req.body.charger.subname, req.body.charger.country, req.body.charger.district,
                                req.body.charger.city, req.body.charger.address, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.methods.comments, req.body.charger.email, new Date], function (err, result, fields) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }

                                    sql = "INSERT INTO order_products (order_id, product_id, model, quantity, image_case) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case FROM cart WHERE user_email=?";
                                    connection.query(sql, [order_id, req.body.charger.email], function (err, result) {
                                        if (err) {
                                            connection.rollback(function () {
                                                throw err;
                                            });
                                        }

                                        sql = "INSERT INTO orderProductHistory (order_id, product_id, model, quantity, image_case, UpdatedBy, UpdatedAt, actions) SELECT ?, cart.product_id, cart.model, cart.quantity, cart.image_case, ?, ?, ? FROM cart WHERE user_email=?";
                                        connection.query(sql, [order_id, req.body.charger.email, new Date, "Αρχική Παραγγελία", req.body.charger.email], function (err, result) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    throw err;
                                                });
                                            }

                                            sql = "DELETE FROM cart WHERE user_email=?";
                                            connection.query(sql, [req.body.charger.email], function (err, result) {
                                                if (err) {
                                                    connection.rollback(function () {
                                                        throw err;
                                                    });
                                                }

                                                connection.commit(function (err) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            throw err;
                                                        });
                                                    }
                                                    console.log('Transaction Completed Successfully.');
                                                    var response = { order_id }
                                                    res.status(200).send(response);

                                                });
                                            });
                                        });
                                    });
                                });
                        })
                    });
                });
            });
            connection.release();
            // Handle error after the release.
            if (err) throw err;
        });
        /* End transaction */
    });
});

router.post("/insert_no_user_order", async (req, res) => {

    mysqlConnection.getConnection(function (err, connection) {
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            let sql = "INSERT INTO addresses (user_email, name, subname, phoneNumber,country, district, city, street, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(sql, [req.body.charger.email, req.body.charger.name, req.body.charger.subname, req.body.charger.phoneNumber, req.body.charger.country,
            req.body.charger.district, req.body.charger.city, req.body.charger.address, req.body.charger.postalCode], function (err, result, fields) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                const chargerAddress_id = result.insertId;

                sql = "INSERT INTO orders (user_email, billingAddress, paymentType, paymentMethod, sendingMethod, comments, itemsPrice, paymentMethodPrice, shippingPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [req.body.charger.email, chargerAddress_id, req.body.methods.typeOfPayment,
                req.body.methods.paymentMethod, req.body.methods.sendingMethod, req.body.methods.comments,
                req.body.itemsCost, req.body.methods.paymentMethodCost, req.body.methods.sendingMethodCost], function (err, result) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    const order_id = result.insertId;

                    sql = "INSERT INTO ordersendingpaymenthistory (order_id, sendingMethod, paymentMethod, paymentType, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [order_id, req.body.methods.sendingMethod, req.body.methods.paymentMethod, req.body.methods.typeOfPayment, req.body.charger.email, new Date], function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        sql = "INSERT INTO billingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, comments, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [order_id, req.body.charger.name, req.body.charger.subname, req.body.charger.country, req.body.charger.district,
                            req.body.charger.city, req.body.charger.address, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.methods.comments, req.body.charger.email, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                const mapCartItems = req.body.cartItems.map(x => {
                                    let rObj = [];
                                    rObj[0] = order_id;
                                    rObj[1] = x._id;
                                    rObj[2] = x.model;
                                    rObj[3] = x.quantity;
                                    return rObj
                                }
                                )

                                sql = "INSERT INTO order_products (order_id,product_id,model,quantity) VALUES ?"
                                connection.query(sql, [mapCartItems], function (err, result) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }

                                    const mapCartItemsHistory = req.body.cartItems.map(x => {
                                        let rObj = [];
                                        rObj[0] = order_id;
                                        rObj[1] = x._id;
                                        rObj[2] = x.model;
                                        rObj[3] = x.quantity;
                                        rObj[4] = req.body.charger.email;
                                        rObj[5] = new Date;
                                        rObj[6] = "Αρχική Παραγγελία";
                                        return rObj
                                    })

                                    sql = "INSERT INTO orderProductHistory (order_id, product_id, model, quantity, UpdatedBy, UpdatedAt, actions) VALUES ?";
                                    connection.query(sql, [mapCartItemsHistory], function (err, result) {
                                        if (err) {
                                            connection.rollback(function () {
                                                throw err;
                                            });
                                        }

                                        connection.commit(function (err) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    throw err;
                                                });
                                            }
                                            console.log('Transaction Completed Successfully.');
                                            var response = { order_id }
                                            res.status(200).send(response);

                                        });
                                    });
                                });
                            })
                    })
                });
            });
        });
        connection.release();
        // Handle error after the release.
        if (err) throw err;
        /* End transaction */
    });
});

router.post("/", isAuth, isAdmin, async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        let sql = ""
        if (req.body.status === "Όλες") {
            sql = "SELECT * FROM orders ORDER BY orderDate DESC LIMIT ? OFFSET ?";
            connection.query(sql, [req.body.itemsPerPage, req.body.offset], function (err, result) {
                if (err) throw err;
                let resp = result;

                connection.query('SELECT COUNT(*) AS count FROM orders',
                    function (err, result, fields) {
                        if (err) throw err;
                        let count = result;

                        res.send({ resp, count });
                    })
            });
        }
        else {
            sql = "SELECT * FROM orders WHERE status=? ORDER BY orderDate DESC LIMIT ? OFFSET ?";
            connection.query(sql, [req.body.status, req.body.itemsPerPage, req.body.offset], function (err, result) {
                if (err) throw err;

                let resp = result;

                connection.query('SELECT COUNT(*) AS count FROM orders WHERE status=?',
                    [req.body.status], function (err, result, fields) {
                        if (err) throw err;
                        let count = result;

                        res.send({ resp, count });
                    })
            });
        }

        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
});

router.get("/:id", isAuth, isAdmin, async (req, res) => {
    const orderId = req.params.id;
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        /* Begin transaction */
        connection.beginTransaction(function (err) {
            if (err) { throw err; }

            let sql = "SELECT * FROM orders WHERE order_id=?";
            connection.query(sql, [orderId], function (err, result) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                const order = result[0];

                sql = "SELECT addresses.* FROM addresses INNER JOIN orders ON addresses.address_id = orders.billingAddress WHERE orders.order_id=?";
                connection.query(sql, [orderId], function (err, result) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    var billingAddress = result[0];

                    sql = "SELECT addresses.* FROM addresses INNER JOIN orders ON addresses.address_id = orders.shippingAddress WHERE orders.order_id=?";
                    connection.query(sql, [orderId], function (err, result) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        var shippingAddress = result[0];

                        sql = "SELECT products._id, products.name, products.image, products.category,products.subcategory, products.totalPrice, products.countInStock, order_products.quantity, order_products.model, order_products.image_case FROM products INNER JOIN order_products ON products._id = order_products.product_id WHERE order_products.order_id=?";
                        connection.query(sql, [orderId], function (err, result) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var products = result;

                            var response = {
                                order,
                                billingAddress,
                                shippingAddress,
                                products
                            };
                            res.send(response);


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
            });
        });
        /* End transaction */

        // Handle error after the release.
        if (err) throw err;
    });
});

router.put("/changeStatus", isAuth, isAdmin, async (req, res) => {

    try {
        mysqlConnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
            switch (req.body.dates.dateIndex) {
                case 0:
                    connection.beginTransaction(function (err) {
                        var sql = "UPDATE orders SET status=?, proccessDate=?, delayDate=?, shippingDate=?, cancelDate=? WHERE order_id=?";
                        connection.query(sql, [req.body.newStatus, req.body.dates.proccessDate, req.body.dates.delayDate,
                        req.body.dates.shippingDate, req.body.dates.cancelDate, req.body.orderId], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var sql = "INSERT INTO orderstatushistory (order_id, status, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?)";
                            connection.query(sql, [req.body.orderId, req.body.newStatus, req.user.username, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log("Order Status updated");
                                    res.status(200).send("OK");
                                });
                            })
                        })
                        connection.release();

                        // Handle error after the release.
                        if (err) throw err;
                    })
                    break;
                case 1:
                    connection.beginTransaction(function (err) {
                        var sql = "UPDATE orders SET status=?, delayDate=?, shippingDate=?, cancelDate=? WHERE order_id=?";
                        connection.query(sql, [req.body.newStatus, req.body.dates.delayDate,
                        req.body.dates.shippingDate, req.body.dates.cancelDate, req.body.orderId], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var sql = "INSERT INTO orderstatushistory (order_id, status, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?)";
                            connection.query(sql, [req.body.orderId, req.body.newStatus, req.user.username, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log("Order Status updated");
                                    res.status(200).send("OK");
                                });
                            })
                        })
                        connection.release();

                        // Handle error after the release.
                        if (err) throw err;
                    })
                    break;
                case 2:
                    connection.beginTransaction(function (err) {
                        var sql = "UPDATE orders SET status=?, shippingDate=?, cancelDate=? WHERE order_id=?";
                        connection.query(sql, [req.body.newStatus, req.body.dates.shippingDate,
                        req.body.dates.cancelDate, req.body.orderId], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var sql = "INSERT INTO orderstatushistory (order_id, status, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?)";
                            connection.query(sql, [req.body.orderId, req.body.newStatus, req.user.username, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log("Order Status updated");
                                    res.status(200).send("OK");
                                });
                            })
                        })
                        connection.release();

                        // Handle error after the release.
                        if (err) throw err;
                    })
                    break;
                case 3:
                    connection.beginTransaction(function (err) {
                        var sql = "UPDATE orders SET status=?, cancelDate=? WHERE order_id=?";
                        connection.query(sql, [req.body.newStatus, req.body.dates.cancelDate, req.body.orderId], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var sql = "INSERT INTO orderstatushistory (order_id, status, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?)";
                            connection.query(sql, [req.body.orderId, req.body.newStatus, req.user.username, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log("Order Status updated");
                                    res.status(200).send("OK");
                                });
                            })
                        })
                        connection.release();

                        // Handle error after the release.
                        if (err) throw err;
                    })
                    break;
                default:
                    break;
            }
        });
    }
    catch (error) {
        res.send({ message: error.message });
    }
});

router.put("/updateStatus", isAuth, isAdmin, async (req, res) => {

    try {
        mysqlConnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!

            switch (req.body.StatusIndex) {
                case 1:
                    connection.beginTransaction(function (err) {
                        var sql = "UPDATE orders SET status=?, proccessDate=? WHERE order_id=?";
                        connection.query(sql, [req.body.newStatus, new Date, req.body.orderId], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var sql = "INSERT INTO orderstatushistory (order_id, status, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?)";
                            connection.query(sql, [req.body.orderId, req.body.newStatus, req.user.username, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log("Order Status updated");
                                    res.status(200).send("OK");
                                });
                            })
                        })
                        connection.release();

                        // Handle error after the release.
                        if (err) throw err;
                    })
                    break;
                case 2:
                    connection.beginTransaction(function (err) {
                        var sql = "UPDATE orders SET status=?, delayDate=? WHERE order_id=?";
                        connection.query(sql, [req.body.newStatus, new Date, req.body.orderId], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var sql = "INSERT INTO orderstatushistory (order_id, status, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?)";
                            connection.query(sql, [req.body.orderId, req.body.newStatus, req.user.username, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log("Order Status updated");
                                    res.status(200).send("OK");
                                });
                            })
                        })
                        connection.release();

                        // Handle error after the release.
                        if (err) throw err;
                    })
                    break;
                case 3:
                    connection.beginTransaction(function (err) {
                        var sql = "UPDATE orders SET status=?, shippingDate=? WHERE order_id=?";
                        connection.query(sql, [req.body.newStatus, new Date, req.body.orderId], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var sql = "INSERT INTO orderstatushistory (order_id, status, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?)";
                            connection.query(sql, [req.body.orderId, req.body.newStatus, req.user.username, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log("Order Status updated");
                                    res.status(200).send("OK");
                                });
                            })
                        })
                        connection.release();

                        // Handle error after the release.
                        if (err) throw err;
                    })
                    break;
                case 4:
                    connection.beginTransaction(function (err) {
                        var sql = "UPDATE orders SET status=?, cancelDate=? WHERE order_id=?";
                        connection.query(sql, [req.body.newStatus, new Date, req.body.orderId], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var sql = "INSERT INTO orderstatushistory (order_id, status, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?)";
                            connection.query(sql, [req.body.orderId, req.body.newStatus, req.user.username, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log("Order Status updated");
                                    res.status(200).send("OK");
                                });
                            })
                        })
                        connection.release();

                        // Handle error after the release.
                        if (err) throw err;
                    })
                    break;
                default:
                    break;
            }

        });

    }
    catch (error) {
        res.send({ message: error.message });
    }
});

router.put("/changeOrderDetails", isAuth, isAdmin, async (req, res) => {

    try {
        mysqlConnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!

            connection.beginTransaction(function (err) {
                if (err) { throw err; }

                var sql = "UPDATE orders SET sendingMethod=?, shippingPrice=?, paymentMethod=?,paymentMethodPrice=?, paymentType=? WHERE order_id=?";
                connection.query(sql, [req.body.sendingMethod, req.body.shippingPrice, req.body.paymentMethod, req.body.paymentMethodCost, req.body.paymentType, req.body.orderId], function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    sql = "INSERT INTO ordersendingpaymenthistory (order_id, sendingMethod, paymentMethod, paymentType, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.orderId, req.body.sendingMethod, req.body.paymentMethod, req.body.paymentType, req.user.username, new Date], function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }


                        sql = "SELECT * FROM orders WHERE order_id=?";
                        connection.query(sql, [req.body.orderId], function (err, result) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }
                                res.status(201).send(result);
                                console.log('Transaction Completed Successfully.');
                            })
                        })
                    })
                })
                connection.release();
                // Handle error after the release.
                if (err) throw err;
            })
        });
    }
    catch (error) {
        res.send({ message: error.message });
    }
});

router.put("/updateChargerAddress", isAuth, isAdmin, async (req, res) => {

    try {
        mysqlConnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!

            if (req.body.paymentType === 'Τιμολόγιο') {
                connection.beginTransaction(function (err) {
                    if (err) { throw err; }
                    var sql = "UPDATE addresses INNER JOIN orders ON addresses.address_id=orders.billingAddress SET companyName=?, bussiness=?, afm=?, doy=?, country=?, district=?, city=?, street=?, phoneNumber=?, postalCode=?, comments=? WHERE orders.order_id=?";
                    connection.query(sql, [req.body.charger.companyName, req.body.charger.bussiness, req.body.charger.afm, req.body.charger.doy, req.body.charger.country, req.body.charger.district, req.body.charger.city,
                    req.body.charger.street, req.body.charger.phoneNumber, req.body.charger.postalCode,
                    req.body.charger.comments, req.body.orderId], function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }
                        sql = "INSERT INTO billingAddressHistory (order_id, companyName, bussiness, afm, doy, country, district, city, street, phoneNumber, postalCode, comments, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [req.body.orderId, req.body.charger.companyName, req.body.charger.bussiness, req.body.charger.afm, req.body.charger.doy, req.body.charger.country, req.body.charger.district,
                        req.body.charger.city, req.body.charger.street, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.charger.comments, req.user.username, new Date], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                res.status(200).send("OK");
                                console.log('Transaction Completed Successfully.');
                            })
                        })
                    })

                    connection.release();

                    // Handle error after the release.
                    if (err) throw err;
                })
            }
            else if (req.body.paymentType === 'Απόδειξη') {
                connection.beginTransaction(function (err) {
                    if (err) { throw err; }

                    var sql = "UPDATE addresses INNER JOIN orders ON addresses.address_id=orders.billingAddress SET name=?, subname=?, country=?, district=?, city=?, street=?, phoneNumber=?, postalCode=?, comments=? WHERE orders.order_id=?";
                    connection.query(sql, [req.body.charger.name, req.body.charger.subname,
                    req.body.charger.country, req.body.charger.district, req.body.charger.city,
                    req.body.charger.street, req.body.charger.phoneNumber, req.body.charger.postalCode,
                    req.body.charger.comments, req.body.orderId], function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }
                        sql = "INSERT INTO billingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, comments, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [req.body.orderId, req.body.charger.name, req.body.charger.subname, req.body.charger.country, req.body.charger.district,
                        req.body.charger.city, req.body.charger.street, req.body.charger.phoneNumber, req.body.charger.postalCode, req.body.charger.comments, req.user.username, new Date], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                res.status(200).send("OK");
                                console.log('Transaction Completed Successfully.');
                            })
                        })
                    })
                    connection.release();

                    // Handle error after the release.
                    if (err) throw err;
                })
            }
        });
    }
    catch (error) {
        res.send({ message: error.message });
    }
});

router.put("/updateShippingAddress", isAuth, isAdmin, async (req, res) => {
    try {
        mysqlConnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!

            if (req.body.shippingAddress) {
                connection.beginTransaction(function (err) {
                    if (err) { throw err; }
                    var sql = "UPDATE addresses INNER JOIN orders ON addresses.address_id=orders.shippingAddress SET name=?, subname=?, country=?, district=?, city=?, street=?, postalCode=? WHERE orders.order_id=?";
                    connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname,
                    req.body.shippingTo.country, req.body.shippingTo.district, req.body.shippingTo.city,
                    req.body.shippingTo.street, req.body.shippingTo.postalCode, req.body.orderId], function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        sql = "INSERT INTO shippingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        connection.query(sql, [req.body.orderId, req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.country, req.body.shippingTo.district,
                        req.body.shippingTo.city, req.body.shippingTo.street, req.body.shippingTo.phoneNumber, req.body.shippingTo.postalCode, req.user.username, new Date], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                res.status(200).send("OK");
                                console.log('Transaction Completed Successfully.');
                            })
                        })
                    })
                    connection.release();

                    // Handle error after the release.
                    if (err) throw err;
                })
            }
            else {
                /* Begin transaction */
                connection.beginTransaction(function (err) {
                    if (err) { throw err; }

                    var sql = "INSERT INTO addresses (name, subname, country, district, city, street, postalCode) VALUE (?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [req.body.shippingTo.name, req.body.shippingTo.subname,
                    req.body.shippingTo.country, req.body.shippingTo.district, req.body.shippingTo.city,
                    req.body.shippingTo.street, req.body.shippingTo.postalCode], function (err, result) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        const shippingAddress_id = result.insertId;

                        sql = "UPDATE orders SET shippingAddress=? WHERE order_id=?";
                        connection.query(sql, [shippingAddress_id, req.body.orderId], function (err, result) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            sql = "INSERT INTO shippingAddressHistory (order_id, name, subname, country, district, city, street, phoneNumber, postalCode, UpdatedBy, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                            connection.query(sql, [req.body.orderId, req.body.shippingTo.name, req.body.shippingTo.subname, req.body.shippingTo.country, req.body.shippingTo.district,
                            req.body.shippingTo.city, req.body.shippingTo.street, req.body.shippingTo.phoneNumber, req.body.shippingTo.postalCode, req.user.username, new Date], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                });
                            })
                        });
                    });
                    connection.release();

                    // Handle error after the release.
                    if (err) throw err;
                });
                /* End transaction */
            }
        });
    }
    catch (error) {
        res.send({ message: error.message });
    }
});

router.put("/updateOrder", isAuth, isAdmin, async (req, res) => {

    try {
        console.log(req.body.itemsCost)
        mysqlConnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!

            connection.beginTransaction(function (err) {
                if (err) { throw err; }

                var sql = "UPDATE order_products SET quantity=? WHERE order_id=? && model=? && product_id=?";
                connection.query(sql, [req.body.quantity, req.body.order_id, req.body.model, req.body.product_id], function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    sql = "SELECT SUM(order_products.quantity*products.totalPrice) AS itemscost FROM order_products INNER JOIN products on order_products.product_id=products._id WHERE order_products.order_id=? ";
                    connection.query(sql, [req.body.order_id], function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }
                        const itemsCost = result[0].itemscost;

                        var sql = "UPDATE orders SET itemsPrice=? WHERE order_id=?";
                        connection.query(sql, [itemsCost, req.body.order_id], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            sql = "INSERT INTO orderProductHistory (order_id, product_id, model, quantity, UpdatedBy, UpdatedAt, actions) VALUES (?, ?, ?, ?, ?, ?, ?)";
                            connection.query(sql, [req.body.order_id, req.body.product_id, req.body.model, req.body.quantity, req.user.username, new Date, "Αλλαγή Ποσότητας"], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }

                                    res.status(200).send("OK");
                                    console.log('Transaction Completed Successfully.');
                                })
                            })
                        })
                    })
                })
            })
            connection.release();

            // Handle error after the release.
            if (err) throw err;
        })
    }
    catch (error) {
        res.send({ message: error.message });
    }
});

router.post("/removeOrderItem", isAuth, isAdmin, async (req, res) => {

    try {
        mysqlConnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!

            connection.beginTransaction(function (err) {
                if (err) { throw err; }

                var sql = "INSERT INTO orderProductHistory (order_id, product_id, model, quantity, UpdatedBy, UpdatedAt, actions) VALUES (?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [req.body.order_id, req.body.product_id, req.body.model, req.body.quantity, req.user.username, new Date, "Διαγραφή"], function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    var sql = "DELETE FROM order_products WHERE order_id=? && model=? && product_id=?";
                    connection.query(sql, [req.body.order_id, req.body.model, req.body.product_id], function (err, result, fields) {
                        if (err) throw err;

                        sql = "SELECT SUM(order_products.quantity*products.totalPrice) AS itemscost FROM order_products INNER JOIN products on order_products.product_id=products._id WHERE order_products.order_id=? ";
                        connection.query(sql, [req.body.order_id], function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }
                            const itemsCost = result[0].itemscost;

                            var sql = "UPDATE orders SET itemsPrice=? WHERE order_id=?";
                            connection.query(sql, [itemsCost, req.body.order_id], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            throw err;
                                        });
                                    }

                                    res.status(200).send("OK");
                                    console.log('Transaction Completed Successfully.');
                                })
                            })
                        })
                    })
                })
                connection.release();

                // Handle error after the release.
                if (err) throw err;
            })
        });
    }
    catch (error) {
        res.send({ message: error.message });
    }
});

router.post("/customerOrders", isAuth, async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        let sql = "SELECT * FROM orders WHERE user_id=? ORDER BY orderDate DESC";
        connection.query(sql, [req.body.email], function (err, result) {
            if (err) throw err;

            res.send(result);
        });
        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
});

router.get("/customerOrders/:id", isAuth, async (req, res) => {
    const orderId = req.params.id;
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        /* Begin transaction */
        connection.beginTransaction(function (err) {
            if (err) { throw err; }

            let sql = "SELECT * FROM orders WHERE order_id=?";
            connection.query(sql, [orderId], function (err, result) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                const order = result[0];

                sql = "SELECT addresses.* FROM addresses INNER JOIN orders ON addresses.address_id = orders.billingAddress WHERE orders.order_id=?";
                connection.query(sql, [orderId], function (err, result) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    var billingAddress = result[0];

                    sql = "SELECT addresses.* FROM addresses INNER JOIN orders ON addresses.address_id = orders.shippingAddress WHERE orders.order_id=?";
                    connection.query(sql, [orderId], function (err, result) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        var shippingAddress = result[0];

                        sql = "SELECT products._id, products.name, products.image, products.category,products.subcategory, products.totalPrice, products.countInStock, order_products.quantity, order_products.model FROM products INNER JOIN order_products ON products._id = order_products.product_id WHERE order_products.order_id=?";
                        connection.query(sql, [orderId], function (err, result) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var products = result;

                            var response = {
                                order,
                                billingAddress,
                                shippingAddress,
                                products
                            };
                            res.send(response);


                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }                                
                            });
                        });
                    });
                });
            });
        });
        /* End transaction */
        connection.release();
        // Handle error after the release.
        if (err) throw err;
    });
});


export default router;