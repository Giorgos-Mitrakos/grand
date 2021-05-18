"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _connection = _interopRequireDefault(require("../connection"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var nodemailer = require('nodemailer');

var router = _express["default"].Router();

router.post("/registerConfirmation", function (req, res) {
  var transporter = nodemailer.createTransport({
    host: _config["default"].EMAIL_HOST,
    port: _config["default"].EMAIL_PORT,
    auth: {
      user: _config["default"].EMAIL_ACCOUNT_USER,
      pass: _config["default"].EMAIL_ACCOUNT_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var mailOptions = {
    from: _config["default"].EMAIL_ACCOUNT_USER,
    to: req.body.email,
    subject: 'Εγγραφή στο grandmobile.gr',
    attachments: [{
      filename: 'PNG_FINAL64.png',
      path: 'frontend/public/PNG_FINAL64.png',
      cid: 'logo' //same cid value as in the html img src

    }, {
      filename: 'ΜΑΚΕΤΑ192.png',
      path: 'frontend/public/ΜΑΚΕΤΑ192.png',
      cid: 'maketa' //same cid value as in the html img src,

    }],
    html: '<h1 style="background-color:#4b4a9c;color:white;text-align:center;padding:1rem;"><img src="cid:logo"/>Grandmobile Accessories</h1>' + '<p>Αγαπητέ/ή ' + req.body.name + ',<br/>' + '<p>Ευχαριστούμε για την εγγραφής σας στο <a href="https://www.grandmobile.gr/">grandmobile.gr</a> accessories. </p>' + '<p>Για οποιαδήποτε απορία ή πρόβλημα, μη διστάσετε να επικοινωνήσετε μαζί μας, στο e-mail <strong>grandmobile@grandmobile.gr</strong> ή τηλεφωνικά στο <strong>22211 12505</strong>.</p>' + '<img src="cid:maketa"/>'
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send("Success Email Confirmation");
});
router.post("/sendAccountDeleteConfirmation", function (req, res) {
  var transporter = nodemailer.createTransport({
    host: _config["default"].EMAIL_HOST,
    port: _config["default"].EMAIL_PORT,
    auth: {
      user: _config["default"].EMAIL_ACCOUNT_USER,
      pass: _config["default"].EMAIL_ACCOUNT_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var mailOptions = {
    from: _config["default"].EMAIL_ACCOUNT_USER,
    to: req.body.email,
    subject: 'Διαγραφή λογαριασμού από το grandmobile.gr',
    attachments: [{
      filename: 'PNG_FINAL64.png',
      path: 'frontend/public/PNG_FINAL64.png',
      cid: 'logo' //same cid value as in the html img src

    }, {
      filename: 'ΜΑΚΕΤΑ192.png',
      path: 'frontend/public/ΜΑΚΕΤΑ192.png',
      cid: 'maketa' //same cid value as in the html img src,

    }],
    html: '<h1 style="background-color:#4b4a9c;color:white;text-align:center;padding:1rem;"><img src="cid:logo"/>Grandmobile Accessories</h1>' + '<p>Αγαπητέ/ή κύριε/α,<br/>' + '<p>Η διαγραφή του λογαριασμού σας στο <a href="https://www.grandmobile.gr/">grandmobile.gr</a> ολοκληρώθηκε επιτυχώς. </p>' + '<p>Για οποιαδήποτε απορία ή πρόβλημα, μη διστάσετε να επικοινωνήσετε μαζί μας, στο e-mail <strong>grandmobile@grandmobile.gr</strong> ή τηλεφωνικά στο <strong>22211 12505</strong>.</p>' + '<img src="cid:maketa"/>'
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send("Success Email Confirmation");
});
router.post("/resetpassword", function (req, res) {
  _connection["default"].getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    var sql = "SELECT username,email,password FROM users WHERE email=? LIMIT 1";
    connection.query(sql, [req.body.email], function (err, result, fields) {
      if (err) throw err;

      if (result.length !== 0) {
        var user = {
          username: result[0].username,
          email: result[0].email,
          password: result[0].password
        };

        var token = _jsonwebtoken["default"].sign({
          user: user
        }, _config["default"].JWT_SECRET, {
          expiresIn: '1h'
        });

        var url = "https://www.grandmobile.gr/password/reset/" + req.body.email + '/' + token;
        var transporter = nodemailer.createTransport({
          host: _config["default"].EMAIL_HOST,
          port: _config["default"].EMAIL_PORT,
          auth: {
            user: _config["default"].EMAIL_ACCOUNT_USER,
            pass: _config["default"].EMAIL_ACCOUNT_PASSWORD
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        var mailOptions = {
          from: _config["default"].EMAIL_ACCOUNT_USER,
          to: req.body.email,
          subject: 'Επαναφορά Password',
          attachments: [{
            filename: 'PNG_FINAL64.png',
            path: 'frontend/public/PNG_FINAL64.png',
            cid: 'logo' //same cid value as in the html img src

          }, {
            filename: 'ΜΑΚΕΤΑ192.png',
            path: 'frontend/public/ΜΑΚΕΤΑ192.png',
            cid: 'maketa' //same cid value as in the html img src,

          }],
          html: '<h1 style="background-color:#4b4a9c;color:white;text-align:center;padding:1rem;"><img src="cid:logo"/>Grandmobile Accessories</h1>' + '<p>Αγαπητέ/ή ' + result[0].username + ',<br/>' + '<p>Για την επαναφορά του κωδικού σου πατήστε στο σύνδεσμο <br/> <a style="cursor:pointer" href=' + url + '>' + url + '</a> </p>' + '<p>Αν δεν χρησιμοποιήσετε το σύνδεσμο σε μία ώρα, αυτός θα λήξει.</p>' + '<img src="cid:maketa"/>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        res.send("Success Email Confirmation");
      } else {
        res.send("OK");
      }
    }); // Handle error after the release.

    if (err) throw err;
  });
});
router.post("/updatepassconfirmation", function (req, res) {
  _connection["default"].getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    var sql = "SELECT username FROM users WHERE email=? LIMIT 1";
    connection.query(sql, [req.body.email], function (err, result, fields) {
      if (err) throw err;

      if (result.length !== 0) {
        var transporter = nodemailer.createTransport({
          host: _config["default"].EMAIL_HOST,
          port: _config["default"].EMAIL_PORT,
          auth: {
            user: _config["default"].EMAIL_ACCOUNT_USER,
            pass: _config["default"].EMAIL_ACCOUNT_PASSWORD
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        var mailOptions = {
          from: _config["default"].EMAIL_ACCOUNT_USER,
          to: req.body.email,
          subject: 'Επιτυχής Αλλαγή Κωδικού',
          attachments: [{
            filename: 'PNG_FINAL64.png',
            path: 'frontend/public/PNG_FINAL64.png',
            cid: 'logo' //same cid value as in the html img src

          }, {
            filename: 'ΜΑΚΕΤΑ192.png',
            path: 'frontend/public/ΜΑΚΕΤΑ192.png',
            cid: 'maketa' //same cid value as in the html img src,

          }],
          html: '<h1 style="background-color:#4b4a9c;color:white;text-align:center;padding:1rem;"><img src="cid:logo"/>Grandmobile Accessories</h1>' + '<p>Αγαπητέ/ή ' + result[0].username + ',<br/>' + '<p>Η επαναφορά του κωδικού σου έγινε επιτυχώς.</p>' + '<p></p>' + '<img src="cid:maketa"/>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        res.send("Success Email Confirmation");
      } else {
        res.send("OK");
      }
    }); // Handle error after the release.

    if (err) throw err;
  });
});
router.post("/addToNewsletters", function (req, res) {
  var transporter = nodemailer.createTransport({
    host: _config["default"].EMAIL_HOST,
    port: _config["default"].EMAIL_PORT,
    auth: {
      user: _config["default"].EMAIL_NEWSLETTER_USER,
      pass: _config["default"].EMAIL_NEWSLETTER_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var mailOptions = {
    from: _config["default"].EMAIL_NEWSLETTER_USER,
    to: req.body.email,
    subject: 'Επιβεβαίωση Εγγραφής Στο Newsletter',
    attachments: [{
      filename: 'PNG_FINAL64.png',
      path: 'frontend/public/PNG_FINAL64.png',
      cid: 'logo' //same cid value as in the html img src

    }, {
      filename: 'ΜΑΚΕΤΑ192.png',
      path: 'frontend/public/ΜΑΚΕΤΑ192.png',
      cid: 'maketa' //same cid value as in the html img src,

    }],
    html: '<h1 style="background-color:#4b4a9c;color:white;text-align:center;padding:1rem;"><img src="cid:logo"/>Grandmobile Accessories</h1>' + '<p>Ευχαριστούμε για την εγγραφής σας στο newsletter του Grandmobile accessories. </p>' + '<p>Για οποιαδήποτε απορία ή πρόβλημα, μη διστάσετε να επικοινωνήσετε μαζί μας, στο e-mail <strong>grandmobile@grandmobile.gr</strong> ή τηλεφωνικά στο <strong>22211 12505</strong>.</p>' + '<img src="cid:maketa"/>'
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send("Success Newsletter Confirmation");
});
router.post("/removeFromNewsletters", function (req, res) {
  // email στον πελάτη
  var transporter = nodemailer.createTransport({
    host: _config["default"].EMAIL_HOST,
    port: _config["default"].EMAIL_PORT,
    auth: {
      user: _config["default"].EMAIL_NEWSLETTER_USER,
      pass: _config["default"].EMAIL_NEWSLETTER_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var mailOptions = {
    from: _config["default"].EMAIL_NEWSLETTER_USER,
    to: req.body.email,
    subject: 'Επιβεβαίωση Διαγραφής Από Newsletter',
    attachments: [{
      filename: 'PNG_FINAL64.png',
      path: 'frontend/public/PNG_FINAL64.png',
      cid: 'logo' //same cid value as in the html img src

    }, {
      filename: 'ΜΑΚΕΤΑ192.png',
      path: 'frontend/public/ΜΑΚΕΤΑ192.png',
      cid: 'maketa' //same cid value as in the html img src,

    }],
    html: '<h1 style="background-color:#4b4a9c;color:white;text-align:center;padding:1rem;"><img src="cid:logo"/>Grandmobile Accessories</h1>' + '<p>Το email σας έχει διαγραφεί επιτυχώς από τις λίστες μας</p>' + '<p>Για οποιαδήποτε απορία ή πρόβλημα, μη διστάσετε να επικοινωνήσετε μαζί μας, στο e-mail <strong>grandmobile@grandmobile.gr</strong> ή τηλεφωνικά στο <strong>22211 12505</strong>.</p>' + '<img src="cid:maketa"/>'
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); // εμαιλ στο κατάστημα για τυχών σχόλια του πελάτη

  transporter = nodemailer.createTransport({
    host: _config["default"].EMAIL_HOST,
    port: _config["default"].EMAIL_PORT,
    auth: {
      user: _config["default"].EMAIL_NEWSLETTER_USER,
      pass: _config["default"].EMAIL_NEWSLETTER_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  mailOptions = {
    from: _config["default"].EMAIL_NEWSLETTER_USER,
    to: _config["default"].EMAIL_NEWSLETTER_USER,
    subject: 'Επιβεβαίωση Διαγραφής Από Newsletter',
    text: 'Email:' + req.body.email + '\n' + 'Σχόλια:' + req.body.comments
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send("Success Newsletter Deleting");
});
router.post("/toContact", function (req, res) {
  var transporter = nodemailer.createTransport({
    host: _config["default"].EMAIL_HOST,
    port: _config["default"].EMAIL_PORT,
    auth: {
      user: _config["default"].EMAIL_CONTACT_USER,
      pass: _config["default"].EMAIL_CONTACT_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var mailOptions = {
    from: _config["default"].EMAIL_CONTACT_USER,
    to: _config["default"].EMAIL_CONTACT_USER,
    subject: req.body.subject,
    html: '<p>Ονοματεπώνυμο: ' + req.body.name + '</p>' + '<p>email: ' + req.body.email + '</p>' + '<p>Μήνυμα: ' + req.body.message + '</p>'
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send("Success Email to Contacts");
});
router.post("/orderConfimation", function (req, res) {
  var orderId = req.body.orderId;

  _connection["default"].getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    /* Begin transaction */

    connection.beginTransaction(function (err) {
      if (err) {
        throw err;
      }

      var sql = "SELECT * FROM orders WHERE order_id=?";
      connection.query(sql, [orderId], function (err, result) {
        if (err) {
          connection.rollback(function () {
            throw err;
          });
        }

        var order = result[0];
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
            sql = "SELECT products._id, products.name, products.image, products.category, products.totalPrice, products.countInStock, order_products.quantity, order_products.model, order_products.image_case FROM products INNER JOIN order_products ON products._id = order_products.product_id WHERE order_products.order_id=?";
            connection.query(sql, [orderId], function (err, result) {
              if (err) {
                connection.rollback(function () {
                  throw err;
                });
              }

              var queryProducts = result;
              var products = queryProducts.map(function (x) {
                var temp = Object.assign({}, x);

                if (temp.category === "Φτιάξε τη Θήκη σου") {
                  temp.image = "https://grandmobile.gr/images/makeyourcase/" + temp.image_case;
                } else if (!temp.image.includes("http")) {
                  temp.image = "https://grandmobile.gr/images/products/" + temp.image;
                }

                return temp;
              });
              var response = {
                order: order,
                billingAddress: billingAddress,
                shippingAddress: shippingAddress,
                products: products
              };
              var emailTitle = '';
              var htmltext = '';

              switch (response.order.status) {
                case 'Καταχωρήθηκε':
                  emailTitle = 'Επιβεβαίωση Παραγγελίας #' + orderId;
                  htmltext = 'Έχουμε <strong>παραλάβει</strong> την παραγγελία σας και αναμένεται να επεξεργαστεί από άνθρωπο μας. Θα ενημερωθείτε <strong>άμεσα</strong> όταν επεξεργαστεί με νέο μήνυμα. Μείνετε συντονισμένοι!';
                  break;

                case 'Επεξεργάζεται':
                  emailTitle = 'Η Παραγγελία #' + orderId + ' επεξεργάζεται';
                  htmltext = '<strong>Επεξεργαζόμαστε</strong> την παραγγελία σας και συσκευάζουμε προσεκτικά τα προϊόντα σας. Θα ενημερωθείτε <strong>άμεσα</strong> όταν ολοκληρωθεί η διαδικασία με νέο μήνυμα. Μείνετε συντονισμένοι!';
                  break;

                case 'Αναμονή':
                  emailTitle = 'Η Παραγγελία #' + orderId + ' βρίσκετε σε αναμονή';
                  htmltext = 'Κάποιο ή κάποια από τα προϊόντα σας <strong>δεν είναι άμεσα διαθέσιμα</strong> .Θα ενημερωθείτε <strong>άμεσα</strong> όταν ολοκληρωθεί η διαδικασία με νέο μήνυμα. Μείνετε συντονισμένοι!';
                  break;

                case 'Ολοκληρώθηκε':
                  emailTitle = 'Η Παραγγελία #' + orderId + ' ολοκληρώθηκε';
                  htmltext = 'Η παραγγελία σας έχει <strong>ολοκληρωθεί</strong> και  έχει εκδοθεί το κατάλληλο παραστατικό.Ευχαριστούμε για την προτίμησή σας!';
                  break;

                case 'Ακυρώθηκε':
                  emailTitle = 'Η Παραγγελία #' + orderId + ' ακυρώθηκε';
                  htmltext = 'Η παραγγελία σας έχει <strong>ακυρωθεί</strong>.';
                  break;

                default:
                  break;
              }

              var transporter = nodemailer.createTransport({
                host: _config["default"].EMAIL_HOST,
                port: _config["default"].EMAIL_PORT,
                auth: {
                  user: _config["default"].EMAIL_SALES_USER,
                  pass: _config["default"].EMAIL_SALES_PASSWORD
                },
                tls: {
                  rejectUnauthorized: false
                }
              });

              if (order.paymentType === "Τιμολόγιο") {
                if (response.shippingAddress) {
                  var mailOptions = {
                    from: _config["default"].EMAIL_SALES_USER,
                    to: response.billingAddress.user_email,
                    subject: emailTitle,
                    attachments: [{
                      filename: 'PNG_FINAL64.png',
                      path: 'frontend/public/PNG_FINAL64.png',
                      cid: 'logo' //same cid value as in the html img src,

                    }, {
                      filename: 'ΜΑΚΕΤΑ192.png',
                      path: 'frontend/public/ΜΑΚΕΤΑ192.png',
                      cid: 'maketa' //same cid value as in the html img src,

                    }],
                    html: '<h1 style="color: #312f8b">Grandmobile accessories</h1> ' + '<h1 style="background-color:#4b4a9c;color:white;text-align:center;padding:1rem;"><img src="cid:logo"/>' + 'Η παραγγελία με αριθμό #' + orderId + ' ' + response.order.status + ' </h1>' + '<p>Αγαπητέ/ή ' + response.billingAddress.name + ',<br/>' + 'Η κατάσταση της παραγγελίας σας έχει αλλάξει σε ' + response.order.status + '.<br/>' + htmltext + '<br/><hr/>' + '<div style="border-top:1px solid #312f8b;">' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '</colgroup>' + '<tr><th>ΣΤΟΙΧΕΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</th><th>ΠΑΡΑΔΟΣΗ</th><th>ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΓΓΕΛΙΑΣ</th></tr>' + '<tr><td>' + response.billingAddress.companyName + '</td><td>' + response.shippingAddress.name + ' ' + response.shippingAddress.subname + '</td><td>' + response.order.orderDate.toLocaleString() + '</td></tr>' + '<tr><td>' + response.billingAddress.bussiness + '</td><td>' + response.shippingAddress.street + '</td><td>ΠΛΗΡΩΜΗ: ' + response.order.paymentMethod + '</td></tr>' + '<tr><td>' + response.billingAddress.afm + '</td><td>' + response.shippingAddress.city + ',' + response.shippingAddress.district + ',' + response.shippingAddress.postalCode + '</td><td>ΜΕΤΑΦΟΡΙΚΑ: ' + response.order.sendingMethod + '</td></tr>' + '<tr><td>' + response.billingAddress.doy + '</td><td>' + response.shippingAddress.country + '</td></tr>' + '<tr><td>' + response.billingAddress.street + '</td><td></td></tr>' + '<tr><td>' + response.billingAddress.city + ',' + response.billingAddress.district + ',' + response.billingAddress.postalCode + '</td><td></td></tr>' + '<tr><td>' + response.billingAddress.country + '</td><td></td></tr>' + '<tr><td>' + response.billingAddress.phoneNumber + '</td><td></td></tr>' + '<table/>' + '</div><hr/>' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 50%;">' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 10%;">' + '</colgroup>' + '<tr>' + '<th>Φώτο</th>' + '<th>Προιόν</th>' + '<th>Ποσότητα</th>' + '<th>Τιμή</th>' + '<th>Σύνολο Προιόντος</th>' + '</tr>' + response.products.map(function (x) {
                      return '<tr>' + '<td><img style="width:30px; height:30px" src=' + x.image + '><img></td>' + '<td>' + x.name + '</td>' + '<td>' + x.quantity + '</td>' + '<td>' + x.totalPrice + ' €</td>' + '<td>' + x.quantity * x.totalPrice + ' €</td>' + '</tr>';
                    }) + '<table/><hr/>' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '</colgroup>' + '<tr><th>ΣΗΜΕΙΩΣΕΙΣ ΠΕΛΑΤΗ</th><th>     </th></tr>' + '<tr><td>' + response.order.comments + '</td><td>     </td><td>Υποσύνολο: ' + response.order.itemsPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td>ΜΕΤΑΦΟΡΙΚΑ: ' + response.order.shippingPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td>ΧΡΕΩΣΗ ΑΝΤΙΚΑΤΑΒΟΛΗΣ: ' + response.order.paymentMethodPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td><strong>Σύνολο: </strong>' + response.order.totalPrice + '</td></tr>' + '<tr><td></td><td>  <img src="cid:maketa"/>   </td></tr>' + '<table/>'
                  };
                } else {
                  var mailOptions = {
                    from: _config["default"].EMAIL_SALES_USER,
                    to: response.billingAddress.user_email,
                    subject: emailTitle,
                    attachments: [{
                      filename: 'PNG_FINAL64.png',
                      path: 'frontend/public/PNG_FINAL64.png',
                      cid: 'logo' //same cid value as in the html img src,

                    }, {
                      filename: 'ΜΑΚΕΤΑ192.png',
                      path: 'frontend/public/ΜΑΚΕΤΑ192.png',
                      cid: 'maketa' //same cid value as in the html img src,

                    }],
                    html: '<h1 style="color: #312f8b">Grandmobile accessories</h1> ' + '<h1 style="background-color:#4b4a9c;color:white;text-align:center;padding:1rem;"><img src="cid:logo"/>' + 'Η παραγγελία με αριθμό #' + orderId + ' ' + response.order.status + ' </h1>' + '<p>Αγαπητέ/ή ' + response.billingAddress.name + ',<br/>' + 'Η κατάσταση της παραγγελίας σας έχει αλλάξει σε ' + response.order.status + '.<br/>' + htmltext + '<br/><hr/>' + '<div>' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '</colgroup>' + '<tr><th>ΣΤΟΙΧΕΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</th><th></th><th>ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΓΓΕΛΙΑΣ</th></tr>' + '<tr><td>' + 'ΕΠΩΝΥΜΙΑ: ' + response.billingAddress.companyName + '</td><td>      </td><td>' + response.order.orderDate.toLocaleString() + '</td></tr>' + '<tr><td>' + 'Επάγγελμα: ' + response.billingAddress.bussiness + '</td><td>        </td><td>ΠΛΗΡΩΜΗ: ' + response.order.paymentMethod + '</td></tr>' + '<tr><td>' + 'Α.Φ.Μ.: ' + response.billingAddress.afm + '</td><td>      </td><td>ΜΕΤΑΦΟΡΙΚΑ: ' + response.order.sendingMethod + '</td></tr>' + '<tr><td>' + 'Δ.Ο.Υ.: ' + response.billingAddress.doy + '</td><td>       </td></tr>' + '<tr><td>' + response.billingAddress.street + '</td><td></td></tr>' + '<tr><td>' + response.billingAddress.city + ',' + response.billingAddress.district + ',' + response.billingAddress.postalCode + '</td><td></td></tr>' + '<tr><td>' + response.billingAddress.country + '</td><td></td></tr>' + '<tr><td>' + response.billingAddress.phoneNumber + '</td><td></td></tr>' + '<table/>' + '</div><hr/>' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 50%;">' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 10%;">' + '</colgroup>' + '<tr>' + '<th>Φώτο</th>' + '<th>Προιόν</th>' + '<th>Ποσότητα</th>' + '<th>Τιμή</th>' + '<th>Σύνολο Προιόντος</th>' + '</tr>' + response.products.map(function (x) {
                      return '<tr>' + '<td><img style="width:30px; height:30px" src=' + x.image + '><img></td>' + '<td>' + x.name + '</td>' + '<td>' + x.quantity + '</td>' + '<td>' + x.totalPrice + ' €</td>' + '<td>' + x.quantity * x.totalPrice + ' €</td>' + '</tr>';
                    }) + '<table/><hr/>' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '</colgroup>' + '<tr><th>ΣΗΜΕΙΩΣΕΙΣ ΠΕΛΑΤΗ</th><th>     </th></tr>' + '<tr><td>' + response.order.comments + '</td><td>     </td><td>Υποσύνολο: ' + response.order.itemsPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td>ΜΕΤΑΦΟΡΙΚΑ: ' + response.order.shippingPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td>ΧΡΕΩΣΗ ΑΝΤΙΚΑΤΑΒΟΛΗΣ: ' + response.order.paymentMethodPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td><strong>Σύνολο: </strong>' + response.order.totalPrice + '</td></tr>' + '<tr><td></td><td>  <img src="cid:maketa"/>   </td></tr>' + '<table/>'
                  };
                }
              } else {
                if (response.shippingAddress) {
                  var mailOptions = {
                    from: _config["default"].EMAIL_SALES_USER,
                    to: response.billingAddress.user_email,
                    subject: emailTitle,
                    attachments: [{
                      filename: 'PNG_FINAL64.png',
                      path: 'frontend/public/PNG_FINAL64.png',
                      cid: 'logo' //same cid value as in the html img src,

                    }, {
                      filename: 'ΜΑΚΕΤΑ192.png',
                      path: 'frontend/public/ΜΑΚΕΤΑ192.png',
                      cid: 'maketa' //same cid value as in the html img src,

                    }],
                    html: '<h1 style="color: #312f8b">Grandmobile accessories</h1> ' + '<h1 style="background-color:#4b4a9c;color:white;text-align:center;padding:1rem;"><img src="cid:logo"/>' + 'Η παραγγελία με αριθμό #' + orderId + ' ' + response.order.status + ' </h1>' + '<p>Αγαπητέ/ή ' + response.billingAddress.name + ',<br/>' + 'Η κατάσταση της παραγγελίας σας έχει αλλάξει σε ' + response.order.status + '.<br/>' + htmltext + '<br/><hr/>' + '<div style="border-top:1px solid #312f8b;">' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '</colgroup>' + '<tr><th>ΠΕΛΑΤΗΣ</th><th>ΠΑΡΑΔΟΣΗ</th><th>ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΓΓΕΛΙΑΣ</th></tr>' + '<tr><td>' + response.billingAddress.name + ' ' + response.billingAddress.subname + '</td><td>' + response.shippingAddress.name + ' ' + response.shippingAddress.subname + '</td><td>' + response.order.orderDate.toLocaleString() + '</td></tr>' + '<tr><td>' + response.billingAddress.street + '</td><td>' + response.shippingAddress.street + '</td><td>ΠΛΗΡΩΜΗ: ' + response.order.paymentMethod + '</td></tr>' + '<tr><td>' + response.billingAddress.city + ',' + response.billingAddress.district + ',' + response.billingAddress.postalCode + '</td><td>' + response.shippingAddress.city + ',' + response.shippingAddress.district + ',' + response.shippingAddress.postalCode + '</td><td>ΜΕΤΑΦΟΡΙΚΑ: ' + response.order.sendingMethod + '</td></tr>' + '<tr><td>' + response.billingAddress.country + '</td><td>' + response.shippingAddress.country + '</td></tr>' + '<tr><td>' + response.billingAddress.phoneNumber + '</td><td></td></tr>' + '<table/>' + '</div><hr/>' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 50%;">' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 10%;">' + '</colgroup>' + '<tr">' + '<th>Φώτο</th>' + '<th>Προιόν</th>' + '<th>Ποσότητα</th>' + '<th>Τιμή</th>' + '<th>Σύνολο Προιόντος</th>' + '</tr>' + response.products.map(function (x) {
                      return '<tr>' + '<td><img style="width:30px; height:30px" src=' + x.image + '><img></td>' + '<td>' + x.name + '</td>' + '<td>' + x.quantity + '</td>' + '<td>' + x.totalPrice + ' €</td>' + '<td>' + x.quantity * x.totalPrice + ' €</td>' + '</tr>';
                    }) + '<table/><hr/>' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '</colgroup>' + '<tr><th>ΣΗΜΕΙΩΣΕΙΣ ΠΕΛΑΤΗ</th><th>     </th></tr>' + '<tr><td>' + response.order.comments + '</td><td>     </td><td>Υποσύνολο: ' + response.order.itemsPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td>ΜΕΤΑΦΟΡΙΚΑ: ' + response.order.shippingPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td>ΧΡΕΩΣΗ ΑΝΤΙΚΑΤΑΒΟΛΗΣ: ' + response.order.paymentMethodPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td><strong>Σύνολο: </strong>' + response.order.totalPrice + '</td></tr>' + '<tr><td></td><td>  <img src="cid:maketa"/>   </td></tr>' + '<table/>'
                  };
                } else {
                  var mailOptions = {
                    from: _config["default"].EMAIL_SALES_USER,
                    to: response.billingAddress.user_email,
                    subject: emailTitle,
                    attachments: [{
                      filename: 'PNG_FINAL64.png',
                      path: 'frontend/public/PNG_FINAL64.png',
                      cid: 'logo' //same cid value as in the html img src,

                    }, {
                      filename: 'ΜΑΚΕΤΑ192.png',
                      path: 'frontend/public/ΜΑΚΕΤΑ192.png',
                      cid: 'maketa' //same cid value as in the html img src,

                    }],
                    html: '<h1 style="color: #312f8b">Grandmobile accessories</h1> ' + '<h1 style="background-color:#4b4a9c;color:white;text-align:center;padding:1rem;"><img src="cid:logo"/>' + 'Η παραγγελία με αριθμό #' + orderId + ' ' + response.order.status + ' </h1>' + '<p>Αγαπητέ/ή ' + response.billingAddress.name + ',<br/>' + 'Η κατάσταση της παραγγελίας σας έχει αλλάξει σε ' + response.order.status + '.<br/>' + htmltext + '<br/><hr/>' + '<div>' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '</colgroup>' + '<tr><th>ΑΠΟΣΤΟΛΗ</th><th></th><th>ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΓΓΕΛΙΑΣ</th></tr>' + '<tr><td>' + response.billingAddress.name + ' ' + response.billingAddress.subname + '</td><td>      </td><td>' + response.order.orderDate.toLocaleString() + '</td></tr>' + '<tr><td>' + response.billingAddress.street + '</td><td>        </td><td>ΠΛΗΡΩΜΗ: ' + response.order.paymentMethod + '</td></tr>' + '<tr><td>' + response.billingAddress.city + ',' + response.billingAddress.district + ',' + response.billingAddress.postalCode + '</td><td>      </td><td>ΜΕΤΑΦΟΡΙΚΑ: ' + response.order.sendingMethod + '</td></tr>' + '<tr><td>' + response.billingAddress.country + '</td><td>       </td></tr>' + '<tr><td>' + response.billingAddress.phoneNumber + '</td><td></td></tr>' + '<table/>' + '</div><hr/>' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 50%;">' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 10%;">' + '<col span="1" style="width: 10%;">' + '</colgroup>' + '<tr' + '<th>Φώτο</th>' + '<th>Προιόν</th>' + '<th>Ποσότητα</th>' + '<th>Τιμή</th>' + '<th>Σύνολο Προιόντος</th>' + '</tr>' + response.products.map(function (x) {
                      return '<tr>' + '<td><img style="width:30px; height:30px" src=' + x.image + '></img></td>' + '<td>' + x.name + '</td>' + '<td>' + x.quantity + '</td>' + '<td>' + x.totalPrice + ' €</td>' + '<td>' + x.quantity * x.totalPrice + ' €</td>' + '</tr>';
                    }) + '<table/><hr/>' + '<table style="width:100%;">' + '<colgroup>' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '<col span="1" style="width: 33%;">' + '</colgroup>' + '<tr><th>ΣΗΜΕΙΩΣΕΙΣ ΠΕΛΑΤΗ</th><th>     </th></tr>' + '<tr><td>' + response.order.comments + '</td><td>     </td><td>Υποσύνολο: ' + response.order.itemsPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td>ΜΕΤΑΦΟΡΙΚΑ: ' + response.order.shippingPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td>ΧΡΕΩΣΗ ΑΝΤΙΚΑΤΑΒΟΛΗΣ: ' + response.order.paymentMethodPrice + ' €</td></tr>' + '<tr><td></td><td>     </td><td><strong>Σύνολο: </strong>' + response.order.totalPrice + '</td></tr>' + '<tr><td></td><td>  <img src="cid:maketa"/>   </td></tr>' + '<table/>'
                  };
                }
              }

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              res.send("Success Email to Contacts");
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
router.post("/sendNewOrderNotification", function (req, res) {
  var transporter = nodemailer.createTransport({
    host: _config["default"].EMAIL_HOST,
    port: _config["default"].EMAIL_PORT,
    auth: {
      user: _config["default"].EMAIL_ORDER_USER,
      pass: _config["default"].EMAIL_ORDER_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var mailOptions = {
    from: _config["default"].EMAIL_ORDER_USER,
    to: _config["default"].EMAIL_ORDER_USER,
    subject: 'Νέα παραγγελία. Κωδικός: ' + req.body.orderId,
    html: '<p>Μόλις λάβατε μια νέα παραγγελία με κωδικό ' + req.body.orderId + '</p>'
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send("Success Email to Order Notification");
});
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=emailRoute.js.map