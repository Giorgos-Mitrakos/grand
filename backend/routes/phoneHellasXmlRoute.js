import express from 'express';
import fs from 'fs';
import xml2js from 'xml2js';
import mysqlConnection from '../connection';

const router= express.Router();

router.get("/", async (req, res) =>{

    const parser= new xml2js.Parser();
    fs.readFile('C:/Users/Giorgos/reactApp/grand/frontend/src/images/hellasphone.xml', function(err, data) {
        parser.parseString(data, function (err, result) {
            console.dir(result.products.product.length);
            console.log('Done');

            const insertProduct = (name, category, subcategory, brand, image, price, weight, mpn, supplier, availability)=>{
                mysqlConnection.getConnection(function(err, connection) {
                    if (err) throw err; // not connected!
            
                    let sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier, availability) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [name,category, subcategory, brand, image, price, weight, mpn, supplier, availability], function (err, result, fields) {
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

            const insertProductWithFeature = (name, category, subcategory, brand, image, price, weight, mpn, supplier, featureArray, availability)=>{
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

                    let sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [name,category, subcategory, brand, image, price, weight, mpn, supplier, availability], function (err, result, fields) {
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

            const insertProductWithCompatibility = (name, category, subcategory, brand, image, price, weight, mpn, supplier, compatibilityArray, availability)=>{
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

                    let sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier,  availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [name,category, subcategory, brand, image, price, weight, mpn, supplier,  availability], function (err, result, fields) {
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
            for (let index = 0; index < result.products.product.length; index++) {
                
                const element = result.products.product[index];

                const phoneCases = () =>{
                    switch (element.productname[0].split(" ")[0].trim()) {
                        case "Huawei": 
                        // data.push(element.productname[0].split(" ")[0].trim());               
                            if(element.productname[0].includes("P Smart Z"))                            
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Huawei",model:"P Smart Z"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("P20"))
                            { 
                                compatibilities = [];
                                compatibilities.push({company:"Huawei",model:"P20"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else
                            {
                                compatibilities = [];
                                compatibilities.push({company:"Huawei",model:"MediaPad M5 Pro 10.8"});
                                insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                                break;
                        case "HUAWEI":                            
                            if(element.productname[0].includes("P30 Lite"))                            
                            {
                                compatibilities = [];
                                compatibilities.push({company:"Huawei",model:"P30 Lite"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else
                            {
                                compatibilities = [];
                                compatibilities.push({company:"Huawei",model:"P30"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                                break;
                        case "Samsung":
                            if(element.productname[0].includes("Galaxy Note 10+"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Note 10+"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy Note 10 Lite"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Note 10 Lite"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy Note 10"))                             
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Note 10"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy S10+"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S10+"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy S10e"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S10e"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy S10 Lite"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S10 Lite"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy S10 lite"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S10 Lite"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy S10"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S10"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy Note 20"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Note 20"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A70"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A70"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A80"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A80"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A6 Plus"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A6 Plus"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A20e"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A20e"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy S20"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S20"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A50"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A50"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy S9+"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S9+"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy S9"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S9"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy J1"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"J1"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A40"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A40"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy J7"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"J7"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A9"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A9"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy Note 9"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Note 9"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A51"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A51"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A41"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A41"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A71"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A71"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy A6"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"A6"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("G988F"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S20 Ultra"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("G985F"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S20+"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("G980F"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"S20"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Samsung Note 8"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Note 8"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy Tab S7+"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Tab S7+"});
                                insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Galaxy Tab S7"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Tab S7"});
                                insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Samsung",model:"Tab S4"});
                                insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            break;
                        case "Apple":
                            if(element.productname[0].includes("iPhone 11 Pro Max"))
                            {                           
                                let compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone 11 Pro Max"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("iPhone 11 Pro"))
                            {                          
                                let compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone 11 Pro"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("iPhone 11"))
                            {                          
                                let compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone 11"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("iPhone 8 / 7 "))
                            {                           
                                let compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone 7 / 8 "});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("iPhone 8 Plus / 7 Plus"))
                            {                          
                                let compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone 7 Plus / 8 Plus"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("iPhone XS Max"))
                            {                           
                                let compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone XS Max"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("iPhone XS"))
                            {                           
                                let compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone XS"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("iPhone Xs"))
                            {                           
                                let compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone XS"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("iPhone X"))
                            {                         
                                let compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone X"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("iPhone SE 2020/8/7)"))
                            {                          
                                let compatibilities = [];
                                compatibilities.push({company:"Apple",model:"iPhone 7 / 8 / SE 2020"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }                            
                            break;
                        case "Lenovo":
                                let compatibilities = [];
                                compatibilities.push({company:"Lenovo",model:"A328"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            break;
                        case "Nokia":
                            if(element.productname[0].includes("Nokia 6"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Nokia",model:"6"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            } 
                            else if(element.productname[0].includes("Nokia 5"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Nokia",model:"5"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            else if(element.productname[0].includes("Nokia CC-110"))
                            {
                                let compatibilities = [];
                                compatibilities.push({company:"Nokia",model:"CC-110"});
                                insertProductWithCompatibility(element.productname[0],"Kινητά","Θήκες-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                            }
                            break;
                        default:
                            // data.push(element.productname[0].split(" ")[0].trim())
                            break;
                    }
                }

                const phone_accessories = () =>{
                    switch (element.category[0].split("//")[2].trim()) {
                        case "Φορτιστές":
                            insertProduct(element.productname[0],"Kινητά","Φορτιστές-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                                break;
                        case "Bluetooth":
                            insertProduct(element.productname[0],"Kινητά","Bluetooth",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                                break;
                        case "Προστασία Οθόνης":
                            // data.push(element.productname[0])//.split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                            insertProduct(element.productname[0],"Kινητά","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                                break;
                        case "Powerbanks":
                            insertProduct(element.productname[0],"Μπαταρίες","PowerBanks",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Ακουστικά/Ηχεία":
                            insertProduct(element.productname[0],"Kινητά","Handsfree",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                                break;
                        case "Καλώδια/Αντάπτορες":
                            if(element.productname[0].includes("Αντάπτορας"))
                            {
                                insertProduct(element.productname[0],"Kινητά","Adapters-Φόρτισης-Δεδομένων",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            }
                            else
                            {
                                insertProduct(element.productname[0],"Kινητά","Καλώδια-Φόρτισης-Δεδομένων",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            }
                            break;
                        case "Βάσεις Κινητών/Selfie Sticks":
                            if(element.productname[0].includes("Selfie"))
                            {
                                insertProduct(element.productname[0],"Kινητά","Selfie-Sticks",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            }
                            else
                            {
                                insertProduct(element.productname[0],"Kινητά","Βάσεις-Στήριξης-Κινητών",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            }
                            break;
                        case "Κάρτες Μνήμης":
                            insertProduct(element.productname[0],"Αποθηκευτικά-Μέσα","Memory-Cards",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                                break;
                        case "Γραφίδες":
                            insertProduct(element.productname[0],"Kινητά","Γραφίδες",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Sim":
                            insertProduct(element.productname[0],"Kινητά","Διάφορα-αξεσουάρ",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Διάφορα":
                            insertProduct(element.productname[0],"Kινητά","Διάφορα-αξεσουάρ",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Θήκες Κινητών":
                            phoneCases();
                            break;                        
                        default: 
                            // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                            break;
                    }
                }

                const tabletCases = () =>{
                    switch (element.productname[0].split(" ")[0].trim()) {
                        case "Huawei": 
                            let compatibilities = [];
                            compatibilities.push({company:"Huawei",model:"MediaPad T3 10"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        break;
                        case "Apple":                         
                        if(element.productname[0].includes("12.9-inch iPad Pro"))
                        {
                            compatibilities = [];
                            compatibilities.push({company:"Apple",model:"iPad Pro 12.9"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("12.9 iPad Pro"))
                        {
                            compatibilities = [];
                            compatibilities.push({company:"Apple",model:"iPad Pro 12.9"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("11-inch iPad Pro"))
                        {
                            compatibilities = [];
                            compatibilities.push({company:"Apple",model:"iPad Pro 11"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("iPad Pro 10.5"))
                        {
                            compatibilities = [];
                            compatibilities.push({company:"Apple",model:"iPad Pro 10.5"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("iPad mini"))
                        {
                            compatibilities = [];
                            compatibilities.push({company:"Apple",model:"iPad Mini"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("iPad 9.7"))
                        {
                            compatibilities = [];
                            compatibilities.push({company:"Apple",model:"iPad 9.7"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("iPad Air 10.5"))
                        {
                            compatibilities = [];
                            compatibilities.push({company:"Apple",model:"iPad Air 10.5"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        break;
                        case "Samsung":                                             
                        if(element.productname[0].includes("Galaxy Tab A 10.1"))
                        {   
                            compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"Tab A 10.1"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("Galaxy Tab S6 Lite 10.4"))
                        { 
                            compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"Tab S6 Lite 10.4"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("Galaxy Tab S6 Lite"))
                        {   
                            compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"Tab S6 Lite"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("Galaxy Tab S6"))
                        { 
                            compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"Tab S6"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("Galaxy Tab S3"))
                        {   
                            compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"Tab S3"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        else if(element.productname[0].includes("Galaxy Tab A"))
                        { 
                            compatibilities = [];
                            compatibilities.push({company:"Samsung",model:"Tab A 10.1"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        }
                        break;
                        case "Lenovo":
                            compatibilities = [];
                            compatibilities.push({company:"Lenovo",model:"Thinkpad Quick Shot"});
                            insertProductWithCompatibility(element.productname[0],"Tablet","Θήκες-Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                        break;                        
                    }                    
                }

                const tablet_screen_protection = () =>{
                    if(element.productname[0].includes("IPAD AIR/AIR 2/IPAD PRO 9.7"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Apple",model:"AIR/AIR 2/PRO 9.7"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("AIR/IPAD AIR 2/IPAD PRO 9,7"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Apple",model:"IPAD AIR/AIR 2/PRO 9.7"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("IPAD PRO 12.9"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Apple",model:"IPAD PRO 12.9"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("IPAD MINI"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Apple",model:"IPAD MINI 4"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("IPAD AIR"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Apple",model:"IPAD AIR"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("Huawei MediaPad T3 9.6")){
                        let compatibilities = [];
                        compatibilities.push({company:"Huawei",model:"MediaPad T3 9.6"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("Huawei MediaPad T5 10.1")){
                        let compatibilities = [];
                        compatibilities.push({company:"Huawei",model:"MediaPad T5 10.1"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("SAMSUNG TAB A 2016 T580/T585 10.1"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Samsung",model:"TAB A 2016 T580/T585 10.1"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("SAMSUNG TAB A 2016 T280/T285 7.0"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Samsung",model:"TAB A 2016 T280/T285 7.0"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("SAMSUNG TAB S2 T710/T715/T719 8.0"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Samsung",model:"TAB S2 T710/T715/T719 8.0"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("Galaxy Tab A 10.1 2019 T510/T515"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Samsung",model:"Tab A T510/T515 10.1"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("Samsung Galaxy Tab A 8.0 T290/295/297"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Samsung",model:"Tab A 8.0 T290/295/297"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("SAMSUNG TAB A T550/T555 9.7"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Samsung",model:"TAB A T550/T555 9.7"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("SAMSUNG TAB S2 9.7"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Samsung",model:"SAMSUNG TAB S2 9.7"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                    else if(element.productname[0].includes("TAB S2 8"))
                    {
                        let compatibilities = [];
                        compatibilities.push({company:"Samsung",model:"TAB S2 8"});
                        insertProductWithCompatibility(element.productname[0],"Tablet","Προστασία-Οθόνης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",compatibilities,element.order_delivery[0])
                    }
                }

                const tablet_accessories = () =>{
                    switch (element.category[0].split("//")[2].trim()) {
                        case "Φορτιστές":
                            insertProduct(element.productname[0],"Tablet","Φορτιστές-tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Προστασία Οθόνης":
                            tablet_screen_protection();
                            break;
                        case "Θήκες":
                            tabletCases();
                            break;
                        case "Βάσεις":
                            insertProduct(element.productname[0],"Tablet","Βάσεις",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                                break;
                        default: 
                            // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                            break;
                    }
                }

                const tablets = () =>{
                    switch (element.category[0].split("//")[1].trim()) {
                        case "Αξεσουάρ Tablet":
                            tablet_accessories();
                            break;
                        case "Brands":
                            insertProduct(element.productname[0],"Tablet","Tablet",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        default:
                            break;
                    }
                }

                const mobiles_smartwatches = () =>{
                    switch (element.category[0].split("//")[1].trim()) {
                        case "Αξεσουάρ":
                            phone_accessories();
                            break;
                        case "Κινητά Τηλέφωνα":
                            insertProduct(element.productname[0],"Kινητά","Kινητά",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Σταθερά":
                            // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                            if(element.category[0].split("//")[2].trim()==="IP Τηλεφωνία")
                            {
                                let features = []; 
                                features.push({featureTitle:"Είδος Συσκευής",featureName:"IP Τηλεφωνία"});
                                insertProduct(element.productname[0],"είδη-γραφείου","Σταθερά-Τηλέφωνα",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            }
                            else if(element.category[0].split("//")[2].trim()==="Ενσύρματα")
                            {
                                let features = []; 
                                features.push({featureTitle:"Είδος Συσκευής",featureName:"Ενσύρματα"});
                                insertProductWithFeature(element.productname[0],"είδη-γραφείου","Σταθερά-Τηλέφωνα",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",features,element.order_delivery[0]);
                            }
                            else if(element.category[0].split("//")[2].trim()==="Ασύρματα")
                            {
                                let features = []; 
                                features.push({featureTitle:"Είδος Συσκευής",featureName:"Ασύρματα"});
                                insertProductWithFeature(element.productname[0],"είδη-γραφείου","Σταθερά-Τηλέφωνα",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",features,element.order_delivery[0]);
                            }
                            else if(element.category[0].split("//")[2].trim()==="Συσκευές Fax")
                            {
                                let features = []; 
                                features.push({featureTitle:"Είδος Συσκευής",featureName:"Συσκευές Fax"});
                                insertProductWithFeature(element.productname[0],"είδη-γραφείου","Σταθερά-Τηλέφωνα",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",features,element.order_delivery[0]);
                            }
                            break;
                        default:  
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                            break;
                    }
                }

                const gaming_cataloge = () =>{
                    switch (element.category[0].split("//")[2].trim()) {
                        case "Gamepads":
                            insertProduct(element.productname[0],"Gaming","Gamepads",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Παιχνίδια":
                            insertProduct(element.productname[0],"Gaming","Παιχνίδια",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Virtual Reality":
                            insertProduct(element.productname[0],"Gaming","Virtual-Reality",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Αξεσουάρ":
                            insertProduct(element.productname[0],"Gaming","Αξεσουάρ",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Τιμονιέρες":
                            insertProduct(element.productname[0],"Gaming","Τιμονιέρες",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Joysticks":
                            insertProduct(element.productname[0],"Gaming","Joysticks",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Gaming Chair":
                            insertProduct(element.productname[0],"Gaming","Gaming-Chair",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;                    
                        default:
                            // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                            break;
                    }
                }

                const gaming = () =>{
                    switch (element.category[0].split("//")[1].trim()) {
                        case "Gaming":
                            gaming_cataloge();
                            break;
                        default:
                            break;
                    }
                }

                const cameras = () =>{
                    switch (element.category[0].split("//")[2].trim()) {
                        case "Θήκες/Τσάντες":
                            // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                            insertProduct(element.productname[0],"Cameras","Θήκες-Τσάντες",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Φακοί/Flash Κάμερας":
                            // data.push(element.productname[0]); 
                            insertProduct(element.productname[0],"Cameras","Φακοί-Flash",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Τρίποδα":
                            insertProduct(element.productname[0],"Cameras","Τρίποδα",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        default:
                            insertProduct(element.productname[0],"Cameras","Photo-Cameras",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                    }
                }

                const multimedia_accessories = () =>{
                    if(element.category[0].split("//")[2]!==undefined)
                    {
                        switch (element.category[0].split("//")[2].trim()) {
                            case "Ήχος":
                                insertProduct(element.productname[0],"Μultimedia","Αξεσουάρ-Ήχου",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                                break;
                            case "Κάμερα":
                                insertProduct(element.productname[0],"Cameras","Αξεσουάρ-Κάμερας",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                                break;
                        
                            default:
                                // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                                break;
                        }
                    }
                }

                const sound = () =>{
                    switch (element.category[0].split("//")[2].trim()) {
                        case "Ηχεία":
                            insertProduct(element.productname[0],"Μultimedia","Ηχεία",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "MP3-MP4":
                            insertProduct(element.productname[0],"Μultimedia","mp3-mp4-players",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Μικρόφωνα":
                            insertProduct(element.productname[0],"Μultimedia","Μικρόφωνα",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Ακουστικά":
                            insertProduct(element.productname[0],"Μultimedia","Headsets",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Ηχοσυστήματα Αυτοκινήτου":
                            insertProduct(element.productname[0],"Μultimedia","Ηχοσυστήματα-Αυτοκινήτου",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Ραδιόφωνο":
                            insertProduct(element.productname[0],"Μultimedia","Ραδιόφωνα",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                             break;
                        case "Ηχοσυστήματα":
                            insertProduct(element.productname[0],"Μultimedia","Ηχοσυστήματα",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Φορητά Ηχοσυστήματα":
                            insertProduct(element.productname[0],"Μultimedia","Φορητά-Ηχοσυστήματα",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Walkie Talkie/Συσκευές Υπαγόρευσης":
                            insertProduct(element.productname[0],"Μultimedia","Walkie-Talkie-Συσκευές-Υπαγόρευσης",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Πικάπ":
                            insertProduct(element.productname[0],"Μultimedia","Πικάπ",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Karaoke":
                            insertProduct(element.productname[0],"Μultimedia","Karaoke",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;                    
                        default:
                            break;
                    }
                }

                const tv_accessories = ()=>{
                    switch (element.category[0].split("//")[2].trim()) {
                        case "Βάσεις Τηλεοράσεων":
                            insertProduct(element.productname[0],"Μultimedia","Βάσεις-Στήριξης-TV",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Κεραίες":
                            insertProduct(element.productname[0],"Μultimedia","Κεραίες-TV",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Ψηφιακοί Δεκτές/Αποκωδικοποιητές":
                            insertProduct(element.productname[0],"Μultimedia","Ψηφιακοί-Δεκτές-Αποκωδικοποιητές",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Media Players":
                            insertProduct(element.productname[0],"Μultimedia","Media-Players",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Home Cinema":
                            insertProduct(element.productname[0],"Μultimedia","Home-Cinema",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Αξεσουάρ":
                            insertProduct(element.productname[0],"Μultimedia","Αξεσουάρ-TV",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Φορήτες Τηλεοράσεις":
                            insertProduct(element.productname[0],"Μultimedia","Φορήτες-Τηλεοράσεις",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        default:
                            insertProduct(element.productname[0],"Μultimedia","Τηλεοράσεις",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                    }
                }

                const multimedia = () =>{
                    switch (element.category[0].split("//")[1].trim()) {
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
                            // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                            break;
                    }
                }

                const freeTime = () =>{
                    switch (element.category[0].split("//")[2].trim()) {
                        case "Κυάλια":
                            insertProduct(element.productname[0],"Gadgets","Κυάλια",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Πατίνια":
                            insertProduct(element.productname[0],"Gadgets","Πατίνια",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Μικροσκοπία":
                            insertProduct(element.productname[0],"Gadgets","Μικροσκοπία",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        default:
                            break;
                    }
                }

                const auto_moto = () =>{
                    switch (element.category[0].split("//")[2].trim()) {
                        case "Συσκευές Πλοήγησης GPS":
                            insertProduct(element.productname[0],"Gadgets","Συσκευές-Πλοήγησης-GPS",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Κάμερες Αυτοκινήτου":
                            insertProduct(element.productname[0],"Gadgets","Κάμερες-Αυτοκινήτου",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Αξεσουάρ":
                            insertProduct(element.productname[0],"Gadgets","Αξεσουάρ-Αυτοκινήτου",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Διάφορα":
                            insertProduct(element.productname[0],"Gadgets","Διάφορα",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        default:
                            break;
                    }
                }

                const gadgets = () =>{
                    switch (element.category[0].split("//")[1].trim()) {
                        case "Ελεύθερος Χρόνος":
                            freeTime();
                            break;
                        case "Auto-Moto":
                            auto_moto();
                            break;
                        case "Ψηφιακές Κορνίζες":
                            insertProduct(element.productname[0],"Gadgets","Ψηφιακές-Κορνίζες",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                        case "Drones":
                            insertProduct(element.productname[0],"Gadgets","Drones",element.manufacturer[0],element.image[0],element.order_price[0],element.weight[0],element.mpn[0],"hellasphone",element.order_delivery[0]);
                            break;
                    
                        default:
                            // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                            break;
                    }
                }
                
                switch (element.category[0].split("//")[0].trim()){
                    case "Πληροφορική":
                        break;
                    case "Living":
                        break;
                    case "Τηλεφωνία":
                        mobiles_smartwatches();
                        break;
                    case "Tablets":
                        tablets();
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        break;
                    case "Gaming":
                        gaming();
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        break;
                    case "Ήχος/Εικόνα":
                        multimedia();
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        break;
                    case "Gadgets":
                        gadgets();
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        break;
                    default:
                        //  data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        break;
                }
            }
            res.send(data)
            // res.send(result.products.product.category[0]);
        });
    });
})


export default router;