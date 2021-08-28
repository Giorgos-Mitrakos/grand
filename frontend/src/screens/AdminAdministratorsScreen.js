import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner.js';
import './AdminAdministratorsScreen.css';
import ReactTooltip from 'react-tooltip';
import { deleteAdmin, insertAdmin, listAdmins } from '../action/userActions.js';

function AdminAdministratorsScreen(props) {

    const [newAdminUsername, setNewAdminUsername] = useState("");
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");
    const adminsList = useSelector(state => state.adminsList);
    const { admins, loading, error } = adminsList;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listAdmins());
        return () => {

        }
    }, []);

    const insertNewAdminHandler = () => {
        dispatch(insertAdmin(newAdminUsername, newAdminEmail, newAdminPassword));
    }

    const removeAdminbHandler = (email) => {
        dispatch(deleteAdmin(email));
    }

    const validEmail = (value) => {
        if (value !== "undefined") {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

            if (pattern.test(value)) {
                setNewAdminEmail(value);
            }
        }
    }

    return (
        <div>
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Διαχειριστές</li>
                </ul>
            </div>
            <div className="color-wrapper">
                <div className="card-list-header">
                    <h4 className="expand">Διαχειριστές</h4>
                </div>
                <div className="admin-info">
                    <div className="add_new_admin">
                        <div>
                            <label className="header-label">username: </label>
                            <input type="text" value={newAdminUsername} required onChange={(e) => setNewAdminUsername(e.target.value)} />
                        </div>
                        <div>
                            <label className="header-label">email: </label>
                            <input type="text" required onChange={(e) => validEmail(e.target.value)} />
                        </div>
                        <div>
                            <label className="header-label">password: </label>
                            <input type="text" value={newAdminPassword} required onChange={(e) => setNewAdminPassword(e.target.value)} />
                        </div>
                        <button className="button continuebtn" onClick={insertNewAdminHandler} disabled={newAdminUsername === "" || newAdminPassword === "" || newAdminEmail === ""}>Προσθήκη Διαχειριστή</button>
                    </div>
                    <div className="admins_table">
                        <h3>Διαχειριστές</h3>
                        <div className="auto-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Ενέργεια</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? <div><LoadingSpinner /></div> :
                                        error ? <div>{error}</div> :
                                            admins &&
                                            admins.map(admin =>
                                                <tr key={admin.email}>
                                                    <td>{admin.username}</td>
                                                    <td>{admin.email}</td>
                                                    <td>
                                                        <button className="button radio-edit-button" onClick={() => removeAdminbHandler(admin.email)}>
                                                            <span class="material-icons" data-tip data-for="delete_administrator">
                                                                delete
                                                            </span>
                                                        </button>
                                                        <ReactTooltip backgroundColor="#deccf0" textColor="#312f8b" id="delete_administrator" place="top" effect="solid">
                                                            Διαγραφή
                                                        </ReactTooltip>
                                                    </td>
                                                </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AdminAdministratorsScreen;