import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendPasswordReset } from '../action/emailActions';
import './ForgottenPassword.css';

function ForgottenPassword(props) {
    const [email,setEmail]=useState("");
    const emailResetPassword = useSelector(state=>state.emailResetPassword);
    const {successSending:successSendingResetPassword} = emailResetPassword;
    const dispatch = useDispatch();

    const sendPasswordResetEmail = (e) => {
        e.preventDefault()
        dispatch(sendPasswordReset(email));
        // axios.post(`${SERVER_URI}/reset_password/user/${email}`)
        setEmail('');
    }

    const validEmail =(value)=>{
        if (value !== "undefined") {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
          
            if (pattern.test(value)) {
          
              setEmail(value);
          
            }
          
          }
    }
    
    return(
        <div className="reset-form">
            <div className="reset-form-container">
            <h3>Επαναφορά Κωδικού</h3>
            {successSendingResetPassword ? (
            <div className="reset-password-form-sent-wrapper">
                <p>
                Σε λίγο θα λάβεις στο email σου ένα σύνδεσμο για την επαναφορά του κωδικού σου!<br/> Μην είσαι ξεχασιάρης...
                </p>
                <Link to="/signin" className="ghost-btn">
                Είσοδος
                </Link>
            </div>
            ) : (
            <div className="reset-password-form-wrapper">
                <p>
                Αν ξέχασες τον κωδικό σου συμπλήρωσε το email σου και εμείς θα σου στείλουμε ένα email με περαιτέρω οδηγίες!
                </p>
                <form onSubmit={sendPasswordResetEmail}>
                <input
                    onChange={(e)=>validEmail(e.target.value)}
                    placeholder="Email address" required
                />
                <input type="submit" id="reset-password-submit" className="button" value="Επαναφορά κωδικού" disabled={!email}></input>
                
                </form>
                <Link to="/signin">Θυμάμαι τον κωδικό μου.</Link>
            </div>
            )}
            </div>
        </div>
    )
}

export default ForgottenPassword;