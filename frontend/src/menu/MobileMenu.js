import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { menuOpen } from '../action/menuActions';
import './MobileMenu.css';
import { navigation } from '../data/data';

function MobileMenu(props) {
    const dispatch = useDispatch();
    return (
        <div className="mobile-menu">
            <ul onClick={() => dispatch(menuOpen())}>
                {navigation.map((x,index) =>
                    <li key={index}><Link to={x.linkto}>{x.title}</Link></li>
                )}
            </ul>
        </div>
    )
}

export default MobileMenu;