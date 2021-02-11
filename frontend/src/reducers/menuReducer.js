import {TOGGLE_MAIN_MENU, TOGGLE_PRODUCT_MENU} from '../constants/menuConstants';

function menuReducer(state={isMenuOpen:false},action){
    switch(action.type){
        case TOGGLE_MAIN_MENU:
            return {...state,isMenuOpen:!state.isMenuOpen}
        default:
            return state;
    }
}

function productMenuReducer(state={isProductMenuOpen:false},action){
    switch(action.type){
        case TOGGLE_PRODUCT_MENU:
            return {...state,isProductMenuOpen:action.payload}
        default:
            return state;
    }
}

export {menuReducer, productMenuReducer};