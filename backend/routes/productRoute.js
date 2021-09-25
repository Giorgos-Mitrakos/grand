import express from 'express';
import mysqlConnection from '../connection';
import { isAdmin, isAuth } from '../util';

const router = express.Router();

router.get("/", async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        connection.query('SELECT * FROM products WHERE visibility=1', function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(result);
            connection.release();

            // Handle error after the release.
            if (err) throw err;
        })
    });
})

router.get("/collectionlist", async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        var sql = `SELECT _id, name, category, brand, image, description,
        countInStock, numReview, subcategory, weight, supplier, availability, 
        visibility, totalPrice FROM products WHERE category=? && visibility=1`;
        connection.query(sql, ["Συλλογή"], function (err, result, fields) {
            if (err) throw err;

            res.status(200).send(result);
        });

        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });

})

router.get("/collectionrandomlist", async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        var sql = `SELECT _id, name, category, brand, image, description,
        countInStock, numReview, subcategory, weight, supplier, availability, 
        visibility, totalPrice FROM products WHERE category=? && visibility=1
        ORDER BY RAND() LIMIT 10`;
        connection.query(sql, ["Συλλογή"], function (err, result, fields) {
            if (err) throw err;

            res.status(200).send(result);
        });

        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });

})

router.get("/collectionDetails/:id", async (req, res) => {
    const collectionId = req.params.id;
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        /* Begin transaction */
        connection.beginTransaction(function (err) {
            if (err) { throw err; }

            var sql = 'UPDATE products set numReview= numReview+1 WHERE _id=?';
            connection.query(sql, collectionId, function (err, result) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                var sql = 'SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice FROM products WHERE _id=?';
                connection.query(sql, collectionId, function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    res.status(200).send(result[0]);
                    connection.commit(function (err) {
                        if (err) {
                            connection.rollback(function () {
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

router.post("/products_by_category", async (req, res) => {

    let brandsStr = "";
    if (req.body.brandFilters.length != 0) {
        let filt = req.body.brandFilters;
        for (let i = 0; i < filt.length; i++) {
            let brand = filt[i]
            if (i === 0) {
                brandsStr += `&& (products.brand= '${brand}'`
            }
            else {
                brandsStr += ` OR products.brand= '${brand}'`
            }
        }
        brandsStr += `)`
    }

    let features = "";
    if (req.body.filter.length != 0) {
        features += `EXISTS
        ( SELECT product_id 
            FROM features 
            WHERE products._id=features.product_id`
        let filt = req.body.filter;
        for (let i = 0; i < filt.length; i++) {
            let feature = filt[i].split('_')
            if (i === 0) {
                features += ` AND ((feature_title= '${feature[0]}' 
                AND feature= '${feature[1]}')`
            }
            else {
                features += ` OR (feature_title= '${feature[0]}' 
                AND feature= '${feature[1]}')`
            }
        }
        features += `)) AND`
    }

    let compCompanyStr = "";
    if (req.body.compCompanyFilter.length > 0) {
        let compCompFilter = req.body.compCompanyFilter;
        let compModelFilter = req.body.compModelFilter;

        compCompanyStr += `EXISTS
        ( SELECT product_id 
            FROM compatibilities 
            WHERE products._id=compatibilities.product_id`

        if (req.body.compModelFilter.length === 0) {

            for (let i = 0; i < compCompFilter.length; i++) {
                let company = compCompFilter[i]
                if (i === 0) {
                    compCompanyStr += ` AND ((compatibility_company= '${company}')`
                }
                else {
                    compCompanyStr += ` OR (compatibility_company= '${company}')`
                }
            }

            compCompanyStr += `)) AND`
        }
        else
        {
            for (let i = 0; i < compCompFilter.length; i++) {
                let company = compCompFilter[i]
                if (i === 0) {                    
                    for (let j = 0; j < compModelFilter.length; j++) {
                        let model = compModelFilter[j];
                        if(j===0)
                        {
                            compCompanyStr += ` AND ((`
                        }
                        else
                        {
                            compCompanyStr += ` OR (`
                        }
                        compCompanyStr += `compatibility_company= '${company}'
                        AND compatibility_model='${model}')`
                    }                    
                }
                else {
                    for (let j = 0; j < compModelFilter.length; j++) {
                        let model = compModelFilter[j];
                        compCompanyStr += ` OR (`
                        
                        compCompanyStr += `compatibility_company= '${company}'
                        AND compatibility_model='${model}')`
                    }
                    
                }
            }

            compCompanyStr += `)) AND`
        }
        console.log(compCompanyStr)
    }

    let page = parseInt(req.body.page) || 0
    let iPerPage = parseInt(req.body.itemsPerPage) || 12
    let offset = page * iPerPage
    let sortedBy = "";
    switch (req.body.sortType) {
        case "alphabetic":
            sortedBy = "ORDER BY name"
            break;

        case "alphabeticDESC":
            sortedBy = "ORDER BY name DESC"
            break;

        case "price":
            sortedBy = "ORDER BY totalPrice"
            break;

        case "priceDESC":
            sortedBy = "ORDER BY totalPrice DESC"
            break;

        default:
            sortedBy = "ORDER BY name"
            break;
    }
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        connection.beginTransaction(function (err) {
            if (err) { throw err; }
            var sql = `SELECT Count(*) as count
            FROM products
            WHERE 
            ${features} 
            ${compCompanyStr}
            products.category=? 
            && products.subcategory=? 
            && products.visibility=1
            ${brandsStr}
            `;
            connection.query(sql, [req.body.category, req.body.subcategory], function (err, result, fields) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                let count = result[0].count;

                connection.query(`SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice 
                FROM products
                WHERE 
                ${features}
                ${compCompanyStr}
                products.category=? 
                && products.subcategory=? 
                && products.visibility=1
                ${brandsStr}
                ${sortedBy}
                LIMIT ?
                OFFSET ?`,
                    [req.body.category, req.body.subcategory, iPerPage, offset], function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        let products = result;

                        connection.query(`SELECT DISTINCT brand
                            FROM products
                            WHERE products.category=? 
                            && products.subcategory=? 
                            && products.visibility=1`,
                            [req.body.category, req.body.subcategory], function (err, result, fields) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }

                                let dictinctBrands = result;

                                connection.query(`SELECT DISTINCT brand
                                        FROM products                                        
                                        WHERE 
                                        ${features}
                                        ${compCompanyStr}
                                        products.category=? 
                                        && products.subcategory=? 
                                        && products.visibility=1`,
                                    [req.body.category, req.body.subcategory], function (err, result, fields) {
                                        if (err) {
                                            connection.rollback(function () {
                                                throw err;
                                            });
                                        }

                                        let excludedBrands = result;

                                        connection.commit(function (err) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    throw err;
                                                });
                                            }
                                            res.status(200).send({ products, count, dictinctBrands, excludedBrands });
                                            console.log('Transaction Completed Successfully.');
                                        });
                                    });
                            });
                    })
                connection.release();

                // Handle error after the release.
                if (err) throw err;
            })
        })
    });
})

router.get("/featurelist", async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
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

router.post("/feature_title_by_category", async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        connection.query('SELECT DISTINCT features.feature_title FROM products LEFT JOIN features ON products._id=features.product_id WHERE products.category=? && products.subcategory=? && products.visibility=1 && features.feature_title IS NOT NULL',
            [req.body.category, req.body.subcategory], function (err, result, fields) {
                if (err) throw err;
                console.log("Read products succeed");
                res.send(result);
                connection.release();

                // Handle error after the release.
                if (err) throw err;
            })
    });
})

