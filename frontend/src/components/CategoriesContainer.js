import React from 'react';
import ProductCategories from '../components/ProductCategories';
import { Link } from 'react-router-dom';
import {categories} from '../data/data';

function CategoriesContainer(props) {
   
    return (
        <div className="categories-container">
            {categories.map(x=>
            <Link to={x.linkto}>
                <ProductCategories
                    src={x.imgSource}
                    alt={x.altContent}
                    category={x.productCategory} />
            </Link>
            )}
        </div>
    )
}

export default CategoriesContainer