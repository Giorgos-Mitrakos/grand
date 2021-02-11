import { USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_SIGNOUT_REQUEST, USER_SIGNOUT_SUCCESS, USER_SIGNOUT_FAIL, USER_PASSWORD_CHANGE_REQUEST, USER_PASSWORD_CHANGE_SUCCESS, USER_PASSWORD_CHANGE_FAIL, USER_ACCOUNT_ADDRESS_REQUEST, USER_ACCOUNT_ADDRESS_SUCCESS, USER_ACCOUNT_ADDRESS_FAIL, USER_SAVE_ACCOUNT_INFO_REQUEST, USER_SAVE_ACCOUNT_INFO_SUCCESS, USER_SAVE_ACCOUNT_INFO_FAIL, ADD_TO_NEWSLETTER_REQUEST, ADD_TO_NEWSLETTER_SUCCESS, ADD_TO_NEWSLETTER_FAIL, REMOVE_FROM_NEWSLETTER_REQUEST, REMOVE_FROM_NEWSLETTER_SUCCESS, REMOVE_FROM_NEWSLETTER_FAIL, DELETE_USER_ACCOUNT_REQUEST, DELETE_USER_ACCOUNT_SUCCESS, DELETE_USER_ACCOUNT_FAIL } from "../constants/userConstants";

function userSigninReducer (state={userInfo:[]}, action){
    switch(action.type){
        case USER_SIGNIN_REQUEST:
            return {loading:true};
        case USER_SIGNIN_SUCCESS:
            return {loading:false, userInfo : action.payload};
        case USER_SIGNIN_FAIL:
            return {loading:false, error : action.payload, signInFailMessage:action.message};
        case USER_SIGNOUT_REQUEST:
            return {loading:true};
        case USER_SIGNOUT_SUCCESS:
            return {loading:false, userInfo : null};
        case USER_SIGNOUT_FAIL:
            return {loading:false, error : action.payload};
        case USER_REGISTER_REQUEST:
            return {loading:true};
        case USER_REGISTER_SUCCESS:
            return {loading:false, userInfo : action.payload, success: action.success};
        case USER_REGISTER_FAIL:
            return {loading:false, error : action.payload, registerFailmessage:action.message};
        case DELETE_USER_ACCOUNT_REQUEST:
            return {loading:true, userInfo:state.userInfo};
        case DELETE_USER_ACCOUNT_SUCCESS:
            return {loading:false, userInfo : {},message:action.payload.message, successDeleting: action.success};
        case DELETE_USER_ACCOUNT_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function userSignoutReducer (state={}, action){
    switch(action.type){
        
        default:
            return state;
    }
}

function userRegisterReducer (state={}, action){
    switch(action.type){
        
        default:
            return state;
    }
}

function userAccountInfoReducer (state={}, action){
    switch(action.type){
        case USER_SAVE_ACCOUNT_INFO_REQUEST:
            return {loading:true};
        case USER_SAVE_ACCOUNT_INFO_SUCCESS:
            return {loading:false, userAddressInfo : action.payload, success: true};
        case USER_SAVE_ACCOUNT_INFO_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function userAccountAddressReducer (state={}, action){
    switch(action.type){
        case USER_ACCOUNT_ADDRESS_REQUEST:
            return {loading:true};
        case USER_ACCOUNT_ADDRESS_SUCCESS:
            return {loading:false, userAddressInfo : action.payload};
        case USER_ACCOUNT_ADDRESS_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function userPasswordChangeReducer (state={}, action){
    switch(action.type){
        case USER_PASSWORD_CHANGE_REQUEST:
            return {loading:true};
        case USER_PASSWORD_CHANGE_SUCCESS:
            return {loading:false,message:action.payload.message, success: true};
        case USER_PASSWORD_CHANGE_FAIL:
            return {loading:false, error : action.payload, message:action.message};
        default:
            return state;
    }
}

function addForNewsletterReducer (state={}, action){
    switch(action.type){
        case ADD_TO_NEWSLETTER_REQUEST:
            return {loading:true};
        case ADD_TO_NEWSLETTER_SUCCESS:
            return {loading:false, successAdding: action.payload};
        case ADD_TO_NEWSLETTER_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function removeFromNewsletterReducer (state={}, action){
    switch(action.type){
        case REMOVE_FROM_NEWSLETTER_REQUEST:
            return {loading:true};
        case REMOVE_FROM_NEWSLETTER_SUCCESS:
            return {loading:false, successRemoving: action.payload};
        case REMOVE_FROM_NEWSLETTER_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

export {userSigninReducer,userRegisterReducer,userSignoutReducer, 
    userAccountInfoReducer, userPasswordChangeReducer,userAccountAddressReducer,
    addForNewsletterReducer, removeFromNewsletterReducer}