import React from 'react';
import './Header.css';
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import ProfileMenu from '../menu/ProfileMenu';
import { menuOpen } from '../action/menuActions';
import { importProducts } from '../action/productActions';
import { navigation } from '../data/data';

function Header(){
    const cart=useSelector(state=>state.cart);
    const {cartItems} = cart;
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const dispatch=useDispatch();

    const handleClick=()=>{    
        dispatch(menuOpen());
    }
        
    return (        
            <div className="header">
                <button className="Navbar-toggle" onClick={handleClick}>
                <i className="material-icons" style={{ fontSize: "2rem" }}>menu</i>
                </button>
                <div className="brand">                
                    <Link to='/'>
                        <img className="logo" src="./PNG_FINAL.png"alt="logo"/>
                    </Link>
                    <Link to='/' className="brand-name">
                        <h2>Grand</h2>
                        <h5>mobile accessories</h5>
                    </Link>                
                </div>
                <div className="nav-bar">
                    {navigation.map((x, index)=>
                    <div key={index}>
                        <Link to={x.linkto}>{x.title}</Link>
                    </div>
                    )}
                </div>
                <div className="header-links"> 
                    <div className="dd-profile-wrapper">                                      
                        <div><i className="material-icons">account_box</i></div>                    
                        <div className="dropdown-profile-menu">
                                <ProfileMenu/>
                        </div>
                    </div>
                    <div>
                    {(userInfo && userInfo.isAdmin===1)?"": <Link className="my-cart-link" to="/cart" data-tip data-for="my-cart">
                        <i className="material-icons">shopping_cart</i>
                        <div className="total-items-in-cart">
                            {cartItems && cartItems.reduce((a,c) => a + Number(c.quantity), 0)}
                        </div>
                    </Link>}
                    </div>
                    <ReactTooltip id="my-cart" place="bottom" effect="solid">
                        Το καλάθι μου
                    </ReactTooltip>
                </div>
                
            </div>
    )
}

export default Header;