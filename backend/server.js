import express from 'express'; 
import dotenv from 'dotenv';
import config from './config';
import path from 'path';
import 'regenerator-runtime/runtime';
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute';
import adminRoute from './routes/adminRoute';
import productRoute from './routes/productRoute';
import cartRoute from './routes/cartRoute.js';
import wishlistRoute from './routes/wishlistRoute.js';
import phonemodelRoute from './routes/phonemodelRoute.js';
import orderRoute from './routes/orderRoute.js';
import xmlRoute from './routes/xmlRoute.js';
import phoneHellasXmlRoute from './routes/phoneHellasXmlRoute.js';
import emailRoute from './routes/emailRoute.js';
import paymentRoute from './routes/paymentRoute.js';

dotenv.config();

const app=express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/public')));
app.use("/api/users/", userRoute);
app.use("/api/admin/", adminRoute);
app.use("/api/products/", productRoute);
app.use("/api/cart/", cartRoute);
app.use("/api/wishlist/", wishlistRoute);
app.use("/api/phoneModels/", phonemodelRoute);
app.use("/api/orders/", orderRoute);
app.use("/api/isispc-xml", xmlRoute);
app.use("/api/hellasphone-xml/", phoneHellasXmlRoute);
app.use("/api/email/", emailRoute);
app.use("/api/payment/", paymentRoute);
app.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/public/index.html`));
});

const port = config.PORT;
app.listen(port, function () {
  console.log("Server started at http://localhost:".concat(port));
});