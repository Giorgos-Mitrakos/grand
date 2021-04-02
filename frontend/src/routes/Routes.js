import React, { Suspense, lazy } from 'react';
import { Route, Switch } from "react-router-dom";
import MainScreen from '../screens/MainScreen';
import ProtectedRoute from '../components/ProtectedRoute';
import ProductsByCategoryScreen from '../screens/ProductsByCategoryScreen';
const CollectionScreen = lazy(() => import('../screens/CollectionScreen'));
const ProductsScreen = lazy(() => import('../screens/ProductsScreen'));
const ContactUsScreen = lazy(() => import('../screens/ContactUsScreen'));
const ProductDetailScreen = lazy(() => import('../screens/ProductDetailsScreen'));
const CartScreen = lazy(() => import('../screens/CartScreen'));
const SigninScreen = lazy(() => import('../screens/SigninScreen'));
const AdminProductsScreen = lazy(() => import('../screens/AdminProductsScreen'));
const RegisterScreen = lazy(() => import('../screens/RegisterScreen'));
const ShippingScreen = lazy(() => import('../screens/ShippingScreen'));
const PaymentScreen = lazy(() => import('../screens/PaymentScreen'));
const PlaceOrderScreen = lazy(() => import('../screens/PlaceOrderScreen'));
const WishListScreen = lazy(() => import('../screens/WishListScreen'));
const MyaccountScreen = lazy(() => import('../screens/MyAccountScreen'));
const AdminOrdersScreen = lazy(() => import('../screens/AdminOrdersScreen'));
const AdminOrdersDetailScreen = lazy(() => import('../screens/AdminOrderDetails'));
const AdminCollectionScreen = lazy(() => import('../screens/AdminCollectionScreen'));
const AdminListsScreen = lazy(() => import('../screens/AdminListsScreen'));
const CollectionDetailScreen = lazy(() => import('../screens/CollectionDetailsScreen'));
const Gdpr = lazy(() => import('../screens/Gdpr'));
const NewsletterDisclaimer = lazy(() => import('../screens/NewsletterDisclaimer'));
const ForgottenPassword = lazy(() => import('../screens/ForgottenPassword'));
const UpdatePassword = lazy(() => import('../screens/UpdatePassword'));
const ConditionsOfUse = lazy(() => import('../screens/ConditionsOfUse'));
const CustomerOrdersScreen = lazy(() => import('../screens/CustomerOrdersScreen'));
const CustomerOrderDetails = lazy(() => import('../screens/CustomerOrderDetails'));
const SendingMethodsScreen = lazy(() => import('../screens/SendingMethodsScreen'));
const ReturnPolicy = lazy(() => import('../screens/ReturnPolicy'));

function Routes() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
    );
}
export default Routes;