import React from 'react';
import {Link} from 'react-router-dom';
import './MakeyourcaseHeader.css';

function MakeyourcaseHeader(){
    return (
        <div className="make-case-header">
            <div className="make-case-brand">
                <Link to='/'>
                    <img className="make-case-logo" src={require('../images/PNG_FINAL.png')} alt="logo"/>
                </Link>
                <Link to='/' className="make-case-brand-name">
                    <h1>Grand</h1>
                    <h5>mobile accessories</h5>
                </Link>                
            </div>
        </div>
    )
}

export default MakeyourcaseHeader;