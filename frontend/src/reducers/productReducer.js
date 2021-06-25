import { PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL,
     PRODUCT_LIST_REQUEST, PRODUCT_DETAILS_REQUEST,
      PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL,
       PRODUCT_SAVE_REQUEST, PRODUCT_SAVE_SUCCESS, 
       PRODUCT_SAVE_FAIL, PRODUCT_MOST_VIEWED_REQUEST, 
       PRODUCT_MOST_VIEWED_SUCCESS, PRODUCT_MOST_VIEWED_FAIL, 
       MANUFACTURES_LIST_REQUEST, MANUFACTURES_LIST_SUCCESS, MANUFACTURES_LIST_FAIL, 
       MANUFACTURER_INSERT_REQUEST, MANUFACTURER_INSERT_SUCCESS, MANUFACTURER_INSERT_FAIL, 
       FEATURE_TITLE_LIST_REQUEST, FEATURE_TITLE_LIST_SUCCESS, FEATURE_TITLE_LIST_FAIL, 
       FEATURE_TITLE_INSERT_REQUEST, FEATURE_TITLE_INSERT_SUCCESS, FEATURE_TITLE_INSERT_FAIL, 
       FEATURE_NAME_LIST_REQUEST, FEATURE_NAME_LIST_SUCCESS, FEATURE_NAME_LIST_FAIL, 
       FEATURE_NAME_INSERT_REQUEST, FEATURE_NAME_INSERT_SUCCESS, FEATURE_NAME_INSERT_FAIL, 
       FEATURE_INSERT_REQUEST, FEATURE_INSERT_SUCCESS, FEATURE_INSERT_FAIL, 
       FEATURE_LIST_REQUEST, FEATURE_LIST_SUCCESS, FEATURE_LIST_FAIL, 
       FEATURE_DELETE_REQUEST, FEATURE_DELETE_SUCCESS, FEATURE_DELETE_FAIL, 
       CATEGORIES_LIST_REQUEST, CATEGORIES_LIST_SUCCESS, CATEGORIES_LIST_FAIL, 
       SUBCATEGORIES_LIST_REQUEST, SUBCATEGORIES_LIST_SUCCESS, SUBCATEGORIES_LIST_FAIL, 
       PRODUCT_LIST_BY_CATEGORY_REQUEST, PRODUCT_LIST_BY_CATEGORY_SUCCESS, PRODUCT_LIST_BY_CATEGORY_FAIL, 
       PRODUCT_VISIBILITY_CHANGE_REQUEST, PRODUCT_VISIBILITY_CHANGE_SUCCESS, PRODUCT_VISIBILITY_CHANGE_FAIL, 
       PRODUCT_LIST_BY_CATEGORY_ADMIN_REQUEST, PRODUCT_LIST_BY_CATEGORY_ADMIN_SUCCESS, PRODUCT_LIST_BY_CATEGORY_ADMIN_FAIL,
       REMOVE_PRODUCTS, CATEGORY_PERCENTAGE_CHANGE_REQUEST, CATEGORY_PERCENTAGE_CHANGE_SUCCESS,
       CATEGORY_PERCENTAGE_CHANGE_FAIL, FEATURE_TITLES_BY_CATEGORY_REQUEST,
       FEATURE_TITLES_BY_CATEGORY_SUCCESS, FEATURE_TITLES_BY_CATEGORY_FAIL,
       FEATURE_NAMES_BY_CATEGORY_REQUEST, FEATURE_NAMES_BY_CATEGORY_SUCCESS,
       FEATURE_NAMES_BY_CATEGORY_FAIL, GET_FEATURES_REQUEST, GET_FEATURES_SUCCESS,
       GET_FEATURES_FAIL, SENDING_LIST_REQUEST, SENDING_LIST_SUCCESS,
       SENDING_LIST_FAIL, EDIT_SENDING_METHOD_REQUEST, EDIT_SENDING_METHOD_SUCCESS,
       EDIT_SENDING_METHOD_FAIL, ADD_SENDING_METHOD_REQUEST, ADD_SENDING_METHOD_SUCCESS,
       ADD_SENDING_METHOD_FAIL, REMOVE_SENDING_METHOD_REQUEST, REMOVE_SENDING_METHOD_SUCCESS,
       REMOVE_SENDING_METHOD_FAIL, ADMIN_PAYMENT_LIST_REQUEST, ADMIN_PAYMENT_LIST_SUCCESS,
       ADMIN_PAYMENT_LIST_FAIL, EDIT_ADMIN_PAYMENT_LIST_REQUEST,
       EDIT_ADMIN_PAYMENT_LIST_SUCCESS, EDIT_ADMIN_PAYMENT_LIST_FAIL,
       ADD_ADMIN_PAYMENT_LIST_REQUEST, ADD_ADMIN_PAYMENT_LIST_SUCCESS, ADD_ADMIN_PAYMENT_LIST_FAIL,
       REMOVE_ADMIN_PAYMENT_LIST_REQUEST, REMOVE_ADMIN_PAYMENT_LIST_SUCCESS,
       REMOVE_ADMIN_PAYMENT_LIST_FAIL, COMPATIBILITIES_BY_CATEGORY_REQUEST,
       COMPATIBILITIES_BY_CATEGORY_SUCCESS, COMPATIBILITIES_BY_CATEGORY_FAIL,
       COMPATIBILITY_COMPANIES_LIST_REQUEST, COMPATIBILITY_COMPANIES_LIST_SUCCESS,
       COMPATIBILITY_COMPANIES_LIST_FAIL, COMPATIBILITY_MODELS_LIST_REQUEST,
       COMPATIBILITY_MODELS_LIST_SUCCESS, COMPATIBILITY_MODELS_LIST_FAIL,
       INSERT_COMPATIBILITY_COMPANY_REQUEST, INSERT_COMPATIBILITY_COMPANY_SUCCESS,
       INSERT_COMPATIBILITY_COMPANY_FAIL, INSERT_COMPATIBILITY_MODEL_REQUEST,
       INSERT_COMPATIBILITY_MODEL_SUCCESS, INSERT_COMPATIBILITY_MODEL_FAIL,
       PRODUCT_COMPATIBILITIES_REQUEST, PRODUCT_COMPATIBILITIES_SUCCESS,
       PRODUCT_COMPATIBILITIES_FAIL, INSERT_PRODUCT_COMPATIBILITY_REQUEST,
       INSERT_PRODUCT_COMPATIBILITY_SUCCESS, INSERT_PRODUCT_COMPATIBILITY_FAIL, 
       DELETE_PRODUCT_COMPATIBILITY_REQUEST, DELETE_PRODUCT_COMPATIBILITY_SUCCESS, 
       DELETE_PRODUCT_COMPATIBILITY_FAIL,
       SUPPLIERS_LIST_REQUEST,
       SUPPLIERS_LIST_SUCCESS,
       SUPPLIERS_LIST_FAIL,
       SUPPLIERS_INSERT_REQUEST,
       SUPPLIERS_INSERT_SUCCESS,
       SUPPLIERS_INSERT_FAIL,
       SUPPLIERS_DELETE_REQUEST,
       SUPPLIERS_DELETE_SUCCESS,
       SUPPLIERS_DELETE_FAIL,
       MANUFACTURER_DELETE_REQUEST,
       MANUFACTURER_DELETE_SUCCESS,
       MANUFACTURER_DELETE_FAIL,
       SEARCH_FOR_ITEMS_REQUEST,
       SEARCH_FOR_ITEMS_SUCCESS,
       SEARCH_FOR_ITEMS_FAIL,
       SELECT_ITEMS_PER_PAGE,
       SET_SEARCH_TEXT,
       SET_SEARCH_FILTERS,
       RESET_SEARCH_FILTERS,
       GET_PRODUCT_HISTORY_REQUEST,
       GET_PRODUCT_HISTORY_SUCCESS,
       GET_PRODUCT_HISTORY_FAIL} from '../constants/productConstant';

