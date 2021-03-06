import express from 'express';
import fs from 'fs';
import xml2js from 'xml2js';
import mysqlConnection from '../connection';

const router= express.Router();

router.get("/", async (req, res) =>{

    const parser= new xml2js.Parser();
    fs.readFile('C:/Users/Giorgos/projects/reactApp/grand/frontend/src/images/xml_isis.xml', function(err, data) {
        parser.parseString(data, function (err, result) {
            console.dir(result["www.isispc-eshop.gr"].PRODUCTS[0].PRODUCT[0].NAME);
            console.log('Done');

            const insertProduct = (name, category, subcategory, brand, image, price, weight, mpn, supplier, availability, description)=>{
                mysqlConnection.getConnection(function(err, connection) {
                    if (err) throw err; // not connected!
            
                    let sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier, description, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [name,category, subcategory, brand, image, price, weight, mpn, supplier, description, availability], function (err, result, fields) {
                        if( err & err != "ER_DUP_ENTRY" ){
                                console.log("Entry is already");
                            }
                    
                        sql = "INSERT INTO manufacturers (name) VALUES(?)";
                        connection.query(sql, [brand], function (err, result, fields) {
                            if( err & err != "ER_DUP_ENTRY" ){
                                console.log("Entry is already");
                            }
                        })
                    })
                                
                    connection.release();
                    // Handle error after the release.
                    if (err) throw err;
                     
                });
            }

            const insertProductWithFeature = (name, category, subcategory, brand, image, price, weight, mpn, supplier, featureArray, availability, description)=>{
                mysqlConnection.getConnection(function(err, connection) {  
                    if (err) throw err; // not connected!

                    featureArray.forEach(featArr => {
                        let sql = "INSERT INTO feature_titles (feature_title) VALUES (?)";
                        connection.query(sql, [featArr.featureTitle], function (err, result, fields) {
                            if( err & err != "ER_DUP_ENTRY" ){
                                console.log("Entry is already");
                            }
                            
                            let title_id='';

                            if(!err)
                            {
                                title_id = result.insertId;

                                sql = "INSERT INTO feature_names (feature_title_id, feature_name) VALUES (?, ?)";
                                    connection.query(sql, [title_id, featArr.featureName], function (err, result, fields) {
                                        if( err & err != "ER_DUP_ENTRY" ){
                                            console.log("Entry is already");
                                        }
                                    })
                            }
                            else{
                                sql = "SELECT feature_title_id FROM feature_titles WHERE feature_title=?"
                                connection.query(sql, [featArr.featureTitle], function (err, result, fields) {
                                    if( err & err != "ER_DUP_ENTRY" ){
                                        console.log("Entry is already");
                                    }
                                    title_id=result[0].feature_title_id;
                                    
                                    sql = "INSERT INTO feature_names (feature_title_id, feature_name) VALUES (?, ?)";
                                    connection.query(sql, [title_id, featArr.featureName], function (err, result, fields) {
                                        if( err & err != "ER_DUP_ENTRY" ){
                                            console.log("Entry is already");
                                        }
                                    })
                                })
                            }
                        })
                    })

                    let sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier, description, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [name,category, subcategory, brand, image, price, weight, mpn, supplier, description, availability], function (err, result, fields) {
                        if (err & err != "ER_DUP_ENTRY" ) { 
                            console.log("Entry is already");
                        }

                        if(result)
                        {
                            const product_id = result.insertId;
                        
                            featureArray.forEach(featArr => {                                        
                                sql="INSERT INTO features (product_id, feature_title, feature) VALUES (?, ?, ?)";
                                connection.query(sql, [product_id, featArr.featureTitle, featArr.featureName], function (err, result, fields) {
                                    if (err) { 
                                        console.log("Entry is already");
                                    }

                                    sql = "INSERT INTO manufacturers (name) VALUES(?)";
                                    connection.query(sql, [brand], function (err, result, fields) {
                                        if( err & err != "ER_DUP_ENTRY" ){
                                            console.log("Entry is already");
                                        }
                                    })
                                })
                            })
                        }
                    }) 
                            
                    connection.release();
                    // Handle error after the release.
                    if (err) throw err;                    
                });                
            }

            const insertProductWithCompatibility = (name, category, subcategory, brand, image, price, weight, mpn, supplier, compatibilityArray, availability, description)=>{
                mysqlConnection.getConnection(function(err, connection) {  
                    if (err) throw err; // not connected!

                    compatibilityArray.forEach(compArr => {
                        let sql = "INSERT INTO compatibility_company (company) VALUES (?)";
                        connection.query(sql, [compArr.company], function (err, result, fields) {
                            if( err & err != "ER_DUP_ENTRY" ){
                                console.log("Entry is already");
                            }
                            
                            let company_id='';

                            if(!err)
                            {
                                company_id = result.insertId;

                                sql = "INSERT INTO compatibility_model (compatibility_company_id, model) VALUES (?, ?)";
                                    connection.query(sql, [company_id, compArr.model], function (err, result, fields) {
                                        if( err & err != "ER_DUP_ENTRY" ){
                                            console.log("Entry is already");
                                        }
                                    })
                            }
                            else{
                                sql = "SELECT compatibility_company_id FROM compatibility_company WHERE company=?"
                                connection.query(sql, [compArr.company], function (err, result, fields) {
                                    if( err & err != "ER_DUP_ENTRY" ){
                                        console.log("Entry is already");
                                    }
                                    company_id=result[0].compatibility_company_id;
                                    
                                    sql = "INSERT INTO compatibility_model (compatibility_company_id, model) VALUES (?, ?)";
                                    connection.query(sql, [company_id, compArr.model], function (err, result, fields) {
                                        if( err & err != "ER_DUP_ENTRY" ){
                                            console.log("Entry is already");
                                        }
                                    })
                                })
                            }
                        })
                    })

                    let sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier, description, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [name,category, subcategory, brand, image, price, weight, mpn, supplier, description, availability], function (err, result, fields) {
                        if (err & err != "ER_DUP_ENTRY" ) { 
                            console.log("Entry is already");
                        }

                        if(result)
                        {
                            const product_id = result.insertId;
                        
                            compatibilityArray.forEach(compArr => {                                        
                                sql="INSERT INTO compatibilities (product_id, compatibility_company, compatibility_model) VALUES (?, ?, ?)";
                                connection.query(sql, [product_id, compArr.company, compArr.model], function (err, result, fields) {
                                    if (err) { 
                                        console.log("Entry is already");
                                    }

                                    sql = "INSERT INTO manufacturers (name) VALUES(?)";
                                    connection.query(sql, [brand], function (err, result, fields) {
                                        if( err & err != "ER_DUP_ENTRY" ){
                                            console.log("Entry is already");
                                        }
                                    })
                                })
                            })
                        }
                    }) 
                            
                    connection.release();
                    // Handle error after the release.
                    if (err) throw err;                    
                });                
            }

            let data = [];
            for (let index = 0; index < result["www.isispc-eshop.gr"].PRODUCTS[0].PRODUCT.length; index++) {
                
                const element = result["www.isispc-eshop.gr"].PRODUCTS[0].PRODUCT[index];

                const programsAndServices = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[1].trim()) {
                        case "Antivirus":
                            insertProduct(element.NAME[0],"προγράμματα-υπηρεσίες","Antivirus",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC", element.AVAILABILITY[0],element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Pegasus μηχανογράφηση":
                            insertProduct(element.NAME[0],"προγράμματα-υπηρεσίες","PEGASUS-Μηχανογράφηση",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0],element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "e-Token ψηφιακή υπογραφή":
                            insertProduct(element.NAME[0],"προγράμματα-υπηρεσίες","e-TOKEN-Ψηφιακή-Υπογραφή",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0],element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Υπηρεσίες":
                            insertProduct(element.NAME[0],"προγράμματα-υπηρεσίες","Υπηρεσίες",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0],element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;                    
                        default:
                            break;
                    }
                }

                const cable_keyboards = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[2].trim()) {
                        case "Ενσύρματα":
                            let features = []; 
                            features.push({featureTitle:"Ασύρματα/Ενσύρματα",featureName:"Ενσύρματα"});                                
                            insertProductWithFeature(element.NAME[0],"Πληκτρολόγια-Ποντίκια","Πληκτρολόγια",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC", features, element.AVAILABILITY[0], element.TEXT[0].replace('&lt;','<').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Ασύρματα":
                            features = []; 
                            features.push({featureTitle:"Ασύρματα/Ενσύρματα",featureName:"Ασύρματα"});                            
                            insertProductWithFeature(element.NAME[0],"Πληκτρολόγια-Ποντίκια","Πληκτρολόγια",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features , element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;                    
                        default:
                            break;
                    }
                }

                const cable_mouses = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[2].trim()) {
                        case "Ενσύρματα":
                            let features = []; 
                            features.push({featureTitle:"Ασύρματα/Ενσύρματα",featureName:"Ενσύρματα"});                                
                            insertProductWithFeature(element.NAME[0],"Πληκτρολόγια-Ποντίκια","Ποντίκια",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC", features, element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Ασύρματα":
                            features = []; 
                            features.push({featureTitle:"Ασύρματα/Ενσύρματα",featureName:"Ασύρματα"});                            
                            insertProductWithFeature(element.NAME[0],"Πληκτρολόγια-Ποντίκια","Ποντίκια",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features ,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Mousepad":
                            insertProduct(element.NAME[0],"Desktop","MousePads",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;                    
                        default:
                            break;
                    }
                }

                const handsFree = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[2].trim()) {
                        case "Bluetooth":
                            insertProduct(element.NAME[0],"Kινητά","Bluetooth",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Wired":
                            insertProduct(element.NAME[0],"Kινητά","Handsfree",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;                    
                        default:
                            break;
                    }
                }

                const network_devices = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[2].trim()) {
                        case "Κάρτες δικτύου":
                            insertProduct(element.NAME[0],"Δικτυακός-Εξοπλισμός","Κάρτες-Δικτύου",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Switches":
                            insertProduct(element.NAME[0],"Δικτυακός-Εξοπλισμός","Switches",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Range Extender - Powerlines":
                            insertProduct(element.NAME[0],"Δικτυακός-Εξοπλισμός","Range-Extenders-Powerlines",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace('&lt;','<').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Kαλώδια":
                            insertProduct(element.NAME[0],"Δικτυακός-Εξοπλισμός","Καλώδια",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;                    
                        default:
                            break;
                    }
                }

                const chargers = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[3].trim()) {
                        case "Notebook":
                            insertProduct(element.NAME[0],"Laptop","Φορτιστές-Laptop",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0],element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "PC":
                            insertProduct(element.NAME[0],"Pc-Hardwear","Τροφοδοτικά",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0],element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        default:
                            break;
                    }
                }

                const pc_parts = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[2].trim()) {
                        case "Τροφοδοτικά":
                            chargers();
                            break;
                        case "Δίσκοι &amp; SSD":
                            insertProduct(element.NAME[0],"Pc-Hardwear","Δίσκοι-SSD",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "DVD-RW":
                            insertProduct(element.NAME[0],"Pc-Hardwear","DVD-RW",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break; 
                        case "Μνήμες Ram":
                            insertProduct(element.NAME[0],"Pc-Hardwear","Μνήμες-Ram",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Καλώδια":
                            insertProduct(element.NAME[0],"Pc-Hardwear","Καλώδια",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        default:
                            break;
                    }
                }

                const desktopAndPeripheral = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[1].trim()) {
                        case "Οθόνες":
                            insertProduct(element.NAME[0],"Μultimedia","Οθόνες",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Πληκτρολόγια":
                            cable_keyboards();
                            break;  
                        case "Ποντίκια":
                            cable_mouses();
                            break;
                        case "PC Parts":
                            pc_parts();
                            break;
                        case "Δικτυακός εξοπλισμός":
                            network_devices();
                            break;                  
                        default:   
                            break;
                    }
                }

                const office_supplies = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[1].trim()) {
                        case "Χαρτιά":
                            insertProduct(element.NAME[0],"Χαρτιά","Εκτυπώσεων-Φωτοτυπιών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Υλικά πλαστικοποίησης":
                            insertProduct(element.NAME[0],"είδη-γραφείου","Υλικά-Πλαστικοποίησης",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;  
                        case "Καθαριστικά":
                            insertProduct(element.NAME[0],"είδη-γραφείου","Καθαριστικά",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Καταστροφείς εγγράφων":
                            insertProduct(element.NAME[0],"είδη-γραφείου","καταστροφείς-εγγράφων",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Toners":
                            // data.push(element.CATEGORY[0]["_"].split("->")[0].concat(" "+element.CATEGORY[0]["_"].split("->")[1]).concat(" "+element.CATEGORY[0]["_"].split("->")[2]).concat(" "+element.CATEGORY[0]["_"].split("->")[3]).concat(" "+element.CATEGORY[0]["_"].split("->")[4])); 
                            
                            let features = []; 
                            features.push({featureTitle:"Συμβατότητα",featureName:element.CATEGORY[0]["_"].split("->")[2]});                            
                            insertProductWithFeature(element.NAME[0],"Laser","Μελάνια",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features ,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Μελάνια":
                            // data.push(element.CATEGORY[0]["_"].split("->")[0].concat(" "+element.CATEGORY[0]["_"].split("->")[1]).concat(" "+element.CATEGORY[0]["_"].split("->")[2]).concat(" "+element.CATEGORY[0]["_"].split("->")[3]).concat(" "+element.CATEGORY[0]["_"].split("->")[4])); 
                            features = []; 
                            features.push({featureTitle:"Συμβατότητα",featureName:element.CATEGORY[0]["_"].split("->")[2]});                            
                            insertProductWithFeature(element.NAME[0],"Inkjet","Μελάνια",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Drums":
                            // data.push(element.CATEGORY[0]["_"].split("->")[0].concat(" "+element.CATEGORY[0]["_"].split("->")[1]).concat(" "+element.CATEGORY[0]["_"].split("->")[2]).concat(" "+element.CATEGORY[0]["_"].split("->")[3]).concat(" "+element.CATEGORY[0]["_"].split("->")[4])); 
                            features = []; 
                            features.push({featureTitle:"Συμβατότητα",featureName:element.CATEGORY[0]["_"].split("->")[2]});                            
                            insertProductWithFeature(element.NAME[0],"Laser","Drums",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Ρολλά μηχανών":
                            features = []; 
                            features.push({featureTitle:"Διαστάσεις",featureName:element.CATEGORY[0]["_"].split("->")[3]});                            
                            insertProductWithFeature(element.NAME[0],"Ρολλά-μηχανημάτων","Θερμικά Ταμειακών - POS",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC", features, element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        default:   
                            break;
                    }
                }

                const lighting = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[1].trim()) {
                        case "Πολύμπριζα":
                            insertProduct(element.NAME[0],"Φωτισμός","Πολύμπριζα",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Λάμπες LED":
                            if(element.CATEGORY[0]["_"].split("->")[2].trim()==="Adapter")
                            {
                                let features = []; 
                                features.push({featureTitle:"Adaptor",featureName:element.CATEGORY[0]["_"].split("->")[2]});
                                insertProductWithFeature(element.NAME[0],"Φωτισμός","Λάμπες-LED",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            }
                            else
                            {
                                let features = []; 
                                features.push({featureTitle:"Τάση",featureName:element.CATEGORY[0]["_"].split("->")[2]});
                                features.push({featureTitle:"Βάση",featureName:element.CATEGORY[0]["_"].split("->")[3]});
                                insertProductWithFeature(element.NAME[0],"Φωτισμός","Λάμπες-LED",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            }
                            break;  
                        case "Προβολείς Led":
                            let features = [];
                            features.push({featureTitle:"Τάση",featureName:element.CATEGORY[0]["_"].split("->")[2]});
                            insertProductWithFeature(element.NAME[0],"Φωτισμός","Προβολείς-LED",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Εργαλεία":
                            insertProduct(element.NAME[0],"Φωτισμός","Εργαλεία",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        default:   
                            break;
                    }
                }

                const mobiles_smartwatches = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[1].trim()) {
                        case "Θήκες":
                            // data.push(element.CATEGORY[0]["_"].split("->")[0].concat(" "+element.CATEGORY[0]["_"].split("->")[1]).concat(" "+element.CATEGORY[0]["_"].split("->")[2]).concat(" "+element.CATEGORY[0]["_"].split("->")[3]).concat(" "+element.CATEGORY[0]["_"].split("->")[4])); 
                            let compatibilities = [];
                            if(element.CATEGORY[0]["_"].split("->")[2]==="iPhone")
                            {
                                if(element.CATEGORY[0]["_"].split("->")[3].trim()==="6/6s")
                                {
                                    compatibilities = [];
                                    compatibilities.push({company:"Apple",model:"iPhone 6 / 6s"});
                                    insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                                else if(element.CATEGORY[0]["_"].split("->")[3]==="6/6s Plus")
                                {
                                    compatibilities = [];
                                    compatibilities.push({company:"Apple",model:"6 / 6s Plus"});
                                    insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                                else if(element.CATEGORY[0]["_"].split("->")[3]==="5/5s")
                                {
                                    compatibilities = [];
                                    compatibilities.push({company:"Apple",model:"iPhone 5 / 5s"});
                                    insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                                else if(element.CATEGORY[0]["_"].split("->")[3]==="4/4s")
                                {
                                    compatibilities = [];
                                    compatibilities.push({company:"Apple",model:"iPhone 4 / 4s"});
                                    insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                                else
                                {
                                    compatibilities = [];
                                    compatibilities.push({company:"Apple",model:"iPhone "+element.CATEGORY[0]["_"].split("->")[3].trim()});
                                    insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                            }
                            else
                            {
                                compatibilities = [];
                                compatibilities.push({company:element.CATEGORY[0]["_"].split("->")[2],model:element.CATEGORY[0]["_"].split("->")[3].trim()});
                                insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            }
                            break;
                        case "Προστασία Οθόνης / Κάμερας":
                            if(element.CATEGORY[0]["_"].split("->")[2]==="iPhone")
                            {
                                if(element.CATEGORY[0]["_"].split("->")[3].trim()==="6/6s")
                                {
                                    compatibilities = [];
                                    compatibilities.push({company:"Apple",model:"iPhone 6 / 6s"});
                                    insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                                else if(element.CATEGORY[0]["_"].split("->")[3].trim()==="6/6s Plus")
                                {
                                    compatibilities = [];
                                    compatibilities.push({company:"Apple",model:"iPhone 6 / 6s Plus"});
                                    insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                                else if(element.CATEGORY[0]["_"].split("->")[3].trim()==="5/5s")
                                {
                                    compatibilities = [];
                                    compatibilities.push({company:"Apple",model:"iPhone 5 / 5s"});
                                    insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                                else if(element.CATEGORY[0]["_"].split("->")[3].trim()==="4/4s")
                                {
                                    compatibilities = [];
                                    compatibilities.push({company:"Apple",model:"iPhone 4 / 4s"});
                                    insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                                else if(element.CATEGORY[0]["_"].split("->")[3].trim()==="7/8")
                                {
                                    compatibilities = [];
                                    compatibilities.push({company:"Apple",model:"iPhone 7 / 8"});
                                    insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                                else
                                {
                                compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone "+element.CATEGORY[0]["_"].split("->")[3].trim()});
                                insertProductWithCompatibility(element.NAME[0],"Kινητά","Θήκες-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                                }
                            }
                            else
                            {
                            compatibilities = [];
                            compatibilities.push({company:element.CATEGORY[0]["_"].split("->")[2],model:element.CATEGORY[0]["_"].split("->")[3].trim()});
                            insertProductWithCompatibility(element.NAME[0],"Kινητά","Προστασία-Οθόνης",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            }
                            break;
                        case "Φορτιστές":
                            let features = [];
                            features.push({featureTitle:"Σύνδεση",featureName:element.CATEGORY[0]["_"].split("->")[2].trim()});
                            insertProductWithFeature(element.NAME[0],"Kινητά","Φορτιστές-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Ανταλλακτικά επισκευών":
                            if(element.CATEGORY[0]["_"].split("->")[2]==="iPhone")
                            {
                            compatibilities = [];
                            compatibilities.push({company:"Apple",model:"iPhone"+element.CATEGORY[0]["_"].split("->")[3].trim()});
                            insertProductWithCompatibility(element.NAME[0],"Kινητά","Ανταλλακτικά-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            }
                            else if(element.CATEGORY[0]["_"].split("->")[2]==="Εργαλεία")
                            {
                                insertProduct(element.NAME[0],"Kινητά","Ανταλλακτικά-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            }
                            else
                            {
                            compatibilities = [];
                            compatibilities.push({company:element.CATEGORY[0]["_"].split("->")[2],model:element.CATEGORY[0]["_"].split("->")[3].trim()});
                            insertProductWithCompatibility(element.NAME[0],"Kινητά","Ανταλλακτικά-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",compatibilities,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            }
                            break;
                        case "Βάσεις στήριξης &amp; selfie sticks":
                            insertProduct(element.NAME[0],"Kινητά","Βάσεις-Στήριξης-Κινητών",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Bluetooth car kit":
                            insertProduct(element.NAME[0],"Kινητά","Car-Kit",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Adapter":
                            features = [];
                            features.push({featureTitle:"Τύπος",featureName:element.CATEGORY[0]["_"].split("->")[2].trim()});
                            insertProductWithFeature(element.NAME[0],"Kινητά","Adapters-Φόρτισης-Δεδομένων",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                        break;
                        case "Καλώδια":                            
                            features = [];
                            features.push({featureTitle:"Τύπος",featureName:element.CATEGORY[0]["_"].split("->")[2]});
                            insertProductWithFeature(element.NAME[0],"Kινητά","Καλώδια-Φόρτισης-Δεδομένων",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                        break;
                        case "Hands free":
                            handsFree();
                            break;
                        case "Smartwatches":
                            insertProduct(element.NAME[0],"Kινητά","Smartwatches",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        default:   
                            break;
                    }
                }

                const batteries_powerbanks = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[1].trim()) {
                        case "Power Banks":
                            insertProduct(element.NAME[0],"Μπαταρίες","PowerBanks",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Λιθίου":
                            insertProduct(element.NAME[0],"Μπαταρίες","Λιθίου",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Επαναφορτιζόμενες":
                            insertProduct(element.NAME[0],"Μπαταρίες","Επαναφορτιζόμενες",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Αλκαλικές":
                            insertProduct(element.NAME[0],"Μπαταρίες","Αλκαλικές",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;  
                        default:   
                            break;
                    }
                }

                const storage_devices = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[2].trim()) {
                        case "CD - DVD":
                            insertProduct(element.NAME[0],"Αποθηκευτικά-Μέσα","CD-DVD",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Memory Card":
                            let features = []; 
                            features.push({featureTitle:"Χωρητικότητα",featureName:element.CATEGORY[0]["_"].split("->")[3]});                            
                            insertProductWithFeature(element.NAME[0],"Αποθηκευτικά-Μέσα","Memory-Cards",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features ,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Flash Drives":
                            features = []; 
                            features.push({featureTitle:"Χωρητικότητα",featureName:element.CATEGORY[0]["_"].split("->")[3]});                            
                            insertProductWithFeature(element.NAME[0],"Αποθηκευτικά-Μέσα","Flash-Drivers",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features ,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        default:   
                            break;
                    }
                }

                const headsetMicrophones = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[2].trim()) {                        
                        case "Headphones":
                            let features = []; 
                            features.push({featureTitle:"Ασύρματα/Ενσύρματα",featureName:element.CATEGORY[0]["_"].split("->")[3]});                            
                            insertProductWithFeature(element.NAME[0],"Μultimedia","Headsets",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features ,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '))
                            break;
                        case "Μικρόφωνα":
                            insertProduct(element.NAME[0],"Μultimedia","Μικρόφωνα",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));break;
                        default:   
                            break;
                    }
                }

                const cameras= () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[2].trim()) {
                        case "Action camera accessoires":
                            insertProduct(element.NAME[0],"Cameras","Action-Cameras-Accessories",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Action camera":
                            insertProduct(element.NAME[0],"Cameras","Action-Cameras",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Web camera":
                            insertProduct(element.NAME[0],"Cameras","web-cameras",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Κάμερες καταγραφής πορείας":
                            insertProduct(element.NAME[0],"Cameras","Κάμερες-καταγραφής-πορείας",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        default:   
                            break;
                    }
                }

                const multimedia = () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[1].trim()) {
                        case "Ηχεία":
                            let features = []; 
                                features.push({featureTitle:"Τύπος",featureName:element.CATEGORY[0]["_"].split("->")[2]});
                                insertProductWithFeature(element.NAME[0],"Μultimedia","Ηχεία",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",features,element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                                break;
                        case "Αποθηκευτικά Μέσα":
                            storage_devices();
                            break;
                        case "Players MP3 / MP4":
                            insertProduct(element.NAME[0],"Μultimedia","mp3-mp4-players",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Βάσεις στήριξης TV":
                            insertProduct(element.NAME[0],"Μultimedia","Βάσεις-Στήριξης-TV",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Cameras":
                            cameras();
                            break;
                        case "Καλώδια &amp; adapter":
                            insertProduct(element.NAME[0],"Μultimedia","Καλώδια-Adapters",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Usb hubs / Card readers":
                            insertProduct(element.NAME[0],"Μultimedia","Usb-Hubs-Card-Readers",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Game controllers &amp; accesories":
                            insertProduct(element.NAME[0],"Μultimedia","Game-Controllers-Accessories",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Pointing devices":
                            insertProduct(element.NAME[0],"Μultimedia","Pointing-Devices",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "3D Pen":
                            insertProduct(element.NAME[0],"Μultimedia","3D-Pen",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Θήκες tablet":
                            insertProduct(element.NAME[0],"Tablet","Θήκες-Tablet",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Ακουστικά / Μικρόφωνα":
                            headsetMicrophones();
                            break;
                        default:  
                            break;
                    }
                }

                const medical_devices= () =>{
                    switch (element.CATEGORY[0]["_"].split("->")[1].trim()) {
                        case "Προστασίας":
                            insertProduct(element.NAME[0],"Ιατρικά-Είδη","Προστασίας",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Οξύμετρα":
                            insertProduct(element.NAME[0],"Ιατρικά-Είδη","Οξύμετρα",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Αποστειρωτές - Αντισηπτικά":                            
                            insertProduct(element.NAME[0],"Ιατρικά-Είδη","Αποστειρωτές-Αντισηπτικά",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        case "Θερμόμετρα":
                            insertProduct(element.NAME[0],"Ιατρικά-Είδη","Θερμόμετρα",element.MANUFACTURER[0],element.IMAGE_URL[0],element.PRICE[0],element.WEIGHT[0],element.MPN[0],"ISISPC",element.AVAILABILITY[0], element.TEXT[0].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&").replace(/&nbsp;/gi, ' '));
                            break;
                        default:   
                        data.push(element.CATEGORY[0]["_"].split("->")[0].concat(" "+element.CATEGORY[0]["_"].split("->")[1]).concat(" "+element.CATEGORY[0]["_"].split("->")[2]).concat(" "+element.CATEGORY[0]["_"].split("->")[3]).concat(" "+element.CATEGORY[0]["_"].split("->")[4])); 
                            break;
                    }
                }
                
                switch (element.CATEGORY[0]["_"].split("->")[0].trim() ) {
                    case "Προγράμματα &amp; Υπηρεσίες":
                        // programsAndServices();
                        break;
                    case "Υπολογιστές &amp; Περιφερειακά":
                        //  desktopAndPeripheral();
                        break;
                    case "Αναλώσιμα":
                        // office_supplies();
                        break;
                    case "Φωτισμός &amp; Εξοπλισμός":
                        // lighting();
                        break;
                    case "Αξεσουάρ Κινητής &amp; Smartwatches":
                        // mobiles_smartwatches();
                    break;
                    case "Μπαταρίες &amp; Power Banks":
                        // batteries_powerbanks();
                    break;
                    case "Multimedia":
                            // multimedia();
                            break;
                        case "Ιατρικά Είδη":
                            medical_devices();                     
                            break; 
                    default:
                        //  data.push(element.AVAILABILITY[0]); 
                        // data.push(element.CATEGORY[0]["_"].split("->")[0].concat(" "+element.CATEGORY[0]["_"].split("->")[1]).concat(" "+element.CATEGORY[0]["_"].split("->")[2]).concat(" "+element.CATEGORY[0]["_"].split("->")[3]).concat(" "+element.CATEGORY[0]["_"].split("->")[4])); 
                        break;
                }
            }
            res.send(data)
            //res.send(result["www.isispc-eshop.gr"].PRODUCTS[0].PRODUCT[388].CATEGORY[0]["_"].split("->"));
        });
    });
})


export default router;