import Axios from 'axios';
import { WISHLIST_ADD_ITEM_REQUEST, WISHLIST_ADD_ITEM_SUCCESS, WISHLIST_ADD_ITEM_FAIL, WISHLIST_REMOVE_ITEM_FAIL, WISHLIST_REMOVE_ITEM_SUCCESS, WISHLIST_REMOVE_ITEM_REQUEST, WISHLIST_ITEMS_REQUEST, WISHLIST_ITEMS_SUCCESS, WISHLIST_ITEMS_FAIL, MOVE_TO_CART_REQUEST, MOVE_TO_CART_SUCCESS, MOVE_TO_CART_FAIL } from "../constants/wishListConstants";


const addToWishList = (user_email, product_id , model) => async (dispatch, getState) =>{
    try{
        dispatch({type: WISHLIST_ADD_ITEM_REQUEST,payload:{user_email, product_id , model}});
        const {userSignin:{userInfo}} = getState();
        if(!model)
        {
            model="none";
        }
        const {data} = await Axios.post("/api/wishlist/additem", {user_email, product_id , model},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: WISHLIST_ADD_ITEM_SUCCESS, payload: data, success:true});

    }
    catch(error)
    {
        dispatch({type: WISHLIST_ADD_ITEM_FAIL, payload: error.message});
    }
}

const removeFromWishList = (user_email,product_id) => async (dispatch, getState) =>{
    try{
        dispatch({type: WISHLIST_REMOVE_ITEM_REQUEST,payload:{user_email, product_id }});
        const {userSignin:{userInfo}} = getState();
        await Axios.post("/api/wishlist/removeitem", {user_email, product_id },
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: WISHLIST_REMOVE_ITEM_SUCCESS, success:true, payload:{user_email,product_id}});

    }
    catch(error)
    {
        dispatch({type: WISHLIST_REMOVE_ITEM_FAIL, payload: error.message});
    }
}

const getWishList = (user_email) => async (dispatch, getState) =>{
    try{
        dispatch({type: WISHLIST_ITEMS_REQUEST,payload:{user_email }});
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.post("/api/wishlist/getwishlist", {user_email },
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: WISHLIST_ITEMS_SUCCESS, payload: data, success:true});

    }
    catch(error)
    {
        dispatch({type: WISHLIST_ITEMS_FAIL, payload: error.message});
    }
}

const moveToCart = (user_email, product_id, model) => async (dispatch, getState) =>{
    try{
        dispatch({type: MOVE_TO_CART_REQUEST,payload:{user_email, product_id, model }});
        const {userSignin:{userInfo}} = getState();
        if(!model)
        {
            model="none";
        }
        await Axios.post("/api/wishlist/movetocart", {user_email, product_id, model},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        const {data} = await Axios.post("/api/wishlist/getwishlist", {user_email},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: MOVE_TO_CART_SUCCESS, payload: data, success:true});

    }
    catch(error)
    {
        dispatch({type: MOVE_TO_CART_FAIL, payload: error.message});
    }
}

export {addToWishList, removeFromWishList, getWishList, moveToCart}