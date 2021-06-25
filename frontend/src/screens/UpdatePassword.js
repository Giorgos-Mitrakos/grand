import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { sendUpdatePassConfirm, updatePass } from '../action/emailActions';
import { Helmet } from 'react-helmet';
import './UpdatePassword.css'

function UpdatePassword(props) {

    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { email, token } = useParams();
    const updatePassword = useSelector(state => state.updatePassword);
    const { successUpdate, error: updatePassError } = updatePassword;
    const dispatch = useDispatch();


    useEffect(() => {
        if (successUpdate === true)
            dispatch(sendUpdatePassConfirm(email));

    }, [successUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Έλεγξτε τον κωδικο");
        }
        else {
            dispatch(updatePass(email, token, newPassword));
        }

    }

    return (
        <div className="reset-form">
            <Helmet>
                <title>Grand Mobile Accessories-Αλλαγή Κωδικού</title>
                <meta name="description" content="Ξεχάσατε τον κωδικό σας; Επαναφέρετε των κωδικό σας έυκολα δημιουργόντας καινούργιο." />
                <meta name="keywords" content="Κωδικός, password, new, νέος, reset, επαναφορά " />
            </Helmet>
            <div className="reset-form-container">
                <h3>Αλλαγή Κωδικού</h3>
                {successUpdate === true ? (
                    <div className="reset-password-form-sent-wrapper">
                        <p>
                            Ο κωδικός σας έχει αλλαχθεί.
                        </p>
                        <Link to="/signin" className="ghost-btn">
                            Είσοδος
                        </Link>
                    </div>
                ) :
                    successUpdate === false ? (
                        <div className="reset-password-form-sent-wrapper">
                            <p>
                                {updatePassError}
                            </p>
                        </div>
                    )
                        : (
                            <div className="reset-password-form-wrapper">
                                <form onSubmit={submitHandler}>
                                    <input type="password"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        value={newPassword}
                                        placeholder="Νέος Κωδικός"
                                    />
                                    <input type="password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}
                                        placeholder="Επιβεβαίωση Κωδικός"
                                    />
                                    <input type="submit" className="button" value="Αλλαγή Κωδικού"></input>

                                </form>
                            </div>
                        )}
            </div>
        </div>
    )
}

export default UpdatePassword;