router.post("/feature_name_by_category", async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        connection.query('SELECT DISTINCT features.feature_title,features.feature FROM products LEFT JOIN features ON products._id=features.product_id WHERE products.category=? && products.subcategory=? && products.visibility=1 && features.feature_title IS NOT NULL',
            [req.body.category, req.body.subcategory], function (err, result, fields) {
                if (err) throw err;
                console.log("Read products succeed");
                res.send(result);
                connection.release();

                // Handle error after the release.
                if (err) throw err;
            })
    });
})

router.post("/compatibilities_by_category", async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        connection.query(`SELECT compatibility_id,product_id,compatibility_company,compatibility_model 
        FROM compatibilities LEFT JOIN products 
        ON products._id=compatibilities.product_id 
        WHERE products.category=? && products.subcategory=? && products.visibility=1 && compatibilities.compatibility_company IS NOT NULL 
        ORDER BY compatibilities.compatibility_company,compatibilities.compatibility_model `,
            [req.body.category, req.body.subcategory], function (err, result, fields) {
                if (err) throw err;
                console.log("Read compatibility companies succeed");
                res.send(result);
                connection.release();

                // Handle error after the release.
                if (err) throw err;
            })
    });
})

router.post("/products_by_category_admin", isAuth, isAdmin, async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        if (req.body.supplier === '' || req.body.supplier === 'Επέλεξε Προμηθευτή' || req.body.supplier === null || req.body.supplier === undefined) {
            if (req.body.subcategory === '' || req.body.subcategory === 'Επέλεξε Υποκατηγορία' || req.body.subcategory === null || req.body.subcategory === undefined) {
                connection.query('SELECT * FROM products WHERE category=? LIMIT 20 OFFSET ? ',
                    [req.body.category, req.body.offset], function (err, result, fields) {
                        if (err) throw err;
                        let resp = result;

                        connection.query('SELECT COUNT(*) AS count FROM products WHERE category=?',
                            [req.body.category], function (err, result, fields) {
                                if (err) throw err;
                                let count = result;

                                res.send({ resp, count });
                            })

                    })
            }
            else {
                connection.query('SELECT * FROM products WHERE category=? && subcategory=? LIMIT 20 OFFSET ?',
                    [req.body.category, req.body.subcategory, req.body.offset], function (err, result, fields) {
                        if (err) throw err;
                        let resp = result;

                        connection.query('SELECT COUNT(*) AS count FROM products WHERE category=? && subcategory=?',
                            [req.body.category, req.body.subcategory], function (err, result, fields) {
                                if (err) throw err;
                                let count = result;

                                res.send({ resp, count });
                            })
                    })
            }
        }
        else {
            if (req.body.category === '' || req.body.category === 'Επέλεξε Κατηγορία' || req.body.category === null || req.body.category === undefined) {
                connection.query('SELECT * FROM products WHERE  supplier=? LIMIT 20 OFFSET ?',
                    [req.body.supplier, req.body.offset], function (err, result, fields) {
                        if (err) throw err;
                        let resp = result;

                        connection.query('SELECT COUNT(*) AS count FROM products WHERE supplier=?',
                            [req.body.supplier], function (err, result, fields) {
                                if (err) throw err;
                                let count = result;

                                res.send({ resp, count });
                            })
                    })
            }
            else {
                if (req.body.subcategory === '' || req.body.subcategory === 'Επέλεξε Υποκατηγορία' || req.body.subcategory === null || req.body.subcategory === undefined) {
                    connection.query('SELECT * FROM products WHERE category=? && supplier=? LIMIT 20 OFFSET ?',
                        [req.body.category, req.body.supplier, req.body.offset], function (err, result, fields) {
                            if (err) throw err;
                            let resp = result;

                            connection.query('SELECT COUNT(*) AS count FROM products WHERE category=? && supplier=?',
                                [req.body.category, req.body.supplier], function (err, result, fields) {
                                    if (err) throw err;
                                    let count = result;

                                    res.send({ resp, count });
                                })
                        })
                }
                else {
                    connection.query('SELECT * FROM products WHERE category=? && subcategory=? && supplier=? LIMIT 20 OFFSET ?',
                        [req.body.category, req.body.subcategory, req.body.supplier, req.body.offset], function (err, result, fields) {
                            if (err) throw err;
                            let resp = result;

                            connection.query('SELECT COUNT(*) AS count FROM products WHERE category=? && subcategory=? && supplier=?',
                                [req.body.category, req.body.subcategory, req.body.supplier], function (err, result, fields) {
                                    if (err) throw err;
                                    let count = result;

                                    res.send({ resp, count });
                                })
                        })
                }
            }
        }
        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
})

