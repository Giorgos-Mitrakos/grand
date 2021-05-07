import React, { useEffect } from 'react';
import './ProductsScreen.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import CategoriesContainer from '../components/CategoriesContainer';


function ProductsScreen() {

    useEffect(() => {
        window.scrollTo(0, 0)

        return () => {

        }
    }, []);

    return (
        <div >
            <Helmet>
                <title>Grand Mobile Accessories-Προϊόντα-Κατηγορίες</title>
                <meta name="description" content="Εδώ θα βρείτε όλα μας τα προίόντα στις καλύτερες τιμές" />
                <meta name="keywords" content="Κινητά, Κινητή Τηλεφωνία, Τάμπλετ, tablet, desktop, Η/Υ, επιτραπέζιος, λάπτοπ, laptop, 
                φορητός, υπολογιστής, εικόνα, ήχος, είδη γραφείου, office supplies, software, προγράμματα, υπηρεσίες,
                gaming, παιχνίδια, φωτισμός, lighting, gadgets, ιατρικά είδη, " />
            </Helmet>
            <div className="title">
                <h2>ΠΡΟΙΟΝΤΑ</h2>
            </div>
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Προϊόντα</li>
                </ul>
            </div>
            <CategoriesContainer />
        </div>
    )
}

export default ProductsScreen;