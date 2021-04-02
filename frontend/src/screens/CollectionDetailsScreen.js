import React, { useEffect, useState } from 'react';
import './ProductDetailsScreen.css';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listModels } from '../action/modelActions';
import ReactTooltip from 'react-tooltip';
import { addToCart, addToLocalCart } from '../action/cartActions';
import { addToWishList } from '../action/wishListActions';
import { detailsCollection } from '../action/collectionActions';
import LoadingSpinner from '../components/LoadingSpinner';

function CollectionDetailScreen (props){

    const [qty,setQty] = useState(1);
    const [model,setModel] = useState();
    const collectionDetails = useSelector(state=>state.collectionDetails);
    const {collection,loading, error} = collectionDetails;
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const modelList = useSelector(state=>state.modelList);
    const {phoneModels,loadingModel,errorModel} = modelList;
    let {id}=useParams();
    const dispatch = useDispatch();


    useEffect(()=>{
        dispatch(detailsCollection(id));
        dispatch(listModels());
        window.scrollTo(0,80)
        return()=>{

        }
    },[])
    
    const handleAddToCart = () =>{
        if(model)
        {
            if(userInfo)
            {
                dispatch(addToCart( collection._id, model, qty));
            }
            else
            {
                dispatch(addToLocalCart(collection._id, model, qty));
            }
        }
        else
        {
            alert("Παρακαλώ επιλέξτε το μοντέλο της συσκευής σας");
        }
    }
    
    const handleAddToWishList = () =>{
        if(model)
        {
            dispatch(addToWishList(userInfo.email, collection._id, model));
        }
        else
        {
            alert("Παρακαλώ επιλέξτε το μοντέλο της συσκευής σας");
        }
    }
    
    return (
        loading?<div>Loading...</div>:
        error?<div>{error}</div>:
        (
        <div className="details-screen-wrapper">            
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li><Link to="/collection">Συλλογή</Link></li>
                    <li>{collection.name}</li>
                </ul>
            </div>
            {loading?<LoadingSpinner/>:
            error?<div>{error}</div>:
            <div className="product-details-wrapper">
                <div className="product-detail-image">
                    <img className="product-img" src={collection.image} alt={collection.name}></img>
                </div>
                <div className="product-details">
                    <ul>
                        <li className="product-name-info">
                            <h2>{collection.name}</h2>
                        </li>
                        <li className="product-price-info">
                            <label for="prod-price">Τιμή : </label>
                            <h3 className="prod-price" name="prod-price">  €{collection.totalPrice}</h3>
                        </li>                        
                        <li className="product-phone-model">
                            <label for="select-model">Μοντέλο :</label>
                            {loadingModel? <div>Loading...</div>:
                            errorModel?<div>{error}</div>:
                            <select className="select-model" name="select-model"
                            onChange={(e)=>{setModel(e.target.value)}}>
                                <option value="" disabled hidden selected>Επέλεξε το μοντέλο του κινητού σου</option>
                                {phoneModels.map(model=>(
                                    <option key={model.id} value={model.brand + " "+ model.model}>
                                        {model.brand + " "+ model.model}
                                    </option>
                                ))}
                            </select>
                            }
                        </li>                        
                        <li>                        
                            <div className="qty-addbutton-wishlist">
                                <label className="select-qty-label" for="qty">Ποσότητα: </label>
                                <select className="select-qty" name="qty" id="qty"
                                value={qty} onChange={(e)=> {setQty(e.target.value)}}>
                                    {[...Array(collection.countInStock).keys()].map(x=>
                                        <option key={x + 1} value={x+1}>{x+1}</option>)}
                                </select>
                                <div>
                                    <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!collection.countInStock>0}>
                                        ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ
                                    </button>
                                    <button className="wish-list-link" onClick={handleAddToWishList} disabled={!collection.countInStock>0}
                                    data-tip data-for="my-wish-list">
                                        <i class="material-icons wish-list-link">favorite_border</i>
                                    </button>
                                    <ReactTooltip backgroundColor="#deccf0" textColor="#312f8b" id="my-wish-list" place="bottom" effect="solid">
                                        Προσθήκη στα αγαπημένα μου.
                                    </ReactTooltip>
                                </div>
                            </div>
                        </li>
                        <li className="product-details-info">
                            <h3>Περιγραφή:</h3>
                            <br/>
                            {collection.description}
                        </li>
                    </ul>
                </div>
            </div>
}
        </div>
        )
    )
}

export default CollectionDetailScreen;