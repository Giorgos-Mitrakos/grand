import React, { useEffect, useState } from 'react';
import './ProductDetailsScreen.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { detailsProduct } from '../action/productActions';
import ReactTooltip from 'react-tooltip';
import { addToCart, addToLocalCart } from '../action/cartActions';
import { addToWishList } from '../action/wishListActions';

function ProductDetailScreen (props){

    const [qty,setQty] = useState(1);
    const productDetails = useSelector(state=>state.productDetails);
    const {product,loading, error} = productDetails;
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(detailsProduct(props.match.params.id));  
        window.scrollTo(0,0);     
        return ()=>{

        };
    },[props.match.params.id,dispatch])
    
    const handleAddToCart = () =>{
        if(userInfo)
        {
            dispatch(addToCart( product._id, undefined, qty));
        }
        else
        {
            dispatch(addToLocalCart(product._id, undefined, qty));
        }
    }
    
    const handleAddToWishList = () =>{
        if(userInfo){
        dispatch(addToWishList(userInfo.email, product._id, undefined));
        }
        else
        {
            alert("Η wishlist σάς δίνει τη δυνατότητα να αποθηκεύσετε τα προϊόντα που σας ενδιαφέρουν ιδιαίτερα\nΓια την λειτουργία αυτή είναι απαραίτητο να έχετε συνδεθεί σαν χρήστης.")
        }
    }

    const ShowHtml = (props)=> {   
        return (
            //<iframe srcdoc={props} />
         <div  dangerouslySetInnerHTML={{__html: props}} />
        )
      }
    
    return (
        loading?<div>Loading...</div>:
        error?<div>{error}</div>:
        (
        <div className="details-screen-wrapper">            
            <div>
                <ul class="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li><Link to="/products">Προϊοντα</Link></li>
                    <li>{product.category}</li>
                    {product.subcategory!=="" && product.subcategory!==null && <li><Link to={"/products/"+ product.category+"/"+product.subcategory}>{product.subcategory}</Link></li>}
                    <li>{product.name}</li>
                </ul>
            </div>
            <div className="product-details-wrapper">
                <div className="product-detail-image">
                    <img className="product-img" src={product.image} alt={product.name}></img>
                </div>
                <div className="product-details">
                    <ul>
                        <li className="product-name-info">
                            <h2>{product.name}</h2>
                        </li>
                        <li className="product-price-info">
                            <label for="prod-price">Τιμή : </label>
                            <h3 className="prod-price" name="prod-price">  €{product.totalPrice}</h3>
                        </li>                                                 
                        <li>
                            <h4>{product.availability}</h4>
                        </li>                   
                        <li>                        
                            <div className="qty-addbutton-wishlist">
                                <label className="select-qty-label" for="qty">Ποσότητα: </label>
                                <select className="select-qty" name="qty" id="qty"
                                value={qty} onChange={(e)=> {setQty(e.target.value)}}>
                                    {[...Array(product.countInStock).keys()].map(x=>
                                        <option key={x + 1} value={x+1}>{x+1}</option>)}
                                </select>
                                <div>
                                    <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!product.countInStock>0}>
                                        ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ
                                    </button>
                                    <button className="wish-list-link" onClick={handleAddToWishList} disabled={!product.countInStock>0}
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
                            {ShowHtml(product.description)}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        )
    )
}

export default ProductDetailScreen;