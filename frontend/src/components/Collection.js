import React from 'react';
import './product.css';

function Collection (props){
    return (  
        <div className="product">
            <img className="product-image" src={props.src} alt={props.alt}/>
            <div className="product-name">{props.productName}</div>
            <div className="flip-product">
                <div className="product-price">{props.percentage?(props.price*(100 +props.percentage)/100).toFixed(2):props.price.toFixed(2)} €</div>
                <div className="product-see-details">Δείτε περισσότερα</div>
            </div>
        </div>
    )
}

export default Collection;