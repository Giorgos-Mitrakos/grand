import React from 'react';
import { Route } from 'react-router';

export default (
    <Route>
        <Route path='/' exact={true} />
        <Route path='/contact-us' />
        {/* <Route path='/makeyourcase' component={MakeYourCaseLayout}/> */}
        <Route path="/collection" exact={true} />
        <Route path="/collection/:id" />
        <Route path="/products" exact={true} />
        <Route path="/products/:category/:subcategory" exact={true} />
        <Route path="/product/:id" />
        <Route path="/cart/" />
        <Route path="/signin" />
        <Route path="/register" />
        <Route path="/shipping" />
        <Route path="/payment" />
        <Route path="/placeorder" />
        <Route path="/wishlist" />
        <Route path="/my-account" />
        <Route path="/my-orders" />
        <Route path="/my-order-details/:id" />
        <Route path="/forgottenpassword" />
        <Route path="/password/reset/:email/:token" />
        <Route path="/Πολιτική-Απορρήτου" />
        <Route path="/newsletter-disclaimer" />
        <Route path="/Τρόποι-Αποστολής" />
        <Route path="/ConditionsOfUse" />
        <Route path="/Return" />
    </Route>
);