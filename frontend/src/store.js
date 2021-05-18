import {createStore, combineReducers, compose, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import { textReducer } from "./reducers/editorReducer";
import { menuReducer, productMenuReducer } from "./reducers/menuReducer";
import { productListReducer, productDetailsReducer, mostViewedProductsReducer, 
    manufacturersListReducer, featureTitleListReducer, featureNameListReducer, 
    featureListReducer, categoryListReducer, subcategoryListReducer, 
    featureTitlesByCategoryReducer, featureNamesByCategoryReducer, 
    productFeaturesReducer, sendingListReducer, paymentListReducer, 
    compatibilitiesByCategoryReducer, compatibilityCompaniesReducer, 
    compatibilityModelsReducer, productCompatibilitiesReducer, suppliersListReducer, searchForItemsReducer, itemsPerPageReducer, textSearchReducer, productHistoryReducer } from "./reducers/productReducer";
import { modelListReducer, phoneModelListReducer, phonesBrandListReducer } from "./reducers/modelReducer";
import { cartReducer } from "./reducers/cartReducer";
import Cookie from 'js-cookie';
import { userSigninReducer, userRegisterReducer, userAccountInfoReducer, 
    userPasswordChangeReducer, userAccountAddressReducer, addForNewsletterReducer, removeFromNewsletterReducer, adminsListReducer } from "./reducers/userReducer";
import { wishListReducer } from "./reducers/wishListReducer";
import { orderReducer, orderListReducer, orderDetailsReducer, changeOrderStatusReducer,
     updateOrderStatusReducer, 
     updateOrderReducer, deleteOrderItemReducer, customerOrderListReducer, customerOrderDetailsReducer, orderHistoryReducer } from "./reducers/orderReducer";
import { collectionAdminReducer, collectionDetailsReducer, collectionListReducer, collectionRandomListReducer } from "./reducers/collectionReducer";
import { emailAccountDeleteConfirmationReducer, emailAddNewsletterReducer, emailContactReducer, emailOrderCorfimationReducer, emailOrderNotificationReducer, emailPassUpdateConfirmationReducer, emailRegisterReducer, 
    emailRemoveNewsletterReducer, emailResetPasswordReducer, updatePasswordReducer } from "./reducers/emailReducer";
import { paymentMethodsListReducer, sendingMethodsListReducer } from "./reducers/paymentReducer";

const cartItems = Cookie.getJSON("cartItems") || [];
const userInfo = Cookie.getJSON("userInfo") || null;
const shipping = Cookie.getJSON("shipping") || null;
const payment = Cookie.getJSON("payment") || null;
const userAddressInfo = Cookie.getJSON('userAddressInfo') || null;

const initialState={ cart : {cartItems, shipping, payment}, userSignin: {userInfo}, userAccountAddress:{userAddressInfo}};
const reducer=combineReducers({
    textEditor : textReducer,
    menuToggle : menuReducer,
    productList : productListReducer,
    productDetails : productDetailsReducer,
    modelList : modelListReducer,
    cart : cartReducer,
    userSignin:userSigninReducer,
    userRegister:userRegisterReducer,
    wishList: wishListReducer,
    userAccountInfo:userAccountInfoReducer,
    userPasswordChange:userPasswordChangeReducer,
    userAccountAddress:userAccountAddressReducer,
    order:orderReducer,
    orderList:orderListReducer,
    orderDetails:orderDetailsReducer,
    changeOrderStatus:changeOrderStatusReducer,
    updateOrderStatus:updateOrderStatusReducer,
    updateOrder:updateOrderReducer,
    deleteOrderItem:deleteOrderItemReducer,
    mostViewedProducts:mostViewedProductsReducer,
    phonesBrandList:phonesBrandListReducer,
    phoneModelList:phoneModelListReducer,
    manufacturersList:manufacturersListReducer,
    featureTitleList:featureTitleListReducer,
    featureNameList:featureNameListReducer,
    featureList:featureListReducer,
    categoryList:categoryListReducer,
    subcategoryList:subcategoryListReducer,
    productMenu:productMenuReducer,
    featureTitlesByCategory:featureTitlesByCategoryReducer,
    featureNamesByCategory:featureNamesByCategoryReducer,
    productFeatures:productFeaturesReducer,
    collectionAdmin:collectionAdminReducer,
    collectionList:collectionListReducer,
    collectionDetails:collectionDetailsReducer,
    sendingList:sendingListReducer,
    emailRegister:emailRegisterReducer,
    emailContact:emailContactReducer,
    addForNewsletter:addForNewsletterReducer,
    emailAddNewsletter:emailAddNewsletterReducer,
    removeFromNewsletter:removeFromNewsletterReducer,
    emailRemoveNewsletter:emailRemoveNewsletterReducer,
    emailOrderCorfimation:emailOrderCorfimationReducer,
    sendingMethodsList:sendingMethodsListReducer,
    paymentMethodsList:paymentMethodsListReducer,
    paymentList:paymentListReducer,
    emailResetPassword:emailResetPasswordReducer,    
    updatePassword:updatePasswordReducer,
    emailPassUpdateConfirmation:emailPassUpdateConfirmationReducer,
    compatibilitiesByCategory:compatibilitiesByCategoryReducer,
    compatibilityCompanies:compatibilityCompaniesReducer,
    compatibilityModels:compatibilityModelsReducer,
    productCompatibilities:productCompatibilitiesReducer,
    emailAccountDeleteConfirmation:emailAccountDeleteConfirmationReducer,
    customerOrderList:customerOrderListReducer,
    customerOrderDetails:customerOrderDetailsReducer,
    collectionRandomList:collectionRandomListReducer,
    suppliersList:suppliersListReducer,
    emailOrderNotification:emailOrderNotificationReducer,
    searchForItems:searchForItemsReducer,
    perPageItems:itemsPerPageReducer,
    textSearch:textSearchReducer,
    adminsList:adminsListReducer,
    productHistory:productHistoryReducer,
    orderHistory:orderHistoryReducer
})

const composeEchancer= window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;
const store=createStore(reducer,initialState, composeEchancer(applyMiddleware(thunk)));
export default store;