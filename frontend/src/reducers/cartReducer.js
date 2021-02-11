import { CART_SAVE_SHIPPING, CART_SAVE_PAYMENT, CART_ADD_ITEM_REQUEST, CART_ADD_ITEM_SUCCESS, CART_ADD_ITEM_FAIL, CART_REMOVE_ITEM_FAIL, CART_REMOVE_ITEM_SUCCESS, CART_REMOVE_ITEM_REQUEST, CART_ITEM_REQUEST, CART_ITEM_SUCCESS, CART_ITEM_FAIL, CART_UPDATE_ITEM_REQUEST, CART_UPDATE_ITEM_SUCCESS, CART_UPDATE_ITEM_FAIL, CART_NO_USER_ADD_ITEM_REQUEST, CART_NO_USER_ADD_ITEM_SUCCESS, CART_NO_USER_UPDATE_ITEM_SUCCESS, CART_NO_USER_UPDATE_ITEM_REQUEST, CART_NO_USER_REMOVE_ITEM_REQUEST, CART_NO_USER_REMOVE_ITEM_SUCCESS, CART_EMPTY_REQUEST, CART_ADD_IMAGE_CASE_ITEM_REQUEST, CART_ADD_IMAGE_CASE_ITEM_SUCCESS, CART_ADD_IMAGE_CASE_ITEM_FAIL } from "../constants/cartConstants";

function cartReducer(state={cartItems:[], shipping:{}, payment:{}},action){
    switch(action.type){
        case CART_EMPTY_REQUEST:
            return {cartItems: []};
        case CART_ADD_ITEM_REQUEST:
            return {loading:true, cartItems: []};
        case CART_ADD_ITEM_SUCCESS:
            return {loading:false, cartItems : action.payload};
        case CART_ADD_ITEM_FAIL:
            return {loading:false, error : action.payload};
        case CART_NO_USER_ADD_ITEM_REQUEST:
            return {loading:true, cartItems: [...state.cartItems]};
        case CART_NO_USER_ADD_ITEM_SUCCESS:
            const item = action.payload;
            const product = state.cartItems.find(x => x._id === item._id && x.model===item.model);
            if (product) 
            {
                return {
                cartItems:
                    state.cartItems.map(x => (x._id === product._id && x.model=== product.model)? item : x)
                };
            }
            return { cartItems: [...state.cartItems, item] };        
        case CART_ADD_IMAGE_CASE_ITEM_REQUEST:
            return {uploading:true, cartItems: []};
        case CART_ADD_IMAGE_CASE_ITEM_SUCCESS:
            return {uploading:false, cartItems : action.payload};
        case CART_ADD_IMAGE_CASE_ITEM_FAIL:
            return {uploading:false, error : action.payload};
        case CART_UPDATE_ITEM_REQUEST:
            return {loading:true, cartItems: []};
        case CART_UPDATE_ITEM_SUCCESS:
            return {loading:false, cartItems : action.payload};
        case CART_UPDATE_ITEM_FAIL:
            return {loading:false, error : action.payload};
        case CART_NO_USER_UPDATE_ITEM_REQUEST:
            return {loading:false, cartItems: [...state.cartItems]};
        case CART_NO_USER_UPDATE_ITEM_SUCCESS:
            const item1 = action.payload;
            const product1 = state.cartItems.find(x => x._id === item1._id && x.model===item1.model);
            
            return {
            cartItems:
                state.cartItems.map(x => (x._id === product1._id && x.model=== product1.model)? item1 : x)
            };
            
        case CART_REMOVE_ITEM_REQUEST:
            return {loading:true, cartItems: []};
        case CART_REMOVE_ITEM_SUCCESS:
            return {loading:false, cartItems : action.payload};
        case CART_REMOVE_ITEM_FAIL:
            return {loading:false, error : action.payload};
        case CART_NO_USER_REMOVE_ITEM_REQUEST:
            return {loading:true, cartItems: [...state.cartItems]};
        case CART_NO_USER_REMOVE_ITEM_SUCCESS:
            return {loading:false, cartItems : state.cartItems.filter(x=>!(x._id===action.payload.product_id && x.model===action.payload.model))};
        case CART_ITEM_REQUEST:
            return {loading:true, cartItems: []};
        case CART_ITEM_SUCCESS:
            return {loading:false, cartItems : action.payload};
        case CART_ITEM_FAIL:
            return {loading:false, error : action.payload};
        case CART_SAVE_SHIPPING:
            return{
                ...state, shipping: action.payload
            }
        case CART_SAVE_PAYMENT:
            return{
                ...state, payment: action.payload
            }
        default:
            return state;
    }

}

export {cartReducer}