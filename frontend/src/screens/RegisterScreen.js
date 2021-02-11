import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../action/userActions';
import './RegisterScreen.css';
import { sendRegisterConfirmation } from '../action/emailActions';


function RegisterScreen(props) {

    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [rePassword,setRePassword] = useState('');
    const userSignin = useSelector(state=>state.userSignin);
    const {loading, error, success, registerFailmessage} = userSignin;
    const emailRegister = useSelector(state=>state.emailRegister);
    const {sendEmail}=emailRegister;
    const dispatch = useDispatch();

    useEffect(()=>{
        if(success){
            dispatch(sendRegisterConfirmation(email,name));            
        }
        return ()=>{

        }
    },[success]);

    useEffect(()=>{
        if(sendEmail==="success"){
            alert("Η εγγραφή σας ολοκληρώθηκε.\nΣας έχει σταλεί email επιβεβαίωσης.Παρακαλώ ελέγξτε τα εισερχόμενα σας.\nΣε περίπτωση που δεν βλέπετε το μήνημα ελέγξτε το φάκελο της ανεπιθύμητης αλληλογραφίας. ")
            props.history.push("/");
        }
        
        return ()=>{

        }
    },[sendEmail]);
    
    const submitHandler = (e) => {
        e.preventDefault();
        if(password!==rePassword)
        {
            alert("Έλεγξτε τον κωδικο");
        }
        else{
            dispatch(register(name, email, password));
        }
    }

    const validEmail =(value)=>{
        if (value !== "undefined") {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
          
            if (pattern.test(value)) {
          
              setEmail(value);
          
            }
          
          }
    }

    return <div className="form">
        <form onSubmit={submitHandler}>
            <ul className="form-container">
                <li>
                    <h2>
                        Εγγραφή νέου μέλους
                    </h2>
                </li>
                <li>
                    {loading && <div>Loading...</div>}
                    {error && <div>{registerFailmessage}</div>}
                </li>
                <li>
                    <input type="text" name="name" id="name" placeholder="όνομα" required
                     onChange={(e)=> setName(e.target.value)}>
                    </input>
                </li>
                <li>
                    <input type="email" name="email" id="email" placeholder="email" required
                     onChange={(e)=> validEmail(e.target.value)}>
                    </input>
                </li>
                <li>                    
                    <input type="password" name="password" id="password" placeholder="κωδικός" required
                     onChange={(e)=> setPassword(e.target.value)}>
                    </input>                                        
                </li>
                <li>
                    <input type="password" name="re-password" id="re-password" placeholder="Επιβεβαίωση κωδικού" required
                     onChange={(e)=> setRePassword(e.target.value)}>
                    </input>
                </li>
                <li>
                    <input type="submit" className="button" value="Εγγραφή"></input>
                </li>
                <li>
                    <label>
                        Έχετε ήδη λογαριασμό στο GrandMobile;
                    </label>
                    <Link to="/signin">
                        Είσοδος
                    </Link>
                </li>
            </ul>
        </form>
    </div>
}

export default RegisterScreen;