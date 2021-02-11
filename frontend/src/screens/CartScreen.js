import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './CartScreen.css';
import { removeFromCart, removeFromLocalCart, updateCart, getCart, updateLocalCart } from '../action/cartActions';

function CartScreen(props){
    
    const cart=useSelector(state=>state.cart);
    const {cartItems} = cart;
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const dispatch = useDispatch();

    useEffect(()=>{
        if(userInfo)
        {
        dispatch(getCart(userInfo.email));
        }
        
        return ()=>{

        };
    },[userInfo,dispatch])

    const removeFromCartHandler = (cart_id,id,model,image_case) => {
        if(userInfo)
        {
            dispatch(removeFromCart(userInfo.email,cart_id,model,image_case));
        }
        else
        {
            dispatch(removeFromLocalCart(id,model));
        }
    }

    const updateCartHandler = (cart_id,id,model,quantity) => {
        if(userInfo)
        {
            dispatch(updateCart(userInfo.email,cart_id,model,quantity));
        }
        else
        {
            dispatch(updateLocalCart(id,model,quantity));
        }
    }
   
    return(
        <div className="cart-screen-container">
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Το καλάθι μου</li>
                </ul>
            </div>
            <div className="cart">
                <div className="cart-list">
                    <ul className="cart-list-container">                    
                        {cartItems!==undefined && cartItems.length===0?
                        <li>
                            <h3>Το καλάθι είναι άδειο</h3>
                        </li>
                        :
                        cartItems && cartItems.map(item=>
                            <li className="cart-item" key={item._id + item.model}>
                                <div className="cart-image-name-model-price">
                                    <div className="cart-image">
                                        {item.category!=="Φτιάξε τη Θήκη σου"?
                                        <Link to={"/product/" + item._id}>
                                            <img src={item.image} alt="product"/>
                                        </Link>:
                                            <img src={item.image_case} alt="Η φώτο σου"/>
                                        }
                                    </div>
                                    <div className="cart-name-model-price">
                                        <div className="cart-name-model">
                                            <div className="cart-name">
                                                <div>
                                                {item.category!=="Φτιάξε τη Θήκη σου"?
                                                    <Link to={"/product/" + item._id}>
                                                        {item.name}
                                                    </Link>:
                                                    <div>{item.name}</div>}
                                                </div>
                                            </div>
                                            {item.model!=='none' &&
                                            <div className="cart-model">
                                                Μοντέλο: {item.model}
                                            </div>  }                              
                                        </div> 
                                        <div className="cart-item-price">
                                            {item.totalPrice} €
                                        </div>
                                    </div>
                                </div>
                                <div className="cart-qty-total-price-delete">
                                    <div className="cart-qty-total-price">
                                        <div className="cart-qty">                                     
                                            <select className="cart-select-qty" name="cart-select-qty" id="cart-select-qty"
                                            value={item.quantity} onChange={(e)=>updateCartHandler(item.cart_id,item._id,item.model,e.target.value)} >
                                            {[...Array(item.countInStock).keys()].map(x=>
                                                <option key={x + 1} value={x+1}>{x+1}</option>)}
                                            </select>
                                        </div>
                                        <div className="cart-total-price">
                                        {(item.totalPrice * item.quantity).toFixed(2)} €
                                    </div>
                                    </div>
                                    <div>
                                    <button className="delete-item-button" onClick={()=>removeFromCartHandler(item.cart_id,item._id,item.model,item.image_case)}>
                                        <i className="material-icons">delete_forever</i>
                                    </button>
                                </div>
                                </div>
                            </li>)}
                    </ul>
                </div>
                <div className="cart-action">
                    <h3>
                        <div>
                        Υποσύνολο  ( {cartItems && cartItems.reduce((a,c) => a + Number(c.quantity), 0)} τεμ.) :
                        </div>
                        <div>
                            {cartItems && cartItems.reduce((a,c)=>a + c.totalPrice*c.quantity,0).toFixed(2)} €
                        </div>
                    </h3>
                    <h5> *Στις τιμές συμπεριλαμβάνονται το Φ.Π.Α. 24% </h5>
                    <h5 style={{marginTop:0.3+'rem'}}> **Σε δυσπρόσιτες περιοχές ενδέχεται να υπάρξει επιπλέον κόστος μεταφορικών.</h5>
                    <button className="proceed-checkout-btn" disabled={cartItems.length===0}
                    onClick={()=>props.history.push("/shipping")}>
                        Ολοκλήρωση παραγγελίας
                    </button>
                </div>
            </div>
        </div>
        
    )
}

export default CartScreen;