import Axios from 'axios';
import Cookie from 'js-cookie';
import { USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_SIGNOUT_REQUEST, USER_SIGNOUT_SUCCESS, USER_SIGNOUT_FAIL, USER_PASSWORD_CHANGE_REQUEST, USER_PASSWORD_CHANGE_SUCCESS, USER_PASSWORD_CHANGE_FAIL, USER_ACCOUNT_ADDRESS_REQUEST, USER_ACCOUNT_ADDRESS_SUCCESS, USER_ACCOUNT_ADDRESS_FAIL, USER_SAVE_ACCOUNT_INFO_REQUEST, USER_SAVE_ACCOUNT_INFO_SUCCESS, USER_SAVE_ACCOUNT_INFO_FAIL, ADD_TO_NEWSLETTER_REQUEST, ADD_TO_NEWSLETTER_SUCCESS, ADD_TO_NEWSLETTER_FAIL, REMOVE_FROM_NEWSLETTER_REQUEST, REMOVE_FROM_NEWSLETTER_SUCCESS, REMOVE_FROM_NEWSLETTER_FAIL, DELETE_USER_ACCOUNT_REQUEST, DELETE_USER_ACCOUNT_SUCCESS, DELETE_USER_ACCOUNT_FAIL, ADMINS_LIST_REQUEST, ADMINS_LIST_SUCCESS, ADMINS_LIST_FAIL, INSERT_ADMIN_REQUEST, INSERT_ADMIN_SUCCESS, INSERT_ADMIN_FAIL, DELETE_ADMIN_REQUEST, DELETE_ADMIN_SUCCESS, DELETE_ADMIN_FAIL } from '../constants/userConstants';

const signin = (email, password) =>async (dispatch) =>{
    dispatch({type: USER_SIGNIN_REQUEST, payload: {email,password}});
    try{
        const {data} = await Axios.post("/api/users/signin", {email,password});
        dispatch({type: USER_SIGNIN_SUCCESS, payload: data});
        Cookie.set('userInfo', JSON.stringify(data), { expires: 1/24 });
    }
    catch(error){
        dispatch({type: USER_SIGNIN_FAIL, payload: error.message, message:error.response.data.message});
    }
}

const signout = (email) =>async (dispatch) =>{
    dispatch({type: USER_SIGNOUT_REQUEST, payload: email});
    try{
        //const {data} = await Axios.post("/api/users/signout", {email});
        dispatch({type: USER_SIGNOUT_SUCCESS, payload: null});
        Cookie.remove('userInfo');
        Cookie.remove('cartItems');
        Cookie.remove('shipping');
        Cookie.remove('payment');
        Cookie.remove('userAddressInfo');
    }
    catch(error){
        dispatch({type: USER_SIGNOUT_FAIL, payload: error.message});
    }
}

const register = (name, email, password) =>async (dispatch) =>{
    dispatch({type: USER_REGISTER_REQUEST, payload: {name, email, password}});
    try{
        const {data} = await Axios.post("/api/users/register", {name, email, password});
        dispatch({type: USER_REGISTER_SUCCESS, payload: data, success:data.success});
        if(data.success)
        {
            Cookie.set('userInfo', JSON.stringify(data), { expires: 1/24 });
        }
    }
    catch(error){
        dispatch({type: USER_REGISTER_FAIL, payload: error.message, message:error.response.data.message});
    }
}

const saveAccountInfo = (name, subname, phoneNumber, email,
    country, district, city, address, postalCode) =>async (dispatch, getState) =>{    
    try{
        dispatch({type: USER_SAVE_ACCOUNT_INFO_REQUEST, payload: {name, subname, phoneNumber, email,
            country, district, city, address, postalCode}});
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.put("/api/users/accountInfo", {name, subname, phoneNumber, email,
            country, district, city, address, postalCode },
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: USER_SAVE_ACCOUNT_INFO_SUCCESS, payload: data, success:true});
        Cookie.set('userAddressInfo', JSON.stringify(data));
    }
    catch(error){
        dispatch({type: USER_SAVE_ACCOUNT_INFO_FAIL, payload: error.message});
    }
}

