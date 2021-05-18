import Axios from 'axios';
import Cookie from 'js-cookie';
import { ORDER_ADD_REQUEST, ORDER_ADD_SUCCESS, ORDER_ADD_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_LIST_FAIL, ORDER_DETAIL_REQUEST, ORDER_DETAIL_SUCCESS, ORDER_DETAIL_FAIL, ORDER_CHANGE_STATUS_FAIL, ORDER_CHANGE_STATUS_SUCCESS, ORDER_CHANGE_STATUS_REQUEST, ORDER_UPDATE_STATUS_REQUEST, ORDER_UPDATE_STATUS_SUCCESS, ORDER_UPDATE_STATUS_FAIL, ORDER_DETAILS_CHANGE_REQUEST, ORDER_DETAILS_CHANGE_SUCCESS, ORDER_DETAILS_CHANGE_FAIL, ORDER_CHARGER_ADDRESS_UPDATE_REQUEST, ORDER_CHARGER_ADDRESS_UPDATE_SUCCESS, ORDER_CHARGER_ADDRESS_UPDATE_FAIL, ORDER_SHIPPING_ADDRESS_UPDATE_REQUEST, ORDER_SHIPPING_ADDRESS_UPDATE_SUCCESS, ORDER_SHIPPING_ADDRESS_UPDATE_FAIL, ORDER_UPDATE_REQUEST, ORDER_UPDATE_SUCCESS, ORDER_UPDATE_FAIL, ORDER_DELETED_ITEM_REQUEST, ORDER_DELETED_ITEM_SUCCESS, ORDER_DELETED_ITEM_FAIL, CUSTOMER_ORDER_LIST_REQUEST, CUSTOMER_ORDER_LIST_SUCCESS, CUSTOMER_ORDER_LIST_FAIL, CUSTOMER_ORDER_DETAIL_REQUEST, CUSTOMER_ORDER_DETAIL_SUCCESS, CUSTOMER_ORDER_DETAIL_FAIL, GET_ORDER_HISTORY_REQUEST, GET_ORDER_HISTORY_SUCCESS, GET_ORDER_HISTORY_FAIL} from '../constants/orderConstrains';

const createOrder = (charger, company, shippingTo, methods, itemsCost) => async (dispatch, getState) =>{
    try{
        dispatch({type:ORDER_ADD_REQUEST,payload:{charger, company, shippingTo, methods}});                    
        const {userSignin:{userInfo}} = getState();
        if(userInfo)
        {
            if(methods.typeOfPayment==="Τιμολόγιο")
            {
                if(shippingTo.name){
                  let data = await Axios.post("/api/orders/insert_order_company_shippingTo", {charger, company, shippingTo, methods, itemsCost},
                    {headers:{
                        'Authorization': 'Bearer ' + userInfo.token
                    }});
                    dispatch({type: ORDER_ADD_SUCCESS,payload: data}); 
                }
                else
                {
                  let data = await Axios.post("/api/orders/insert_order_company", {charger, company, methods, itemsCost},
                    {headers:{
                        'Authorization': 'Bearer ' + userInfo.token
                    }});
                    dispatch({type: ORDER_ADD_SUCCESS,payload: data});
                }
            }
            else
            {
                if(shippingTo.name){
                  let data = await Axios.post("/api/orders/insert_order_shippingTo", {charger, shippingTo, methods, itemsCost},
                  {headers:{
                        'Authorization': 'Bearer ' + userInfo.token
                    }});
                    dispatch({type: ORDER_ADD_SUCCESS,payload: data}); 
                }
                else
                {
                  let data = await Axios.post("/api/orders/insert_order", {charger, methods, itemsCost},
                  {headers:{
                        'Authorization': 'Bearer ' + userInfo.token
                    }});
                    dispatch({type: ORDER_ADD_SUCCESS,payload: data}); 
                }
            }            
        }
        else
        {
            const {cart:{cartItems}} = getState();
            if(methods.typeOfPayment==="Τιμολόγιο")
            {
                if(shippingTo.name){
                  let data = await Axios.post("/api/orders/insert_no_user_order_company_shippingTo", {charger, company, shippingTo, methods, cartItems, itemsCost});
                  dispatch({type: ORDER_ADD_SUCCESS,payload: data}); 
                }
                else
                {
                  let data= await Axios.post("/api/orders/insert_no_user_order_company", {charger, company, methods, cartItems, itemsCost});
                  dispatch({type: ORDER_ADD_SUCCESS,payload: data}); 
                }
            }
            else
            {
                if(shippingTo.name){
                    
                  let data = await Axios.post("/api/orders/insert_no_user_order_shippingTo", {charger, shippingTo, methods, cartItems, itemsCost});
                  dispatch({type: ORDER_ADD_SUCCESS,payload: data}); 
                }
                else
                {
                  let data = await Axios.post("/api/orders/insert_no_user_order", {charger, methods, cartItems, itemsCost});
                  dispatch({type: ORDER_ADD_SUCCESS,payload: data}); 
                }
            }
        }
               
        Cookie.set('cartItems', null);
    }
    catch(error)
    {
        dispatch({type: ORDER_ADD_FAIL, payload: error.message});
    }
}

