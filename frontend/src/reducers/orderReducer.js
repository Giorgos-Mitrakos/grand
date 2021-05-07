import {  } from "../constants/userConstants";
import { ORDER_ADD_REQUEST, ORDER_ADD_SUCCESS, ORDER_ADD_FAIL, ORDER_LIST_REQUEST, 
    ORDER_LIST_SUCCESS, ORDER_LIST_FAIL, ORDER_DETAIL_REQUEST, ORDER_DETAIL_SUCCESS, 
    ORDER_DETAIL_FAIL, ORDER_CHANGE_STATUS_REQUEST, ORDER_CHANGE_STATUS_SUCCESS, 
    ORDER_CHANGE_STATUS_FAIL, ORDER_UPDATE_STATUS_FAIL, ORDER_UPDATE_STATUS_SUCCESS, 
    ORDER_UPDATE_STATUS_REQUEST, ORDER_DETAILS_CHANGE_REQUEST, 
    ORDER_DETAILS_CHANGE_SUCCESS, ORDER_DETAILS_CHANGE_FAIL, 
    ORDER_CHARGER_ADDRESS_UPDATE_REQUEST, ORDER_CHARGER_ADDRESS_UPDATE_SUCCESS, 
    ORDER_CHARGER_ADDRESS_UPDATE_FAIL, ORDER_SHIPPING_ADDRESS_UPDATE_REQUEST, 
    ORDER_SHIPPING_ADDRESS_UPDATE_SUCCESS, ORDER_SHIPPING_ADDRESS_UPDATE_FAIL, 
    ORDER_UPDATE_REQUEST, ORDER_UPDATE_SUCCESS, ORDER_UPDATE_FAIL, 
    ORDER_DELETED_ITEM_REQUEST, ORDER_DELETED_ITEM_SUCCESS, ORDER_DELETED_ITEM_FAIL, CUSTOMER_ORDER_LIST_REQUEST, CUSTOMER_ORDER_LIST_SUCCESS, CUSTOMER_ORDER_LIST_FAIL, CUSTOMER_ORDER_DETAIL_REQUEST, CUSTOMER_ORDER_DETAIL_SUCCESS, CUSTOMER_ORDER_DETAIL_FAIL} from "../constants/orderConstrains";


