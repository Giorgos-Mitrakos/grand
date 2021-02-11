import {TOGGLE_MAIN_MENU, TOGGLE_PRODUCT_MENU} from '../constants/menuConstants';

const menuOpen = () => (dispatch)=>
{
    dispatch({type:TOGGLE_MAIN_MENU});
}

const productMenuToggle = (bool) => (dispatch)=>
{
    dispatch({type:TOGGLE_PRODUCT_MENU, payload:bool});
}

export {menuOpen, productMenuToggle}