router.post("/product_by_name_admin", isAuth, isAdmin, async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        const nameSearch = `%${req.body.productName.trim()}%`

        connection.query('SELECT * FROM products WHERE name LIKE ? LIMIT 20 OFFSET ? ',
            [nameSearch, req.body.offset], function (err, result, fields) {
                if (err) throw err;
                let resp = result;

                connection.query('SELECT COUNT(*) AS count FROM products WHERE name LIKE ?',
                    [nameSearch], function (err, result, fields) {
                        if (err) throw err;
                        let count = result;

                        res.send({ resp, count });
                    })

            })
        connection.release();

        // Handle error after the release.
        if (err) throw err;
    });
})

router.get("/:id", async (req, res) => {
    const productId = req.params.id;
    mysqlConnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        /* Begin transaction */
        connection.beginTransaction(function (err) {
            if (err) { throw err; }

            var sql = 'UPDATE products set numReview= numReview+1 WHERE _id=?';
            connection.query(sql, productId, function (err, result) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                sql = 'SELECT _id, name, category, brand, image, description,countInStock, numReview, subcategory, weight, supplier, availability, visibility, totalPrice FROM products WHERE _id=?';
                connection.query(sql, productId, function (err, result, fields) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    var product = result[0]

                    sql = 'SELECT compatibility_company, compatibility_model FROM compatibilities WHERE product_id=?';
                    connection.query(sql, productId, function (err, result, fields) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        var compatibilities = result;

                        sql = 'SELECT feature_title, feature FROM features WHERE product_id=?';
                        connection.query(sql, productId, function (err, result, fields) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }

                            var features = result;

                            res.status(200).send({ product, compatibilities, features });
                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
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
            });
        });
        /* End transaction */
    });
})

