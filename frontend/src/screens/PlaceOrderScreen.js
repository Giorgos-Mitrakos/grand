import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './PlaceOrderScreen.css';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../action/orderActions';
import { emptyCart } from '../action/cartActions';
import { sendEmailToConfirmOrder, sendNewOrderEmail } from '../action/emailActions';
import LoadingSpinner from '../components/LoadingSpinner';
import { Helmet } from 'react-helmet';

function PlaceOrderScreen(props) {

const cart=useSelector(state=>state.cart);
const {cartItems, shipping, payment} = cart;
const order = useSelector(state=>state.order);
const {successOrdering,orderId,loading:loadingCreateOrder} = order;
const emailOrderCorfimation = useSelector(state=>state.emailOrderCorfimation);
const {successSending} = emailOrderCorfimation;

if(!shipping){
    props.history.push("/shipping");
}
else if(!payment){
    props.history.push("/payment");
}

const dispatch = useDispatch();
    
const placeOrder = () => {
    const charger={
        name:shipping.charger.name,
        subname:shipping.charger.subname,
        country:shipping.charger.country,
        district:shipping.charger.district,
        city:shipping.charger.city,
        address:shipping.charger.address,
        postalCode:shipping.charger.postalCode,
        phoneNumber:shipping.charger.phone,
        email:shipping.charger.email
    };

    const company={
        companyName:shipping.company.companyName,
        bussiness:shipping.company.bussiness,
        doy:shipping.company.doy,
        afm:shipping.company.afm
    };
    const shippingTo={
        name :shipping.shippingTo.name,
        subname: shipping.shippingTo.subname,
        country:shipping.shippingTo.country,
        district:shipping.shippingTo.district,
        city:shipping.shippingTo.city,
        address:shipping.shippingTo.address,
        postalCode:shipping.shippingTo.postalCode
    };

    const methods = {
        comments: shipping.comments,
        typeOfPayment: shipping.typeOfPayment,
        paymentMethod: payment.paymentMethod,
        paymentMethodCost: payment.paymentMethodCost,
        sendingMethod: payment.sendingMethod,
        sendingMethodCost: payment.sendingMethodCost
    }

    const itemsCost = cartItems.reduce((a,c)=>a + c.totalPrice*c.quantity,0).toFixed(2);
    
    
    dispatch(createOrder(charger, company, shippingTo, methods, itemsCost, cartItems));
}
    
    useEffect(()=>{
        if(successOrdering===true){
            dispatch(sendEmailToConfirmOrder(orderId["order_id"]));
            dispatch(sendNewOrderEmail(orderId["order_id"]));
        }
        else if(successOrdering===false)
        {
            alert("Κάτι συνέβει και δεν καταχωρήθηκε η παραγγελεία σας!!!!\nΖητούμε συγνώμη για την αναστάτωση.Παρακαλούμε να επαναλάβεται τη διαδικασία!");
        }

    },[successOrdering]);
    
    useEffect(()=>{
        if(successSending===true){
            alert("Η παραγγελία σας καταχωρήθηκε επιτυχώς!");
            emptyCart();
            dispatch(emptyCart());           
            props.history.push("/");
            window.location.reload(false);
        }
        else if(successSending===false)
        {
            alert("Κάτι συνέβει και δεν καταχωρήθηκε η παραγγελεία σας!!!!\nΖητούμε συγνώμη για την αναστάτωση.Παρακαλούμε να επαναλάβεται τη διαδικασία!");
        }
            
        
    },[successSending]);
    

    return (
        <div>
            <Helmet>
                <title>Grand Mobile Accessories-Καταχώρηση Παραγγελίας</title>
                <meta name="description" content="Καταχωρήστε την παραγγελία σας και εμείς θα την επεξεργαστούμε και θα την αποστείλουμε στη διεύθυνση που επιθυμείτε." />
                <meta name="keywords" content="Καταχώρηση, παραγγελία, order." />
            </Helmet>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            {shipping && payment &&
            <div className="placeorder">        
                <div className="placeorder-info">
                    <div className="order-info">
                        <h3>Στοιχεία Παραγγελίας</h3>
                        <div>
                            <label>Είδος παραστατικού :</label>
                            <div>{shipping.typeOfPayment}</div>                           
                        </div>
                        <div>
                            <label>Τρόπος Πληρωμής :</label>
                            <div>{payment.paymentMethod}</div>
                        </div>                        
                        <div>
                            <label>Τρόπος Αποστολής :</label>
                            <div>{payment.sendingMethod}</div>                           
                        </div>
                        <div>
                            <label>Σχόλια πελάτη :</label>
                            <div>{shipping.comments}</div>                          
                        </div>
                    </div>
                    <div className="charger-shipping">
                        {shipping.typeOfPayment==="Τιμολόγιο" &&
                        <div className="invoice-info">
                            <h3>Στοιχεία Τιμολόγησης</h3>
                            <div>
                                <label>Επωνυμία :</label>
                                <div>{shipping.company.companyName}</div>
                            </div>
                            <div>
                                <label>Επάγγελμα :</label>
                                <div>{shipping.company.bussiness}</div>                                
                            </div>
                            <div>
                                <label>Α.Φ.Μ. :</label>
                                <div>{shipping.company.afm}</div>                                
                            </div>
                            <div>
                                <label>Δ.Ο.Υ. :</label>
                                <div>{shipping.company.doy}</div>                                
                            </div>
                            <div>
                                <label>Χώρα :</label>
                                <div>{shipping.charger.country}</div>
                            </div>
                            <div>
                                <label>Νομός :</label>
                                <div>{shipping.charger.district}</div>
                            </div>
                            <div>
                                <label>Πόλη :</label>
                                <div>{shipping.charger.city}</div>
                            </div>
                            <div>
                                <label>Διεύθυνση :</label>
                                <div>{shipping.charger.address}</div>
                            </div>
                            <div>
                                <label>Τ.Κ. :</label>
                                <div>{shipping.charger.postalCode}</div>
                            </div>
                            <div>
                                <label>Τηλέφωνο :</label>
                                <div>{shipping.charger.phone}</div>
                            </div>
                            <div>
                                <label>Email :</label>
                                <div>{shipping.charger.email}</div>
                            </div>
                        </div>
}
                        {shipping.typeOfPayment==="Απόδειξη" &&
                        <div className="charger-info">
                            <h3>Στοιχεία Πελάτη</h3>
                            <div>
                                <label>Όνομα :</label>
                                <div>{shipping.charger.name}</div>
                            </div>
                            <div>
                                <label>Επίθετο :</label>
                                <div>{shipping.charger.subname}</div>                                
                            </div>
                            <div>
                                <label>Χώρα :</label>
                                <div>{shipping.charger.country}</div>
                            </div>
                            <div>
                                <label>Νομός :</label>
                                <div>{shipping.charger.district}</div>
                            </div>
                            <div>
                                <label>Πόλη :</label>
                                <div>{shipping.charger.city}</div>
                            </div>
                            <div>
                                <label>Διεύθυνση :</label>
                                <div>{shipping.charger.address}</div>
                            </div>
                            <div>
                                <label>Τ.Κ. :</label>
                                <div>{shipping.charger.postalCode}</div>
                            </div>
                            <div>
                                <label>Τηλέφωνο :</label>
                                <div>{shipping.charger.phone}</div>
                            </div>
                            <div>
                                <label>Email :</label>
                                <div>{shipping.charger.email}</div>
                            </div>
                            <div></div>
                        </div>
}
                        {shipping.shippingTo.name &&
                        <div className="shipping-info">
                            <h3>Στοιχεία Παράδοσης</h3>
                            <div>
                                <label>Όνομα :</label>
                                <div>{shipping.shippingTo.name}</div>
                            </div>
                            <div>
                                <label>Επίθετο :</label>
                                <div>{shipping.shippingTo.subname}</div>
                            </div>
                            <div>
                                <label>Χώρα :</label>
                                <div>{shipping.shippingTo.country}</div>
                            </div>
                            <div>
                                <label>Νομός :</label>
                                <div>{shipping.shippingTo.district}</div>
                            </div>
                            <div>
                                <label>Πόλη :</label>
                                <div>{shipping.shippingTo.city}</div>
                            </div>
                            <div>
                                <label>Διεύθυνση :</label>
                                <div>{shipping.shippingTo.address}</div>
                            </div>
                            <div>
                                <label>Τ.Κ :</label>
                                <div>{shipping.shippingTo.postalCode}</div> 
                            </div>
                            <div>
                                
                            </div>
                        </div>
}
                    </div>                    
                </div>
                <div className="order-preview">
                    <div className="order-list">
                        <ul className="order-list-container">
                            <li style={{justifyContent:"center"}}>
                                <h2>Η Παραγγελία σου</h2>
                            </li>
                            {cartItems.map(item=>
                                <li className="order-item" key={item._id + item.model}>
                                    <div className="order-image-name-model">
                                        <div className="order-image">
                                        {item.category!=="Φτιάξε τη Θήκη σου"?
                                            <img src={item.image} alt="product"/>:
                                            <img src={item.image_case} alt="Φτιάξε τη θήκη σου"/>}
                                        </div>
                                        <div className="order-name-model">
                                        <div className="order-name">
                                            <div>                                        
                                                {item.name}                                                                             
                                            </div>
                                        </div>
                                        {item.category==="Συλλογή" &&
                                        <div className="order-model">
                                            Μοντέλο: {item.model}
                                        </div>  }                              
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
                                    Κόστος Προϊόντων ( {cartItems.reduce((a,c) => a + Number(c.quantity), 0)} τεμ.) :
                                    </h3>
                                    <h3>
                                        {cartItems.reduce((a,c)=>a + c.totalPrice*c.quantity,0).toFixed(2)} €
                                    </h3>
                                </div>                                             
                            </li>
                            {payment.sendingMethod && <li>
                                <div className="order-items-total-cost">
                                    <h5>
                                    Κόστος Αποστολής :
                                    </h5>
                                    <h5>
                                        {payment.sendingMethodCost} €
                                    </h5>
                                </div>                                             
                            </li>}
                            {payment.paymentMethod && <li>
                                <div className="order-items-total-cost">
                                    <h5>
                                    {payment.paymentMethod } :
                                    </h5>
                                    <h5>
                                        {payment.paymentMethodCost} €
                                    </h5>
                                </div>                                             
                            </li>}
                            <li>
                                <div className="order-items-total-cost">
                                    <h3>
                                    Σύνολο :
                                    </h3>
                                    <h3>
                                    {(cartItems.reduce((a,c)=>a + c.totalPrice*c.quantity,0)+ payment.sendingMethodCost + payment.paymentMethodCost).toFixed(2)} €
                                    </h3>
                                </div>                                             
                            </li>
                            <li>
                                <h5>*Στις τιμές συμπεριλαμβάνονται το Φ.Π.Α. 24% </h5>
                            </li>
                            <li>
                                <h5 style={{marginTop:0.3+'rem'}}> **Σε δυσπρόσιτες περιοχές ενδέχεται να υπάρξει επιπλέον κόστος μεταφορικών.</h5>
                            </li>
                            <li>
                                <button onClick={placeOrder} className="button continuebtn" disabled={loadingCreateOrder}>{loadingCreateOrder?<LoadingSpinner/>:"Καταχώρηση παραγγελίας"}</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>}
        </div>
    
    )
}

export default PlaceOrderScreen;