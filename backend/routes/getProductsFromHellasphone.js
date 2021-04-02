var http = require('http');
import express from 'express';
import { getToken, isAuth, isAdmin } from '../util.js';
import mysqlConnection from '../connection';

const router = express.Router();

router.get("/",  (req, res) => {
    
    http.get('http://www.hellasphone.com.gr/api.php?action=getWholeCatalog&user_id=4478767&password=383cHClX2mcR5oHjOV7d&type=JSON', function (resp) {
        var data = '';
        resp.on('data', function (chunk) {
            data += chunk
        }).on('end', function () {
            try {

                const insertProduct = (name, category, subcategory, brand, image, price, weight, mpn, supplier, availability) => {
                    mysqlConnection.getConnection(function (err, connection) {
                        if (err) throw err; // not connected!
                        let sql = "SELECT _id FROM products WHERE MPN=?"
                        connection.query(sql, [mpn], function (err, result, fields) {
                            if (err) throw err;

                            if (result.length > 0) {

                                sql = "UPDATE products SET name=?, category=?, subcategory=?, brand=?, image=?, price=?, weight=?, supplier=?, availability=?, visibility=?, lastUpdated=? WHERE MPN=?";
                                connection.query(sql, [name, category, subcategory, brand, image, price, weight, supplier, availability, 1, new Date, mpn], function (err, result, fields) {
                                    if (err & err != "ER_DUP_ENTRY") {
                                        console.log("Entry is already");
                                    }

                                    sql = "INSERT INTO manufacturers (name) VALUES(?)";
                                    connection.query(sql, [brand], function (err, result, fields) {
                                        if (err & err != "ER_DUP_ENTRY") {
                                            console.log("Entry is already");
                                        }
                                    })
                                })
                            }
                            else {

                                sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier, availability, visibility, lastUpdated) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                connection.query(sql, [name, category, subcategory, brand, image, price, weight, mpn, supplier, availability, 1, new Date], function (err, result, fields) {
                                    if (err & err != "ER_DUP_ENTRY") {
                                        console.log("Entry is already");
                                    }

                                    sql = "INSERT INTO manufacturers (name) VALUES(?)";
                                    connection.query(sql, [brand], function (err, result, fields) {
                                        if (err & err != "ER_DUP_ENTRY") {
                                            console.log("Entry is already");
                                        }
                                    })
                                })
                            }
                        })
                                            
                        connection.release();
                        // Handle error after the release.
                        if (err) throw err;

                    });
                }

                const insertProductWithFeature = (name, category, subcategory, brand, image, price, weight, mpn, supplier, featureArray, availability) => {
                    mysqlConnection.getConnection(function (err, connection) {
                        if (err) throw err; // not connected!

                        featureArray.forEach(featArr => {
                            let sql = "INSERT INTO feature_titles (feature_title) VALUES (?)";
                            connection.query(sql, [featArr.featureTitle], function (err, result, fields) {
                                if (err & err != "ER_DUP_ENTRY") {
                                    console.log("Entry is already");
                                }

                                let title_id = '';

                                if (!err) {
                                    title_id = result.insertId;

                                    sql = "INSERT INTO feature_names (feature_title_id, feature_name) VALUES (?, ?)";
                                    connection.query(sql, [title_id, featArr.featureName], function (err, result, fields) {
                                        if (err & err != "ER_DUP_ENTRY") {
                                            console.log("Entry is already");
                                        }
                                    })
                                }
                                else {
                                    sql = "SELECT feature_title_id FROM feature_titles WHERE feature_title=?"
                                    connection.query(sql, [featArr.featureTitle], function (err, result, fields) {
                                        if (err & err != "ER_DUP_ENTRY") {
                                            console.log("Entry is already");
                                        }
                                        title_id = result[0].feature_title_id;

                                        sql = "INSERT INTO feature_names (feature_title_id, feature_name) VALUES (?, ?)";
                                        connection.query(sql, [title_id, featArr.featureName], function (err, result, fields) {
                                            if (err & err != "ER_DUP_ENTRY") {
                                                console.log("Entry is already");
                                            }
                                        })
                                    })
                                }
                            })
                        })

                        let sql = "SELECT _id FROM products WHERE MPN=?"
                        connection.query(sql, [mpn], function (err, result, fields) {
                            if (err) throw err;

                            if (result.length > 0) {
                                const product_id = result[0]['_id'];
                                let sql = "UPDATE products SET name=?, category=?, subcategory=?, brand=?, image=?, price=?, weight=?, visibility=1, supplier=?, availability=?, lastUpdated=? WHERE MPN=?";
                                connection.query(sql, [name, category, subcategory, brand, image, price, weight, supplier, availability, new Date, mpn], function (err, result, fields) {
                                    if (err) {
                                        console.log("Something went wrong!");
                                    }

                                    featureArray.forEach(featArr => {
                                        sql = "SELECT features_id FROM features WHERE product_id=? AND feature_title=? AND feature=?";
                                        connection.query(sql, [product_id, featArr.featureTitle, featArr.featureName], function (err, result, fields) {
                                            if (err) {
                                                console.log("Something went wrong!");
                                            }

                                            if (result.length > 0) {
                                                const features_id = result[0]["features_id"];

                                                sql = "UPDATE features SET product_id=?, feature_title=?, feature=? WHERE features_id=?";
                                                connection.query(sql, [product_id, featArr.featureTitle, featArr.featureName, features_id], function (err, result, fields) {
                                                    if (err & err != "ER_DUP_ENTRY") {
                                                        console.log("Entry is already");
                                                    }

                                                    sql = "INSERT INTO manufacturers (name) VALUES(?)";
                                                    connection.query(sql, [brand], function (err, result, fields) {
                                                        if (err & err != "ER_DUP_ENTRY") {
                                                            console.log("Entry is already");
                                                        }
                                                    })
                                                })
                                            }
                                            else {
                                                sql = "INSERT INTO features (product_id, feature_title, feature) VALUES (?, ?, ?)";
                                                connection.query(sql, [product_id, featArr.featureTitle, featArr.featureName], function (err, result, fields) {
                                                    if (err & err != "ER_DUP_ENTRY") {
                                                        console.log("Entry is already");
                                                    }

                                                    sql = "INSERT INTO manufacturers (name) VALUES(?)";
                                                    connection.query(sql, [brand], function (err, result, fields) {
                                                        if (err & err != "ER_DUP_ENTRY") {
                                                            console.log("Entry is already");
                                                        }
                                                    })
                                                })
                                            }
                                        })
                                    })
                                })
                            }
                            else {
                                let sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                connection.query(sql, [name, category, subcategory, brand, image, price, weight, mpn, supplier, availability], function (err, result, fields) {
                                    if (err & err != "ER_DUP_ENTRY") {
                                        console.log("Entry is already");
                                    }

                                    if (result) {
                                        const product_id = result.insertId;

                                        featureArray.forEach(featArr => {
                                            sql = "INSERT INTO features (product_id, feature_title, feature) VALUES (?, ?, ?)";
                                            connection.query(sql, [product_id, featArr.featureTitle, featArr.featureName], function (err, result, fields) {
                                                if (err & err != "ER_DUP_ENTRY") {
                                                    console.log("Entry is already");
                                                }

                                                sql = "INSERT INTO manufacturers (name) VALUES(?)";
                                                connection.query(sql, [brand], function (err, result, fields) {
                                                    if (err & err != "ER_DUP_ENTRY") {
                                                        console.log("Entry is already");
                                                    }
                                                })
                                            })
                                        })
                                    }
                                })
                            }
                        })

                        connection.release();
                        console.log(mysqlConnection._freeConnections.indexOf(connection)+"---2");
                        // Handle error after the release.
                        if (err) throw err;
                    });
                }

                const insertProductWithCompatibility = (name, category, subcategory, brand, image, price, weight, mpn, supplier, compatibilityArray, availability) => {
                    mysqlConnection.getConnection(function (err, connection) {
                        if (err) throw err; // not connected!

                        compatibilityArray.forEach(compArr => {
                            let sql = "INSERT INTO compatibility_company (company) VALUES (?)";
                            connection.query(sql, [compArr.company], function (err, result, fields) {
                                if (err & err != "ER_DUP_ENTRY") {
                                    console.log("Entry is already");
                                }

                                let company_id = '';

                                if (!err) {
                                    company_id = result.insertId;

                                    sql = "INSERT INTO compatibility_model (compatibility_company_id, model) VALUES (?, ?)";
                                    connection.query(sql, [company_id, compArr.model], function (err, result, fields) {
                                        if (err & err != "ER_DUP_ENTRY") {
                                            console.log("Entry is already");
                                        }
                                    })
                                }
                                else {
                                    sql = "SELECT compatibility_company_id FROM compatibility_company WHERE company=?"
                                    connection.query(sql, [compArr.company], function (err, result, fields) {
                                        if (err & err != "ER_DUP_ENTRY") {
                                            console.log("Entry is already");
                                        }
                                        company_id = result[0].compatibility_company_id;

                                        sql = "INSERT INTO compatibility_model (compatibility_company_id, model) VALUES (?, ?)";
                                        connection.query(sql, [company_id, compArr.model], function (err, result, fields) {
                                            if (err & err != "ER_DUP_ENTRY") {
                                                console.log("Entry is already");
                                            }
                                        })
                                    })
                                }
                            })
                        })

                        let sql = "SELECT _id FROM products WHERE MPN=?"
                        connection.query(sql, [mpn], function (err, result, fields) {
                            if (err) throw err;

                            if (result.length > 0) {
                                const product_id = result[0]['_id'];

                                let sql = "UPDATE products SET name=?, category=?, subcategory=?, brand=?, image=?, price=?, weight=?, visibility=1, supplier=?, availability=?, lastUpdated=? WHERE MPN=?";
                                connection.query(sql, [name, category, subcategory, brand, image, price, weight, supplier, availability, new Date, mpn], function (err, result, fields) {
                                    if (err) {
                                        console.log("Something went wrong!");
                                    }

                                    compatibilityArray.forEach(compArr => {
                                        sql = "SELECT compatibility_id FROM compatibilities WHERE product_id=? AND compatibility_company=? AND compatibility_model=?";
                                        connection.query(sql, [product_id, compArr.company, compArr.model], function (err, result, fields) {
                                            if (err) {
                                                console.log("Something went wrong!");
                                            }

                                            if (result.length > 0) {
                                                const compatibility_id = result[0]["compatibility_id"];
                                                sql = "UPDATE compatibilities SET product_id=?, compatibility_company=?, compatibility_model=? WHERE compatibility_id=?";
                                                connection.query(sql, [product_id, compArr.company, compArr.model, compatibility_id], function (err, result, fields) {
                                                    if (err) {
                                                        console.log("Entry is already");
                                                    }

                                                    sql = "INSERT INTO manufacturers (name) VALUES(?)";
                                                    connection.query(sql, [brand], function (err, result, fields) {
                                                        if (err & err != "ER_DUP_ENTRY") {
                                                            console.log("Entry is already");
                                                        }
                                                    })
                                                })
                                            }
                                            else {
                                                sql = "INSERT INTO compatibilities (product_id, compatibility_company, compatibility_model) VALUES (?, ?, ?)";
                                                connection.query(sql, [product_id, compArr.company, compArr.model], function (err, result, fields) {
                                                    if (err) {
                                                        console.log("Entry is already");
                                                    }

                                                    sql = "INSERT INTO manufacturers (name) VALUES(?)";
                                                    connection.query(sql, [brand], function (err, result, fields) {
                                                        if (err & err != "ER_DUP_ENTRY") {
                                                            console.log("Entry is already");
                                                        }
                                                    })
                                                })
                                            }
                                        })
                                    })
                                })
                            }
                            else {
                                let sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier,  availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                connection.query(sql, [name, category, subcategory, brand, image, price, weight, mpn, supplier, availability], function (err, result, fields) {
                                    if (err & err != "ER_DUP_ENTRY") {
                                        console.log("Entry is already");
                                    }

                                    if (result) {
                                        const product_id = result.insertId;

                                        compatibilityArray.forEach(compArr => {
                                            sql = "INSERT INTO compatibilities (product_id, compatibility_company, compatibility_model) VALUES (?, ?, ?)";
                                            connection.query(sql, [product_id, compArr.company, compArr.model], function (err, result, fields) {
                                                if (err) {
                                                    console.log("Entry is already");
                                                }

                                                sql = "INSERT INTO manufacturers (name) VALUES(?)";
                                                connection.query(sql, [brand], function (err, result, fields) {
                                                    if (err & err != "ER_DUP_ENTRY") {
                                                        console.log("Entry is already");
                                                    }
                                                })
                                            })
                                        })
                                    }
                                })
                            }
                        })

                        connection.release();
                        console.log(mysqlConnection._freeConnections.indexOf(connection)+"---3");
                        // Handle error after the release.
                        if (err) throw err;
                    });
                }

                let json = JSON.parse(data);

                for (let i = 0; i < json.length; i++) {
                    let element = json[i];

                    const phoneCases = () => {
                        switch (element.PRODUCT.split(" ")[0].trim()) {
                            case "Huawei":
                                // data.push(element.PRODUCT.split(" ")[0].trim());               
                                if (element.PRODUCT.includes("P Smart Z")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Huawei", model: "P Smart Z" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("P20")) {
                                    compatibilities = [];
                                    compatibilities.push({ company: "Huawei", model: "P20" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else {
                                    compatibilities = [];
                                    compatibilities.push({ company: "Huawei", model: "MediaPad M5 Pro 10.8" });
                                    insertProductWithCompatibility(element.PRODUCT, "Tablet", "Θήκες-Tablet", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                break;
                            case "HUAWEI":
                                if (element.PRODUCT.includes("P30 Lite")) {
                                    compatibilities = [];
                                    compatibilities.push({ company: "Huawei", model: "P30 Lite" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else {
                                    compatibilities = [];
                                    compatibilities.push({ company: "Huawei", model: "P30" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                break;
                            case "Samsung":
                                if (element.PRODUCT.includes("Galaxy Note 10+")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "Note 10+" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy Note 10 Lite")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "Note 10 Lite" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy Note 10")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "Note 10" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy S10+")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S10+" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy S10e")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S10e" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy S10 Lite")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S10 Lite" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy S10 lite")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S10 Lite" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy S10")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S10" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy Note 20")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "Note 20" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A70")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A70" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A80")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A80" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A6 Plus")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A6 Plus" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A20e")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A20e" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy S20")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S20" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A50")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A50" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy S9+")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S9+" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy S9")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S9" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy J1")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "J1" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A40")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A40" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy J7")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "J7" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A9")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A9" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy Note 9")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "Note 9" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A51")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A51" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A41")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A41" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A71")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A71" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy A6")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "A6" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("G988F")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S20 Ultra" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("G985F")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S20+" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("G980F")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "S20" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Samsung Note 8")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "Note 8" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy Tab S7+")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "Tab S7+" });
                                    insertProductWithCompatibility(element.PRODUCT, "Tablet", "Θήκες-Tablet", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Galaxy Tab S7")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "Tab S7" });
                                    insertProductWithCompatibility(element.PRODUCT, "Tablet", "Θήκες-Tablet", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Samsung", model: "Tab S4" });
                                    insertProductWithCompatibility(element.PRODUCT, "Tablet", "Θήκες-Tablet", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                break;
                            case "Apple":
                                if (element.PRODUCT.includes("iPhone 11 Pro Max")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Apple", model: "iPhone 11 Pro Max" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("iPhone 11 Pro")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Apple", model: "iPhone 11 Pro" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("iPhone 11")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Apple", model: "iPhone 11" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("iPhone 8 / 7 ")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Apple", model: "iPhone 7 / 8 " });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("iPhone 8 Plus / 7 Plus")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Apple", model: "iPhone 7 Plus / 8 Plus" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("iPhone XS Max")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Apple", model: "iPhone XS Max" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("iPhone XS")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Apple", model: "iPhone XS" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("iPhone Xs")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Apple", model: "iPhone XS" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("iPhone X")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Apple", model: "iPhone X" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("iPhone SE 2020/8/7)")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Apple", model: "iPhone 7 / 8 / SE 2020" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                break;
                            case "Lenovo":
                                let compatibilities = [];
                                compatibilities.push({ company: "Lenovo", model: "A328" });
                                insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                break;
                            case "Nokia":
                                if (element.PRODUCT.includes("Nokia 6")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Nokia", model: "6" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Nokia 5")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Nokia", model: "5" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                else if (element.PRODUCT.includes("Nokia CC-110")) {
                                    let compatibilities = [];
                                    compatibilities.push({ company: "Nokia", model: "CC-110" });
                                    insertProductWithCompatibility(element.PRODUCT, "Kινητά", "Θήκες-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", compatibilities, element.ORDER_DELIVERY)
                                }
                                break;
                            default:
                                // data.push(element.PRODUCT.split(" ")[0].trim())
                                break;
                        }
                    }

                    const phone_accessories = () => {
                        switch (element.CATEGORY.split("//")[2].trim()) {
                            case "Φορτιστές":
                                insertProduct(element.PRODUCT, "Kινητά", "Φορτιστές-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                break;
                            case "Bluetooth":
                                insertProduct(element.PRODUCT, "Kινητά", "Bluetooth", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                break;
                            case "Προστασία Οθόνης":
                                // data.push(element.PRODUCT)//.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                                insertProduct(element.PRODUCT, "Kινητά", "Προστασία-Οθόνης", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                break;
                            case "Powerbanks":
                                insertProduct(element.PRODUCT, "Μπαταρίες", "PowerBanks", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                break;
                            case "Ακουστικά/Ηχεία":
                                insertProduct(element.PRODUCT, "Kινητά", "Handsfree", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                break;
                            case "Καλώδια/Αντάπτορες":
                                if (element.PRODUCT.includes("Αντάπτορας")) {
                                    insertProduct(element.PRODUCT, "Kινητά", "Adapters-Φόρτισης-Δεδομένων", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                }
                                else {
                                    insertProduct(element.PRODUCT, "Kινητά", "Καλώδια-Φόρτισης-Δεδομένων", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                }
                                break;
                            case "Βάσεις Κινητών/Selfie Sticks":
                                if (element.PRODUCT.includes("Selfie")) {
                                    insertProduct(element.PRODUCT, "Kινητά", "Selfie-Sticks", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                }
                                else {
                                    insertProduct(element.PRODUCT, "Kινητά", "Βάσεις-Στήριξης-Κινητών", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                }
                                break;
                            case "Κάρτες Μνήμης":
                                insertProduct(element.PRODUCT, "Αποθηκευτικά-Μέσα", "Memory-Cards", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                break;
                            case "Γραφίδες":
                                insertProduct(element.PRODUCT, "Kινητά", "Γραφίδες", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                break;
                            case "Sim":
                                insertProduct(element.PRODUCT, "Kινητά", "Διάφορα-αξεσουάρ", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                break;
                            case "Διάφορα":
                                insertProduct(element.PRODUCT, "Kινητά", "Διάφορα-αξεσουάρ", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                break;
                            case "Θήκες Κινητών":
                                phoneCases();
                                break;
                            default:
                                // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                                break;
                        }
                    }

                    const mobiles_smartwatches = () => {
                        switch (element.CATEGORY.split("//")[1].trim()) {
                            case "Αξεσουάρ":
                                phone_accessories();
                                break;
                            case "Κινητά Τηλέφωνα":
                                insertProduct(element.PRODUCT, "Kινητά", "Kινητά", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                break;
                            case "Σταθερά":
                                // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                                if (element.CATEGORY.split("//")[2].trim() === "IP Τηλεφωνία") {
                                    let features = [];
                                    features.push({ featureTitle: "Είδος Συσκευής", featureName: "IP Τηλεφωνία" });
                                    insertProduct(element.PRODUCT, "είδη-γραφείου", "Σταθερά-Τηλέφωνα", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", element.ORDER_DELIVERY);
                                }
                                else if (element.CATEGORY.split("//")[2].trim() === "Ενσύρματα") {
                                    let features = [];
                                    features.push({ featureTitle: "Είδος Συσκευής", featureName: "Ενσύρματα" });
                                    insertProductWithFeature(element.PRODUCT, "είδη-γραφείου", "Σταθερά-Τηλέφωνα", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", features, element.ORDER_DELIVERY);
                                }
                                else if (element.CATEGORY.split("//")[2].trim() === "Ασύρματα") {
                                    let features = [];
                                    features.push({ featureTitle: "Είδος Συσκευής", featureName: "Ασύρματα" });
                                    insertProductWithFeature(element.PRODUCT, "είδη-γραφείου", "Σταθερά-Τηλέφωνα", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", features, element.ORDER_DELIVERY);
                                }
                                else if (element.CATEGORY.split("//")[2].trim() === "Συσκευές Fax") {
                                    let features = [];
                                    features.push({ featureTitle: "Είδος Συσκευής", featureName: "Συσκευές Fax" });
                                    insertProductWithFeature(element.PRODUCT, "είδη-γραφείου", "Σταθερά-Τηλέφωνα", element.MANUFACTURER, element.IMAGE, element.ORDER_PRICE, element.WEIGHT, element.MPN, "hellasphone", features, element.ORDER_DELIVERY);
                                }
                                break;
                            default:
                                // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                                break;
                        }
                    }

                    const tabletCases = () =>{
                        switch (element.PRODUCT.split(" ")[0].trim()) {
                            case "Huawei": 
                                let compatibilities = [];
                                compatibilities.push({company:"Huawei",model:"MediaPad T3 10"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            break;
                            case "Apple":                         
                            if(element.PRODUCT.includes("12.9-inch iPad Pro"))
                            {
                                compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPad Pro 12.9"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("12.9 iPad Pro"))
                            {
                                compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPad Pro 12.9"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("11-inch iPad Pro"))
                            {
                                compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPad Pro 11"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("iPad Pro 10.5"))
                            {
                                compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPad Pro 10.5"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("iPad mini"))
                            {
                                compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPad Mini"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("iPad 9.7"))
                            {
                                compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPad 9.7"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("iPad Air 10.5"))
                            {
                                compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPad Air 10.5"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            break;
                            case "Samsung":                                             
                            if(element.PRODUCT.includes("Galaxy Tab A 10.1"))
                            {   
                                compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Tab A 10.1"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("Galaxy Tab S6 Lite 10.4"))
                            { 
                                compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Tab S6 Lite 10.4"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("Galaxy Tab S6 Lite"))
                            {   
                                compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Tab S6 Lite"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("Galaxy Tab S6"))
                            { 
                                compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Tab S6"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("Galaxy Tab S3"))
                            {   
                                compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Tab S3"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            else if(element.PRODUCT.includes("Galaxy Tab A"))
                            { 
                                compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Tab A 10.1"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            }
                            break;
                            case "Lenovo":
                                compatibilities = [];
                                compatibilities.push({company:"Lenovo",model:"Thinkpad Quick Shot"});
                                insertProductWithCompatibility(element.PRODUCT,"Tablet","Θήκες-Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                            break;                        
                        }                    
                    }
    
                    const tablet_screen_protection = () =>{
                        if(element.PRODUCT.includes("IPAD AIR/AIR 2/IPAD PRO 9.7"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Apple",model:"AIR/AIR 2/PRO 9.7"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("AIR/IPAD AIR 2/IPAD PRO 9,7"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Apple",model:"IPAD AIR/AIR 2/PRO 9.7"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("IPAD PRO 12.9"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Apple",model:"IPAD PRO 12.9"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("IPAD MINI"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Apple",model:"IPAD MINI 4"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("IPAD AIR"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Apple",model:"IPAD AIR"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("Huawei MediaPad T3 9.6")){
                            let compatibilities = [];
                            compatibilities.push({company:"Huawei",model:"MediaPad T3 9.6"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("Huawei MediaPad T5 10.1")){
                            let compatibilities = [];
                            compatibilities.push({company:"Huawei",model:"MediaPad T5 10.1"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("SAMSUNG TAB A 2016 T580/T585 10.1"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"TAB A 2016 T580/T585 10.1"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("SAMSUNG TAB A 2016 T280/T285 7.0"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"TAB A 2016 T280/T285 7.0"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("SAMSUNG TAB S2 T710/T715/T719 8.0"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"TAB S2 T710/T715/T719 8.0"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("Galaxy Tab A 10.1 2019 T510/T515"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"Tab A T510/T515 10.1"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("Samsung Galaxy Tab A 8.0 T290/295/297"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"Tab A 8.0 T290/295/297"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("SAMSUNG TAB A T550/T555 9.7"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"TAB A T550/T555 9.7"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("SAMSUNG TAB S2 9.7"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"SAMSUNG TAB S2 9.7"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                        else if(element.PRODUCT.includes("TAB S2 8"))
                        {
                            let compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"TAB S2 8"});
                            insertProductWithCompatibility(element.PRODUCT,"Tablet","Προστασία-Οθόνης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",compatibilities,element.ORDER_DELIVERY)
                        }
                    }
    
                    const tablet_accessories = () =>{
                        switch (element.CATEGORY.split("//")[2].trim()) {
                            case "Φορτιστές":
                                insertProduct(element.PRODUCT,"Tablet","Φορτιστές-tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Προστασία Οθόνης":
                                tablet_screen_protection();
                                break;
                            case "Θήκες":
                                tabletCases();
                                break;
                            case "Βάσεις":
                                insertProduct(element.PRODUCT,"Tablet","Βάσεις",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                    break;
                            default: 
                                // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                                break;
                        }
                    }
    
                    const tablets = () =>{
                        switch (element.CATEGORY.split("//")[1].trim()) {
                            case "Αξεσουάρ Tablet":
                                tablet_accessories();
                                break;
                            case "Brands":
                                insertProduct(element.PRODUCT,"Tablet","Tablet",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            default:
                                break;
                        }
                    }

                    const gaming_cataloge = () =>{
                        switch (element.CATEGORY.split("//")[2].trim()) {
                            case "Gamepads":
                                insertProduct(element.PRODUCT,"Gaming","Gamepads",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Παιχνίδια":
                                insertProduct(element.PRODUCT,"Gaming","Παιχνίδια",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Virtual Reality":
                                insertProduct(element.PRODUCT,"Gaming","Virtual-Reality",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Αξεσουάρ":
                                insertProduct(element.PRODUCT,"Gaming","Αξεσουάρ",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Τιμονιέρες":
                                insertProduct(element.PRODUCT,"Gaming","Τιμονιέρες",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Joysticks":
                                insertProduct(element.PRODUCT,"Gaming","Joysticks",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Gaming Chair":
                                insertProduct(element.PRODUCT,"Gaming","Gaming-Chair",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;                    
                            default:
                                // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                                break;
                        }
                    }
    
                    const gaming = () =>{
                        switch (element.CATEGORY.split("//")[1].trim()) {
                            case "Gaming":
                                gaming_cataloge();
                                break;
                            default:
                                break;
                        }
                    }

                    const cameras = () =>{
                        switch (element.CATEGORY.split("//")[2].trim()) {
                            case "Θήκες/Τσάντες":
                                // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                                insertProduct(element.PRODUCT,"Cameras","Θήκες-Τσάντες",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Φακοί/Flash Κάμερας":
                                // data.push(element.PRODUCT); 
                                insertProduct(element.PRODUCT,"Cameras","Φακοί-Flash",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Τρίποδα":
                                insertProduct(element.PRODUCT,"Cameras","Τρίποδα",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            default:
                                insertProduct(element.PRODUCT,"Cameras","Photo-Cameras",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                        }
                    }
    
                    const multimedia_accessories = () =>{
                        if(element.CATEGORY.split("//")[2]!==undefined)
                        {
                            switch (element.CATEGORY.split("//")[2].trim()) {
                                case "Ήχος":
                                    insertProduct(element.PRODUCT,"Μultimedia","Αξεσουάρ-Ήχου",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                    break;
                                case "Κάμερα":
                                    insertProduct(element.PRODUCT,"Cameras","Αξεσουάρ-Κάμερας",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                    break;
                            
                                default:
                                    // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                                    break;
                            }
                        }
                    }
    
                    const sound = () =>{
                        switch (element.CATEGORY.split("//")[2].trim()) {
                            case "Ηχεία":
                                insertProduct(element.PRODUCT,"Μultimedia","Ηχεία",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "MP3-MP4":
                                insertProduct(element.PRODUCT,"Μultimedia","mp3-mp4-players",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Μικρόφωνα":
                                insertProduct(element.PRODUCT,"Μultimedia","Μικρόφωνα",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Ακουστικά":
                                insertProduct(element.PRODUCT,"Μultimedia","Headsets",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Ηχοσυστήματα Αυτοκινήτου":
                                insertProduct(element.PRODUCT,"Μultimedia","Ηχοσυστήματα-Αυτοκινήτου",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Ραδιόφωνο":
                                insertProduct(element.PRODUCT,"Μultimedia","Ραδιόφωνα",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                 break;
                            case "Ηχοσυστήματα":
                                insertProduct(element.PRODUCT,"Μultimedia","Ηχοσυστήματα",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Φορητά Ηχοσυστήματα":
                                insertProduct(element.PRODUCT,"Μultimedia","Φορητά-Ηχοσυστήματα",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Walkie Talkie/Συσκευές Υπαγόρευσης":
                                insertProduct(element.PRODUCT,"Μultimedia","Walkie-Talkie-Συσκευές-Υπαγόρευσης",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Πικάπ":
                                insertProduct(element.PRODUCT,"Μultimedia","Πικάπ",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Karaoke":
                                insertProduct(element.PRODUCT,"Μultimedia","Karaoke",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;                    
                            default:
                                break;
                        }
                    }
    
                    const tv_accessories = ()=>{
                        switch (element.CATEGORY.split("//")[2].trim()) {
                            case "Βάσεις Τηλεοράσεων":
                                insertProduct(element.PRODUCT,"Μultimedia","Βάσεις-Στήριξης-TV",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Κεραίες":
                                insertProduct(element.PRODUCT,"Μultimedia","Κεραίες-TV",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Ψηφιακοί Δεκτές/Αποκωδικοποιητές":
                                insertProduct(element.PRODUCT,"Μultimedia","Ψηφιακοί-Δεκτές-Αποκωδικοποιητές",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Media Players":
                                insertProduct(element.PRODUCT,"Μultimedia","Media-Players",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Home Cinema":
                                insertProduct(element.PRODUCT,"Μultimedia","Home-Cinema",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Αξεσουάρ":
                                insertProduct(element.PRODUCT,"Μultimedia","Αξεσουάρ-TV",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Φορήτες Τηλεοράσεις":
                                insertProduct(element.PRODUCT,"Μultimedia","Φορήτες-Τηλεοράσεις",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            default:
                                insertProduct(element.PRODUCT,"Μultimedia","Τηλεοράσεις",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                        }
                    }
    
                    const multimedia = () =>{
                        switch (element.CATEGORY.split("//")[1].trim()) {
                            case "Κάμερα":
                                cameras();
                                break;
                            case "Αξεσουάρ":
                                multimedia_accessories();
                                break;
                            case "Ήχος":
                                sound();
                                break;
                            case "Τηλεοράσεις":
                                tv_accessories();
                                break;
                            default:
                                // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                                break;
                        }
                    }

                    const freeTime = () =>{
                        switch (element.CATEGORY.split("//")[2].trim()) {
                            case "Κυάλια":
                                insertProduct(element.PRODUCT,"Gadgets","Κυάλια",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Πατίνια":
                                insertProduct(element.PRODUCT,"Gadgets","Πατίνια",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Μικροσκοπία":
                                insertProduct(element.PRODUCT,"Gadgets","Μικροσκοπία",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            default:
                                break;
                        }
                    }
    
                    const auto_moto = () =>{
                        switch (element.CATEGORY.split("//")[2].trim()) {
                            case "Συσκευές Πλοήγησης GPS":
                                insertProduct(element.PRODUCT,"Gadgets","Συσκευές-Πλοήγησης-GPS",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Κάμερες Αυτοκινήτου":
                                insertProduct(element.PRODUCT,"Gadgets","Κάμερες-Αυτοκινήτου",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Αξεσουάρ":
                                insertProduct(element.PRODUCT,"Gadgets","Αξεσουάρ-Αυτοκινήτου",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Διάφορα":
                                insertProduct(element.PRODUCT,"Gadgets","Διάφορα",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            default:
                                break;
                        }
                    }
    
                    const gadgets = () =>{
                        switch (element.CATEGORY.split("//")[1].trim()) {
                            case "Ελεύθερος Χρόνος":
                                freeTime();
                                break;
                            case "Auto-Moto":
                                auto_moto();
                                break;
                            case "Ψηφιακές Κορνίζες":
                                insertProduct(element.PRODUCT,"Gadgets","Ψηφιακές-Κορνίζες",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                            case "Drones":
                                insertProduct(element.PRODUCT,"Gadgets","Drones",element.MANUFACTURER,element.IMAGE,element.ORDER_PRICE,element.WEIGHT,element.MPN,"hellasphone",element.ORDER_DELIVERY);
                                break;
                        
                            default:
                                // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                                break;
                        }
                    }

                    switch (element.CATEGORY.split("//")[0].trim()) {
                        case "Πληροφορική":
                            break;
                        case "Living":
                            break;
                        case "Τηλεφωνία":
                            mobiles_smartwatches();
                            break;
                        case "Tablets":
                            tablets();
                            // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                            break;
                        case "Gaming":
                            gaming();
                            // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                            break;
                        case "Ήχος/Εικόνα":
                            multimedia();
                            // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                            break;
                        case "Gadgets":
                            gadgets();
                            // data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                            break;
                        default:
                            //  data.push(element.CATEGORY.split("//")[0].concat(" "+element.CATEGORY.split("//")[1]).concat(" "+element.CATEGORY.split("//")[2]).concat(" "+element.CATEGORY.split("//")[3])); 
                            break;
                    }
                }

                mysqlConnection.getConnection(function (err, connection) {
                    if (err) throw err; // not connected!

                    var d = new Date();
                    d.setDate(d.getDate() - 1);

                    let sql = "UPDATE products SET visibility=0 WHERE (supplier='hellasphone' AND lastUpdated<?) OR (supplier='hellasphone' AND lastUpdated is null) OR price=0"
                    connection.query(sql, d, function (err, result, fields) {
                        if (err) throw err;

                        console.log("Delete not exist products! Number of rows: " + result.affectedRows)

                    })

                    connection.release();
                    // Handle error after the release.
                    if (err) throw err;

                });

                // do something with JSON
            } catch (error) {
                console.error(error.message);
            };
        }).on("error", function (e) {
            console.log("Got error: " + e.message);
        })
        console.log("This is the end")
        return res.send("Done!")
    })


})
export default router;