const listOrders = (status,itemsPerPage, offset) => async (dispatch, getState) => {

    try {
      dispatch({ type: ORDER_LIST_REQUEST });
      const { userSignin: { userInfo } } = getState();
      const { data } = await Axios.post("/api/orders", {status, itemsPerPage, offset},{
        headers:
          { Authorization: 'Bearer ' + userInfo.token }
      });
      dispatch({ type: ORDER_LIST_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ORDER_LIST_FAIL, payload: error.message });
    }
}

const detailsOrder = (orderID) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_DETAIL_REQUEST, payload: orderID });
      const { userSignin: { userInfo } } = getState();
      const { data } = await Axios.get("/api/orders/" + orderID, {
        headers:
          { Authorization: 'Bearer ' + userInfo.token }
      });
      dispatch({ type: ORDER_DETAIL_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ORDER_DETAIL_FAIL, payload: error.message });
    }
}

const changeStatus = (orderId, newStatus, dates) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CHANGE_STATUS_REQUEST, payload: newStatus });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.put("/api/orders/changeStatus",{orderId, newStatus, dates}, {
          headers:
            { Authorization: 'Bearer ' + userInfo.token }
        });
        dispatch({ type: ORDER_CHANGE_STATUS_SUCCESS, payload: data })
      } catch (error) {
        dispatch({ type: ORDER_CHANGE_STATUS_FAIL, payload: error.message });
      }
}

const updateStatus = (orderId, newStatus, StatusIndex) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_UPDATE_STATUS_REQUEST, payload: newStatus });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.put("/api/orders/updateStatus",{orderId, newStatus, StatusIndex}, {
          headers:
            { Authorization: 'Bearer ' + userInfo.token }
        });
        dispatch({ type: ORDER_UPDATE_STATUS_SUCCESS, payload: data })
      } catch (error) {
        dispatch({ type: ORDER_UPDATE_STATUS_FAIL, payload: error.message });
      }
}

const changeOrderDetails = (orderId, sendingMethod, shippingPrice, paymentMethod, paymentMethodCost, paymentType) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_CHANGE_REQUEST});
        const { userSignin: { userInfo } } = getState();
        const data=await Axios.put("/api/orders/changeOrderDetails",{orderId, sendingMethod, shippingPrice, paymentMethod, paymentMethodCost, paymentType}, {
          headers:
            { Authorization: 'Bearer ' + userInfo.token }
        });
        dispatch({ type: ORDER_DETAILS_CHANGE_SUCCESS, payload:data })
      } catch (error) {
        dispatch({ type: ORDER_DETAILS_CHANGE_FAIL, payload: error.message });
      }
}

const updateChargerAddress = (orderId, paymentType, charger) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CHARGER_ADDRESS_UPDATE_REQUEST, payload: [] });
        const { userSignin: { userInfo } } = getState();
        await Axios.put("/api/orders/updateChargerAddress",{orderId, paymentType, charger}, {
          headers:
            { Authorization: 'Bearer ' + userInfo.token }
        });
        dispatch({ type: ORDER_CHARGER_ADDRESS_UPDATE_SUCCESS, payload: {orderId, paymentType, charger} })
      } catch (error) {
        dispatch({ type: ORDER_CHARGER_ADDRESS_UPDATE_FAIL, payload: error.message });
      }
}

