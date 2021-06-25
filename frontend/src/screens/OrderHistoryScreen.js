import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner.js';
import './OrderHistoryScreen.css';
import { getProductHistory } from '../action/productActions.js';
import { getOrderHistory } from '../action/orderActions.js';

function OrderHistoryScreen(props) {

    const orderHistory = useSelector(state => state.orderHistory);
    const { orderStatusHistory, billingAddressHistory, orderSendingPaymentHistory, shippingAddressHistory, orderProductHistory, loading, error } = orderHistory;
    const [οrderStatusModal, setOrderStatusModal] = useState(false);
    const [οrderSendingPaymentModal, setOrderSendingPaymentModal] = useState(false);
    const [οrderBillingAddressModal, setOrderBillingAddressModal] = useState(false);
    const [οrderShippingAddressModal, setOrderShippingAddressModal] = useState(false);
    const [οrderProductModal, setOrderProductModal] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOrderHistory(props.match.params.id));
        return () => {

        }
    }, [props.match.params.id]);

    return (
        <div>
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Ιστορικό Παραγγελίας</li>
                </ul>
            </div>
            <div className="product_history_wrapper">
                <div className="product_history_header" onClick={() => setOrderStatusModal(!οrderStatusModal)}>
                    <h4 className="expand">Ιστορικό κατάστασης παραγγελίας</h4>
                    <i className="material-icons expand">{!οrderStatusModal ? "expand_more" : "expand_less"}</i>
                </div>
                {οrderStatusModal &&
                    (loading ? <div><LoadingSpinner /></div> :
                        error ? <div>{error}</div> :
                            <div className="product_history_table_wrapper">
                                <table >
                                    <thead>
                                        <tr>
                                            <th>Κατάσταση</th>
                                            <th>Επεξεργάστηκε από</th>
                                            <th>Επεξεργάστηκε Στις</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? <tr><td><LoadingSpinner /></td></tr> :
                                            error ? <tr><td><div>{error}</div></td></tr> :
                                                orderStatusHistory.map(ord => (
                                                    <tr>
                                                        <td>{ord.status}</td>
                                                        <td>{ord.UpdatedBy}</td>
                                                        <td>{ord.UpdatedAt && Intl.DateTimeFormat('en-GB', {
                                                            year: 'numeric', month: 'numeric', day: 'numeric',
                                                            hour: 'numeric', minute: 'numeric', second: 'numeric',
                                                            hour12: false
                                                        }).format(Date.parse(ord.UpdatedAt))}</td>
                                                    </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </div>)}
            </div>
            <div className="product_history_wrapper">
                <div className="product_history_header" onClick={() => setOrderSendingPaymentModal(!οrderSendingPaymentModal)}>
                    <h4 className="expand">Ιστορικό Αποστολής- Πληρωμής</h4>
                    <i className="material-icons expand">{!οrderSendingPaymentModal ? "expand_more" : "expand_less"}</i>
                </div>
                {οrderSendingPaymentModal &&
                    (loading ? <div><LoadingSpinner /></div> :
                        error ? <div>{error}</div> :
                            <div className="product_history_table_wrapper">
                                <table >
                                    <thead>
                                        <tr>
                                            <th>Τρόπος Αποστολής</th>
                                            <th>Τρόπος Πληρωμής</th>
                                            <th>Κατάσταση</th>
                                            <th>Επεξεργάστηκε από</th>
                                            <th>Επεξεργάστηκε Στις</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? <tr><td><LoadingSpinner /></td></tr> :
                                            error ? <tr><td><div>{error}</div></td></tr> :
                                                orderSendingPaymentHistory.map(ord => (
                                                    <tr>
                                                        <td>{ord.sendingMethod}</td>
                                                        <td>{ord.paymentMethod}</td>
                                                        <td>{ord.paymentType}</td>
                                                        <td>{ord.UpdatedBy}</td>
                                                        <td>{Intl.DateTimeFormat('en-GB', {
                                                            year: 'numeric', month: 'numeric', day: 'numeric',
                                                            hour: 'numeric', minute: 'numeric', second: 'numeric',
                                                            hour12: false
                                                        }).format(Date.parse(ord.UpdatedAt))}</td>
                                                    </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </div>)}
            </div>
            <div className="product_history_wrapper">
                <div className="product_history_header" onClick={() => setOrderBillingAddressModal(!οrderBillingAddressModal)}>
                    <h4 className="expand">Ιστορικό στοιχείων πελάτη</h4>
                    <i className="material-icons expand">{!οrderBillingAddressModal ? "expand_more" : "expand_less"}</i>
                </div>
                {οrderBillingAddressModal &&
                    (loading ? <div><LoadingSpinner /></div> :
                        error ? <div>{error}</div> :
                            <div className="product_history_table_wrapper">
                                <div className="product_history_table_headers">
                                    <div><label>Επεξεργάστηκε από</label></div>
                                    <div><label>Επεξεργάστηκε Στις</label></div>
                                    <div><label>Επωνυμία</label></div>
                                    <div><label>Επάγγελμα</label></div>
                                    <div><label>Α.Φ.Μ</label></div>
                                    <div><label>Δ.Ο.Υ</label></div>
                                    <div><label>Όνομα</label></div>
                                    <div><label>Επώνυμο</label></div>
                                    <div><label>Χώρα</label></div>
                                    <div><label>Νομός</label></div>
                                    <div><label>Πόλη</label></div>
                                    <div><label>Οδός</label></div>
                                    <div><label>Τ.Κ</label></div>
                                    <div><label>Τηλέφωνο</label></div>
                                    <div id="comments_scroll"><label>Σχόλια</label></div>
                                </div>
                                <div className="horizontal_scroll">
                                {billingAddressHistory.map(ord => (
                                    <div key={ord.ID} className="product_history_table">
                                        <div>{ord.UpdatedBy}</div>
                                        <div>{ord.UpdatedAt && Intl.DateTimeFormat('en-GB', {
                                            year: 'numeric', month: 'numeric', day: 'numeric',
                                            hour: 'numeric', minute: 'numeric', second: 'numeric',
                                            hour12: false
                                        }).format(Date.parse(ord.UpdatedAt))}</div>
                                        <div>{ord.companyName}</div>
                                        <div>{ord.bussiness}</div>
                                        <div>{ord.afm}</div>
                                        <div>{ord.doy}</div>
                                        <div>{ord.name}</div>
                                        <div>{ord.subname}</div>
                                        <div>{ord.country}</div>
                                        <div>{ord.district}</div>
                                        <div>{ord.city}</div>
                                        <div>{ord.street}</div>
                                        <div>{ord.postalCode}</div>
                                        <div>{ord.phoneNumber}</div>
                                        <div id="comments_scroll">{ord.comments}</div>
                                    </div>
                                ))}</div>
                            </div>)}
            </div>
            <div className="product_history_wrapper">
                <div className="product_history_header" onClick={() => setOrderShippingAddressModal(!οrderShippingAddressModal)}>
                    <h4 className="expand">Ιστορικό στοιχείων παράδοσης</h4>
                    <i className="material-icons expand">{!οrderShippingAddressModal ? "expand_more" : "expand_less"}</i>
                </div>
                {οrderShippingAddressModal &&
                    (loading ? <div><LoadingSpinner /></div> :
                        error ? <div>{error}</div> :
                            <div className="product_history_table_wrapper">
                                <div className="product_history_table_headers">
                                    <div><label>Επεξεργάστηκε από</label></div>
                                    <div><label>Επεξεργάστηκε Στις</label></div>
                                    <div><label>Όνομα</label></div>
                                    <div><label>Επώνυμο</label></div>
                                    <div><label>Χώρα</label></div>
                                    <div><label>Νομός</label></div>
                                    <div><label>Πόλη</label></div>
                                    <div><label>Οδός</label></div>
                                    <div><label>Τ.Κ</label></div>
                                    <div><label>Τηλέφωνο</label></div>
                                </div>
                                <div className="horizontal_scroll">
                                {shippingAddressHistory.map(ord => (
                                    <div key={ord.ID} className="product_history_table">
                                        <div>{ord.UpdatedBy}</div>
                                        <div>{ord.UpdatedAt && Intl.DateTimeFormat('en-GB', {
                                            year: 'numeric', month: 'numeric', day: 'numeric',
                                            hour: 'numeric', minute: 'numeric', second: 'numeric',
                                            hour12: false
                                        }).format(Date.parse(ord.UpdatedAt))}</div>
                                        <div>{ord.name}</div>
                                        <div>{ord.subname}</div>
                                        <div>{ord.country}</div>
                                        <div>{ord.district}</div>
                                        <div>{ord.city}</div>
                                        <div>{ord.street}</div>
                                        <div>{ord.postalCode}</div>
                                        <div>{ord.phoneNumber}</div>
                                    </div>
                                ))}</div>
                            </div>)}
            </div>
            <div className="product_history_wrapper">
                <div className="product_history_header" onClick={() => setOrderProductModal(!οrderProductModal)}>
                    <h4 className="expand">Ιστορικό παραγγελίας</h4>
                    <i className="material-icons expand">{!οrderProductModal ? "expand_more" : "expand_less"}</i>
                </div>
                {οrderProductModal &&
                    (loading ? <div><LoadingSpinner /></div> :
                        error ? <div>{error}</div> :
                            <div className="product_history_table_wrapper">
                                <table >
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Κωδ. Προϊόντος</th>
                                            <th>Προϊόν</th>
                                            <th>Κατηγορία</th>
                                            <th>Μοντέλο</th>
                                            <th>Ποσότητα</th>
                                            <th>Επεξεργάστηκε από</th>
                                            <th>Επεξεργάστηκε Στις</th>
                                            <th>Ενέργεια</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? <tr><td><LoadingSpinner /></td></tr> :
                                            error ? <tr><td><div>{error}</div></td></tr> :
                                                orderProductHistory.map(ord => (
                                                    <tr>
                                                        {ord.category !== "Φτιάξε τη Θήκη σου" ?
                                                        <td><img className="admin-product-image" src={ord.image} alt={props.alt} /></td>:
                                                        <td><img className="order-image-img" src={ord.image_case} alt="Φτιάξε τη θήκη σου" /></td>}
                                                        <td>{ord.product_id}</td>
                                                        <td>{ord.name}</td>
                                                        <td>{ord.category}</td>
                                                        {ord.category !== "Φτιάξε τη Θήκη σου" ?
                                                        <td></td>:
                                                        <td>{ord.model}</td>}
                                                        <td>{ord.quantity}</td>
                                                        <td>{ord.UpdatedBy}</td>
                                                        <td>{ord.UpdatedAt && Intl.DateTimeFormat('en-GB', {
                                                            year: 'numeric', month: 'numeric', day: 'numeric',
                                                            hour: 'numeric', minute: 'numeric', second: 'numeric',
                                                            hour12: false
                                                        }).format(Date.parse(ord.UpdatedAt))}</td>
                                                        <td>{ord.actions}</td>
                                                    </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </div>)}
            </div>

        </div >
    )
}

export default OrderHistoryScreen;