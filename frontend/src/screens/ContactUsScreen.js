import React, { useEffect, useState } from 'react';
import './ContactUsScreen.css';
import MapContainer from '../components/MapContainer';
import { useDispatch } from 'react-redux';
import { sendEmailToContact } from '../action/emailActions';

function ContactUsScreen (){

    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [subject,setSubject]= useState('');
    const [message,setMessage]= useState('');
    const dispatch = useDispatch();

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(sendEmailToContact(name,email,subject,message));
        alert("Ευχαριστούμε για που επικοινωνίσατε μαζί μας.\nΟ εκπρόσωπος μας θα επιληφθεί του θέματος και σύντομα θα επικοινωνίσει μαζί σας!")
    }

    useEffect(()=>{
        window.scrollTo(0,0)
        
        return ()=>{
    
        }
    },[]);

    const validEmail =(value)=>{
        if (value !== "undefined") {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
          
            if (pattern.test(value)) {
          
              setEmail(value);
          
            }
          
          }
    }
    
    return(
        <div className="contact-us-container">
            <div className="map-container">
                <MapContainer/>
            </div>
            <div className="contact-us">
                <div className="contact-us-call-mail-social">
                    <div>
                        <h3>Πάντα στο πλευρό του πελάτη</h3>
                        <p>
                        Η εταιρεία μας είναι παντα δίπλα στον πελάτη προσφέροντας την γρηγορότερη και πληρέστερη εξυπηρέτηση. 
                        Επικοινωνήστε μαζί μας και εμείς από την πλευρά μας θα σας απαντήσουμε το συντομότερο στα ερωτήματα και τις απορίες σας. 
                        Ευχαριστούμε για την προτίμηση σας 
                        </p>
                    </div>
                    <div><i class="material-icons">call</i><a href="tel:2221112505">2221112505</a> </div>
                    <div><i class="material-icons">email</i> <a href="mailto:grandmobile@grandmobile.gr">grandmobile@grandmobile.gr</a></div>
                    <div><i class="material-icons">place</i>Αβάντων 69 & Αποστόλη,<br/> Χαλκίδα 34100</div>
                </div>
                <div className="contact-us-email-container">
                    <form className="contact-us-email" onSubmit={submitHandler}>
                        <h3>Επικοινωνήστε Μαζί Μας</h3>
                        <input type="text" id="fullname" name="fullname" value={name} placeholder="Ονοματεπώνυμο" onChange={(e)=>setName(e.target.value)}></input>
                        <input type="email" id="email" name="email" placeholder="email" onChange={(e)=> validEmail(e.target.value)}></input>
                        <input type="text" id="subject" name="subject" placeholder="Θέμα" value={subject} onChange={(e)=>setSubject(e.target.value)}></input>
                        <textarea id="send-message" name="send-message" placeholder="Μήνυμα" value={message} onChange={(e)=>setMessage(e.target.value)} maxLength="1000"></textarea>
                        <input type="submit" id="submit-message" name="submit-message" value="Αποστολή" disabled={!email || !message || !subject}></input>
                    </form>
                </div>
            </div>
        </div>
        
    )

}

export default ContactUsScreen;