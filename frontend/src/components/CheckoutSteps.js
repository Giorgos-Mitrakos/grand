import React from 'react';
import './CheckoutSteps.css';

function CheckoutSteps(props) {
    return(
        <div className="checkout-steps">
            <div className={props.step1 ? 'active' :''}>Στοιχεία Παραγγελίας</div>
            <div className={props.step2 ? 'active' :''}>Τρόποι Πληρωμής</div>
            <div className={props.step3 ? 'active' :''}>Καταχώρηση παραγγελίας</div>
        </div>
    )
}

export default CheckoutSteps;