import React from 'react';
import './ProductCategories.css';

function ProductCategories (props){
    return (  
        <div className="product-category">
            <img className="product-category-image" src={props.src} alt={props.alt}/>
            <div className="product-category-name">{props.category}</div>            
        </div>
    )
}
export default ProductCategories;