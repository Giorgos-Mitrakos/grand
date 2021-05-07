import React from 'react';
import { Link } from 'react-router-dom';
import './CarouselCard.css';

function CarouselCard (props){
    return (  
        <div className="carousel-card">
            <div className="carousel-card-container">
                <div className="carousel-card-image-container">
                    <img className="carousel-card-image" src={props.src} alt={props.alt}/>
                </div>
                <div className="carousel-card-name-price">
                    <div className="carousel-card-name">{props.productName.length>34?props.productName.slice(0,34)+"...":props.productName}</div>
                    <div className="carousel-card-price">{props.price.toFixed(2)} €</div>
                </div>
            </div>
        </div>
    )
}

export default CarouselCard;