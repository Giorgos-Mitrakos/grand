import Axios from 'axios';
import Cookie from 'js-cookie';
import { CART_SAVE_SHIPPING,
    CART_SAVE_PAYMENT, 
    CART_ADD_ITEM_FAIL,
    CART_ADD_ITEM_SUCCESS,
    CART_ADD_ITEM_REQUEST,
    CART_REMOVE_ITEM_FAIL,
    CART_REMOVE_ITEM_SUCCESS,
    CART_REMOVE_ITEM_REQUEST,
    CART_ITEM_REQUEST,
    CART_ITEM_SUCCESS,
    CART_ITEM_FAIL,
    CART_UPDATE_ITEM_REQUEST,
    CART_UPDATE_ITEM_SUCCESS,
    CART_UPDATE_ITEM_FAIL,
    CART_NO_USER_ADD_ITEM_SUCCESS,
    CART_NO_USER_ADD_ITEM_REQUEST,
    CART_NO_USER_UPDATE_ITEM_REQUEST,
    CART_NO_USER_UPDATE_ITEM_SUCCESS,
    CART_NO_USER_REMOVE_ITEM_REQUEST,
    CART_NO_USER_REMOVE_ITEM_SUCCESS, CART_EMPTY_REQUEST, CART_ADD_IMAGE_CASE_ITEM_REQUEST, CART_ADD_IMAGE_CASE_ITEM_SUCCESS, CART_ADD_IMAGE_CASE_ITEM_FAIL} from '../constants/cartConstants';


    
const addToCart = (product_id, model, qty) => async (dispatch, getState) =>{
    try{
        const {userSignin:{userInfo}} = getState();
        const email = userInfo.email;
        
        dispatch({type:CART_ADD_ITEM_REQUEST,payload:{email, product_id, model, qty}});
        if(!model)
        {
            model="none";
        }
        const {data} = await Axios.post("/api/cart/insert_item", {email, product_id, model, qty},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: CART_ADD_ITEM_SUCCESS, payload: data, success:true});
        Cookie.set('cartItems', JSON.stringify(data));
        
    }
    catch(error)
    {
        dispatch({type: CART_ADD_ITEM_FAIL, payload: error.message});
    }
}

const addToLocalCart = (product_id, model, qty) => async (dispatch, getState) =>{
    try{
        dispatch({type:CART_NO_USER_ADD_ITEM_REQUEST,payload: {product_id, model, qty}});
        if(!model)
        {
            model="none";
        }
        const { data } = await Axios.get("/api/products/" + product_id);
        dispatch({type: CART_NO_USER_ADD_ITEM_SUCCESS, 
            payload: {
                _id: data._id,
                name: data.name,
                category: data.category,
                brand: data.brand,
                image: data.image,
                description: data.description,
                totalPrice: data.totalPrice,
                subcategory: data.subcategory,
                countInStock: data.countInStock,
                percentage:data.percentage,
                model : model,
                quantity:qty
            }});
            const { cart: { cartItems } } = getState();
            Cookie.set("cartItems", JSON.stringify(cartItems)); 
    }
    catch(error)
    {
        dispatch({type: CART_ADD_ITEM_FAIL, payload: error.message});
    }
}

const addImageCaseToCart = (image_case_item) => async (dispatch, getState) =>{
    try{
        const {userSignin:{userInfo}} = getState();
        
        dispatch({type:CART_ADD_IMAGE_CASE_ITEM_REQUEST,payload:image_case_item});
        
        const {data} = await Axios.post("/api/cart/insert_image_case_item", image_case_item,
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: CART_ADD_IMAGE_CASE_ITEM_SUCCESS, payload: data, success:true});
        Cookie.set('cartItems', JSON.stringify(data));
        
    }
    catch(error)
    {
        dispatch({type: CART_ADD_IMAGE_CASE_ITEM_FAIL, payload: error.message});
    }
}

const updateCart = (user_email, cart_id, model, qty) => async (dispatch, getState) =>{
    try{
        dispatch({type:CART_UPDATE_ITEM_REQUEST,payload:{user_email, cart_id, model, qty}});                    
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.post("/api/cart/update_item", {user_email, cart_id, model, qty},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: CART_UPDATE_ITEM_SUCCESS, payload: data, success:true});
        Cookie.set('cartItems', JSON.stringify(data));
    }
    catch(error)
    {
        dispatch({type: CART_UPDATE_ITEM_FAIL, payload: error.message});
    }
}

