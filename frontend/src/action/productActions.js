import {
    PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL,
    PRODUCT_SAVE_REQUEST, PRODUCT_SAVE_SUCCESS, PRODUCT_SAVE_FAIL,
    PRODUCT_MOST_VIEWED_REQUEST, PRODUCT_MOST_VIEWED_SUCCESS, PRODUCT_MOST_VIEWED_FAIL,
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
    REMOVE_PRODUCTS, CATEGORY_PERCENTAGE_CHANGE_REQUEST, CATEGORY_PERCENTAGE_CHANGE_SUCCESS, CATEGORY_PERCENTAGE_CHANGE_FAIL,
    FEATURE_TITLES_BY_CATEGORY_REQUEST, FEATURE_TITLES_BY_CATEGORY_SUCCESS, FEATURE_TITLES_BY_CATEGORY_FAIL,
    FEATURE_NAMES_BY_CATEGORY_REQUEST, FEATURE_NAMES_BY_CATEGORY_SUCCESS, FEATURE_NAMES_BY_CATEGORY_FAIL,
    GET_FEATURES_REQUEST, GET_FEATURES_SUCCESS, GET_FEATURES_FAIL,
    SENDING_LIST_REQUEST, SENDING_LIST_SUCCESS, SENDING_LIST_FAIL,
    EDIT_SENDING_METHOD_REQUEST, EDIT_SENDING_METHOD_SUCCESS, EDIT_SENDING_METHOD_FAIL,
    ADD_SENDING_METHOD_REQUEST, ADD_SENDING_METHOD_SUCCESS, ADD_SENDING_METHOD_FAIL,
    REMOVE_SENDING_METHOD_REQUEST, REMOVE_SENDING_METHOD_SUCCESS, REMOVE_SENDING_METHOD_FAIL,
    ADMIN_PAYMENT_LIST_REQUEST, ADMIN_PAYMENT_LIST_SUCCESS, ADMIN_PAYMENT_LIST_FAIL,
    EDIT_ADMIN_PAYMENT_LIST_REQUEST, EDIT_ADMIN_PAYMENT_LIST_SUCCESS, EDIT_ADMIN_PAYMENT_LIST_FAIL,
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
    INSERT_PRODUCT_COMPATIBILITY_REQUEST, INSERT_PRODUCT_COMPATIBILITY_SUCCESS,
    INSERT_PRODUCT_COMPATIBILITY_FAIL, PRODUCT_COMPATIBILITIES_REQUEST,
    PRODUCT_COMPATIBILITIES_SUCCESS, PRODUCT_COMPATIBILITIES_FAIL,
    DELETE_PRODUCT_COMPATIBILITY_REQUEST, DELETE_PRODUCT_COMPATIBILITY_SUCCESS,
    DELETE_PRODUCT_COMPATIBILITY_FAIL,SUPPLIERS_LIST_REQUEST,SUPPLIERS_LIST_SUCCESS,
    SUPPLIERS_LIST_FAIL,SUPPLIERS_INSERT_REQUEST,SUPPLIERS_INSERT_SUCCESS,
    SUPPLIERS_INSERT_FAIL, SUPPLIERS_DELETE_REQUEST, SUPPLIERS_DELETE_SUCCESS,
    SUPPLIERS_DELETE_FAIL, MANUFACTURER_DELETE_REQUEST,  MANUFACTURER_DELETE_SUCCESS,
    MANUFACTURER_DELETE_FAIL, SEARCH_FOR_ITEMS_REQUEST, SEARCH_FOR_ITEMS_SUCCESS,
    SEARCH_FOR_ITEMS_FAIL, SELECT_ITEMS_PER_PAGE, SET_SEARCH_TEXT, SET_SEARCH_FILTERS, RESET_SEARCH_FILTERS, GET_PRODUCT_HISTORY_REQUEST, GET_PRODUCT_HISTORY_SUCCESS, GET_PRODUCT_HISTORY_FAIL
} from "../constants/productConstant";
import Axios from "axios";

const importProducts = () => async (displatch) => {
    await Axios.get("/api/getProducts");
}

const listProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST });
        const { data } = await Axios.get("/api/products");
        dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
    }
}

