import React from 'react';
import { Route, Switch } from "react-router-dom";
import CollectionScreen from '../screens/CollectionScreen';
import ProductsScreen from '../screens/ProductsScreen';
import MainScreen from '../screens/MainScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import ProductDetailScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import SigninScreen from '../screens/SigninScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminProductsScreen from '../screens/AdminProductsScreen';
import ProtectedRoute from '../components/ProtectedRoute';
import ShippingScreen from '../screens/ShippingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PlaceOrderScreen from '../screens/PlaceOrderScreen';
import WishListScreen from '../screens/WishListScreen';
import MyaccountScreen from '../screens/MyAccountScreen';
import AdminOrdersScreen from '../screens/AdminOrdersScreen';
import AdminOrdersDetailScreen from '../screens/AdminOrderDetails';
import AdminCollectionScreen from "../screens/AdminCollectionScreen.js";
import AdminListsScreen from '../screens/AdminListsScreen';
import ProductsByCategoryScreen from '../screens/ProductsByCategoryScreen';
import CollectionDetailScreen from '../screens/CollectionDetailsScreen';
import Gdpr from '../screens/Gdpr';
import NewsletterDisclaimer from '../screens/NewsletterDisclaimer';
import ForgottenPassword from '../screens/ForgottenPassword';
import UpdatePassword from '../screens/UpdatePassword';
import ConditionsOfUse from '../screens/ConditionsOfUse';
import CustomerOrdersScreen from '../screens/CustomerOrdersScreen';
import CustomerOrderDetails from '../screens/CustomerOrderDetails';
import SendingMethodsScreen from '../screens/SendingMethodsScreen';
import ReturnPolicy from '../screens/ReturnPolicy';

function Routes() {
    return (
        <Switch>
            <Route path='/' exact={true} component={MainScreen} />
            <Route path='/contact-us' component={ContactUsScreen} />
            {/* <Route path='/makeyourcase' component={MakeYourCaseLayout}/> */}
            <Route path="/collection" exact={true} component={CollectionScreen} />
            <Route path="/collection/:id" component={CollectionDetailScreen} />
            <Route path="/products" exact={true} component={ProductsScreen} />
            <Route path="/products/:category/:subcategory" exact={true} component={ProductsByCategoryScreen} />
            <Route path="/product/:id" component={ProductDetailScreen} />
            <Route path="/cart/" component={CartScreen} />
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/shipping" component={ShippingScreen} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/wishlist" component={WishListScreen} />
            <Route path="/my-account" component={MyaccountScreen} />
            <Route path="/my-orders" component={CustomerOrdersScreen} />
            <Route path="/my-order-details/:id" component={CustomerOrderDetails} />
            <Route path="/forgottenpassword" component={ForgottenPassword} />
            <Route path="/password/reset/:email/:token" component={UpdatePassword} />
            <Route path="/Πολιτική-Απορρήτου" component={Gdpr} />
            <Route path="/newsletter-disclaimer" component={NewsletterDisclaimer} />
            <Route path="/Τρόποι-Αποστολής" component={SendingMethodsScreen} />
            <Route path="/ConditionsOfUse" component={ConditionsOfUse} />
            <Route path="/Return" component={ReturnPolicy} />
            <ProtectedRoute path="/admin/createproduct" component={AdminProductsScreen} />
            <ProtectedRoute path="/admin/orders" exact={true} component={AdminOrdersScreen} />
            <ProtectedRoute path="/admin/collection" component={AdminCollectionScreen} />
            <ProtectedRoute path="/admin/order/:id" component={AdminOrdersDetailScreen} />
            <ProtectedRoute path="/admin/lists" component={AdminListsScreen} />
        </Switch>

    );
}
export default Routes;