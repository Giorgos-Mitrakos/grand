import Axios from 'axios';
import { ADMIN_COLLECTION_LIST_FAIL, ADMIN_COLLECTION_LIST_REQUEST, ADMIN_COLLECTION_LIST_SUCCESS, COLLECTION_DETAILS_FAIL, COLLECTION_DETAILS_REQUEST, COLLECTION_DETAILS_SUCCESS, COLLECTION_LIST_FAIL, COLLECTION_LIST_REQUEST, COLLECTION_LIST_SUCCESS, COLLECTION_RANDOM_LIST_FAIL, COLLECTION_RANDOM_LIST_REQUEST, COLLECTION_RANDOM_LIST_SUCCESS, COLLECTION_SAVE_REQUEST, COLLECTION_SAVE_SUCCESS, COLLECTION_VISIBILITY_CHANGE_FAIL, COLLECTION_VISIBILITY_CHANGE_REQUEST, COLLECTION_VISIBILITY_CHANGE_SUCCESS } from '../constants/collectionConstants';
import { PRODUCT_SAVE_FAIL } from '../constants/productConstant';

const listCollectionAdmin = () =>async (dispatch,getState)=>{
    try{
        dispatch({type:ADMIN_COLLECTION_LIST_REQUEST});
        const {userSignin:{userInfo}} = getState();
        const {data}= await Axios.post("/api/admin/getcollectionList" ,[],{headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type:ADMIN_COLLECTION_LIST_SUCCESS, payload: data, success:true});
    }
    catch(error)
    {
        dispatch({type:ADMIN_COLLECTION_LIST_FAIL, payload: error.message});
    }
}

const listCollection = () =>async (dispatch)=> {
    try{
        dispatch({type:COLLECTION_LIST_REQUEST});
        const {data}= await Axios.get("/api/products/collectionlist");
        dispatch({type:COLLECTION_LIST_SUCCESS, payload: data});
    }
    catch(error)
    {
        dispatch({type:COLLECTION_LIST_FAIL, payload: error.message});
    }    
}

const randomListCollection = () =>async (dispatch)=> {
    try{
        dispatch({type:COLLECTION_RANDOM_LIST_REQUEST});
        const {data}= await Axios.get("/api/products/collectionrandomlist");
        dispatch({type:COLLECTION_RANDOM_LIST_SUCCESS, payload: data});
    }
    catch(error)
    {
        dispatch({type:COLLECTION_RANDOM_LIST_FAIL, payload: error.message});
    }    
}

const detailsCollection = (collectionID) =>async (dispatch)=> {
    try{
        dispatch({type:COLLECTION_DETAILS_REQUEST, payload : collectionID});
        const {data}= await Axios.get("/api/products/collectionDetails/"+collectionID);
        dispatch({type:COLLECTION_DETAILS_SUCCESS, payload: data});
    }
    catch(error)
    {
        dispatch({type:COLLECTION_DETAILS_FAIL, payload: error.message});
    }    
}

const saveCollection = (collectionId,collection) =>async (dispatch, getState) =>{
    try {
        if(!collectionId)
        {
            dispatch({type:COLLECTION_SAVE_REQUEST, payload:collection}); 
            const {userSignin:{userInfo}} = getState();        
            await Axios.post("/api/admin/insertcollectionproduct", collection, 
            {headers:{'Authorization': 'Bearer ' + userInfo.token}
            });
            dispatch({type:COLLECTION_SAVE_SUCCESS, payload:collection});
        }
        else
        {
            dispatch({type:COLLECTION_SAVE_REQUEST, payload:collection}); 
            const {userSignin:{userInfo}} = getState();        
            await Axios.put("/api/admin/insertcollectionproduct/"+ collectionId,collection, 
            {headers:{'Authorization': 'Bearer ' + userInfo.token}
            });
            dispatch({type:COLLECTION_SAVE_SUCCESS, payload:collection});
        }
    } catch (error) {
        dispatch({type:PRODUCT_SAVE_FAIL, payload:error.message}) 
    }
}

const changeCollectionVisibility = (collectionId,productVisibility)=>async (dispatch,getState)=>{
    try{
        const {userSignin:{userInfo}} = getState();
        dispatch({type:COLLECTION_VISIBILITY_CHANGE_REQUEST});
        const {data}= await Axios.put("/api/admin/changeCollectionVisibility",{collectionId,productVisibility},{headers:{
            'Authorization': 'Bearer ' + userInfo.token
        }});
        dispatch({type:COLLECTION_VISIBILITY_CHANGE_SUCCESS, payload: data[0]});
    }
    catch(error)
    {
        dispatch({type:COLLECTION_VISIBILITY_CHANGE_FAIL, payload: error.message});
    }
}

export {listCollectionAdmin,listCollection,detailsCollection,
    saveCollection,changeCollectionVisibility,randomListCollection}