function orderReducer (state={orderId:''}, action){
    switch(action.type){
        case ORDER_ADD_REQUEST:
            return {loading:true};
        case ORDER_ADD_SUCCESS:
            return {loading:false, successOrdering:true, orderId:action.payload.data};
        case ORDER_ADD_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function orderListReducer(state = { orders: [],  }, action) {
    switch (action.type) {
      case ORDER_LIST_REQUEST:
        return { loading: true };
      case ORDER_LIST_SUCCESS:
        return { loading: false, orders: action.payload.resp, count: action.payload.count[0].count };
      case ORDER_LIST_FAIL:
        return { loading: false, error: action.payload };
      default: return state;
    }
}

function orderDetailsReducer(state={ order :{}, charger: {}, shippingTo: {}, products: [] }, action){
  switch(action.type){
      case ORDER_DETAIL_REQUEST:
          return {loading:true};
      case ORDER_DETAIL_SUCCESS:
          return {loading:false, success:true, order : action.payload.order, charger:action.payload.billingAddress,
             shippingTo:action.payload.shippingAddress, products: action.payload.products};
      case ORDER_DETAIL_FAIL:
          return {loading:false, error : action.payload};
        case ORDER_DETAILS_CHANGE_REQUEST:
            return {loading:true};
        case ORDER_DETAILS_CHANGE_SUCCESS:
            return {loading:false, success: true, ...state, charger:{...state.charger},shippingTo:{...state}, order: action.payload.data};
        case ORDER_DETAILS_CHANGE_FAIL:
            return {loading:false, error : action.payload};
        case ORDER_CHARGER_ADDRESS_UPDATE_REQUEST:
            return {loading:true};
        case ORDER_CHARGER_ADDRESS_UPDATE_SUCCESS:
            return {loading:false, success: true, order: state.order.map(x=>(x.order_id===action.payload.orderId)?(x.paymentType=action.payload.paymentType): x),
            charger: state.charger.map(x=>(x.afm=action.payload.charger.afm,x.companyName=action.payload.charger.companyName,
                x.bussiness=action.payload.charger.bussiness,x.doy=action.payload.charger.doy,
                x.name=action.payload.charger.name,x.subname=action.payload.charger.subname,
                x.country=action.payload.charger.country,x.district=action.payload.charger.district,
                x.city=action.payload.charger.city,x.street=action.payload.charger.street,
                x.postalCode=action.payload.charger.postalCode,x.phoneNumber=action.payload.charger.phoneNumber,
                x.comments=action.payload.charger.comments))};
        case ORDER_CHARGER_ADDRESS_UPDATE_FAIL:
            return {loading:false, error : action.payload};
        case ORDER_SHIPPING_ADDRESS_UPDATE_REQUEST:
            return {loading:true};
        case ORDER_SHIPPING_ADDRESS_UPDATE_SUCCESS:
            return {loading:false, success: true, ...state, charger:{...state.charger},order:{...state.order}, shippingTo: action.payload.data};
        case ORDER_SHIPPING_ADDRESS_UPDATE_FAIL:
            return {loading:false, error : action.payload};
      default:
          return state;
  }
}

function changeOrderStatusReducer (state={}, action){
  switch(action.type){
      case ORDER_CHANGE_STATUS_REQUEST:
          return {loading:true};
      case ORDER_CHANGE_STATUS_SUCCESS:
          return {loading:false, successChangeStatus:true, payload: []};
      case ORDER_CHANGE_STATUS_FAIL:
          return {loading:false, error : action.payload};
      default:
          return state;
  }
}

function updateOrderStatusReducer (state={}, action){
    switch(action.type){
        case ORDER_UPDATE_STATUS_REQUEST:
            return {loading:true};
        case ORDER_UPDATE_STATUS_SUCCESS:
            return {loading:false, success: true, payload: []};
        case ORDER_UPDATE_STATUS_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
}
}

function updateOrderReducer (state={}, action){
    switch(action.type){
        case ORDER_UPDATE_REQUEST:
            return {loading:true};
        case ORDER_UPDATE_SUCCESS:
            return {loading:false, success: true, payload: []};
        case ORDER_UPDATE_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function deleteOrderItemReducer (state={}, action){
    switch(action.type){
        case ORDER_DELETED_ITEM_REQUEST:
            return {loading:true};
        case ORDER_DELETED_ITEM_SUCCESS:
            return {loading:false, success: true, payload: []};
        case ORDER_DELETED_ITEM_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function customerOrderListReducer (state={orders:[]}, action){
    switch(action.type){
        case CUSTOMER_ORDER_LIST_REQUEST:
            return {loading:true};
        case CUSTOMER_ORDER_LIST_SUCCESS:
            return {loading:false, orders: action.payload};
        case CUSTOMER_ORDER_LIST_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
}

function customerOrderDetailsReducer(state={ order :{}, charger: {}, shippingTo: {}, products: [] }, action){
    switch(action.type){
        case CUSTOMER_ORDER_DETAIL_REQUEST:
            return {loading:true};
        case CUSTOMER_ORDER_DETAIL_SUCCESS:
            return {loading:false, success:true, order : action.payload.order, charger:action.payload.billingAddress,
               shippingTo:action.payload.shippingAddress, products: action.payload.products};
        case CUSTOMER_ORDER_DETAIL_FAIL:
            return {loading:false, error : action.payload};
        default:
            return state;
    }
  }


export {orderReducer, orderListReducer, orderDetailsReducer,
     changeOrderStatusReducer, updateOrderStatusReducer,
      deleteOrderItemReducer, updateOrderReducer, customerOrderListReducer, 
      customerOrderDetailsReducer}