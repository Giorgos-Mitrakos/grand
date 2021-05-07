import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyAccountScreen.css';
import { useSelector, useDispatch } from 'react-redux';
import { saveAccountInfo, passwordChange, accountInfo, deleteAccount, signout } from '../action/userActions';
import { sendAccountDeleteEmail } from '../action/emailActions';
import { Helmet } from 'react-helmet';

function MyaccountScreen(props){

    const emailAccountDeleteConfirmation = useSelector(state=>state.emailAccountDeleteConfirmation);
    const {successSending} = emailAccountDeleteConfirmation;
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo,successDeleting} = userSignin;
    const userAccountInfo = useSelector(state=>state.userAccountInfo);
    const {success: successSave} = userAccountInfo;
    const userAccountAddress= useSelector(state=>state.userAccountAddress);
    const {userAddressInfo} = userAccountAddress;
    const userPasswordChange = useSelector(state=>state.userPasswordChange);
    const {message: changePasswordMessage} = userPasswordChange;
    const dispatch = useDispatch();
    const [accountInfoModal,setAccountInfoModal] = useState(false);
    const [passwordChangeModal,setPasswordChangeModal] = useState(false);
    const [addressInfoModal,setAddressInfoModal] = useState(false);
    const [deleteUserModal,setDeleteUserModal] = useState(false);
    const [name,setName] = useState();
    const [subname,setSubname] = useState();
    const [email,setEmail] = useState();
    const [phoneNumber,setPhoneNumber] = useState();
    const [password,setPassword] = useState();
    const [newPassword,setNewPassword] = useState();
    const [country,setCountry] = useState();
    const [district,setDistrict] = useState();
    const [city,setCity] = useState();
    const [address,setAddress] = useState();
    const [postalCode,setPostalCode] = useState();


    useEffect(()=>{        
        if(userInfo===null){
            props.history.push("/");
        }
                
    },[userInfo,props.history]);

    useEffect(()=>{        
        if(userInfo)
        {            
            dispatch(accountInfo(userInfo.email));
            setEmail(userInfo.email);
        }        
    },[userInfo,dispatch]);

    useEffect(()=>{        
        if(userAddressInfo)
        {
            setName(userAddressInfo.name);
            setSubname(userAddressInfo.subname);            
            setPhoneNumber(userAddressInfo.phoneNumber);
            setCountry(userAddressInfo.country);
            setDistrict(userAddressInfo.district);
            setCity(userAddressInfo.city);
            setAddress(userAddressInfo.address);
            setPostalCode(userAddressInfo.postalCode);
        }
    },[userAddressInfo]);

    useEffect(()=>{        
        if(successDeleting===true)
        {            
            dispatch(sendAccountDeleteEmail(email))
        }
        else if(successDeleting===false)
        {
            alert("Δεν υπάρχει λογαριασμός με αυτό το email!\nΠαρακαλούμε να επαναλάβετε τη διαδικασία διαγραφής ή επικοινωνίστε μαζί μας ώστε να προβούμε στις απαραίτητες ενέργειες\nΣυγνώμη για την αναστάτωση.")
        }
    },[successDeleting]);

    useEffect(()=>{
        if(successSending)
        {
            alert("Η διαγραφή του λογαριασμού σας ολοκληρώθηκε επιτυχώς .\nΣας έχει σταλεί email επιβεβαίωσης.Παρακαλώ ελέγξτε τα εισερχόμενα σας.\nΣε περίπτωση που δεν βλέπετε το μήνημα ελέγξτε το φάκελο της ανεπιθύμητης αλληλογραφίας.")
            dispatch(signout());
            props.history.push("/");
            window.location.reload(false);
        }
        
        return ()=>{
    
        }
    },[successSending]);


    const accountInfoModalHandler = () =>
    {
        setAccountInfoModal(!accountInfoModal);
    }

    const passwordChangeHandler = () =>
    {
        setPasswordChangeModal(!passwordChangeModal);
    }

    const addressInfoModalHandler = () =>
    {
        setAddressInfoModal(!addressInfoModal);
    }

    const deleteUserModalHandler = () =>{
        setDeleteUserModal(!deleteUserModal);
    }

    const accountFormSubmitHandler = (e)=>{
        e.preventDefault();
        dispatch(saveAccountInfo(name, subname, phoneNumber, email, country, district,
             city,address,postalCode));
    }

    const passwordChangeFormSubmitHandler = (e)=>{
        e.preventDefault();
        dispatch(passwordChange(email,password,newPassword));
        setPassword("");
        setNewPassword("");
    }

    const deleteAccountFormSubmitHandler = (e)=>{
        e.preventDefault();
        dispatch(deleteAccount(email));
    }
    

    return(
        <div>
            <Helmet>
                <title>Grand Mobile Accessories-Ο Λογαριασμός μου</title>
                <meta name="description" content="Δημιούργησε λογαριασμό στο grandmobile.gr μείνε ενημερωμένος και επωφελήσου από τις προσφορές." />
                <meta name="keywords" content="Λογαριασμός, account, user, χρήστης." />
            </Helmet>
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Ο Λογαριασμός μου</li>
                </ul>
            </div>
            <div className="my-account-wrapper">
                <div className="card-header"  onClick={accountInfoModalHandler}>
                    <h4 className="expand">Προσωπικές Πληροφορίες</h4>
                    <i className="material-icons expand">{!accountInfoModal?"expand_more":"expand_less"}</i>
                </div>
                {accountInfoModal &&
                <div className="account-info">
                    {successSave && <div className="accountInfoMessage">Οι αλλαγές αποθηκεύτηκαν</div>}
                    <form id="accountForm" onSubmit={accountFormSubmitHandler}>
                        <ul>                            
                            <li>
                                <div className="column-display">
                                    <label>Όνομα</label>
                                    <input type="text" value={name} placeholder="Όνομα*"
                                    onChange={(e)=> setName(e.target.value)}/>
                                </div>                                                                
                            </li>
                            <li>                                
                                <div className="column-display">
                                    <label>Επίθετο</label>
                                    <input type="text" value={subname} placeholder="Επίθετο*"
                                    onChange={(e)=> setSubname(e.target.value)}/>
                                </div>
                            </li>
                            <li>
                                <div className="column-display">
                                    <label>Email</label>
                                    <input type="text" value={email} placeholder="Email*"
                                    onChange={(e)=> setEmail(e.target.value)} disabled/>
                                </div>
                            </li>
                            <li>
                                <div className="column-display">
                                    <label>Τηλέφωνο</label>
                                    <input type="tel" value={phoneNumber} placeholder="Τηλέφωνο*" maxLength="10"
                                    onChange={(e)=> setPhoneNumber(e.target.value)}/>
                                </div>
                            </li>
                            <li>
                                <input type="submit" className= "proceed-checkout-btn" value="Αποθήκευση"/>
                            </li>
                        </ul>
                    </form>
                </div>
                }
            </div>                
            <div className="my-account-wrapper">
                <div className="card-header" onClick={passwordChangeHandler}>
                    <h4 className="expand">Αλλαγή password</h4>
                    <i className="material-icons expand">{!passwordChangeModal?"expand_more":"expand_less"}</i>
                </div>
                {passwordChangeModal &&
                <div className="password-change">
                    {changePasswordMessage && <div className="accountInfoMessage">{changePasswordMessage}</div>}
                    <form id="passwordChangeForm" onSubmit={passwordChangeFormSubmitHandler}>
                        <ul>
                            <li>
                                <div className="column-display">
                                    <label>Password</label>
                                    <input type="password" value={password} placeholder="password*"
                                    onChange={(e)=> setPassword(e.target.value)}/>
                                </div>                                                                
                            </li>
                            <li>
                                <div className="column-display">
                                    <label>Νέο Password</label>
                                    <input type="password" value={newPassword} placeholder="Νέο Password*"
                                    onChange={(e)=> setNewPassword(e.target.value)}/>
                                </div>
                            </li>
                            <li>
                                <input type="submit" className= "proceed-checkout-btn" value="Αλλαγή Password"/>
                            </li>
                        </ul>
                    </form>
                </div>
                }
            </div>
            <div className="my-account-wrapper">
                <div className="card-header" onClick={addressInfoModalHandler}>
                    <h4 className="expand">Επεξεργασία Διεύθυνσης</h4>
                    <i className="material-icons expand">{!addressInfoModal?"expand_more":"expand_less"}</i>
                </div>
                {addressInfoModal &&
                <div className="address-info">
                    {successSave && <div className="accountInfoMessage">Οι αλλαγές αποθηκεύτηκαν</div>}
                    <form id="addressForm" onSubmit={accountFormSubmitHandler}>
                        <ul>
                            <li>
                                <div className="column-display">
                                    <label>Χώρα</label>
                                    <input type="text" value={country} placeholder="Χώρα*"
                                    onChange={(e)=> setCountry(e.target.value)}/>
                                </div>
                                <div className="column-display">
                                    <label>Νομός</label>
                                    <input type="text" value={district} placeholder="Νομός*"
                                    onChange={(e)=> setDistrict(e.target.value)}/>
                                </div>
                                <div className="column-display">
                                    <label>Πόλη</label>
                                    <input type="text" value={city} placeholder="Πόλη*"
                                    onChange={(e)=> setCity(e.target.value)}/>
                                </div>
                            </li>
                            <li>
                                <div className="column-display address">
                                    <label>Διεύθυνση</label>
                                    <input type="text" value={address} placeholder="Διεύθυνση*"
                                    onChange={(e)=> setAddress(e.target.value)}/>
                                </div>
                                <div className="column-display">
                                    <label>Τ.Κ</label>
                                    <input type="text" value={postalCode} placeholder="Τ.Κ*"
                                    onChange={(e)=> setPostalCode(e.target.value)}/>
                                </div>
                            </li>
                            <li>
                                <input type="submit" className= "proceed-checkout-btn" value="Αποθήκευση"/>
                            </li>
                        </ul>
                    </form>
                </div>
                }
            </div>
            <div className="my-account-wrapper">
                <div className="card-header" onClick={deleteUserModalHandler}>
                    <h4 className="expand">Διαγραφή Λογαριασμού</h4>
                    <i className="material-icons expand">{!deleteUserModal?"expand_more":"expand_less"}</i>
                </div>
                {deleteUserModal &&
                <div className="address-info">
                     <form id="addressForm" onSubmit={deleteAccountFormSubmitHandler}>
                        <ul>
                            <li>
                                <h4>Θέλετε να διαγράψετε το λογαριασμό σας;</h4>
                            </li>
                            <li>
                                <div style={{alignSelf:"center"}}>Το email σας είναι : <strong>{email}</strong></div>
                                <input type="submit" className= "proceed-checkout-btn" value="Διαγραφή Λογαριασμού"/>
                            </li>
                        </ul>
                    </form>
                </div>
                }
            </div>
        
        </div>
    )

}

export default MyaccountScreen;