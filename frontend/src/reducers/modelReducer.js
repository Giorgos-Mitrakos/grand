const { MODEL_LIST_REQUEST, MODEL_LIST_SUCCESS, MODEL_LIST_FAIL, PHONE_BRAND_LIST_REQUEST, PHONE_BRAND_LIST_SUCCESS, PHONE_BRAND_LIST_FAIL, BRAND_INSERT_REQUEST, BRAND_INSERT_SUCCESS, BRAND_INSERT_FAIL, PHONE_MODEL_LIST_REQUEST, PHONE_MODEL_LIST_SUCCESS, PHONE_MODEL_LIST_FAIL, MODEL_INSERT_REQUEST, MODEL_INSERT_SUCCESS, MODEL_INSERT_FAIL } = require("../constants/modelConstants");

function modelListReducer(state={phoneModels:[]},action){
    switch(action.type){
        case MODEL_LIST_REQUEST:
            return {loadingModel:true};
        case MODEL_LIST_SUCCESS:
            return {loadingModel:false, phoneModels : action.payload};
        case MODEL_LIST_FAIL:
            return {loadingModel:false, errorModel : action.payload};
        default:
            return state;
    }
}

function phonesBrandListReducer(state={phoneBrands:[]},action){
    switch(action.type){
        case PHONE_BRAND_LIST_REQUEST:
            return {loadingBrand:true};
        case PHONE_BRAND_LIST_SUCCESS:
            return {loadingBrand:false, phoneBrands : action.payload};
        case PHONE_BRAND_LIST_FAIL:
            return {loadingBrand:false, errorBrand : action.payload};
        case BRAND_INSERT_REQUEST:
            return {loadingBrand:true, phoneBrands:[]};
        case BRAND_INSERT_SUCCESS:
            return {loadingBrand:false, phoneBrands : action.payload};
        case BRAND_INSERT_FAIL:
            return {loadingBrand:false, errorBrand : action.payload};
        default:
            return state;
    }
}

function phoneModelListReducer(state={phoneModels:[]},action){
    switch(action.type){
        case PHONE_MODEL_LIST_REQUEST:
            return {loadingModel:true};
        case PHONE_MODEL_LIST_SUCCESS:
            return {loadingModel:false, phoneModels : action.payload};
        case PHONE_MODEL_LIST_FAIL:
            return {loadingModel:false, errorModel : action.payload};
        case MODEL_INSERT_REQUEST:
            return {loadingModel:true, phoneModels:[]};
        case MODEL_INSERT_SUCCESS:
            return {loadingModel:false, phoneModels : action.payload};
        case MODEL_INSERT_FAIL:
            return {loadingModel:false, errorModel : action.payload};
        default:
            return state;
    }
}

export {modelListReducer, phonesBrandListReducer, phoneModelListReducer}