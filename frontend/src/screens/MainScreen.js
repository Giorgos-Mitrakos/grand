import React, { Suspense, lazy, useEffect } from 'react';
import './MainScreen.css';
import { Link } from 'react-router-dom';
import CookieConsent from "react-cookie-consent";
import { useSelector, useDispatch } from 'react-redux';
import { randomListCollection } from '../action/collectionActions';
import { findMostViewedProducts } from '../action/productActions';
const CategoriesContainer = lazy(() => import('../components/CategoriesContainer'));
const MyCarousel = lazy(() => import('../components/MyCarousel'));

function MainScreen() {

    useEffect(() => {
        window.scrollTo(0, 0)

        return () => {

        }
    }, []);

    const collectionRandomList = useSelector(state => state.collectionRandomList);
    const { collection, loading: collectionLoading, error: collectionError } = collectionRandomList;
    const mostViewedProducts = useSelector(state => state.mostViewedProducts);
    const { mostViewed, loading: mostViewedLoading, error: mostViewedError } = mostViewedProducts;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(randomListCollection());
        dispatch(findMostViewedProducts());

    }, [dispatch])

    return (
        <div className="main-screen-container">
            <div className="main-image">
                <img className="make-your-case-image" src="./images/color-smartphone-cases.webp" alt="Make your case" />
            </div>
            <div className="products-container">
                <h2>ΠΡΟΙΟΝΤΑ</h2>
                <Suspense fallback={<div>Loading...</div>}>
                    <CategoriesContainer />
                </Suspense>
            </div>
            <div className="collection-carousel">
                <h2>Η ΣΥΛΛΟΓΗ ΜΑΣ</h2>
                <Suspense fallback={<div>Loading...</div>}>
                    <MyCarousel carouselList={collection} loading={collectionLoading} error={collectionError} />
                </Suspense>
            </div>
            <div className="collection-carousel">
                <h2>ΔΗΜΟΦΙΛΕΣΤΕΡΑ ΠΡΟΙΟΝΤΑ</h2>
                <Suspense fallback={<div>Loading...</div>}>
                    <MyCarousel carouselList={mostViewed} loading={mostViewedLoading} error={mostViewedError} />
                </Suspense>
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
                style={{ background: "#2B373B", height: "auto", fontFamily: "Roboto" }}
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