import { WISHLIST_ADD_ITEM_FAIL, WISHLIST_ADD_ITEM_REQUEST, WISHLIST_ADD_ITEM_SUCCESS, WISHLIST_REMOVE_ITEM_REQUEST, WISHLIST_REMOVE_ITEM_SUCCESS, WISHLIST_REMOVE_ITEM_FAIL, WISHLIST_ITEMS_REQUEST, WISHLIST_ITEMS_SUCCESS, WISHLIST_ITEMS_FAIL, MOVE_TO_CART_REQUEST, MOVE_TO_CART_SUCCESS, MOVE_TO_CART_FAIL } from "../constants/wishListConstants";

function wishListReducer(state={wishListItems:[]},action){
    switch(action.type){
        case WISHLIST_ITEMS_REQUEST:
            return {loading:true, wishListItems: []};
        case WISHLIST_ITEMS_SUCCESS:
            return {loading:false, wishListItems : action.payload};
        case WISHLIST_ITEMS_FAIL:
            return {loading:false, error : action.payload};
        case WISHLIST_ADD_ITEM_REQUEST:
            return {loading:true};
        case WISHLIST_ADD_ITEM_SUCCESS:
            return {loading:false, wishListItems : action.payload};
        case WISHLIST_ADD_ITEM_FAIL:
            return {loading:false, error : action.payload}; 
        case WISHLIST_REMOVE_ITEM_REQUEST:
            return {loading:true};
        case WISHLIST_REMOVE_ITEM_SUCCESS:
            return {loading:false, wishListItems: state.wishListItems.filter(x=>!(x._id===action.payload.product_id && x.user_email===action.payload.user_email))};
        case WISHLIST_REMOVE_ITEM_FAIL:
            return {loading:false, error : action.payload};
        case MOVE_TO_CART_REQUEST:
            return {loading:true, wishListItems: []};
        case MOVE_TO_CART_SUCCESS:
            return {loading:false, wishListItems : action.payload};
        case MOVE_TO_CART_FAIL:
            return {loading:false, error : action.payload}; 
        default:
            return state;
    }
}

export {wishListReducer}