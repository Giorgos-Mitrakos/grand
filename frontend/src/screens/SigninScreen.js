import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signin } from '../action/userActions';
import './SigninScreen.css';
import { getCart } from '../action/cartActions';
import { Helmet } from 'react-helmet';


function SigninScreen(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userSignin = useSelector(state => state.userSignin);
    const { loading, userInfo, error, signInFailMessage } = userSignin;
    const dispatch = useDispatch();
    const redirect = props.location.search ? props.location.search.split("=")[1] : "/";

    useEffect(() => {
        if (userInfo) {
            dispatch(getCart(userInfo.email));
            props.history.push("/");
        }
        return () => {

        }
    }, [userInfo, dispatch, props.history]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
    }

    const validEmail = (value) => {
        if (value !== "undefined") {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

            if (pattern.test(value)) {

                setEmail(value);

            }

        }
    }

    return <div className="form">
        <Helmet>
            <title>Grand Mobile Accessories-Σύνδεση</title>
            <meta name="description" content="Κάντε σύνδεση στην ιστοσελίδα μας για να μπορείτε να παρακολουθείτε την πορεία της παραγγελίας σας και για το ιστορικό των αγορών σας" />
            <meta name="keywords" content="Signin, login, σύνδεση, παρακολούθηση, ιστορικό, history " />
        </Helmet>
        <form onSubmit={submitHandler}>
            <ul className="form-container">
                <li>
                    <h2>
                        Σύνδεση
                    </h2>
                </li>
                <li>
                    {loading && <div>Loading...</div>}
                    {error && <div>{signInFailMessage}</div>}
                </li>
                <li>
                    <input type="email" name="email" id="email" placeholder="email" required
                        onChange={(e) => validEmail(e.target.value)}>
                    </input>
                </li>
                <li>
                    <input type="password" name="password" id="password" placeholder="password" required
                        onChange={(e) => setPassword(e.target.value)}>
                    </input>
                </li>
                <li>
                    <input type="submit" className="button" value="Είσοδος"></input>
                </li>
                <li>
                    <Link to="/forgottenpassword">
                        Ξέχασα τον Κωδικό μου
                    </Link>
                </li>
                <li>
                    <label>
                        Δεν έχεις λογαριασμό στο GrandMobile;
                    </label>
                </li>
                <li>
                    <Link to={redirect === "/" ? "register" : "register?redirect=" + redirect}>
                        Δημιούργησε το Grand λογαριασμό σου εδώ!
                    </Link>
                </li>
            </ul>
        </form>
    </div>
}

export default SigninScreen;