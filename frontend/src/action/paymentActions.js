import Axios from 'axios';
import { PAYMENT_METHODS_LIST_FAIL, PAYMENT_METHODS_LIST_REQUEST, PAYMENT_METHODS_LIST_SUCCESS, SENDING_METHODS_LIST_FAIL, SENDING_METHODS_LIST_REQUEST, SENDING_METHODS_LIST_SUCCESS } from '../constants/paymentConstants';

const listSendingMethods = () =>async (dispatch)=> {
    try{
        dispatch({type:SENDING_METHODS_LIST_REQUEST});
        const {data}= await Axios.get("/api/payment/sendingmethods");
        dispatch({type:SENDING_METHODS_LIST_SUCCESS, payload: data});
    }
    catch(error)
    {
        dispatch({type:SENDING_METHODS_LIST_FAIL, payload: error.message});
    }    
}

const listPaymentMethods = (sendingMethodId) =>async (dispatch)=> {
    try{
        dispatch({type:PAYMENT_METHODS_LIST_REQUEST});
        const {data}= await Axios.post("/api/payment/paymentmethods",{sendingMethodId});
        dispatch({type:PAYMENT_METHODS_LIST_SUCCESS, payload: data});
    }
    catch(error)
    {
        dispatch({type:PAYMENT_METHODS_LIST_FAIL, payload: error.message});
    }    
}

export {listSendingMethods, listPaymentMethods}