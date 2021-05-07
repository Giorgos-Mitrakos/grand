import { SEND_ACCOUNT_DELETE_EMAIL_FAIL, SEND_ACCOUNT_DELETE_EMAIL_REQUEST, SEND_ACCOUNT_DELETE_EMAIL_SUCCESS, SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_FAIL, SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_REQUEST, SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_SUCCESS, SEND_EMAIL_FOR_NEWSLETTER_DELETE_FAIL, SEND_EMAIL_FOR_NEWSLETTER_DELETE_REQUEST, SEND_EMAIL_FOR_NEWSLETTER_DELETE_SUCCESS, SEND_EMAIL_TO_CONFIRM_ORDER_FAIL, SEND_EMAIL_TO_CONFIRM_ORDER_REQUEST, SEND_EMAIL_TO_CONFIRM_ORDER_SUCCESS, SEND_EMAIL_TO_CONTACT_FAIL, SEND_EMAIL_TO_CONTACT_REQUEST, SEND_EMAIL_TO_CONTACT_SUCCESS, SEND_NEW_ORDER_EMAIL_FAIL, SEND_NEW_ORDER_EMAIL_REQUEST, SEND_NEW_ORDER_EMAIL_SUCCESS, SEND_PASSWORD_RESET_FAIL, SEND_PASSWORD_RESET_REQUEST, SEND_PASSWORD_RESET_SUCCESS, SEND_REGISTER_COMFIRMATION_FAIL, SEND_REGISTER_COMFIRMATION_REQUEST, SEND_REGISTER_COMFIRMATION_SUCCESS, SEND_UPDATE_PASSWORD_CONFIRM_FAIL, SEND_UPDATE_PASSWORD_CONFIRM_REQUEST, SEND_UPDATE_PASSWORD_CONFIRM_SUCCESS, UPDATE_PASSWORD_RESET_FAIL, UPDATE_PASSWORD_RESET_REQUEST, UPDATE_PASSWORD_RESET_SUCCESS } from "../constants/emailConstants";


function emailRegisterReducer (state={}, action){
    switch(action.type){
        case SEND_REGISTER_COMFIRMATION_REQUEST:
            return {loading:true, sendEmail:action.payload};
        case SEND_REGISTER_COMFIRMATION_SUCCESS:
            return {loading:false, sendEmail:action.payload};
        case SEND_REGISTER_COMFIRMATION_FAIL:
            return {loading:false, error : action.payload, sendEmail: "error"};
        default:
            return state;
    }
}

function emailContactReducer (state={}, action){
    switch(action.type){
        case SEND_EMAIL_TO_CONTACT_REQUEST:
            return {loading:true, sendEmail:action.payload};
        case SEND_EMAIL_TO_CONTACT_SUCCESS:
            return {loading:false, sendEmail:action.payload};
        case SEND_EMAIL_TO_CONTACT_FAIL:
            return {loading:false, error : action.payload, sendEmail: "error"};
        default:
            return state;
    }
}

function emailAddNewsletterReducer (state={}, action){
    switch(action.type){
        case SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_REQUEST:
            return {loading:true};
        case SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_SUCCESS:
            return {loading:false, successSending: action.payload};
        case SEND_EMAIL_FOR_NEWSLETTER_CONFIRM_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function emailRemoveNewsletterReducer (state={}, action){
    switch(action.type){
        case SEND_EMAIL_FOR_NEWSLETTER_DELETE_REQUEST:
            return {loading:true};
        case SEND_EMAIL_FOR_NEWSLETTER_DELETE_SUCCESS:
            return {loading:false, successSending: true};
        case SEND_EMAIL_FOR_NEWSLETTER_DELETE_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function emailOrderCorfimationReducer (state={}, action){
    switch(action.type){
        case SEND_EMAIL_TO_CONFIRM_ORDER_REQUEST:
            return {loading:true};
        case SEND_EMAIL_TO_CONFIRM_ORDER_SUCCESS:
            return {loading:false, successSending: true};
        case SEND_EMAIL_TO_CONFIRM_ORDER_FAIL:
            return {loading:false, successSending:false, error : action.payload};       
        default:
            return state;
    }
}

function emailOrderNotificationReducer (state={}, action){
    switch(action.type){
        case SEND_NEW_ORDER_EMAIL_REQUEST:
            return {loading:true};
        case SEND_NEW_ORDER_EMAIL_SUCCESS:
            return {loading:false, successSending: true};
        case SEND_NEW_ORDER_EMAIL_FAIL:
            return {loading:false, successSending:false, error : action.payload};       
        default:
            return state;
    }
}

function emailResetPasswordReducer (state={}, action){
    switch(action.type){
        case SEND_PASSWORD_RESET_REQUEST:
            return {loading:true};
        case SEND_PASSWORD_RESET_SUCCESS:
            return {loading:false, successSending: true};
        case SEND_PASSWORD_RESET_FAIL:
            return {loading:false, successSending:false, error : action.payload};
        default:
            return state;
    }
}

function updatePasswordReducer (state={}, action){
    switch(action.type){
        case UPDATE_PASSWORD_RESET_REQUEST:
            return {loading:true};
        case UPDATE_PASSWORD_RESET_SUCCESS:
            return {loading:false, successUpdate: true};
        case UPDATE_PASSWORD_RESET_FAIL:
            return {loading:false, successUpdate: false, error : action.payload};
        default:
            return state;
    }
}

function emailPassUpdateConfirmationReducer (state={}, action){
    switch(action.type){
        case SEND_UPDATE_PASSWORD_CONFIRM_REQUEST:
            return {loading:true};
        case SEND_UPDATE_PASSWORD_CONFIRM_SUCCESS:
            return {loading:false, successSending: true};
        case SEND_UPDATE_PASSWORD_CONFIRM_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function emailAccountDeleteConfirmationReducer (state={}, action){
    switch(action.type){
        case SEND_ACCOUNT_DELETE_EMAIL_REQUEST:
            return {loading:true};
        case SEND_ACCOUNT_DELETE_EMAIL_SUCCESS:
            return {loading:false, successSending: true};
        case SEND_ACCOUNT_DELETE_EMAIL_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

export {emailRegisterReducer, emailContactReducer, emailAddNewsletterReducer, 
    emailRemoveNewsletterReducer, emailOrderCorfimationReducer, 
    emailResetPasswordReducer, updatePasswordReducer,emailPassUpdateConfirmationReducer,
    emailAccountDeleteConfirmationReducer,emailOrderNotificationReducer}