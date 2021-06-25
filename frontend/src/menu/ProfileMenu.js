import React, { Fragment, useEffect } from 'react';
import './ProfileMenu.css';
import {Link} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signout } from '../action/userActions';

function ProfileMenu(props){

    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    const dispatch = useDispatch();

    useEffect(()=>{
        
        return ()=>{

        }
    },[userInfo]);

    const signoutHandler = () =>{
        dispatch(signout(userInfo.email));
        window.location.reload(false);
    }

    return(
        <div className="profile-menu-containter">
            <ul>
            {userInfo?
            <Fragment>
                <div>Καλώσορισες,<br/> {userInfo.username}!</div>
            <li><button onClick={signoutHandler}>Έξοδος</button></li>
            </Fragment>
            :
            <Fragment>
            <li><Link to="/signin">Είσοδος</Link></li>            
            <li><Link to="/register">Εγγραφή</Link></li>
            </Fragment>
            
            }
            {userInfo && (userInfo.isAdmin===1 || userInfo.isAdmin===2) &&
            <Fragment>
            <li><Link to="/admin/orders">Παραγγελίες</Link></li>
            <li><Link to="/admin/createproduct">Προϊόντα</Link></li>
            <li><Link to="/admin/collection">Συλλογη</Link></li>
            <li><Link to="/admin/lists">Λίστες</Link></li>
            <li><Link to="/admin/newsletter">Newsletters</Link></li>
            </Fragment>}
            {userInfo && userInfo.isAdmin===2 &&
            <Fragment>
            <li><Link to="/admin/administrators">Διαχειριστές</Link></li>
            </Fragment>}
            {userInfo && userInfo.isAdmin===0 &&
            <Fragment>
            <li><Link to="/my-account">Ο Λογαριασμός μου</Link></li>
            <li><Link to="/wishlist">Λίστα αγαπημένων</Link></li>
            <li><Link to="/my-orders">Οι παραγγελίες μου</Link></li>
            </Fragment>
            } 
            </ul>                     
        </div>

    );
}

export default ProfileMenu;