function sortCompanies( a, b ) {
if ( a.company < b.company ){
    return -1;
}
if ( a.company > b.company ){
    return 1;
}
return 0;
}

function sortModels( a, b ) {
    if ( a.model < b.model ){
        return -1;
    }
    if ( a.model > b.model ){
        return 1;
    }
    return 0;
}

function sortCompatibilities( a, b ) {
    if ( a.compatibility_model < b.compatibility_model ){
        return -1;
    }
    if ( a.compatibility_model > b.compatibility_model ){
        return 1;
    }
    return 0;
}

function productListReducer(state={products:[]},action){
    switch(action.type){
        case PRODUCT_LIST_REQUEST:
            return {loading:true, products: []};
        case PRODUCT_LIST_SUCCESS:
            return {loading:false, products : action.payload};
        case PRODUCT_LIST_FAIL:
            return {loading:false, error : action.payload};
        case PRODUCT_LIST_BY_CATEGORY_REQUEST:
            return {loading:true, products: []};
        case PRODUCT_LIST_BY_CATEGORY_SUCCESS:
            return {loading:false, products : action.payload};
        case PRODUCT_LIST_BY_CATEGORY_FAIL:
            return {loading:false, error : action.payload};
        case PRODUCT_LIST_BY_CATEGORY_ADMIN_REQUEST:
            return {loading:true, products: []};
        case PRODUCT_LIST_BY_CATEGORY_ADMIN_SUCCESS:
            return {loading:false, products : action.payload.resp, count: action.payload.count[0].count};
        case PRODUCT_LIST_BY_CATEGORY_ADMIN_FAIL:
            return {loading:false, error : action.payload};
        case PRODUCT_VISIBILITY_CHANGE_REQUEST:
            return {loading:true, products:[...state.products]};
        case PRODUCT_VISIBILITY_CHANGE_SUCCESS:
            let item = action.payload;
            return {loading:false,
                products :state.products.map(x=>(x._id===item._id)?item:x)
            };
        case PRODUCT_VISIBILITY_CHANGE_FAIL:
            return {loading:false, error : action.payload};
        case PRODUCT_SAVE_REQUEST:
            return {loadingSave:true};
        case PRODUCT_SAVE_SUCCESS:
            item = action.payload;
            return {loadingSave:false,
                products : [...state.products,state.products.map(x=>(x._id===item._id)?item:x)]
            };
        case PRODUCT_SAVE_FAIL:
            return {loadingSave:false, errorSave : action.payload};
        case REMOVE_PRODUCTS:
            return {products:[]};
        case CATEGORY_PERCENTAGE_CHANGE_REQUEST:
            return {loadingPercentage:true, products: [...state.products]};
        case CATEGORY_PERCENTAGE_CHANGE_SUCCESS:
            return {loadingPercentage:false, successPercentageChange:true, products: [...state.products]};
        case CATEGORY_PERCENTAGE_CHANGE_FAIL:
            return {loadingPercentage:false, errorPercentage : action.payload};
        default:
            return state;
    }
}