const changeVisibility = (productID, productVisibility) => async (dispatch, getState) => {
    try {
        const { userSignin: { userInfo } } = getState();
        dispatch({ type: PRODUCT_VISIBILITY_CHANGE_REQUEST });
        const { data } = await Axios.put("/api/admin/changeVisibility", { productID, productVisibility }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: PRODUCT_VISIBILITY_CHANGE_SUCCESS, payload: data[0] });
    }
    catch (error) {
        dispatch({ type: PRODUCT_VISIBILITY_CHANGE_FAIL, payload: error.message });
    }
}

const changeCategoryPercentage = (pricePercentage, category, subcategory, supplier) => async (dispatch, getState) => {
    try {
        const { userSignin: { userInfo } } = getState();
        dispatch({ type: CATEGORY_PERCENTAGE_CHANGE_REQUEST });
        const { data } = await Axios.put("/api/admin/category_percentage_change", { pricePercentage, category, subcategory, supplier }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: CATEGORY_PERCENTAGE_CHANGE_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: CATEGORY_PERCENTAGE_CHANGE_FAIL, payload: error.message });
    }
}

const getProductsByCategory = (category, subcategory) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_LIST_BY_CATEGORY_REQUEST });
        const { data } = await Axios.post("/api/products/products_by_category", { category, subcategory });
        dispatch({ type: PRODUCT_LIST_BY_CATEGORY_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: PRODUCT_LIST_BY_CATEGORY_FAIL, payload: error.message });
    }
}

const getFeatures = () => async (dispatch) => {
    try {
        dispatch({ type: GET_FEATURES_REQUEST });
        const { data } = await Axios.get("/api/products/featurelist");
        dispatch({ type: GET_FEATURES_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: GET_FEATURES_FAIL, payload: error.message });
    }
}

const getFeatureTitlesByCategory = (category, subcategory) => async (dispatch) => {
    try {
        dispatch({ type: FEATURE_TITLES_BY_CATEGORY_REQUEST });
        const { data } = await Axios.post("/api/products/feature_title_by_category", { category, subcategory });
        dispatch({ type: FEATURE_TITLES_BY_CATEGORY_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: FEATURE_TITLES_BY_CATEGORY_FAIL, payload: error.message });
    }
}

const getFeatureNameByCategory = (category, subcategory) => async (dispatch) => {
    try {
        dispatch({ type: FEATURE_NAMES_BY_CATEGORY_REQUEST });
        const { data } = await Axios.post("/api/products/feature_name_by_category", { category, subcategory });
        dispatch({ type: FEATURE_NAMES_BY_CATEGORY_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: FEATURE_NAMES_BY_CATEGORY_FAIL, payload: error.message });
    }
}

const getCompatibilities = (category, subcategory) => async (dispatch) => {
    try {
        dispatch({ type: COMPATIBILITIES_BY_CATEGORY_REQUEST });
        const { data } = await Axios.post("/api/products/compatibilities_by_category", { category, subcategory });
        dispatch({ type: COMPATIBILITIES_BY_CATEGORY_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: COMPATIBILITIES_BY_CATEGORY_FAIL, payload: error.message });
    }
}

const getProductsByCategoryAdmin = (category, subcategory, supplier, offset) => async (dispatch, getState) => {
    try {
        const { userSignin: { userInfo } } = getState();
        dispatch({ type: PRODUCT_LIST_BY_CATEGORY_ADMIN_REQUEST });
        const { data } = await Axios.post("/api/products/products_by_category_admin", { category, subcategory, supplier, offset }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: PRODUCT_LIST_BY_CATEGORY_ADMIN_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: PRODUCT_LIST_BY_CATEGORY_ADMIN_FAIL, payload: error.message });
    }
}

const findMostViewedProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_MOST_VIEWED_REQUEST });
        const { data } = await Axios.post("/api/products/most_viewed");
        dispatch({ type: PRODUCT_MOST_VIEWED_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: PRODUCT_MOST_VIEWED_FAIL, payload: error.message });
    }
}

const saveProduct = (productId, product) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_SAVE_REQUEST, payload: product });
        const { userSignin: { userInfo } } = getState();
        if (!productId) {
            const { data } = await Axios.post("/api/admin/createproduct", product, {
                headers: {
                    'Authorization': 'Bearer ' + userInfo.token
                }
            });
            dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
        }
        else {
            const { data } = await Axios.put("/api/admin/createproduct/" + productId, product, {
                headers: {
                    'Authorization': 'Bearer ' + userInfo.token
                }
            });
            dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
        }

    } catch (error) {
        dispatch({ type: PRODUCT_SAVE_FAIL, payload: error.message })
    }
}

