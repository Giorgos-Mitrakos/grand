import Axios from 'axios';
import { SEND_ACCOUNT_DELETE_EMAIL_FAIL, SEND_ACCOUNT_DELETE_EMAIL_REQUEST, SEND_ACCOUNT_DELETE_EMAIL_SUCCESS, SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_FAIL, SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_REQUEST, SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_SUCCESS, SEND_EMAIL_FOR_NEWSLETTER_DELETE_FAIL, SEND_EMAIL_FOR_NEWSLETTER_DELETE_REQUEST, SEND_EMAIL_FOR_NEWSLETTER_DELETE_SUCCESS, SEND_EMAIL_TO_CONFIRM_ORDER_FAIL, SEND_EMAIL_TO_CONFIRM_ORDER_REQUEST, SEND_EMAIL_TO_CONFIRM_ORDER_SUCCESS, SEND_EMAIL_TO_CONTACT_FAIL, SEND_EMAIL_TO_CONTACT_REQUEST, SEND_EMAIL_TO_CONTACT_SUCCESS, SEND_PASSWORD_RESET_FAIL, SEND_PASSWORD_RESET_REQUEST, SEND_PASSWORD_RESET_SUCCESS, SEND_REGISTER_COMFIRMATION_FAIL, SEND_REGISTER_COMFIRMATION_REQUEST, SEND_REGISTER_COMFIRMATION_SUCCESS, SEND_UPDATE_PASSWORD_CONFIRM_FAIL, SEND_UPDATE_PASSWORD_CONFIRM_REQUEST, SEND_UPDATE_PASSWORD_CONFIRM_SUCCESS, UPDATE_PASSWORD_RESET_FAIL, UPDATE_PASSWORD_RESET_REQUEST, UPDATE_PASSWORD_RESET_SUCCESS } from '../constants/emailConstants';

const sendRegisterConfirmation = (email,name) => async (dispatch)=>{
    try {
        dispatch({type:SEND_REGISTER_COMFIRMATION_REQUEST, payload:"sending"});
        await Axios.post("/api/email/registerConfirmation", {email,name});
        dispatch({type: SEND_REGISTER_COMFIRMATION_SUCCESS, payload:"success"});
    } catch (error) {
        dispatch({type: SEND_REGISTER_COMFIRMATION_FAIL, payload: error.message});
    }
}

const sendEmailToContact = (name,email,subject,message) => async (dispatch)=>{
    try {
        dispatch({type:SEND_EMAIL_TO_CONTACT_REQUEST, payload:"sending"});
        await Axios.post("/api/email/toContact", {name,email,subject,message});
        dispatch({type: SEND_EMAIL_TO_CONTACT_SUCCESS, payload:"success"});
    } catch (error) {
        dispatch({type: SEND_EMAIL_TO_CONTACT_FAIL, payload: error.message});
    }
}

const sendNewsLetterMailConfirmation = (email) => async (dispatch)=>{
    try {
        dispatch({type:SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_REQUEST, payload:"sending"});
        await Axios.post("/api/email/addToNewsletters", {email});
        dispatch({type: SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_SUCCESS, payload:"success"});
    } catch (error) {
        dispatch({type: SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_FAIL, payload: error.message});
    }
}

const sendNewsLetterMailDeletingConfirmation = (email,comments) => async (dispatch)=>{
    try {
        dispatch({type:SEND_EMAIL_FOR_NEWSLETTER_DELETE_REQUEST, payload:"sending"});
        await Axios.post("/api/email/removeFromNewsletters", {email,comments});
        dispatch({type: SEND_EMAIL_FOR_NEWSLETTER_DELETE_SUCCESS, payload:"success"});
    } catch (error) {
        dispatch({type: SEND_EMAIL_FOR_NEWSLETTER_DELETE_FAIL, payload: error.message});
    }
}

const sendEmailToConfirmOrder = (orderId) => async (dispatch)=>{
    try {
        dispatch({type:SEND_EMAIL_TO_CONFIRM_ORDER_REQUEST, payload:"sending"});
        await Axios.post("/api/email/orderConfimation", {orderId});
        dispatch({type: SEND_EMAIL_TO_CONFIRM_ORDER_SUCCESS, payload:"success"});
    } catch (error) {
        dispatch({type: SEND_EMAIL_TO_CONFIRM_ORDER_FAIL, payload: error.message});
    }
}

const sendPasswordReset = (email) => async (dispatch)=>{    
    try{
        dispatch({type: SEND_PASSWORD_RESET_REQUEST});
        const {data} =await Axios.post("/api/email/resetpassword", {email});
        dispatch({type: SEND_PASSWORD_RESET_SUCCESS, payload:data.success});        
    }
    catch(error){
        dispatch({type: SEND_PASSWORD_RESET_FAIL, payload: error.message});
    }
}

const updatePass = (email,token,password) => async (dispatch)=>{    
    try{
        dispatch({type: UPDATE_PASSWORD_RESET_REQUEST});
        const {data} =await Axios.post("/api/users/updatepassword", {email,token,password});
        dispatch({type: UPDATE_PASSWORD_RESET_SUCCESS, payload:data.success});        
    }
    catch(error){
        dispatch({type: UPDATE_PASSWORD_RESET_FAIL, payload: error.response.data.msg});
    }
}

const sendUpdatePassConfirm = (email) => async (dispatch)=>{    
    try{
        dispatch({type: SEND_UPDATE_PASSWORD_CONFIRM_REQUEST});
        const {data} =await Axios.post("/api/email/updatepassconfirmation", {email});
        dispatch({type: SEND_UPDATE_PASSWORD_CONFIRM_SUCCESS, payload:data.success});        
    }
    catch(error){
        dispatch({type: SEND_UPDATE_PASSWORD_CONFIRM_FAIL, payload: error.message});
    }
}

const sendAccountDeleteEmail = (email) => async (dispatch)=>{    
    try{
        dispatch({type: SEND_ACCOUNT_DELETE_EMAIL_REQUEST});
        const {data} =await Axios.post("/api/email/sendAccountDeleteConfirmation", {email});
        dispatch({type: SEND_ACCOUNT_DELETE_EMAIL_SUCCESS, payload:data.success});        
    }
    catch(error){
        dispatch({type: SEND_ACCOUNT_DELETE_EMAIL_FAIL, payload: error.message});
    }
}

export {sendRegisterConfirmation, sendEmailToContact, sendNewsLetterMailConfirmation,
    sendNewsLetterMailDeletingConfirmation,sendEmailToConfirmOrder,sendPasswordReset,
    updatePass,sendUpdatePassConfirm,sendAccountDeleteEmail}