function mostViewedProductsReducer(state={mostViewed:[]},action){
    switch(action.type){
        case PRODUCT_MOST_VIEWED_REQUEST:
            return {loading:true, mostViewed: []};
        case PRODUCT_MOST_VIEWED_SUCCESS:
            return {loading:false, mostViewed : action.payload};
        case PRODUCT_MOST_VIEWED_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function searchForItemsReducer(state={searchItems:[], categories:[], subcategories:[]},action){
    switch(action.type){
        case SEARCH_FOR_ITEMS_REQUEST:
            return {loading:true, searchItems: [], categories:[], subcategories:[]};
        case SEARCH_FOR_ITEMS_SUCCESS:
            return {loading:false, searchItems : action.payload.resp, count:action.payload.count[0].count, 
                categories: action.payload.categories,subcategories: action.payload.subcategories};
        case SEARCH_FOR_ITEMS_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function productDetailsReducer(state={product:{}, compatibilities:[], features:[]},action){
    switch(action.type){
        case PRODUCT_DETAILS_REQUEST:
            return {loading:true};
        case PRODUCT_DETAILS_SUCCESS:
            return {loading:false, product : action.payload.product, 
                compatibilities:action.payload.compatibilities,
                features:action.payload.features};
        case PRODUCT_DETAILS_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function manufacturersListReducer(state={manufacturers:[]},action){
    switch(action.type){
        case MANUFACTURES_LIST_REQUEST:
            return {loading:true, manufacturers: []};
        case MANUFACTURES_LIST_SUCCESS:
            return {loading:false, manufacturers : action.payload};
        case MANUFACTURES_LIST_FAIL:
            return {loading:false, error : action.payload};
        case MANUFACTURER_INSERT_REQUEST:
            return {loading:true, manufacturers: []};
        case MANUFACTURER_INSERT_SUCCESS:
            return {loading:false, manufacturers : action.payload};
        case MANUFACTURER_INSERT_FAIL:
            return {loading:false, error : action.payload};
        case MANUFACTURER_DELETE_REQUEST:
            return {loading:true, manufacturers: []};
        case MANUFACTURER_DELETE_SUCCESS:
            return {loading:false, manufacturers : action.payload};
        case MANUFACTURER_DELETE_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function sendingListReducer(state={sendingMethods:[]},action) {
    switch(action.type){
        case SENDING_LIST_REQUEST:
            return {loading:true, sendingMethods: []};
        case SENDING_LIST_SUCCESS:
            return {loading:false, sendingMethods : action.payload};
        case SENDING_LIST_FAIL:
            return {loading:false, error : action.payload};
        case EDIT_SENDING_METHOD_REQUEST:
            return {loading:true, sendingMethods: []};
        case EDIT_SENDING_METHOD_SUCCESS:
            return {loading:false, sendingMethods : action.payload};
        case EDIT_SENDING_METHOD_FAIL:
            return {loading:false, error : action.payload};
        case ADD_SENDING_METHOD_REQUEST:
            return {loading:true, sendingMethods: []};
        case ADD_SENDING_METHOD_SUCCESS:
            return {loading:false, sendingMethods : action.payload};
        case ADD_SENDING_METHOD_FAIL:
            return {loading:false, error : action.payload};
        case REMOVE_SENDING_METHOD_REQUEST:
            return {loading:true, sendingMethods: [...state.sendingMethods]};
        case REMOVE_SENDING_METHOD_SUCCESS:
            return {loading:false, sendingMethods : action.payload};
        case REMOVE_SENDING_METHOD_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state; 
    }   
}

function paymentListReducer(state={paymentMethods:[]},action) {
    switch(action.type){
        case ADMIN_PAYMENT_LIST_REQUEST:
            return {loading:true, paymentMethods: []};
        case ADMIN_PAYMENT_LIST_SUCCESS:
            return {loading:false, paymentMethods : action.payload};
        case ADMIN_PAYMENT_LIST_FAIL:
            return {loading:false, error : action.payload};
        case EDIT_ADMIN_PAYMENT_LIST_REQUEST:
            return {loading:true, paymentMethods: []};
        case EDIT_ADMIN_PAYMENT_LIST_SUCCESS:
            return {loading:false, paymentMethods : action.payload};
        case EDIT_ADMIN_PAYMENT_LIST_FAIL:
            return {loading:false, error : action.payload};
        case ADD_ADMIN_PAYMENT_LIST_REQUEST:
            return {loading:true, paymentMethods: []};
        case ADD_ADMIN_PAYMENT_LIST_SUCCESS:
            return {loading:false, paymentMethods : action.payload};
        case ADD_ADMIN_PAYMENT_LIST_FAIL:
            return {loading:false, error : action.payload};
        case REMOVE_ADMIN_PAYMENT_LIST_REQUEST:
            return {loading:true, paymentMethods: []};
        case REMOVE_ADMIN_PAYMENT_LIST_SUCCESS:
            return {loading:false, paymentMethods : action.payload};
        case REMOVE_ADMIN_PAYMENT_LIST_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state; 
    }   
}

function featureTitleListReducer(state={featureTitles:[]},action){
    switch(action.type){
        case FEATURE_TITLE_LIST_REQUEST:
            return {loading:true, featureTitles: []};
        case FEATURE_TITLE_LIST_SUCCESS:
            return {loading:false, featureTitles : action.payload};
        case FEATURE_TITLE_LIST_FAIL:
            return {loading:false, error : action.payload};
        case FEATURE_TITLE_INSERT_REQUEST:
            return {loading:true, featureTitles: []};
        case FEATURE_TITLE_INSERT_SUCCESS:
            return {loading:false, featureTitles : action.payload};
        case FEATURE_TITLE_INSERT_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function featureNameListReducer(state={featureNames:[]},action){
    switch(action.type){
        case FEATURE_NAME_LIST_REQUEST:
            return {loading:true, featureNames: []};
        case FEATURE_NAME_LIST_SUCCESS:
            return {loading:false, featureNames : action.payload};
        case FEATURE_NAME_LIST_FAIL:
            return {loading:false, error : action.payload};
        case FEATURE_NAME_INSERT_REQUEST:
            return {loading:true, featureNames: []};
        case FEATURE_NAME_INSERT_SUCCESS:
            return {loading:false, featureNames : action.payload};
        case FEATURE_NAME_INSERT_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function featureListReducer(state={features:[]},action){
    switch(action.type){
        case FEATURE_LIST_REQUEST:
            return {loading:true, features: []};
        case FEATURE_LIST_SUCCESS:
            return {loading:false, features : action.payload};
        case FEATURE_LIST_FAIL:
            return {loading:false, error : action.payload};
        case FEATURE_INSERT_REQUEST:
            return {loading:true, features: []};
        case FEATURE_INSERT_SUCCESS:
            return {loading:false, features : action.payload};
        case FEATURE_INSERT_FAIL:
            return {loading:false, error : action.payload};
        case FEATURE_DELETE_REQUEST:
            return {loading:true, features: []};
        case FEATURE_DELETE_SUCCESS:
            return {loading:false, features : action.payload};
        case FEATURE_DELETE_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function featureTitlesByCategoryReducer(state={featureTitles:[]},action){
    switch (action.type) {
        case FEATURE_TITLES_BY_CATEGORY_REQUEST:
            return {loading:true, featureTitles: []};
        case FEATURE_TITLES_BY_CATEGORY_SUCCESS:
            return {loading:false, featureTitles : action.payload};
        case FEATURE_TITLES_BY_CATEGORY_FAIL:
            return {loading:false, error : action.payload};
    
        default:
            return state;
    }
}

function featureNamesByCategoryReducer(state={featureNames:[]},action){
    switch (action.type) {
        case FEATURE_NAMES_BY_CATEGORY_REQUEST:
            return {loading:true, featureNames: []};
        case FEATURE_NAMES_BY_CATEGORY_SUCCESS:
            return {loading:false, featureNames : action.payload};
        case FEATURE_NAMES_BY_CATEGORY_FAIL:
            return {loading:false, error : action.payload};
    
        default:
            return state;
    }
}

function compatibilitiesByCategoryReducer(state={compatibilities:[]},action){
    switch (action.type) {
        case COMPATIBILITIES_BY_CATEGORY_REQUEST:
            return {loading:true, compatibilities: []};
        case COMPATIBILITIES_BY_CATEGORY_SUCCESS:
            return {loading:false, compatibilities : action.payload};
        case COMPATIBILITIES_BY_CATEGORY_FAIL:
            return {loading:false, error : action.payload};
    
        default:
            return state;
    }
}

function categoryListReducer(state={categories:[]},action){
    switch(action.type){
        case CATEGORIES_LIST_REQUEST:
            return {loading:true, categories: []};
        case CATEGORIES_LIST_SUCCESS:
            return {loading:false, categories : action.payload};
        case CATEGORIES_LIST_FAIL:
            return {loading:false, error : action.payload};        
        default:
            return state;
    }
}

function subcategoryListReducer(state={subcategories:[]},action){
    switch(action.type){
        case SUBCATEGORIES_LIST_REQUEST:
            return {loading:true, subcategories: []};
        case SUBCATEGORIES_LIST_SUCCESS:
            return {loading:false, subcategories : action.payload};
        case SUBCATEGORIES_LIST_FAIL:
            return {loading:false, error : action.payload};        
        default:
            return state;
    }
}

function suppliersListReducer(state={suppliers:[]},action){
    switch(action.type){
        case SUPPLIERS_LIST_REQUEST:
            return {loading:true, suppliers: []};
        case SUPPLIERS_LIST_SUCCESS:
            return {loading:false, suppliers : action.payload};
        case SUPPLIERS_LIST_FAIL:
            return {loading:false, error : action.payload}; 
        case SUPPLIERS_INSERT_REQUEST:
            return {loading:true, suppliers: []};
        case SUPPLIERS_INSERT_SUCCESS:
            return {loading:false, suppliers : action.payload};
        case SUPPLIERS_INSERT_FAIL:
            return {loading:false, error : action.payload};
        case SUPPLIERS_DELETE_REQUEST:
            return {loading:true, suppliers: []};
        case SUPPLIERS_DELETE_SUCCESS:
            return {loading:false, suppliers : action.payload};
        case SUPPLIERS_DELETE_FAIL:
            return {loading:false, error : action.payload};       
        default:
            return state;
    }
}

function productFeaturesReducer(state={features:[]},action){
    switch(action.type){
        case GET_FEATURES_REQUEST:
            return {loading:true, features: []};
        case GET_FEATURES_SUCCESS:
            return {loading:false, features : action.payload};
        case GET_FEATURES_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function compatibilityCompaniesReducer(state={companies:[]},action){
    switch(action.type){
        case COMPATIBILITY_COMPANIES_LIST_REQUEST:
            return {loading:true, companies: []};
        case COMPATIBILITY_COMPANIES_LIST_SUCCESS:
            return {loading:false, companies : action.payload};
        case COMPATIBILITY_COMPANIES_LIST_FAIL:
            return {loading:false, error : action.payload};
        case INSERT_COMPATIBILITY_COMPANY_REQUEST:
            return {loading:true, companies: [...state.companies]};
        case INSERT_COMPATIBILITY_COMPANY_SUCCESS:
            let item = action.payload;
            return {loadingSave:false,
                companies :[...state.companies,item[0]].sort(sortCompanies)
            };
        case INSERT_COMPATIBILITY_COMPANY_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function compatibilityModelsReducer(state={models:[]},action){
    switch(action.type){
        case COMPATIBILITY_MODELS_LIST_REQUEST:
            return {loading:true, models: []};
        case COMPATIBILITY_MODELS_LIST_SUCCESS:
            return {loading:false, models : action.payload};
        case COMPATIBILITY_MODELS_LIST_FAIL:
            return {loading:false, error : action.payload};
        case INSERT_COMPATIBILITY_MODEL_REQUEST:
            return {loading:true, models: [...state.models]};
        case INSERT_COMPATIBILITY_MODEL_SUCCESS:
            let item = action.payload;
            return {loadingSave:false,
                models :[...state.models,item[0]].sort(sortModels)
            };
        case INSERT_COMPATIBILITY_MODEL_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function productCompatibilitiesReducer(state={productCompat:[]},action){
    switch(action.type){
        case PRODUCT_COMPATIBILITIES_REQUEST:
            return {loading:true, productCompat: []};
        case PRODUCT_COMPATIBILITIES_SUCCESS:
            return {loading:false, productCompat : action.payload};
        case PRODUCT_COMPATIBILITIES_FAIL:
            return {loading:false, error : action.payload};
        case INSERT_PRODUCT_COMPATIBILITY_REQUEST:
            return {loading:true, productCompat: [...state.productCompat]};
        case INSERT_PRODUCT_COMPATIBILITY_SUCCESS:
            let item = action.payload;
            return {loadingSave:false,
                productCompat :[...state.productCompat,item[0]].sort(sortCompatibilities)
            };
        case INSERT_PRODUCT_COMPATIBILITY_FAIL:
            return {loading:false, error : action.payload};
        case DELETE_PRODUCT_COMPATIBILITY_REQUEST:
            return {loading:true, productCompat: [...state.productCompat]};
        case DELETE_PRODUCT_COMPATIBILITY_SUCCESS:
            let delId = action.payload;
            return {loadingSave:false,
                productCompat :state.productCompat.filter(x=>x.compatibility_id!==delId)
            };
        case DELETE_PRODUCT_COMPATIBILITY_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function itemsPerPageReducer(state={itemsPerPage:20},action){
    switch(action.type){
        case SELECT_ITEMS_PER_PAGE:
            return {itemsPerPage: action.payload}
        default:
            return state;
    }
}

function textSearchReducer(state={searchText:'', filters: []},action){
    switch(action.type){
        case SET_SEARCH_TEXT:
            return {...state, searchText: action.payload}
        case SET_SEARCH_FILTERS:
            return {...state, filters: action.payload}
        case RESET_SEARCH_FILTERS:
            return {...state,filters: []}
        default:
            return state;
    }
}

function productHistoryReducer(state={prodHistory:[], productCompHistory:[],productFeatHistory:[]},action){
    switch(action.type){
        case GET_PRODUCT_HISTORY_REQUEST:
            return {loading:true, prodHistory: [],productCompHistory:[],productFeatHistory:[]};
        case GET_PRODUCT_HISTORY_SUCCESS:
            return {loading:false, prodHistory: action.payload.productHistory, productCompHistory: action.payload.compHistory, productFeatHistory: action.payload.featHistory};
        case GET_PRODUCT_HISTORY_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}



export {productListReducer, productDetailsReducer, mostViewedProductsReducer,
    manufacturersListReducer, featureTitleListReducer, featureNameListReducer,
    featureListReducer, categoryListReducer, subcategoryListReducer, sendingListReducer,
    featureTitlesByCategoryReducer, featureNamesByCategoryReducer, productFeaturesReducer,
    paymentListReducer,compatibilitiesByCategoryReducer,compatibilityCompaniesReducer,
    compatibilityModelsReducer,productCompatibilitiesReducer,suppliersListReducer,
    searchForItemsReducer,itemsPerPageReducer,textSearchReducer, productHistoryReducer}