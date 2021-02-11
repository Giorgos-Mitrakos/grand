const { SENDING_METHODS_LIST_REQUEST, SENDING_METHODS_LIST_SUCCESS, SENDING_METHODS_LIST_FAIL, PAYMENT_METHODS_LIST_REQUEST, PAYMENT_METHODS_LIST_SUCCESS, PAYMENT_METHODS_LIST_FAIL } = require("../constants/paymentConstants");

function sendingMethodsListReducer(state = { sendingMethods: [] }, action) {
    switch (action.type) {
      case SENDING_METHODS_LIST_REQUEST:
        return { loading: true };
      case SENDING_METHODS_LIST_SUCCESS:
        return { loading: false, sendingMethods: action.payload };
      case SENDING_METHODS_LIST_FAIL:
        return { loading: false, error: action.payload };
      default: return state;
    }
}

function paymentMethodsListReducer(state = { paymentMethods: [] }, action) {
    switch (action.type) {
      case PAYMENT_METHODS_LIST_REQUEST:
        return { loading: true };
      case PAYMENT_METHODS_LIST_SUCCESS:
        return { loading: false, paymentMethods: action.payload };
      case PAYMENT_METHODS_LIST_FAIL:
        return { loading: false, error: action.payload };
      default: return state;
    }
}

export {sendingMethodsListReducer, paymentMethodsListReducer}