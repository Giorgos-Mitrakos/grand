const { ADMIN_COLLECTION_LIST_REQUEST, ADMIN_COLLECTION_LIST_SUCCESS, ADMIN_COLLECTION_LIST_FAIL,
    COLLECTION_SAVE_REQUEST,COLLECTION_SAVE_SUCCESS,PRODUCT_SAVE_FAIL, COLLECTION_VISIBILITY_CHANGE_REQUEST, COLLECTION_VISIBILITY_CHANGE_SUCCESS, COLLECTION_VISIBILITY_CHANGE_FAIL, COLLECTION_LIST_REQUEST, COLLECTION_LIST_SUCCESS, COLLECTION_LIST_FAIL, COLLECTION_DETAILS_REQUEST, COLLECTION_DETAILS_SUCCESS, COLLECTION_DETAILS_FAIL} = require("../constants/collectionConstants");

function collectionAdminReducer(state={collection:[]},action) {
    switch (action.type) {
        case ADMIN_COLLECTION_LIST_REQUEST:
            return {loading:true, collection: []};
        case ADMIN_COLLECTION_LIST_SUCCESS:
            return {loading:false, collection : action.payload};
        case ADMIN_COLLECTION_LIST_FAIL:
            return {loading:false, error : action.payload};
        case COLLECTION_SAVE_REQUEST:
            return {loadingSave:true, collection:[]};
        case COLLECTION_SAVE_SUCCESS:
            let item=action.payload;
            return {loadingSave:false, successSave:true, 
                collection : state.collection.map(x=>(x.collection_id===item.collection_id)?item:x)};
        case PRODUCT_SAVE_FAIL:
            return {loadingSave:false, errorSave : action.payload}; 
        case COLLECTION_VISIBILITY_CHANGE_REQUEST:
            return {loadingVisibility:true, collection:[...state.collection]};
        case COLLECTION_VISIBILITY_CHANGE_SUCCESS:
            let col = action.payload;
            return {loadingVisibility:false,
                collection : state.collection.map(x=>(x._id===col._id)?col:x)
            };
        case COLLECTION_VISIBILITY_CHANGE_FAIL:
            return {loadingVisibility:false, errorVisibility : action.payload};               
        default:
            return state;
    }
}

function collectionListReducer(state={collection:[]},action){
    switch (action.type) {
        case COLLECTION_LIST_REQUEST:
            return {loading:true, collection: []};
        case COLLECTION_LIST_SUCCESS:
            return {loading:false, collection : action.payload};
        case COLLECTION_LIST_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function collectionDetailsReducer(state={collection:{}},action){
    switch(action.type){
        case COLLECTION_DETAILS_REQUEST:
            return {loading:true};
        case COLLECTION_DETAILS_SUCCESS:
            return {loading:false, collection : action.payload};
        case COLLECTION_DETAILS_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

export {collectionAdminReducer,collectionListReducer,collectionDetailsReducer}