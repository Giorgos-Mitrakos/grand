import React, { useEffect, useState } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToNewsletterList } from '../action/userActions';
import { sendNewsLetterMailConfirmation } from '../action/emailActions';
import { categories, contactUs, navigation, theCompany } from '../data/data';

function Footer() {

    const [checked, setChecked] = useState(false);
    const [email, setEmail] = useState('');
    const addForNewsletter = useSelector(state => state.addForNewsletter);
    const { successAdding } = addForNewsletter;
    const emailAddNewsletter = useSelector(state => state.emailAddNewsletter);
    const { successSending } = emailAddNewsletter;
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(addToNewsletterList(email));
    }

    useEffect(() => {
        if (successAdding === true) {
            dispatch(sendNewsLetterMailConfirmation(email));
        }
        else if (successAdding === false) {
            alert("Το Email σας είναι ήδη καταχωρημένο!")
        }
        setEmail('');
        return () => {

        }
    }, [successAdding])

    useEffect(() => {
        if (successSending) {
            alert("Η εγγραφή σας ολοκληρώθηκε.\nΣας έχει σταλεί email επιβεβαίωσης.Παρακαλώ ελέγξτε τα εισερχόμενα σας.\nΣε περίπτωση που δεν βλέπετε το μήνημα ελέγξτε το φάκελο της ανεπιθύμητης αλληλογραφίας.")

        }

        return () => {

        }
    }, [successSending]);
    
    const validEmail = (value) => {
        if (value !== "undefined") {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

            if (pattern.test(value)) {

                setEmail(value);

            }

        }
    }

    return (
        <div className="footer-wrapper">
            <div className="footer">
                <div className="navigation-info info">
                    <h2>Πλοήγηση</h2>
                    <ul>
                        {navigation.map((x, index) =>
                            <li key={index}><Link to={x.linkto}>{x.title}</Link></li>
                        )}
                    </ul>
                </div>
                <div className="product-info info">
                    <h2>Προϊόντα</h2>
                    <ul>
                        {categories.map((x, index) =>
                            <li key={index}><Link to={x.linkto}>{x.productCategory}</Link></li>
                        )}
                    </ul>
                </div>
                <div className="info">
                    <h2>Η Εταιρία</h2>
                    <ul>
                        {theCompany.map((x, index) =>
                            <li key={index}><Link to={x.linkto}>{x.title}</Link></li>
                        )}
                    </ul>
                </div>
                <div className="contact-info info">
                    <h2>Επικοινωνία</h2>
                    <div>
                        <h3>Grand</h3>
                        <h5>mobile accessories</h5>
                    </div>
                    <div className="contact-info-items"><i className="material-icons">place</i>{contactUs.address}</div>
                    <div className="contact-info-items"><i className="material-icons">call</i> <a href={"tel:" + contactUs.phoneNumber}>{contactUs.phoneNumber}</a></div>
                    <div className="contact-info-items"><i className="material-icons">email</i> <a href={"mailto:" + contactUs.email}>{contactUs.email}</a> </div>
                    <div>
                        <a href={contactUs.facebook.linkto}
                            target='_blank' rel="noopener noreferrer" className='f-logo'>
                            <img className='logo-social' src={contactUs.facebook.imgSource}
                                alt={contactUs.facebook.altContent} />
                        </a>
                        <a href={contactUs.instagram.linkto}
                            target='_blank' rel="noopener noreferrer" className='insta-logo'>
                            <img className='logo-social' src={contactUs.instagram.imgSource}
                                alt={contactUs.instagram.altContent} />
                        </a>
                    </div>
                </div>
                <div className="newsletter-info info">
                    <h2>Newsletter</h2>
                    <div>
                        <p>
                            Συμπληρώστε το email σας για να μένετε<br /> ενημερωμένοι για νέα & προσφορές!
                            </p>
                        <form className="newsletter-email" onSubmit={submitHandler}>
                            <input type="email" id="email" name="email" placeholder="email" onChange={(e) => validEmail(e.target.value)}></input><br></br>
                            <input type="checkbox" id="private-policy" name="private-policy" onChange={(e) => { setChecked(e.target.checked) }}></input>
                            {" "}
                            <Link to="/newsletter-disclaimer" id="private-policy-link">
                                <strong>Αποδοχή όρων χρήσης</strong>
                            </Link>
                            <input type="submit" id="submit-email" name="submit-email" value="Εγγραφή" disabled={!checked || !email}></input>
                        </form>
                    </div>
                </div>
            </div>
            <div className="copywrite-container">
                <div>
                    <p>Copyright 2020 © grandmobile.gr | All rights reserved |
                        <Link to="/Πολιτική-Απορρήτου">Πολιτική Απορρήτου</Link>
                    </p>
                </div>
                <div className="brand-info">
                    <Link to='/'>
                        <img className="logo-info"
                            src="./PNG_FINAL.png"
                            alt="logo" />
                    </Link>
                    <Link to='/' className="brand-name-info">
                        <h1>Grand</h1>
                        <h5>mobile accessories</h5>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Footer;