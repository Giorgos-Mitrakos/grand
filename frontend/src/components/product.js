import React from 'react';
import ReactTooltip from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './product.css';
import { addToWishList } from '../action/wishListActions';
import { addToCart, addToLocalCart } from '../action/cartActions';

function Product (props){
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const dispatch = useDispatch();

    const handleAddToWishList = () =>{
        if(userInfo){
        dispatch(addToWishList(userInfo.email, props.id));
        }
        else
        {
            alert("Η wishlist σάς δίνει τη δυνατότητα να αποθηκεύσετε τα προϊόντα που σας ενδιαφέρουν ιδιαίτερα\nΓια την λειτουργία αυτή είναι απαραίτητο να έχετε συνδεθεί σαν χρήστης.")
        }
    }

    const handleAddToCart = () =>{
        if(userInfo)
        {
            dispatch(addToCart( props.id, "none", 1));
        }
        else
        {
            dispatch(addToLocalCart(props.id, "none", 1));
        }
    }

    return (  
        <div className="product">
            <Link className="product_container" to={props.details}>
                <div className="product-image-container">
                    <img className="product-image" src={props.src} alt={props.alt}/>
                </div>
                <div className="product-name-price">
                    <div className="product-name">{props.productName.length>30?props.productName.slice(0,34)+"...":props.productName}</div>
                    <div className="flip-product">
                        <div className="product-price">{props.price.toFixed(2)} €</div>
                        <div className="product-see-details">Δείτε περισσότερα</div>
                    </div>
                </div>
            </Link>
            <div className="product-wishlist-cart">                
                <i class="material-icons product-wishlist-cart-icons" onClick={handleAddToWishList} data-tip data-for="my-wish-list">favorite_border</i>
                <ReactTooltip backgroundColor="#deccf0" textColor="#312f8b" id="my-wish-list" place="right" effect="solid">
                    Προσθήκη στα αγαπημένα μου.
                </ReactTooltip>
                <i className="material-icons product-wishlist-cart-icons" onClick={handleAddToCart} data-tip data-for="my-cart-item-list">shopping_cart</i>
                <ReactTooltip backgroundColor="#deccf0" textColor="#312f8b" id="my-cart-item-list" place="left" effect="solid">
                    Προσθήκη στo καλάθι μου.
                </ReactTooltip>
            </div>
        </div>
    )
}

export default Product;