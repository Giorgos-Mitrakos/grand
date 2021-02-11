"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireDefault(require("fs"));

var _xml2js = _interopRequireDefault(require("xml2js"));

var _connection = _interopRequireDefault(require("../connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express["default"].Router();

router.get("/", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var parser;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            parser = new _xml2js["default"].Parser();

            _fs["default"].readFile('C:/Users/Giorgos/reactApp/grand/frontend/src/images/hellasphone.xml', function (err, data) {
              parser.parseString(data, function (err, result) {
                console.dir(result.products.product.length);
                console.log('Done');

                var insertProduct = function insertProduct(name, category, subcategory, brand, image, price, weight, mpn, supplier, availability) {
                  _connection["default"].getConnection(function (err, connection) {
                    if (err) throw err; // not connected!

                    var sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier, availability) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [name, category, subcategory, brand, image, price, weight, mpn, supplier, availability], function (err, result, fields) {
                      if (err & err != "ER_DUP_ENTRY") {
                        console.log("Entry is already");
                      }

                      sql = "INSERT INTO manufacturers (name) VALUES(?)";
                      connection.query(sql, [brand], function (err, result, fields) {
                        if (err & err != "ER_DUP_ENTRY") {
                          console.log("Entry is already");
                        }
                      });
                    });
                    connection.release(); // Handle error after the release.

                    if (err) throw err;
                  });
                };

                var insertProductWithFeature = function insertProductWithFeature(name, category, subcategory, brand, image, price, weight, mpn, supplier, featureArray, availability) {
                  _connection["default"].getConnection(function (err, connection) {
                    if (err) throw err; // not connected!

                    featureArray.forEach(function (featArr) {
                      var sql = "INSERT INTO feature_titles (feature_title) VALUES (?)";
                      connection.query(sql, [featArr.featureTitle], function (err, result, fields) {
                        if (err & err != "ER_DUP_ENTRY") {
                          console.log("Entry is already");
                        }

                        var title_id = '';

                        if (!err) {
                          title_id = result.insertId;
                          sql = "INSERT INTO feature_names (feature_title_id, feature_name) VALUES (?, ?)";
                          connection.query(sql, [title_id, featArr.featureName], function (err, result, fields) {
                            if (err & err != "ER_DUP_ENTRY") {
                              console.log("Entry is already");
                            }
                          });
                        } else {
                          sql = "SELECT feature_title_id FROM feature_titles WHERE feature_title=?";
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
                            });
                          });
                        }
                      });
                    });
                    var sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [name, category, subcategory, brand, image, price, weight, mpn, supplier, availability], function (err, result, fields) {
                      if (err & err != "ER_DUP_ENTRY") {
                        console.log("Entry is already");
                      }

                      if (result) {
                        var product_id = result.insertId;
                        featureArray.forEach(function (featArr) {
                          sql = "INSERT INTO features (product_id, feature_title, feature) VALUES (?, ?, ?)";
                          connection.query(sql, [product_id, featArr.featureTitle, featArr.featureName], function (err, result, fields) {
                            if (err) {
                              console.log("Entry is already");
                            }

                            sql = "INSERT INTO manufacturers (name) VALUES(?)";
                            connection.query(sql, [brand], function (err, result, fields) {
                              if (err & err != "ER_DUP_ENTRY") {
                                console.log("Entry is already");
                              }
                            });
                          });
                        });
                      }
                    });
                    connection.release(); // Handle error after the release.

                    if (err) throw err;
                  });
                };

                var insertProductWithCompatibility = function insertProductWithCompatibility(name, category, subcategory, brand, image, price, weight, mpn, supplier, compatibilityArray, availability) {
                  _connection["default"].getConnection(function (err, connection) {
                    if (err) throw err; // not connected!

                    compatibilityArray.forEach(function (compArr) {
                      var sql = "INSERT INTO compatibility_company (company) VALUES (?)";
                      connection.query(sql, [compArr.company], function (err, result, fields) {
                        if (err & err != "ER_DUP_ENTRY") {
                          console.log("Entry is already");
                        }

                        var company_id = '';

                        if (!err) {
                          company_id = result.insertId;
                          sql = "INSERT INTO compatibility_model (compatibility_company_id, model) VALUES (?, ?)";
                          connection.query(sql, [company_id, compArr.model], function (err, result, fields) {
                            if (err & err != "ER_DUP_ENTRY") {
                              console.log("Entry is already");
                            }
                          });
                        } else {
                          sql = "SELECT compatibility_company_id FROM compatibility_company WHERE company=?";
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
                            });
                          });
                        }
                      });
                    });
                    var sql = "INSERT INTO products (name, category, subcategory, brand, image, price, weight, MPN, supplier,  availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(sql, [name, category, subcategory, brand, image, price, weight, mpn, supplier, availability], function (err, result, fields) {
                      if (err & err != "ER_DUP_ENTRY") {
                        console.log("Entry is already");
                      }

                      if (result) {
                        var product_id = result.insertId;
                        compatibilityArray.forEach(function (compArr) {
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
                            });
                          });
                        });
                      }
                    });
                    connection.release(); // Handle error after the release.

                    if (err) throw err;
                  });
                };

                var data = [];

                var _loop = function _loop(index) {
                  var element = result.products.product[index];

                  var phoneCases = function phoneCases() {
                    switch (element.productname[0].split(" ")[0].trim()) {
                      case "Huawei":
                        // data.push(element.productname[0].split(" ")[0].trim());               
                        if (element.productname[0].includes("P Smart Z")) {
                          var _compatibilities = [];

                          _compatibilities.push({
                            company: "Huawei",
                            model: "P Smart Z"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("P20")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Huawei",
                            model: "P20"
                          });
                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Huawei",
                            model: "MediaPad M5 Pro 10.8"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        }

                        break;

                      case "HUAWEI":
                        if (element.productname[0].includes("P30 Lite")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Huawei",
                            model: "P30 Lite"
                          });
                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Huawei",
                            model: "P30"
                          });
                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        }

                        break;

                      case "Samsung":
                        if (element.productname[0].includes("Galaxy Note 10+")) {
                          var _compatibilities2 = [];

                          _compatibilities2.push({
                            company: "Samsung",
                            model: "Note 10+"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities2, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Note 10 Lite")) {
                          var _compatibilities3 = [];

                          _compatibilities3.push({
                            company: "Samsung",
                            model: "Note 10 Lite"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities3, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Note 10")) {
                          var _compatibilities4 = [];

                          _compatibilities4.push({
                            company: "Samsung",
                            model: "Note 10"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities4, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy S10+")) {
                          var _compatibilities5 = [];

                          _compatibilities5.push({
                            company: "Samsung",
                            model: "S10+"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities5, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy S10e")) {
                          var _compatibilities6 = [];

                          _compatibilities6.push({
                            company: "Samsung",
                            model: "S10e"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities6, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy S10 Lite")) {
                          var _compatibilities7 = [];

                          _compatibilities7.push({
                            company: "Samsung",
                            model: "S10 Lite"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities7, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy S10 lite")) {
                          var _compatibilities8 = [];

                          _compatibilities8.push({
                            company: "Samsung",
                            model: "S10 Lite"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities8, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy S10")) {
                          var _compatibilities9 = [];

                          _compatibilities9.push({
                            company: "Samsung",
                            model: "S10"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities9, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Note 20")) {
                          var _compatibilities10 = [];

                          _compatibilities10.push({
                            company: "Samsung",
                            model: "Note 20"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities10, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A70")) {
                          var _compatibilities11 = [];

                          _compatibilities11.push({
                            company: "Samsung",
                            model: "A70"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities11, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A80")) {
                          var _compatibilities12 = [];

                          _compatibilities12.push({
                            company: "Samsung",
                            model: "A80"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities12, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A6 Plus")) {
                          var _compatibilities13 = [];

                          _compatibilities13.push({
                            company: "Samsung",
                            model: "A6 Plus"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities13, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A20e")) {
                          var _compatibilities14 = [];

                          _compatibilities14.push({
                            company: "Samsung",
                            model: "A20e"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities14, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy S20")) {
                          var _compatibilities15 = [];

                          _compatibilities15.push({
                            company: "Samsung",
                            model: "S20"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities15, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A50")) {
                          var _compatibilities16 = [];

                          _compatibilities16.push({
                            company: "Samsung",
                            model: "A50"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities16, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy S9+")) {
                          var _compatibilities17 = [];

                          _compatibilities17.push({
                            company: "Samsung",
                            model: "S9+"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities17, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy S9")) {
                          var _compatibilities18 = [];

                          _compatibilities18.push({
                            company: "Samsung",
                            model: "S9"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities18, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy J1")) {
                          var _compatibilities19 = [];

                          _compatibilities19.push({
                            company: "Samsung",
                            model: "J1"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities19, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A40")) {
                          var _compatibilities20 = [];

                          _compatibilities20.push({
                            company: "Samsung",
                            model: "A40"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities20, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy J7")) {
                          var _compatibilities21 = [];

                          _compatibilities21.push({
                            company: "Samsung",
                            model: "J7"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities21, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A9")) {
                          var _compatibilities22 = [];

                          _compatibilities22.push({
                            company: "Samsung",
                            model: "A9"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities22, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Note 9")) {
                          var _compatibilities23 = [];

                          _compatibilities23.push({
                            company: "Samsung",
                            model: "Note 9"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities23, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A51")) {
                          var _compatibilities24 = [];

                          _compatibilities24.push({
                            company: "Samsung",
                            model: "A51"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities24, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A41")) {
                          var _compatibilities25 = [];

                          _compatibilities25.push({
                            company: "Samsung",
                            model: "A41"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities25, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A71")) {
                          var _compatibilities26 = [];

                          _compatibilities26.push({
                            company: "Samsung",
                            model: "A71"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities26, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy A6")) {
                          var _compatibilities27 = [];

                          _compatibilities27.push({
                            company: "Samsung",
                            model: "A6"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities27, element.order_delivery[0]);
                        } else if (element.productname[0].includes("G988F")) {
                          var _compatibilities28 = [];

                          _compatibilities28.push({
                            company: "Samsung",
                            model: "S20 Ultra"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities28, element.order_delivery[0]);
                        } else if (element.productname[0].includes("G985F")) {
                          var _compatibilities29 = [];

                          _compatibilities29.push({
                            company: "Samsung",
                            model: "S20+"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities29, element.order_delivery[0]);
                        } else if (element.productname[0].includes("G980F")) {
                          var _compatibilities30 = [];

                          _compatibilities30.push({
                            company: "Samsung",
                            model: "S20"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities30, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Samsung Note 8")) {
                          var _compatibilities31 = [];

                          _compatibilities31.push({
                            company: "Samsung",
                            model: "Note 8"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities31, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Tab S7+")) {
                          var _compatibilities32 = [];

                          _compatibilities32.push({
                            company: "Samsung",
                            model: "Tab S7+"
                          });

                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities32, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Tab S7")) {
                          var _compatibilities33 = [];

                          _compatibilities33.push({
                            company: "Samsung",
                            model: "Tab S7"
                          });

                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities33, element.order_delivery[0]);
                        } else {
                          var _compatibilities34 = [];

                          _compatibilities34.push({
                            company: "Samsung",
                            model: "Tab S4"
                          });

                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities34, element.order_delivery[0]);
                        }

                        break;

                      case "Apple":
                        if (element.productname[0].includes("iPhone 11 Pro Max")) {
                          var _compatibilities35 = [];

                          _compatibilities35.push({
                            company: "Apple",
                            model: "iPhone 11 Pro Max"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities35, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPhone 11 Pro")) {
                          var _compatibilities36 = [];

                          _compatibilities36.push({
                            company: "Apple",
                            model: "iPhone 11 Pro"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities36, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPhone 11")) {
                          var _compatibilities37 = [];

                          _compatibilities37.push({
                            company: "Apple",
                            model: "iPhone 11"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities37, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPhone 8 / 7 ")) {
                          var _compatibilities38 = [];

                          _compatibilities38.push({
                            company: "Apple",
                            model: "iPhone 7 / 8 "
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities38, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPhone 8 Plus / 7 Plus")) {
                          var _compatibilities39 = [];

                          _compatibilities39.push({
                            company: "Apple",
                            model: "iPhone 7 Plus / 8 Plus"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities39, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPhone XS Max")) {
                          var _compatibilities40 = [];

                          _compatibilities40.push({
                            company: "Apple",
                            model: "iPhone XS Max"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities40, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPhone XS")) {
                          var _compatibilities41 = [];

                          _compatibilities41.push({
                            company: "Apple",
                            model: "iPhone XS"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities41, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPhone Xs")) {
                          var _compatibilities42 = [];

                          _compatibilities42.push({
                            company: "Apple",
                            model: "iPhone XS"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities42, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPhone X")) {
                          var _compatibilities43 = [];

                          _compatibilities43.push({
                            company: "Apple",
                            model: "iPhone X"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities43, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPhone SE 2020/8/7)")) {
                          var _compatibilities44 = [];

                          _compatibilities44.push({
                            company: "Apple",
                            model: "iPhone 7 / 8 / SE 2020"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities44, element.order_delivery[0]);
                        }

                        break;

                      case "Lenovo":
                        var compatibilities = [];
                        compatibilities.push({
                          company: "Lenovo",
                          model: "A328"
                        });
                        insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        break;

                      case "Nokia":
                        if (element.productname[0].includes("Nokia 6")) {
                          var _compatibilities45 = [];

                          _compatibilities45.push({
                            company: "Nokia",
                            model: "6"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities45, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Nokia 5")) {
                          var _compatibilities46 = [];

                          _compatibilities46.push({
                            company: "Nokia",
                            model: "5"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities46, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Nokia CC-110")) {
                          var _compatibilities47 = [];

                          _compatibilities47.push({
                            company: "Nokia",
                            model: "CC-110"
                          });

                          insertProductWithCompatibility(element.productname[0], "Kινητά", "Θήκες-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities47, element.order_delivery[0]);
                        }

                        break;

                      default:
                        // data.push(element.productname[0].split(" ")[0].trim())
                        break;
                    }
                  };

                  var phone_accessories = function phone_accessories() {
                    switch (element.category[0].split("//")[2].trim()) {
                      case "Φορτιστές":
                        insertProduct(element.productname[0], "Kινητά", "Φορτιστές-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Bluetooth":
                        insertProduct(element.productname[0], "Kινητά", "Bluetooth", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Προστασία Οθόνης":
                        // data.push(element.productname[0])//.split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        insertProduct(element.productname[0], "Kινητά", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Powerbanks":
                        insertProduct(element.productname[0], "Μπαταρίες", "PowerBanks", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Ακουστικά/Ηχεία":
                        insertProduct(element.productname[0], "Kινητά", "Handsfree", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Καλώδια/Αντάπτορες":
                        if (element.productname[0].includes("Αντάπτορας")) {
                          insertProduct(element.productname[0], "Kινητά", "Adapters-Φόρτισης-Δεδομένων", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        } else {
                          insertProduct(element.productname[0], "Kινητά", "Καλώδια-Φόρτισης-Δεδομένων", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        }

                        break;

                      case "Βάσεις Κινητών/Selfie Sticks":
                        if (element.productname[0].includes("Selfie")) {
                          insertProduct(element.productname[0], "Kινητά", "Selfie-Sticks", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        } else {
                          insertProduct(element.productname[0], "Kινητά", "Βάσεις-Στήριξης-Κινητών", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        }

                        break;

                      case "Κάρτες Μνήμης":
                        insertProduct(element.productname[0], "Αποθηκευτικά-Μέσα", "Memory-Cards", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Γραφίδες":
                        insertProduct(element.productname[0], "Kινητά", "Γραφίδες", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Sim":
                        insertProduct(element.productname[0], "Kινητά", "Διάφορα-αξεσουάρ", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Διάφορα":
                        insertProduct(element.productname[0], "Kινητά", "Διάφορα-αξεσουάρ", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Θήκες Κινητών":
                        phoneCases();
                        break;

                      default:
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        break;
                    }
                  };

                  var tabletCases = function tabletCases() {
                    switch (element.productname[0].split(" ")[0].trim()) {
                      case "Huawei":
                        var compatibilities = [];
                        compatibilities.push({
                          company: "Huawei",
                          model: "MediaPad T3 10"
                        });
                        insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        break;

                      case "Apple":
                        if (element.productname[0].includes("12.9-inch iPad Pro")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Apple",
                            model: "iPad Pro 12.9"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("12.9 iPad Pro")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Apple",
                            model: "iPad Pro 12.9"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("11-inch iPad Pro")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Apple",
                            model: "iPad Pro 11"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPad Pro 10.5")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Apple",
                            model: "iPad Pro 10.5"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPad mini")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Apple",
                            model: "iPad Mini"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPad 9.7")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Apple",
                            model: "iPad 9.7"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("iPad Air 10.5")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Apple",
                            model: "iPad Air 10.5"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        }

                        break;

                      case "Samsung":
                        if (element.productname[0].includes("Galaxy Tab A 10.1")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Samsung",
                            model: "Tab A 10.1"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Tab S6 Lite 10.4")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Samsung",
                            model: "Tab S6 Lite 10.4"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Tab S6 Lite")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Samsung",
                            model: "Tab S6 Lite"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Tab S6")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Samsung",
                            model: "Tab S6"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Tab S3")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Samsung",
                            model: "Tab S3"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        } else if (element.productname[0].includes("Galaxy Tab A")) {
                          compatibilities = [];
                          compatibilities.push({
                            company: "Samsung",
                            model: "Tab A 10.1"
                          });
                          insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        }

                        break;

                      case "Lenovo":
                        compatibilities = [];
                        compatibilities.push({
                          company: "Lenovo",
                          model: "Thinkpad Quick Shot"
                        });
                        insertProductWithCompatibility(element.productname[0], "Tablet", "Θήκες-Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                        break;
                    }
                  };

                  var tablet_screen_protection = function tablet_screen_protection() {
                    if (element.productname[0].includes("IPAD AIR/AIR 2/IPAD PRO 9.7")) {
                      var compatibilities = [];
                      compatibilities.push({
                        company: "Apple",
                        model: "AIR/AIR 2/PRO 9.7"
                      });
                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", compatibilities, element.order_delivery[0]);
                    } else if (element.productname[0].includes("AIR/IPAD AIR 2/IPAD PRO 9,7")) {
                      var _compatibilities48 = [];

                      _compatibilities48.push({
                        company: "Apple",
                        model: "IPAD AIR/AIR 2/PRO 9.7"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities48, element.order_delivery[0]);
                    } else if (element.productname[0].includes("IPAD PRO 12.9")) {
                      var _compatibilities49 = [];

                      _compatibilities49.push({
                        company: "Apple",
                        model: "IPAD PRO 12.9"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities49, element.order_delivery[0]);
                    } else if (element.productname[0].includes("IPAD MINI")) {
                      var _compatibilities50 = [];

                      _compatibilities50.push({
                        company: "Apple",
                        model: "IPAD MINI 4"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities50, element.order_delivery[0]);
                    } else if (element.productname[0].includes("IPAD AIR")) {
                      var _compatibilities51 = [];

                      _compatibilities51.push({
                        company: "Apple",
                        model: "IPAD AIR"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities51, element.order_delivery[0]);
                    } else if (element.productname[0].includes("Huawei MediaPad T3 9.6")) {
                      var _compatibilities52 = [];

                      _compatibilities52.push({
                        company: "Huawei",
                        model: "MediaPad T3 9.6"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities52, element.order_delivery[0]);
                    } else if (element.productname[0].includes("Huawei MediaPad T5 10.1")) {
                      var _compatibilities53 = [];

                      _compatibilities53.push({
                        company: "Huawei",
                        model: "MediaPad T5 10.1"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities53, element.order_delivery[0]);
                    } else if (element.productname[0].includes("SAMSUNG TAB A 2016 T580/T585 10.1")) {
                      var _compatibilities54 = [];

                      _compatibilities54.push({
                        company: "Samsung",
                        model: "TAB A 2016 T580/T585 10.1"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities54, element.order_delivery[0]);
                    } else if (element.productname[0].includes("SAMSUNG TAB A 2016 T280/T285 7.0")) {
                      var _compatibilities55 = [];

                      _compatibilities55.push({
                        company: "Samsung",
                        model: "TAB A 2016 T280/T285 7.0"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities55, element.order_delivery[0]);
                    } else if (element.productname[0].includes("SAMSUNG TAB S2 T710/T715/T719 8.0")) {
                      var _compatibilities56 = [];

                      _compatibilities56.push({
                        company: "Samsung",
                        model: "TAB S2 T710/T715/T719 8.0"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities56, element.order_delivery[0]);
                    } else if (element.productname[0].includes("Galaxy Tab A 10.1 2019 T510/T515")) {
                      var _compatibilities57 = [];

                      _compatibilities57.push({
                        company: "Samsung",
                        model: "Tab A T510/T515 10.1"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities57, element.order_delivery[0]);
                    } else if (element.productname[0].includes("Samsung Galaxy Tab A 8.0 T290/295/297")) {
                      var _compatibilities58 = [];

                      _compatibilities58.push({
                        company: "Samsung",
                        model: "Tab A 8.0 T290/295/297"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities58, element.order_delivery[0]);
                    } else if (element.productname[0].includes("SAMSUNG TAB A T550/T555 9.7")) {
                      var _compatibilities59 = [];

                      _compatibilities59.push({
                        company: "Samsung",
                        model: "TAB A T550/T555 9.7"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities59, element.order_delivery[0]);
                    } else if (element.productname[0].includes("SAMSUNG TAB S2 9.7")) {
                      var _compatibilities60 = [];

                      _compatibilities60.push({
                        company: "Samsung",
                        model: "SAMSUNG TAB S2 9.7"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities60, element.order_delivery[0]);
                    } else if (element.productname[0].includes("TAB S2 8")) {
                      var _compatibilities61 = [];

                      _compatibilities61.push({
                        company: "Samsung",
                        model: "TAB S2 8"
                      });

                      insertProductWithCompatibility(element.productname[0], "Tablet", "Προστασία-Οθόνης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _compatibilities61, element.order_delivery[0]);
                    }
                  };

                  var tablet_accessories = function tablet_accessories() {
                    switch (element.category[0].split("//")[2].trim()) {
                      case "Φορτιστές":
                        insertProduct(element.productname[0], "Tablet", "Φορτιστές-tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Προστασία Οθόνης":
                        tablet_screen_protection();
                        break;

                      case "Θήκες":
                        tabletCases();
                        break;

                      case "Βάσεις":
                        insertProduct(element.productname[0], "Tablet", "Βάσεις", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      default:
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        break;
                    }
                  };

                  var tablets = function tablets() {
                    switch (element.category[0].split("//")[1].trim()) {
                      case "Αξεσουάρ Tablet":
                        tablet_accessories();
                        break;

                      case "Brands":
                        insertProduct(element.productname[0], "Tablet", "Tablet", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      default:
                        break;
                    }
                  };

                  var mobiles_smartwatches = function mobiles_smartwatches() {
                    switch (element.category[0].split("//")[1].trim()) {
                      case "Αξεσουάρ":
                        phone_accessories();
                        break;

                      case "Κινητά Τηλέφωνα":
                        insertProduct(element.productname[0], "Kινητά", "Kινητά", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Σταθερά":
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        if (element.category[0].split("//")[2].trim() === "IP Τηλεφωνία") {
                          var features = [];
                          features.push({
                            featureTitle: "Είδος Συσκευής",
                            featureName: "IP Τηλεφωνία"
                          });
                          insertProduct(element.productname[0], "είδη-γραφείου", "Σταθερά-Τηλέφωνα", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        } else if (element.category[0].split("//")[2].trim() === "Ενσύρματα") {
                          var _features = [];

                          _features.push({
                            featureTitle: "Είδος Συσκευής",
                            featureName: "Ενσύρματα"
                          });

                          insertProductWithFeature(element.productname[0], "είδη-γραφείου", "Σταθερά-Τηλέφωνα", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _features, element.order_delivery[0]);
                        } else if (element.category[0].split("//")[2].trim() === "Ασύρματα") {
                          var _features2 = [];

                          _features2.push({
                            featureTitle: "Είδος Συσκευής",
                            featureName: "Ασύρματα"
                          });

                          insertProductWithFeature(element.productname[0], "είδη-γραφείου", "Σταθερά-Τηλέφωνα", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _features2, element.order_delivery[0]);
                        } else if (element.category[0].split("//")[2].trim() === "Συσκευές Fax") {
                          var _features3 = [];

                          _features3.push({
                            featureTitle: "Είδος Συσκευής",
                            featureName: "Συσκευές Fax"
                          });

                          insertProductWithFeature(element.productname[0], "είδη-γραφείου", "Σταθερά-Τηλέφωνα", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", _features3, element.order_delivery[0]);
                        }

                        break;

                      default:
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        break;
                    }
                  };

                  var gaming_cataloge = function gaming_cataloge() {
                    switch (element.category[0].split("//")[2].trim()) {
                      case "Gamepads":
                        insertProduct(element.productname[0], "Gaming", "Gamepads", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Παιχνίδια":
                        insertProduct(element.productname[0], "Gaming", "Παιχνίδια", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Virtual Reality":
                        insertProduct(element.productname[0], "Gaming", "Virtual-Reality", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Αξεσουάρ":
                        insertProduct(element.productname[0], "Gaming", "Αξεσουάρ", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Τιμονιέρες":
                        insertProduct(element.productname[0], "Gaming", "Τιμονιέρες", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Joysticks":
                        insertProduct(element.productname[0], "Gaming", "Joysticks", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Gaming Chair":
                        insertProduct(element.productname[0], "Gaming", "Gaming-Chair", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      default:
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        break;
                    }
                  };

                  var gaming = function gaming() {
                    switch (element.category[0].split("//")[1].trim()) {
                      case "Gaming":
                        gaming_cataloge();
                        break;

                      default:
                        break;
                    }
                  };

                  var cameras = function cameras() {
                    switch (element.category[0].split("//")[2].trim()) {
                      case "Θήκες/Τσάντες":
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        insertProduct(element.productname[0], "Cameras", "Θήκες-Τσάντες", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Φακοί/Flash Κάμερας":
                        // data.push(element.productname[0]); 
                        insertProduct(element.productname[0], "Cameras", "Φακοί-Flash", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Τρίποδα":
                        insertProduct(element.productname[0], "Cameras", "Τρίποδα", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      default:
                        insertProduct(element.productname[0], "Cameras", "Photo-Cameras", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;
                    }
                  };

                  var multimedia_accessories = function multimedia_accessories() {
                    if (element.category[0].split("//")[2] !== undefined) {
                      switch (element.category[0].split("//")[2].trim()) {
                        case "Ήχος":
                          insertProduct(element.productname[0], "Μultimedia", "Αξεσουάρ-Ήχου", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                          break;

                        case "Κάμερα":
                          insertProduct(element.productname[0], "Cameras", "Αξεσουάρ-Κάμερας", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                          break;

                        default:
                          // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                          break;
                      }
                    }
                  };

                  var sound = function sound() {
                    switch (element.category[0].split("//")[2].trim()) {
                      case "Ηχεία":
                        insertProduct(element.productname[0], "Μultimedia", "Ηχεία", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "MP3-MP4":
                        insertProduct(element.productname[0], "Μultimedia", "mp3-mp4-players", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Μικρόφωνα":
                        insertProduct(element.productname[0], "Μultimedia", "Μικρόφωνα", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Ακουστικά":
                        insertProduct(element.productname[0], "Μultimedia", "Headsets", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Ηχοσυστήματα Αυτοκινήτου":
                        insertProduct(element.productname[0], "Μultimedia", "Ηχοσυστήματα-Αυτοκινήτου", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Ραδιόφωνο":
                        insertProduct(element.productname[0], "Μultimedia", "Ραδιόφωνα", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Ηχοσυστήματα":
                        insertProduct(element.productname[0], "Μultimedia", "Ηχοσυστήματα", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Φορητά Ηχοσυστήματα":
                        insertProduct(element.productname[0], "Μultimedia", "Φορητά-Ηχοσυστήματα", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Walkie Talkie/Συσκευές Υπαγόρευσης":
                        insertProduct(element.productname[0], "Μultimedia", "Walkie-Talkie-Συσκευές-Υπαγόρευσης", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Πικάπ":
                        insertProduct(element.productname[0], "Μultimedia", "Πικάπ", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Karaoke":
                        insertProduct(element.productname[0], "Μultimedia", "Karaoke", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      default:
                        break;
                    }
                  };

                  var tv_accessories = function tv_accessories() {
                    switch (element.category[0].split("//")[2].trim()) {
                      case "Βάσεις Τηλεοράσεων":
                        insertProduct(element.productname[0], "Μultimedia", "Βάσεις-Στήριξης-TV", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Κεραίες":
                        insertProduct(element.productname[0], "Μultimedia", "Κεραίες-TV", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Ψηφιακοί Δεκτές/Αποκωδικοποιητές":
                        insertProduct(element.productname[0], "Μultimedia", "Ψηφιακοί-Δεκτές-Αποκωδικοποιητές", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Media Players":
                        insertProduct(element.productname[0], "Μultimedia", "Media-Players", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Home Cinema":
                        insertProduct(element.productname[0], "Μultimedia", "Home-Cinema", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Αξεσουάρ":
                        insertProduct(element.productname[0], "Μultimedia", "Αξεσουάρ-TV", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Φορήτες Τηλεοράσεις":
                        insertProduct(element.productname[0], "Μultimedia", "Φορήτες-Τηλεοράσεις", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      default:
                        insertProduct(element.productname[0], "Μultimedia", "Τηλεοράσεις", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;
                    }
                  };

                  var multimedia = function multimedia() {
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
                  };

                  var freeTime = function freeTime() {
                    switch (element.category[0].split("//")[2].trim()) {
                      case "Κυάλια":
                        insertProduct(element.productname[0], "Gadgets", "Κυάλια", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Πατίνια":
                        insertProduct(element.productname[0], "Gadgets", "Πατίνια", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Μικροσκοπία":
                        insertProduct(element.productname[0], "Gadgets", "Μικροσκοπία", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      default:
                        break;
                    }
                  };

                  var auto_moto = function auto_moto() {
                    switch (element.category[0].split("//")[2].trim()) {
                      case "Συσκευές Πλοήγησης GPS":
                        insertProduct(element.productname[0], "Gadgets", "Συσκευές-Πλοήγησης-GPS", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Κάμερες Αυτοκινήτου":
                        insertProduct(element.productname[0], "Gadgets", "Κάμερες-Αυτοκινήτου", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Αξεσουάρ":
                        insertProduct(element.productname[0], "Gadgets", "Αξεσουάρ-Αυτοκινήτου", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Διάφορα":
                        insertProduct(element.productname[0], "Gadgets", "Διάφορα", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      default:
                        break;
                    }
                  };

                  var gadgets = function gadgets() {
                    switch (element.category[0].split("//")[1].trim()) {
                      case "Ελεύθερος Χρόνος":
                        freeTime();
                        break;

                      case "Auto-Moto":
                        auto_moto();
                        break;

                      case "Ψηφιακές Κορνίζες":
                        insertProduct(element.productname[0], "Gadgets", "Ψηφιακές-Κορνίζες", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      case "Drones":
                        insertProduct(element.productname[0], "Gadgets", "Drones", element.manufacturer[0], element.image[0], element.order_price[0], element.weight[0], element.mpn[0], "hellasphone", element.order_delivery[0]);
                        break;

                      default:
                        // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                        break;
                    }
                  };

                  switch (element.category[0].split("//")[0].trim()) {
                    case "Πληροφορική":
                      break;

                    case "Living":
                      break;

                    case "Τηλεφωνία":
                      mobiles_smartwatches();
                      break;

                    case "Tablets":
                      tablets(); // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 

                      break;

                    case "Gaming":
                      gaming(); // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 

                      break;

                    case "Ήχος/Εικόνα":
                      multimedia(); // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 

                      break;

                    case "Gadgets":
                      gadgets(); // data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 

                      break;

                    default:
                      //  data.push(element.category[0].split("//")[0].concat(" "+element.category[0].split("//")[1]).concat(" "+element.category[0].split("//")[2]).concat(" "+element.category[0].split("//")[3])); 
                      break;
                  }
                };

                for (var index = 0; index < result.products.product.length; index++) {
                  _loop(index);
                }

                res.send(data); // res.send(result.products.product.category[0]);
              });
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=phoneHellasXmlRoute.js.map