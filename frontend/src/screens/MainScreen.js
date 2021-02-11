import React, { useEffect } from 'react';
import './MainScreen.css';
import { Link } from 'react-router-dom';
import CollectionCarousel from '../components/CollectionCarousel';
import MostViewProductsCarousel from '../components/MostViewProductsCarousel';
import CategoriesContainer from '../components/CategoriesContainer';
import CookieConsent from "react-cookie-consent";

function MainScreen() {

    useEffect(() => {
        window.scrollTo(0, 0)

        return () => {

        }
    }, []);

    return (
        <div className="main-screen-container">
            <div className="main-image">
                <img className="make-your-case-image" src="./images/color-smartphone-cases.jpg" alt="Make your case" />
            </div>
            <div className="products-container">
                <h2>ΠΡΟΙΟΝΤΑ</h2>
                <CategoriesContainer />
            </div>
            <div className="collection-carousel">
                <CollectionCarousel />
            </div>
            <div className="collection-carousel">
                <MostViewProductsCarousel />
            </div>
            <CookieConsent
                containerClasses="consent"
                location="bottom"
                buttonText="Αποδοχή"
                enableDeclineButton="true"
                flipButtons="true"
                declineButtonText="Δεν αποδέχομαι"
                cookieName="CookieConsent"
                cookieValue="true"
                declineCookieValue="false"
                style={{ background: "#2B373B", height: "auto" }}
                buttonStyle={{ color: "#4e503b", fontSize: "1rem" }}
                expires={150}
            >
                <p>Χρησιμοποιούμε τα υποχρεωτικά (τεχνικώς απαραίτητα) cookies για την καλύτερη περιήγηση
                και εμπειρία σου και για τη βελτίωση των λειτουργιών του site. Με τη συγκατάθεση σου
                θα χρησιμοποιήσουμε επιπρόσθετα Cookies για τη βελτίωση της περιήγησης στην ιστοσελίδα,
                την ανάλυση της επίδοσης και της λειτουργικότητας της και για την παροχή εξατομικευμένων
                διαφημίσεων.
            </p>
                <p> Εάν συμφωνείς με τη χρήση των επιπρόσθετων Cookies επέλεξε "ΑΠΟΔΟΧΗ"
                εάν δεν επιθυμείς την εγκατάσταση των επιπρόσθετων Cookies επέλεξε
                "ΔΕΝ ΑΠΟΔΕΧΟΜΑΙ".
            </p>
                <p>
                    Ενημερώσου για την Πολιτική Cookies
            <Link to="/Πολιτική-Απορρήτου" style={{ color: "yellow" }}> ΕΔΩ</Link>.
            </p>
            </CookieConsent>
        </div>
    )
}

export default MainScreen;