const detailsProduct = (productID) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productID });
        const { data } = await Axios.get("/api/products/" + productID);
        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: PRODUCT_DETAILS_FAIL, payload: error.message });
    }
}

const listManufacturers = () => async (dispatch, getState) => {
    try {
        dispatch({ type: MANUFACTURES_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/manufacturerslist", {}, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: MANUFACTURES_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: MANUFACTURES_LIST_FAIL, payload: error.message });
    }
}

const insertManufacturer = (manufacturer) => async (dispatch, getState) => {
    try {
        dispatch({ type: MANUFACTURER_INSERT_REQUEST, payload: manufacturer });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/insertmanufacturer", { manufacturer }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: MANUFACTURER_INSERT_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: MANUFACTURER_INSERT_FAIL, payload: error.message });
    }
}

const deleteManufacturer = (manufacturer_id) => async (dispatch, getState) => {
    try {
        dispatch({ type: MANUFACTURER_DELETE_REQUEST, payload: manufacturer_id });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/deletemanufacturer", { manufacturer_id }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: MANUFACTURER_DELETE_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: MANUFACTURER_DELETE_FAIL, payload: error.message });
    }
}

const insertSupplier = (supplier) => async (dispatch, getState) => {
    try {
        dispatch({ type: SUPPLIERS_INSERT_REQUEST, payload: supplier });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/insertsupplier", { supplier }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: SUPPLIERS_INSERT_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: SUPPLIERS_INSERT_FAIL, payload: error.message });
    }
}

const deleteSupplier = (supplier_id) => async (dispatch, getState) => {
    try {
        dispatch({ type: SUPPLIERS_DELETE_REQUEST, payload: supplier_id });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/deletesupplier", { supplier_id }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: SUPPLIERS_DELETE_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: SUPPLIERS_DELETE_FAIL, payload: error.message });
    }
}

const listSendingMethods = () => async (dispatch, getState) => {
    try {
        dispatch({ type: SENDING_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/sendinglist", {}, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: SENDING_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: SENDING_LIST_FAIL, payload: error.message });
    }
}

const editSendingMethods = (methodId, method, cost) => async (dispatch, getState) => {
    try {
        dispatch({ type: EDIT_SENDING_METHOD_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/editsendingmethod", { methodId, method, cost }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: EDIT_SENDING_METHOD_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: EDIT_SENDING_METHOD_FAIL, payload: error.message });
    }
}

const createSendingMethods = (method, cost) => async (dispatch, getState) => {
    try {
        dispatch({ type: ADD_SENDING_METHOD_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/createsendingmethod", { method, cost }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: ADD_SENDING_METHOD_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: ADD_SENDING_METHOD_FAIL, payload: error.message });
    }
}

const deleteSendingMethod = (methodId) => async (dispatch, getState) => {
    try {
        dispatch({ type: REMOVE_SENDING_METHOD_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/removesendingmethod", { methodId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: REMOVE_SENDING_METHOD_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: REMOVE_SENDING_METHOD_FAIL, payload: error.message });
    }
}

const listPaymentMethodsAdmin = (methodId) => async (dispatch, getState) => {
    try {
        dispatch({ type: ADMIN_PAYMENT_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/paymentlist", { methodId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: ADMIN_PAYMENT_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: ADMIN_PAYMENT_LIST_FAIL, payload: error.message });
    }
}

const editPaymentMethods = (paymentMethodId, paymentMethod, paymentMethodCost, sendingMethodId) => async (dispatch, getState) => {
    try {
        dispatch({ type: EDIT_ADMIN_PAYMENT_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/editpaymentlist", { paymentMethodId, paymentMethod, paymentMethodCost, sendingMethodId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: EDIT_ADMIN_PAYMENT_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: EDIT_ADMIN_PAYMENT_LIST_FAIL, payload: error.message });
    }
}

const createPaymentMethod = (paymentMethod, paymentMethodCost, sendingMethodId) => async (dispatch, getState) => {
    try {
        dispatch({ type: ADD_ADMIN_PAYMENT_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/createpaymentlist", { paymentMethod, paymentMethodCost, sendingMethodId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: ADD_ADMIN_PAYMENT_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: ADD_ADMIN_PAYMENT_LIST_FAIL, payload: error.message });
    }
}

const deletePaymentMethod = (paymentMethodId, sendingMethodId) => async (dispatch, getState) => {
    try {
        dispatch({ type: REMOVE_ADMIN_PAYMENT_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/removepaymentlist", { paymentMethodId, sendingMethodId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: REMOVE_ADMIN_PAYMENT_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: REMOVE_ADMIN_PAYMENT_LIST_FAIL, payload: error.message });
    }
}

const listFeatureTitles = () => async (dispatch, getState) => {
    try {
        dispatch({ type: FEATURE_TITLE_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/featuretitlelist", {}, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: FEATURE_TITLE_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: FEATURE_TITLE_LIST_FAIL, payload: error.message });
    }
}

const insertFeatureTitle = (featureTitle) => async (dispatch, getState) => {
    try {
        dispatch({ type: FEATURE_TITLE_INSERT_REQUEST, payload: featureTitle });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/insertfeaturetitle", { featureTitle }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: FEATURE_TITLE_INSERT_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: FEATURE_TITLE_INSERT_FAIL, payload: error.message });
    }
}

const getFeatureNames = (featureTitleId) => async (dispatch, getState) => {
    try {
        dispatch({ type: FEATURE_NAME_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/featurenames", { featureTitleId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: FEATURE_NAME_LIST_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: FEATURE_NAME_LIST_FAIL, payload: error.message });
    }
}

const insertFeatureName = (titleId, name) => async (dispatch, getState) => {
    try {
        dispatch({ type: FEATURE_NAME_INSERT_REQUEST, payload: name });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/insertfeaturename", { titleId, name }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: FEATURE_NAME_INSERT_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: FEATURE_NAME_INSERT_FAIL, payload: error.message });
    }
}

const listFeatures = (productId) => async (dispatch, getState) => {
    try {
        dispatch({ type: FEATURE_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/featurelist", { productId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: FEATURE_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: FEATURE_LIST_FAIL, payload: error.message });
    }
}

const insertFeature = (productId, title, name) => async (dispatch, getState) => {
    try {
        dispatch({ type: FEATURE_INSERT_REQUEST, payload: name });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/insertfeature", { productId, title, name }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: FEATURE_INSERT_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: FEATURE_INSERT_FAIL, payload: error.message });
    }
}

const deleteFeature = (productId, featureId) => async (dispatch, getState) => {
    try {
        dispatch({ type: FEATURE_DELETE_REQUEST, payload: featureId });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/deletefeature/", { productId, featureId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: FEATURE_DELETE_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: FEATURE_DELETE_FAIL, payload: error.message });
    }
}

const listCategories = () => async (dispatch, getState) => {
    try {
        dispatch({ type: CATEGORIES_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/categories", [], {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: CATEGORIES_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: CATEGORIES_LIST_FAIL, payload: error.message });
    }
}

const listSubcategories = (parentId) => async (dispatch, getState) => {
    try {
        dispatch({ type: SUBCATEGORIES_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/subcategories", { parentId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: SUBCATEGORIES_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: SUBCATEGORIES_LIST_FAIL, payload: error.message });
    }
}

const listSuppliers = () => async (dispatch, getState) => {
    try {
        dispatch({ type: SUPPLIERS_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/suppliers", {}, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: SUPPLIERS_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: SUPPLIERS_LIST_FAIL, payload: error.message });
    }
}

const removeProducts = () => (dispatch) => {
    dispatch({ type: REMOVE_PRODUCTS });
}

const listCompatibilityCompanies = () => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPATIBILITY_COMPANIES_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/compatibilitycompanylist", {}, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: COMPATIBILITY_COMPANIES_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: COMPATIBILITY_COMPANIES_LIST_FAIL, payload: error.message });
    }
}

const getCompatibilityModels = (companyId) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPATIBILITY_MODELS_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/compatibilitymodelslist", { companyId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: COMPATIBILITY_MODELS_LIST_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: COMPATIBILITY_MODELS_LIST_FAIL, payload: error.message });
    }
}

const insertCompatibilityCompany = (company) => async (dispatch, getState) => {
    try {
        dispatch({ type: INSERT_COMPATIBILITY_COMPANY_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/insertcompatibilitycompany", { company }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: INSERT_COMPATIBILITY_COMPANY_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: INSERT_COMPATIBILITY_COMPANY_FAIL, payload: error.message });
    }
}

const insertCompatibilityModel = (companyId, model) => async (dispatch, getState) => {
    try {
        dispatch({ type: INSERT_COMPATIBILITY_MODEL_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/insertcompatibilitymodel", { companyId, model }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: INSERT_COMPATIBILITY_MODEL_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: INSERT_COMPATIBILITY_MODEL_FAIL, payload: error.message });
    }
}

const getProductCompatibilities = (productId) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_COMPATIBILITIES_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/getproductcompatibilities", { productId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: PRODUCT_COMPATIBILITIES_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: PRODUCT_COMPATIBILITIES_FAIL, payload: error.message });
    }
}

const insertCompatibility = (productId, company, model) => async (dispatch, getState) => {
    try {
        dispatch({ type: INSERT_PRODUCT_COMPATIBILITY_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/insertcompatibility", { productId, company, model }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: INSERT_PRODUCT_COMPATIBILITY_SUCCESS, payload: data, success: true });
    }
    catch (error) {
        dispatch({ type: INSERT_PRODUCT_COMPATIBILITY_FAIL, payload: error.message });
    }
}

const deleteProductCompatibility = (compatId) => async (dispatch, getState) => {
    try {
        dispatch({ type: DELETE_PRODUCT_COMPATIBILITY_REQUEST });
        const { userSignin: { userInfo } } = getState();
        await Axios.post("/api/admin/deletecompatibility", { compatId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: DELETE_PRODUCT_COMPATIBILITY_SUCCESS, payload: compatId });
    }
    catch (error) {
        dispatch({ type: DELETE_PRODUCT_COMPATIBILITY_FAIL, payload: error.message });
    }
}

const searchForItem = (searchText,itemsPerPage, offset, filters) => async (dispatch) => {
    try {
        dispatch({ type: SEARCH_FOR_ITEMS_REQUEST });
        const { data } = await Axios.post("/api/products/searchForItems", { searchText,itemsPerPage, offset, filters });
        dispatch({ type: SEARCH_FOR_ITEMS_SUCCESS, payload: data });
    }
    catch (error) {
        dispatch({ type: SEARCH_FOR_ITEMS_FAIL, payload: error.message });
    }
}

const selectItemsPerPage = (itemsPerPage) => async (dispatch) => {
    dispatch({ type: SELECT_ITEMS_PER_PAGE, payload: itemsPerPage });
}

const searchTextStore = (searchText) => async (dispatch) => {
    dispatch({ type: SET_SEARCH_TEXT, payload: searchText });
}

const filtersStore = (searchFilters) => async (dispatch) => {
    dispatch({ type: SET_SEARCH_FILTERS, payload: searchFilters });
}

const resetFiltersStore = () => async (dispatch) => {
    dispatch({ type: RESET_SEARCH_FILTERS, payload: [] });
}

const getProductHistory = (productId) => async (dispatch, getState) => {
    try {
        dispatch({ type: GET_PRODUCT_HISTORY_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post("/api/admin/getProductHistory", { productId }, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({ type: GET_PRODUCT_HISTORY_SUCCESS, payload: data});
    }
    catch (error) {
        dispatch({ type: GET_PRODUCT_HISTORY_FAIL, payload: error.message });
    }
}


export {
    listProducts, detailsProduct, saveProduct, removeProducts, listSendingMethods,
    findMostViewedProducts, listManufacturers, insertManufacturer,
    listFeatureTitles, insertFeatureTitle, getFeatureNames, insertFeatureName,
    listFeatures, insertFeature, deleteFeature, listCategories, listSubcategories,
    getProductsByCategory, changeVisibility, getProductsByCategoryAdmin,
    changeCategoryPercentage, getFeatureTitlesByCategory, getFeatureNameByCategory,
    getFeatures, editSendingMethods, createSendingMethods, deleteSendingMethod,
    listPaymentMethodsAdmin, editPaymentMethods, createPaymentMethod, deletePaymentMethod,
    getCompatibilities, listCompatibilityCompanies, getCompatibilityModels,
    insertCompatibilityCompany, insertCompatibilityModel, insertCompatibility,
    getProductCompatibilities, deleteProductCompatibility, importProducts, listSuppliers,
    insertSupplier, deleteSupplier, deleteManufacturer, searchForItem, 
    selectItemsPerPage,searchTextStore,filtersStore,resetFiltersStore, getProductHistory
}