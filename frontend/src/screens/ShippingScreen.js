import React, { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ShippingScreen.css';
import { saveShipping } from '../action/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { accountInfo } from '../action/userActions';
import { Helmet } from 'react-helmet';

function ShippingScreen(props) {

    const [chargerName, setChargerName] = useState('');
    const [chargerSubname, setChargerSubname] = useState('');
    const [chargerCountry, setChargerCountry] = useState('');
    const [chargerState, setChargerState] = useState('');
    const [chargerCity, setChargerCity] = useState('');
    const [chargerAddress, setChargerAddress] = useState('');
    const [chargerPostalCode, setChargerPostalCode] = useState('');
    const [chargerPhone, setChargerPhone] = useState('');
    const [chargerEmail, setChargerEmail] = useState('');
    const [chargerComments, setChargerComments] = useState('');
    const [typeOfPayment, setTypeOfPayment] = useState('Απόδειξη');
    const [chargerCompanyName, setChargerCompanyName] = useState('');
    const [chargerBussiness, setChargerBussiness] = useState('');
    const [chargerDoy, setChargerDoy] = useState('');
    const [chargerAfm, setChargerAfm] = useState('');
    const [differentAddress, setDifferentAddress] = useState(false);
    const [shippingName, setShippingName] = useState('');
    const [shippingSubname, setShippingSubname] = useState('');
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingState, setShippingState] = useState('');
    const [shippingCity, setShippingCity] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [shippingPostalCode, setShippingPostalCode] = useState('');
    const [shippingPhone, setShippingPhone] = useState('');

    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const userAccountAddress = useSelector(state => state.userAccountAddress);
    const { userAddressInfo } = userAccountAddress;
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            dispatch(accountInfo(userInfo.email));
        }

    }, [userInfo, dispatch]);

    useEffect(() => {

        const setAddresses = () => {
            setChargerName(userAddressInfo.name);
            setChargerSubname(userAddressInfo.subname);
            setChargerCountry(userAddressInfo.country);
            setChargerState(userAddressInfo.district);
            setChargerCity(userAddressInfo.city);
            setChargerAddress(userAddressInfo.address);
            setChargerPostalCode(userAddressInfo.postalCode);
            setChargerEmail(userAddressInfo.email);
            setChargerPhone(userAddressInfo.phoneNumber);
            setChargerCompanyName(userAddressInfo.companyName);
            setChargerBussiness(userAddressInfo.bussiness);
            setChargerAfm(userAddressInfo.afm);
            setChargerDoy(userAddressInfo.doy);
        }

        if (userAddressInfo) {
            setAddresses();
        }

    }, [userAddressInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        var charger = {
            name: chargerName,
            subName: chargerSubname,
            country: chargerCountry,
            district: chargerState,
            city: chargerCity,
            address: chargerAddress,
            postalCode: chargerPostalCode,
            phone: chargerPhone,
            email: chargerEmail
        };

        var company = {
            companyName: chargerCompanyName,
            bussiness: chargerBussiness,
            doy: chargerDoy,
            afm: chargerAfm
        };

        var shippingTo = {
            differentAddress,
            name: shippingName,
            subname: shippingSubname,
            country: shippingCountry,
            district: shippingState,
            city: shippingCity,
            address: shippingAddress,
            postalCode: shippingPostalCode,
            phone: shippingPhone,
        };


        var comments = chargerComments;

        dispatch(saveShipping(typeOfPayment, company, charger, shippingTo, comments));
        props.history.push("/payment");
    }

    const validEmail = (value) => {
        if (value !== "undefined") {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

            if (pattern.test(value)) {

                setChargerEmail(value);

            }

        }
    }

    return (
        <div>
            <Helmet>
                <title>Grand Mobile Accessories-Στοιχεία Παραγγελίας</title>
                <meta name="description" content="Καταχωρήστε τα στοιχεία παραγγελίας και τιμολόγησης" />
                <meta name="keywords" content="Παραγγελία, τιμολόγηση, καταχώρηση, στοιχεία, απόδειξη, τιμολόγιο " />
            </Helmet>
            <CheckoutSteps step1></CheckoutSteps>
            <div className="shipping-form-wrapper">
                <div className="shipping-form">
                    <form id="shippingForm" onSubmit={submitHandler}>
                        <ul className="shipping-form-container">
                            <li>
                                <h2>Στοιχεία Παραγγελίας</h2>
                            </li>
                            <li id="type-of-payment">
                                <label>Τύπος παραστατικού:</label>
                                <div>
                                    <input type="radio" name="typeofpayment" id="receipt"
                                        onClick={(e) => setTypeOfPayment("Απόδειξη")} defaultChecked />
                                    <label htmlFor="receipt">Απόδειξη</label>
                                </div>
                                <div>
                                    <input type="radio" name="typeofpayment" id="invoice"
                                        onClick={(e) => setTypeOfPayment('Τιμολόγιο')}>
                                    </input>
                                    <label htmlFor="invoice">Τιμολόγιο</label>
                                </div>
                            </li>
                            {typeOfPayment === 'Τιμολόγιο' &&
                                <Fragment>
                                    <li>
                                        <input type="text" name="charger-companyName" id="charger-companyName" placeholder="Επωνυμία*" required={typeOfPayment === 'Τιμολόγιο'}
                                            onChange={(e) => setChargerCompanyName(e.target.value)} value={chargerCompanyName}>
                                        </input>
                                    </li>
                                    <li>
                                        <input type="text" name="charger-bussiness" id="charger-bussiness" placeholder="Επάγγελμα*" required={typeOfPayment === 'Τιμολόγιο'}
                                            onChange={(e) => setChargerBussiness(e.target.value)} value={chargerBussiness}>
                                        </input>
                                    </li>
                                    <li>
                                        <input type="text" name="charger-afm" id="charger-afm" placeholder="Α.Φ.Μ*" required={typeOfPayment === 'Τιμολόγιο'}
                                            onChange={(e) => setChargerAfm(e.target.value)} value={chargerAfm} maxLength='9'>
                                        </input>
                                        <input type="text" name="charger-doy" id="charger-doy" placeholder="Δ.Ο.Υ*" required={typeOfPayment === 'Τιμολόγιο'}
                                            onChange={(e) => setChargerDoy(e.target.value)} value={chargerDoy}>
                                        </input>
                                    </li>
                                </Fragment>
                            }
                            {typeOfPayment === 'Απόδειξη' &&
                                <li>
                                    <input type="text" name="charger-name" id="charger-name" placeholder="Όνομα*" required={typeOfPayment === 'Απόδειξη'}
                                        onChange={(e) => setChargerName(e.target.value)} value={chargerName}>
                                    </input>
                                    <input type="text" name="charger-subname" id="charger-subname" placeholder="Επίθετο*" required={typeOfPayment === 'Απόδειξη'}
                                        onChange={(e) => setChargerSubname(e.target.value)} value={chargerSubname}>
                                    </input>
                                </li>}
                            <li>
                                <input type="text" name="charger-country" id="charger-country" placeholder="Χώρα*" required={typeOfPayment === 'Απόδειξη'}
                                    onChange={(e) => setChargerCountry(e.target.value)} value={chargerCountry}>
                                </input>
                                <input type="text" name="charger-state" id="charger-state" placeholder="Νομός*" required
                                    onChange={(e) => setChargerState(e.target.value)} value={chargerState}>
                                </input>
                                <input type="text" name="charger-city" id="charger-city" placeholder="Πόλη*" required
                                    onChange={(e) => setChargerCity(e.target.value)} value={chargerCity}>
                                </input>
                            </li>
                            <li>
                                <input type="text" name="charger-address" id="charger-address" placeholder="Διεύθυνση*" required
                                    onChange={(e) => setChargerAddress(e.target.value)} value={chargerAddress}>
                                </input>
                                <input type="text" name="charger-postalCode" id="charger-postalCode" placeholder="Τ.Κ*" required
                                    onChange={(e) => setChargerPostalCode(e.target.value)} value={chargerPostalCode}>
                                </input>
                            </li>
                            <li>
                                <input type="tel" name="charger-phone" id="charger-phone" maxLength="10"
                                    placeholder="Τηλέφωνο*" required value={chargerPhone}
                                    onChange={(e) => setChargerPhone(e.target.value)}>
                                </input>
                                <input type="email" name="charger-email" id="charger-email" placeholder="Email*" required value={userInfo ? chargerEmail : undefined}
                                    onChange={(e) => validEmail(e.target.value)} disabled={userInfo}>
                                </input>
                            </li>
                            <li>
                                <div className="different-address">
                                    <input type="checkbox" name="different-address" id="different-address"
                                        onChange={(e) => setDifferentAddress(e.target.checked)}></input>
                                    <label htmlFor="different-address">Αποστολή σε διαφορετική διεύθυνση;</label>
                                </div>
                            </li>
                            {differentAddress &&
                                <Fragment>
                                    <li>
                                        <input type="text" name="shipping-name" id="shipping-name" placeholder="Όνομα*" required={differentAddress}
                                            onChange={(e) => setShippingName(e.target.value)}>
                                        </input>
                                        <input type="text" name="shipping-subname" id="shipping-subname" placeholder="Επίθετο*" required={differentAddress}
                                            onChange={(e) => setShippingSubname(e.target.value)}>
                                        </input>
                                    </li>
                                    <li>
                                        <input type="text" name="shipping-country" id="shipping-country" placeholder="Χώρα*" required={differentAddress}
                                            onChange={(e) => setShippingCountry(e.target.value)} value={shippingCountry}>
                                        </input>
                                        <input type="text" name="shipping-state" id="shipping-state" placeholder="Νομός*" required={differentAddress}
                                            onChange={(e) => setShippingState(e.target.value)}>
                                        </input>
                                        <input type="text" name="shipping-city" id="shipping-city" placeholder="Πόλη*" required={differentAddress}
                                            onChange={(e) => setShippingCity(e.target.value)}>
                                        </input>
                                    </li>
                                    <li>
                                        <input type="text" name="shipping-address" id="shipping-address" placeholder="Διεύθυνση*" required={differentAddress}
                                            onChange={(e) => setShippingAddress(e.target.value)}>
                                        </input>
                                        <input type="text" name="shipping-postalCode" id="shipping-postalCode" placeholder="Τ.Κ*" required={differentAddress}
                                            onChange={(e) => setShippingPostalCode(e.target.value)}>
                                        </input>
                                    </li>
                                    <li className="flex-start">
                                        <input type="tel" name="shipping-phone" id="shipping-phone" maxLength="10"
                                            placeholder="Τηλέφωνο*" required={differentAddress} value={shippingPhone}
                                            onChange={(e) => setShippingPhone(e.target.value)}>
                                        </input>
                                    </li>
                                </Fragment>}
                            <li>
                                <textarea className="comments-textarea" name="comments" id="comments" maxLength="1000"
                                    placeholder="Σημειώσεις σχετικά με την παραγγελία, π.χ ειδικές οδηγίες σχετικά με την παράδοση (προαιρετικό)"
                                    onChange={(e) => setChargerComments(e.target.value)}></textarea>
                            </li>
                        </ul>
                    </form>
                </div>
                <div className="order-preview">
                    <div className="order-list">
                        <ul className="order-list-container">
                            <li>
                                <h2>Η Παραγγελία σου</h2>
                            </li>
                            {cartItems && cartItems.map(item =>
                                <li className="order-item" key={item._id + item.model}>
                                    <div className="order-image-name-model">
                                        <div className="order-image">
                                            {item.category !== "Φτιάξε τη Θήκη σου" ?
                                                <img src={item.image} alt="product" /> :
                                                <img src={item.image_case} alt="Φτιάξε τη θήκη σου" />}
                                        </div>
                                        <div className="order-name-model">
                                            <div className="order-name">
                                                <div>
                                                    {item.name}
                                                </div>
                                            </div>
                                            {item.category === "Συλλογή" &&
                                                <div className="order-model">
                                                    Μοντέλο: {item.model}
                                                </div>}
                                        </div>
                                    </div>
                                    <div className="order-qty-total-price">
                                        <div className="order-quantity">
                                            {item.quantity} (τεμ.)
                                    </div>
                                        <div className="order-total-price">
                                            {(item.totalPrice * item.quantity).toFixed(2)} €
                                </div>
                                    </div>
                                </li>)}
                            <li>
                                <div className="order-items-total-cost">
                                    <h3>
                                        Κόστος Προϊόντων ( {cartItems.reduce((a, c) => a + Number(c.quantity), 0)} τεμ.) :
                                </h3>
                                    <h3>
                                        {cartItems.reduce((a, c) => a + c.totalPrice * c.quantity, 0).toFixed(2)} €
                                </h3>
                                </div>
                            </li>
                            <li>
                                <h5>*Στις τιμές συμπεριλαμβάνονται το Φ.Π.Α. 24% </h5>
                            </li>
                            <li>
                                <h5 style={{ marginTop: 0.3 + 'rem' }}> **Σε δυσπρόσιτες περιοχές ενδέχεται να υπάρξει επιπλέον κόστος μεταφορικών.</h5>
                            </li>
                            <li>
                                <input type="submit" form="shippingForm" className="button continuebtn" value="Συνέχεια"></input>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ShippingScreen;