const updateLocalCart = (product_id, model, qty) => async (dispatch, getState) =>{
    try{
        dispatch({type:CART_NO_USER_UPDATE_ITEM_REQUEST,payload:{}});                    
        const { data } = await Axios.get("/api/products/" + product_id);
        dispatch({type: CART_NO_USER_UPDATE_ITEM_SUCCESS, 
            payload: {
                _id: data._id,
                name: data.name,
                category: data.category,
                brand: data.brand,
                image: data.image,
                description: data.description,
                totalPrice: data.totalPrice,
                subcategory: data.subcategory,
                countInStock: data.countInStock,
                percentage: data.percentage,
                model : model,
                quantity:qty
            }});
            const { cart: { cartItems } } = getState();
            Cookie.set("cartItems", JSON.stringify(cartItems));

    }
    catch(error)
    {
        //dispatch({type: CART_UPDATE_ITEM_FAIL, payload: error.message});
    }
}

const removeFromCart = (user_email, cart_id, model,image_case) => async (dispatch, getState) =>{
    try{
        dispatch({type:CART_REMOVE_ITEM_REQUEST,payload:{user_email, cart_id, model,image_case}});                    
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.post("/api/cart/remove_item", {user_email, cart_id, model,image_case},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: CART_REMOVE_ITEM_SUCCESS, payload: data, success:true});
        Cookie.set('cartItems', JSON.stringify(data));
    }
    catch(error)
    {
        dispatch({type: CART_REMOVE_ITEM_FAIL, payload: error.message});
    }
}

const removeFromLocalCart = ( product_id, model) => async (dispatch, getState) =>{
    try{
        dispatch({type:CART_NO_USER_REMOVE_ITEM_REQUEST,payload:{}});  
        dispatch({type: CART_NO_USER_REMOVE_ITEM_SUCCESS, payload: {product_id, model}, success:true});
        const { cart: { cartItems } } = getState();
        Cookie.set("cartItems", JSON.stringify(cartItems));
    }
    catch(error)
    {
        dispatch({type: CART_REMOVE_ITEM_FAIL, payload: error.message});
    }
}

const getCart = (user_email) => async (dispatch, getState) =>{
    try{
        dispatch({type:CART_ITEM_REQUEST,payload:{user_email}});                    
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.post("/api/cart/get_cart", {user_email},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: CART_ITEM_SUCCESS, payload: data, success:true});
        Cookie.set('cartItems', JSON.stringify(data));
    }
    catch(error)
    {
        dispatch({type: CART_ITEM_FAIL, payload: error.message});
    }
}

const emptyCart = () => async (dispatch, getState) =>{
    dispatch({type:CART_EMPTY_REQUEST,payload:{}});
}

const saveShipping = (typeOfPayment,company,charger,shippingTo,comments) => (dispatch,getState) =>{
    try {
        dispatch({type:CART_SAVE_SHIPPING,
            payload:{
                typeOfPayment,
                company:{
                    companyName:company.companyName,
                    bussiness: company.bussiness,
                    doy:company.doy,
                    afm:company.afm
                    },
                charger:{
                    name:charger.name,
                    subname:charger.subName,
                    country:charger.country,
                    district:charger.district,
                    city:charger.city,
                    address:charger.address,
                    postalCode:charger.postalCode,
                    phone:charger.phone,
                    email:charger.email
                },
                shippingTo:{
                    name:shippingTo.name,
                    subname:shippingTo.subname,
                    country:shippingTo.country,
                    district:shippingTo.district,
                    city:shippingTo.city,
                    address:shippingTo.address,
                    postalCode:shippingTo.postalCode,
                    phone:shippingTo.phone,
                },
                comments
            }});
            const {cart:{shipping}} = getState();
            Cookie.set("shipping", JSON.stringify(shipping));
    } catch (error) {
        
    }
}

const savePayment = (paymentMethod,paymentMethodCost,sendingMethod,sendingMethodCost) => (dispatch,getState) =>{
    try {
        dispatch({type:CART_SAVE_PAYMENT,payload:{
            paymentMethod:paymentMethod,
            paymentMethodCost:paymentMethodCost,
            sendingMethod:sendingMethod,
            sendingMethodCost:sendingMethodCost
        }});
        const {cart:{payment}} = getState();
        Cookie.set("payment", JSON.stringify(payment));
    } catch (error) {
        
    }
}


export {addToCart, emptyCart, addToLocalCart, updateCart, updateLocalCart, 
    removeFromCart, removeFromLocalCart, getCart, saveShipping, savePayment,
    addImageCaseToCart}