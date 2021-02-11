import axios from 'axios';
import { MODEL_LIST_REQUEST, MODEL_LIST_SUCCESS, MODEL_LIST_FAIL, PHONE_BRAND_LIST_REQUEST, PHONE_BRAND_LIST_SUCCESS, PHONE_BRAND_LIST_FAIL, BRAND_INSERT_REQUEST, BRAND_INSERT_SUCCESS, BRAND_INSERT_FAIL, MODEL_INSERT_REQUEST, MODEL_INSERT_SUCCESS, MODEL_INSERT_FAIL, PHONE_MODEL_LIST_REQUEST, PHONE_MODEL_LIST_SUCCESS, PHONE_MODEL_LIST_FAIL } from '../constants/modelConstants';

const listModels = () =>async (dispatch)=> {
    try{
        dispatch({type:MODEL_LIST_REQUEST});
        const {data}= await axios.get("/api/phoneModels");
        dispatch({type:MODEL_LIST_SUCCESS, payload: data});
    }
    catch(error)
    {
        dispatch({type:MODEL_LIST_FAIL, payload: error.message});
    }    
}

const listPhoneBrands = () =>async (dispatch)=> {
    try{
        dispatch({type:PHONE_BRAND_LIST_REQUEST});
        const {data}= await axios.get("/api/phoneModels/phoneBrands");
        dispatch({type:PHONE_BRAND_LIST_SUCCESS, payload: data});
    }
    catch(error)
    {
        dispatch({type:PHONE_BRAND_LIST_FAIL, payload: error.message});
    }    
}

const insertPhoneBrand = (brand) => async (dispatch, getState) => {
    try{
        dispatch({type:BRAND_INSERT_REQUEST, payload : brand});
        const {userSignin:{userInfo}} = getState();
        const {data}= await axios.post("/api/phoneModels/insertbrand", {brand} ,{headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type:BRAND_INSERT_SUCCESS, payload: data, success:true});
    }
    catch(error)
    {
        dispatch({type:BRAND_INSERT_FAIL, payload: error.message});
    }    
}

const insertPhoneModel = (brandId,model) => async (dispatch, getState) => {
    try{
        dispatch({type:MODEL_INSERT_REQUEST, payload : model});
        const {userSignin:{userInfo}} = getState();
        const {data}= await axios.post("/api/phoneModels/insertphonemodel", {brandId,model} ,{headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type:MODEL_INSERT_SUCCESS, payload: data, success:true});
    }
    catch(error)
    {
        dispatch({type:MODEL_INSERT_FAIL, payload: error.message});
    }    
}

const getPhoneModels = (phoneBrandId) =>async (dispatch, getState)=> {
    try{
        dispatch({type:PHONE_MODEL_LIST_REQUEST});
        const {userSignin:{userInfo}} = getState();
        const {data}= await axios.post("/api/phoneModels/phoneModels", {phoneBrandId} ,{headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type:PHONE_MODEL_LIST_SUCCESS, payload: data});
    }
    catch(error)
    {
        dispatch({type:PHONE_MODEL_LIST_FAIL, payload: error.message});
    }    
}

export {listModels, listPhoneBrands, insertPhoneBrand, insertPhoneModel, getPhoneModels}