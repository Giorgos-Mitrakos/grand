import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './PaymentScreen.css';
import {savePayment}  from '../action/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { listPaymentMethods, listSendingMethods } from '../action/paymentActions';
import LoadingSpinner from '../components/LoadingSpinner';

function PaymentScreen(props) {

    const [paymentMethod,setPaymentMethod] = useState('');
    const [paymentMethodCost,setPaymentMethodCost] = useState('');
    const [sendingMethod,setSendingMethod] = useState('');
    const [sendingMethodCost,setSendingMethodCost] = useState('');
    const cart=useSelector(state=>state.cart);
    const {cartItems} = cart;
    const sendingMethodsList=useSelector(state=>state.sendingMethodsList);
    const {sendingMethods,loading: loadingSendingMethods,error:errorSendingMethods} = sendingMethodsList;
    const paymentMethodsList=useSelector(state=>state.paymentMethodsList);
    const {paymentMethods,loading: loadingPaymentMethods,error:errorPaymentMethods} = paymentMethodsList;
    const dispatch = useDispatch();
    
    const submitHandler = (e) => {
        e.preventDefault();
        
        dispatch(savePayment(paymentMethod,paymentMethodCost,sendingMethod, sendingMethodCost));
        props.history.push("/placeorder");
    }

    const sendingMethodHandler = (id,method,cost)=>{
        setSendingMethod(method);
        setSendingMethodCost(cost);
        dispatch(listPaymentMethods(id));
    }

    const paymentMethodHandler = (method,cost)=>{
        setPaymentMethod(method);
        setPaymentMethodCost(cost);
    }

    useEffect(()=>{
        dispatch(listSendingMethods());
        return ()=>{
            
        }
    },[]);
    

    return (
        <div>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <div className="payment-form-wrapper">        
                <div className="payment-form">
                    <form id="sending-payment-form" onSubmit={submitHandler}>
                        
                        <ul className="sending-form-container">
                            <li>
                                <h2>Τρόπος Αποστολής</h2>
                            </li>
                            {loadingSendingMethods?<LoadingSpinner/>:
                            errorSendingMethods?<div>{errorSendingMethods}</div>:
                            sendingMethods.map(send=>
                                <li key={send.sendingMethod_id}>
                                    <input type="radio" name="sendingMethod" id="sendingMethod" value={send.sendingMethod}
                                    onChange={(e)=>sendingMethodHandler(send.sendingMethod_id, send.sendingMethod,send.sendingMethodCost)}/>
                                    <label htmlFor="sendingMethod">   {send.sendingMethod}</label>
                                </li>)}                           
                            </ul>
                        <ul className="payment-form-container">
                            <li>
                                <h2>Τρόπος Πληρωμής</h2>
                            </li>
                            {loadingPaymentMethods?<LoadingSpinner/>:
                            errorPaymentMethods?<div>{errorPaymentMethods}</div>:
                            paymentMethods.map(pay=>
                                <li>
                                    <input type="radio" name="paymentMethod" id="paymentMethod" value={pay.paymentMethod}
                                    onChange={(e)=> paymentMethodHandler(pay.paymentMethod,pay.paymentMethodCost)}/>
                                    <label htmlFor="paymentMethod">   {pay.paymentMethod}</label>
                                </li>
                            )}
                           </ul>
                    </form>
                </div>
                <div className="order-preview">
                    <div className="order-list">
                        <ul className="order-list-container">
                            <li>
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
                                    <h4>
                                    Κόστος Προϊόντων ( {cartItems.reduce((a,c) => a + Number(c.quantity), 0)} τεμ.) :
                                    </h4>
                                    <h4>
                                        {cartItems.reduce((a,c)=>a + c.totalPrice*c.quantity,0).toFixed(2)} €
                                    </h4>
                                </div>                                             
                            </li>
                            {sendingMethod &&<li>
                                <div className="order-items-total-cost">
                                    <h5>
                                    Κόστος Αποστολής :
                                    </h5>
                                    <h5>
                                        {sendingMethodCost} €
                                    </h5>
                                </div>                                             
                            </li>}
                            {paymentMethod && <li>
                                <div className="order-items-total-cost">
                                    <h5>
                                    {paymentMethod} :
                                    </h5>
                                    <h5>
                                        {paymentMethodCost} €
                                    </h5>
                                </div>                                             
                            </li>}
                            <li>
                                <div className="order-items-total-cost">
                                    <h3>
                                    Σύνολο :
                                    </h3>
                                    <h3>
                                    {cartItems.reduce((a,c)=>a + c.totalPrice*c.quantity,0)+ sendingMethodCost + paymentMethodCost} €
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
                                <input type="submit" form="sending-payment-form" className="button continuebtn" value="Συνέχεια"
                                disabled={!(sendingMethod && paymentMethod)}></input>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    
    )
}

export default PaymentScreen;