const updateShippingToAddress = (orderId,shippingAddress, shippingTo) => async (dispatch, getState) => {
  try {
      dispatch({ type: ORDER_SHIPPING_ADDRESS_UPDATE_REQUEST, payload: [] });
      const { userSignin: { userInfo } } = getState();
      const { data } = await Axios.put("/api/orders/updateShippingAddress",{orderId, shippingAddress, shippingTo}, {
        headers:
          { Authorization: 'Bearer ' + userInfo.token }
      });
      dispatch({ type: ORDER_SHIPPING_ADDRESS_UPDATE_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ORDER_SHIPPING_ADDRESS_UPDATE_FAIL, payload: error.message });
    }
}

const updateOrderQuantity = (order_id,product_id, model,quantity,itemsCost) => async (dispatch, getState) => {
  try {
      dispatch({ type: ORDER_UPDATE_REQUEST, payload: [] });
      const { userSignin: { userInfo } } = getState();
      const { data } = await Axios.put("/api/orders/updateOrder",{order_id,product_id,model,quantity,itemsCost}, {
        headers:
          { Authorization: 'Bearer ' + userInfo.token }
      });
      dispatch({ type: ORDER_UPDATE_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ORDER_UPDATE_FAIL, payload: error.message });
    }
}

const removeOrderItem = (order_id,product_id, model) => async (dispatch, getState) => {
  try {
      dispatch({ type: ORDER_DELETED_ITEM_REQUEST, payload: [] });
      const { userSignin: { userInfo } } = getState();
      const { data } = await Axios.post("/api/orders/removeOrderItem",{order_id,product_id,model}, {
        headers:
          { Authorization: 'Bearer ' + userInfo.token }
      });
      dispatch({ type: ORDER_DELETED_ITEM_SUCCESS, payload: data })
    } catch (error) {
      dispatch({ type: ORDER_DELETED_ITEM_FAIL, payload: error.message });
    }
}

const listCustomerOrders = (email) => async (dispatch, getState) => {

  try {
    dispatch({ type: CUSTOMER_ORDER_LIST_REQUEST });
    const { userSignin: { userInfo } } = getState();
    const { data } = await Axios.post("/api/orders/customerOrders",{email}, {
      headers:
        { Authorization: 'Bearer ' + userInfo.token }
    });
    dispatch({ type: CUSTOMER_ORDER_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: CUSTOMER_ORDER_LIST_FAIL, payload: error.message });
  }
}

const detailsCustomerOrder = (orderID) => async (dispatch, getState) => {
  try {
    dispatch({ type: CUSTOMER_ORDER_DETAIL_REQUEST});
    const { userSignin: { userInfo } } = getState();
    const { data } = await Axios.get("/api/orders/customerOrders/" + orderID, {
      headers:
        { Authorization: 'Bearer ' + userInfo.token }
    });
    dispatch({ type: CUSTOMER_ORDER_DETAIL_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: CUSTOMER_ORDER_DETAIL_FAIL, payload: error.message });
  }
}

const getOrderHistory = (orderId) => async (dispatch, getState) => {
  try {
      dispatch({ type: GET_ORDER_HISTORY_REQUEST });
      const { userSignin: { userInfo } } = getState();
      const { data } = await Axios.post("/api/admin/getOrderHistory", { orderId }, {
          headers: {
              'Authorization': 'Bearer ' + userInfo.token
          }
      });
      dispatch({ type: GET_ORDER_HISTORY_SUCCESS, payload: data});
  }
  catch (error) {
      dispatch({ type: GET_ORDER_HISTORY_FAIL, payload: error.message });
  }
}

export {createOrder, listOrders, detailsOrder, changeStatus, updateStatus,
     changeOrderDetails, updateChargerAddress, updateShippingToAddress,
     updateOrderQuantity, removeOrderItem, listCustomerOrders, detailsCustomerOrder,
     getOrderHistory}