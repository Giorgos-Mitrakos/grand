import React from 'react';
import './Contacts.css';
import { contactUs } from '../data/data';

class Contacts extends React.Component{
    render()
    {
        return(
            <div className='contact-container'>
                <div className="call-email">
                    <div><i className="material-icons">call</i> <a href={"tel:"+contactUs.phoneNumber}>{contactUs.phoneNumber}</a></div>
                    <div><i className="material-icons">email</i> <a href={"mailto:"+contactUs.email}>{contactUs.email}</a></div>
                </div>
                <div className="social-media">
                    <a href={contactUs.facebook.linkto}
                    target='_blank' rel="noopener noreferrer" className='f-logo'>
                        <img className='logo-facebook' src={contactUs.facebook.imgSource} 
                        alt={contactUs.facebook.altContent}/>
                    </a>
                    <a href={contactUs.instagram.linkto}
                    target='_blank' rel="noopener noreferrer" className='insta-logo'>
                        <img className='logo-instagram' src={contactUs.instagram.imgSource}
                        alt={contactUs.instagram.altContent}/>
                    </a>
                </div>
            </div>
        );
    }
}

export default Contacts;