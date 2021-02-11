import React, { useEffect } from 'react';
import './ProductsScreen.css';
import {Link} from 'react-router-dom';
import CategoriesContainer from '../components/CategoriesContainer';


function ProductsScreen (){

    useEffect(()=>{
        window.scrollTo(0,0)
        
        return ()=>{
    
        }
    },[]);

    return (  
        <div >
            <div className="title">
                <h2>ΠΡΟΙΟΝΤΑ</h2>
            </div>
            <div>
                <ul class="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Προϊόντα</li>
                </ul>
            </div>
            <CategoriesContainer/>               
        </div> 
    )
}

export default ProductsScreen;