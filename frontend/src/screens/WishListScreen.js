import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './WishListScreen.css';
import { removeFromWishList, getWishList, moveToCart } from '../action/wishListActions';
import { getCart } from '../action/cartActions';

function WishListScreen(props){
    
    const wishList=useSelector(state=>state.wishList);
    const {wishListItems} = wishList;
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const dispatch = useDispatch();

    useEffect(()=>{
        if(userInfo)
        {
            dispatch(getWishList(userInfo.email));
        }
        else
        {
            props.history.push(".signin")
        }
        return ()=>{

        };
    },[userInfo,dispatch]);

    const removeFromWishListHandler = (id) => {
        dispatch(removeFromWishList(userInfo.email,id));
        dispatch(getWishList(userInfo.email));
    }

    const addToCartHandler = (item) => {
        dispatch(moveToCart(userInfo.email, item._id, item.model));
        dispatch(getCart(userInfo.email));
    }
   
    return(
        <div className="wishList-screen-container">
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Τα αγαπημένα μου</li>
                </ul>
            </div>
            <div className="wishList">
                <div className="wishList-list">
                    <ul className="wishList-list-container">                        
                        {!wishListItems || wishListItems.length===0?
                        <li>
                            <h3>Η λίστα αγαπημένων μου είναι άδεια</h3>
                        </li>
                        :
                        wishListItems.map(item=>
                        <li className="wishList-item" key={item.product}>
                            <div className="wishList-image-name-model-price">
                                <div className="wishList-image">
                                    <Link to={"/product/" + item._id}>
                                        <img src={item.image} alt="product"/>
                                    </Link>
                                </div>
                                <div className="wishList-name-model-price">
                                    <div className="wishList-name-model">
                                        <div className="wishList-name">
                                            <div>
                                                <Link to={"/product/" + item._id}>
                                                    {item.name}
                                                </Link>                                        
                                            </div>
                                        </div>
                                        {item.category==="cases" &&
                                        <div className="wishList-model">
                                            Μοντέλο: {item.model}
                                        </div>  }                              
                                    </div> 
                                    <div className="wishList-item-price">
                                        {item.price} €
                                    </div>                                
                                </div>
                            </div>
                            <div className="wishlist-addtocart-remove">
                                <div className="wishList-name">                                     
                                    <button className="add-to-cart-btn" onClick={()=>addToCartHandler(item)}>
                                        ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ
                                    </button>
                                </div>                                
                                <div>
                                <button className="delete-item-button" onClick={()=>removeFromWishListHandler(item._id)}>
                                    <i className="material-icons">delete_forever</i>
                                </button>
                            </div>
                            </div>
                        </li>)}
                    </ul>
                </div>                
            </div>
        </div>
        
    )
}

export default WishListScreen;