router.post("/most_viewed", async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
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

router.post("/searchForItems", async (req, res) => {
    mysqlConnection.getConnection(function (err, connection) {
        let sp = req.body.searchText.trim().split(" ")
        let search = '(';
        for (let i = 0; i < sp.length; i++) {
            if (i !== 0) {
                search += ' && '
            }
            search += 'name LIKE ' + "'%" + sp[i] + "%'"
        };
        search += ' OR( '
        for (let i = 0; i < sp.length; i++) {
            if (i !== 0) {
                search += ' && '
            }
            search += 'subcategory LIKE ' + "'%" + sp[i] + "%'"
        };
        search += ' ) '
        search += ' OR( '
        for (let i = 0; i < sp.length; i++) {
            if (i !== 0) {
                search += ' && '
            }
            search += 'category LIKE ' + "'%" + sp[i] + "%'"
        };
        search += ' )) '

        let filters = '';
        if (req.body.filters !== null && req.body.filters.length !== 0) {
            filters += '&&('
            for (let i = 0; i < req.body.filters.length; i++) {
                if (i !== 0) {
                    filters += ' OR (category="' + req.body.filters[i].category + '" && subcategory="' + req.body.filters[i].subcategory + '")'
                }
                else {
                    filters += ' (category="' + req.body.filters[i].category + '" && subcategory="' + req.body.filters[i].subcategory + '")'
                }
            }
            filters += ')'
        }

        let sortBy = ''
        switch (req.body.sortType) {
            case 'Αλφαβητικά: Α-Ω':
                sortBy = 'name'
                break;
            case 'Αλφαβητικά: Ω-Α':
                sortBy = 'name DESC'
                break;
            case 'Τιμή αύξουσα':
                sortBy = 'totalPrice'
                break;
            case 'Τιμή φθίνουσα':
                sortBy = 'totalPrice DESC'
                break;
            default:
                sortBy = 'numReview DESC'
                break;
        }
        if (err) throw err; // not connected!

        connection.query(`SELECT _id, name, category, brand, image, description,
        countInStock, numReview, subcategory, weight, supplier, availability, 
        visibility, totalPrice FROM products 
        WHERE visibility=1 &&
        ${search} 
        ${filters}         
        ORDER BY ${sortBy} LIMIT ${req.body.itemsPerPage} OFFSET ${req.body.offset}`, function (err, result, fields) {
            if (err) throw err;

            let resp = result;

            connection.query(`SELECT COUNT(*) AS count FROM products 
                    WHERE visibility=1 && 
                    ${search} 
                    ${filters}`,
                function (err, result, fields) {
                    if (err) throw err;
                    let count = result;

                    connection.query(`SELECT DISTINCT category FROM products 
                            WHERE visibility=1 && 
                            ${search}`,
                        function (err, result, fields) {
                            if (err) throw err;
                            let categories = result;

                            connection.query(`SELECT DISTINCT category, subcategory FROM products 
                            WHERE visibility=1 && 
                            ${search}`,
                                function (err, result, fields) {
                                    if (err) throw err;
                                    let subcategories = result;

                                    res.send({ resp, count, categories, subcategories });
                                })
                        })
                })
            connection.release();

            // Handle error after the release.
            if (err) throw err;
        })
    });
})

export default router;