const accountInfo = (email) =>async (dispatch, getState) =>{    
    try{
        dispatch({type: USER_ACCOUNT_ADDRESS_REQUEST, payload: {email}});
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.post("/api/users/accountInfo", {email},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: USER_ACCOUNT_ADDRESS_SUCCESS, payload: data});
        Cookie.set('userAddressInfo', JSON.stringify(data));
    }
    catch(error){
        dispatch({type: USER_ACCOUNT_ADDRESS_FAIL, payload: error.message});
    }
}

const deleteAccount = (email) =>async (dispatch, getState) =>{    
    try{
        dispatch({type: DELETE_USER_ACCOUNT_REQUEST});
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.post("/api/users/deleteAccount", {email},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: DELETE_USER_ACCOUNT_SUCCESS, payload: data, success:true});
    }
    catch(error){alert(error)
        dispatch({type: DELETE_USER_ACCOUNT_FAIL, payload: error.message});
    }
}

const passwordChange = (email, password, newPassword) =>async (dispatch, getState) =>{    
    try{
        dispatch({type: USER_PASSWORD_CHANGE_REQUEST, payload: {email, password, newPassword}});
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.put("/api/users/changePassword", {email, password, newPassword },
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: USER_PASSWORD_CHANGE_SUCCESS, payload: data, success:true});        
    }
    catch(error){
        dispatch({type: USER_PASSWORD_CHANGE_FAIL, payload: error.message, message:error.response.data.message});
    }
}

const addToNewsletterList = (email) =>async (dispatch)=>{
    dispatch({type: ADD_TO_NEWSLETTER_REQUEST});
    try{
        const {data} =await Axios.post("/api/users/addForNewsletter", {email});
        dispatch({type: ADD_TO_NEWSLETTER_SUCCESS, payload:data.success});        
    }
    catch(error){
        dispatch({type: ADD_TO_NEWSLETTER_FAIL, payload: error.message});
    }
}

const removeFromNewsletterList = (email) =>async (dispatch)=>{
    dispatch({type: REMOVE_FROM_NEWSLETTER_REQUEST});
    try{
        const {data} =await Axios.post("/api/users/removeFromNewsletter", {email});
        dispatch({type: REMOVE_FROM_NEWSLETTER_SUCCESS, payload:data.success});        
    }
    catch(error){
        dispatch({type: REMOVE_FROM_NEWSLETTER_FAIL, payload: error.message});
    }
}

const listAdmins = () =>async (dispatch, getState) =>{    
    try{
        dispatch({type: ADMINS_LIST_REQUEST, payload: {}});
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.post("/api/admin/getAdmins", {},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: ADMINS_LIST_SUCCESS, payload: data});        
    }
    catch(error){
        dispatch({type: ADMINS_LIST_FAIL, payload: error.message});
    }
}

const insertAdmin = (username, email, password) =>async (dispatch, getState) =>{    
    try{
        dispatch({type: INSERT_ADMIN_REQUEST, payload: {}});
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.post("/api/admin/insertAdmin", {username, email, password},
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: INSERT_ADMIN_SUCCESS, payload: data});        
    }
    catch(error){
        dispatch({type: INSERT_ADMIN_FAIL, payload: error.message});
    }
}

const deleteAdmin = ( email) =>async (dispatch, getState) =>{    
    try{
        dispatch({type: DELETE_ADMIN_REQUEST, payload: {}});
        const {userSignin:{userInfo}} = getState();
        const {data} = await Axios.post("/api/admin/deleteAdmin", { email },
        {headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type: DELETE_ADMIN_SUCCESS, payload: data});        
    }
    catch(error){
        dispatch({type: DELETE_ADMIN_FAIL, payload: error.message});
    }
}

export {signin, signout, register, saveAccountInfo, accountInfo, passwordChange,
    addToNewsletterList, removeFromNewsletterList, deleteAccount, listAdmins, 
    insertAdmin, deleteAdmin}