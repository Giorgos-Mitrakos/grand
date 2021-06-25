import React, { Fragment, useEffect } from 'react';
import './AdminOrderDetails.css';
import { detailsCustomerOrder } from '../action/orderActions';
import { useSelector, useDispatch } from 'react-redux';

function CustomerOrderDetails(props) {
    const customerOrderDetails = useSelector(state => state.customerOrderDetails);
    const { loading, order, error, charger, shippingTo, products } = customerOrderDetails;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(detailsCustomerOrder(props.match.params.id));
        return () => {
            //
        };
    }, [props.match.params.id, dispatch]);


    const convertDate = (x) => {
        const options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        }
        const dateTimeFormat = new Intl.DateTimeFormat('en-GB', options);
        var date = Date.parse(x);
        return dateTimeFormat.format(date);
    }


    return (
        <div>
            {loading ? <div>loading...</div> :
                error ? <div>{error.message}</div> :
                    (
                        <div className="order_details-wrapper">
                            <div className="order_details">
                                <div>
                                    <ul>
                                        <li>
                                            <label>Αρ. παραγγελίας:</label>
                                            <div>{order.order_id}</div>
                                        </li>
                                        <li>
                                            <label>Email Πελάτη:</label>
                                            <div>{order.user_email}</div>
                                        </li>
                                        <li>
                                            <label>Τρόπος Παράδοσης:</label>
                                            <div>{order.sendingMethod}</div>
                                        </li>
                                        <li>
                                            <label>Τρόπος Πληρωμής:</label>
                                            <div>{order.paymentMethod}</div>
                                        </li>
                                        <li>
                                            <label>Παραστατικό:</label>
                                            <div>{order.paymentType}</div>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <ul>
                                        <li>
                                            <label>Ημ. παραγγελίας:</label>
                                            <div>
                                                {order.orderDate && convertDate(order.orderDate)}
                                            </div>
                                        </li>
                                        <li>
                                            <label>Ημ. επεξεργασίας:</label>
                                            <div>
                                                {order.proccessDate && convertDate(order.proccessDate)}
                                            </div>
                                        </li>
                                        <li>
                                            <label>Ημ. Αποστολής:</label>
                                            <div>
                                                {order.shippingDate && convertDate(order.shippingDate)}
                                            </div>
                                        </li>
                                        <li>
                                            <label>Ημ. Διαγραφής:</label>
                                            <div>
                                                {order.deletedDate && convertDate(order.deletedDate)}
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <ul>
                                        <li>
                                            <label>Κόστος Προιόντων:</label>
                                            <div>{order.itemsPrice} €</div>
                                        </li>
                                        {order.sendingMethod && <li>
                                            <label>Μεταφορικά:</label>
                                            <div>{order.shippingPrice} €</div>
                                        </li>}
                                        {order.paymentMethod && <li>
                                            <label>{order.paymentMethod}:</label>
                                            <div>{order.paymentMethodPrice} €</div>
                                        </li>}
                                        <li>
                                            <label>Σύνολο παραγγελίας:</label>
                                            <div>{order.totalPrice} €</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="charger-shipping-order">
                                <div className="charge-details">
                                    <h3>Στοιχεία Πελάτη</h3>
                                    <ul className="charge-details-unordered-list">
                                        {order.paymentType === 'Τιμολόγιο' &&
                                            <Fragment>
                                                <li>
                                                    <label>Επωνυμία :</label>
                                                    <div>{charger.companyName}</div>
                                                </li>
                                                <li>
                                                    <label>Επάγγελμα:</label>
                                                    <div>{charger.bussiness}</div>
                                                </li>
                                                <li>
                                                    <label> Α.Φ.Μ.:</label>
                                                    <div>{charger.afm}</div>
                                                </li>
                                                <li>
                                                    <label> Δ.Ο.Υ.:</label>
                                                    <div>{charger.doy}</div>
                                                </li>
                                            </Fragment>}
                                        {order.paymentType === 'Απόδειξη' &&
                                            <Fragment>
                                                <li>
                                                    <label>Όνομα :</label>
                                                    <div>{charger.name}</div>
                                                </li>
                                                <li>
                                                    <label>Επίθετο :</label>
                                                    <div>{charger.subname}</div>
                                                </li>
                                            </Fragment>}
                                        <li>
                                            <label>Χώρα :</label>
                                            <div>{charger.country}</div>
                                        </li>
                                        <li>
                                            <label>Νομός :</label>
                                            <div>{charger.district}</div>
                                        </li>
                                        <li>
                                            <label>Πόλη :</label>
                                            <div>{charger.city}</div>
                                        </li>
                                        <li>
                                            <label>Διεύθυνση :</label>
                                            <div>{charger.street}</div>
                                        </li>
                                        <li>
                                            <label>Τ.Κ. :</label>
                                            <div>{charger.postalCode}</div>
                                        </li>
                                        <li>
                                            <label>Τηλέφωνο :</label>
                                            <div>{charger.phoneNumber}</div>
                                        </li>
                                        <li>
                                            <label>Email :</label>
                                            <div>{charger.user_email}</div>
                                        </li>
                                        <li>
                                            <label>Σημειώσεις Πελάτη :</label>
                                            <div>{order.comments}</div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shipping-details">
                                    <h3>Στοιχεία Παράδοσης</h3>
                                    <ul>
                                        {shippingTo &&
                                            <Fragment>
                                                <li>
                                                    <label>Όνομα :</label>
                                                    <div>{shippingTo.name}</div>
                                                </li>
                                                <li>
                                                    <label>Επίθετο :</label>
                                                    <div>{shippingTo.subname}</div>
                                                </li>
                                                <li>
                                                    <label>Χώρα :</label>
                                                    <div>{shippingTo.country}</div>
                                                </li>
                                                <li>
                                                    <label>Νομός :</label>
                                                    <div>{shippingTo.district}</div>
                                                </li>
                                                <li>
                                                    <label>Πόλη :</label>
                                                    <div>{shippingTo.city}</div>
                                                </li>
                                                <li>
                                                    <label>Διεύθυνση :</label>
                                                    <div>{shippingTo.street}</div>
                                                </li>
                                                <li>
                                                    <label>Τ.Κ. :</label>
                                                    <div>{shippingTo.postalCode}</div>
                                                </li>
                                            </Fragment>}
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <div className="order-list-details">
                                    <h3>Παραγγελία</h3>
                                    <ul className="order-list-details-container">
                                        <li id="order-list-header" className="order-list-header">
                                            <div className="photo-row">Φώτο</div>
                                            <div className="order-row">Κωδ.</div>
                                            <div className="product-row">Προϊόν</div>
                                            <div className="order-row">Κατηγορία</div>
                                            <div className="order-row">Μοντέλο</div>
                                            <div className="order-row">Ποσότητα</div>
                                            <div className="order-row">Σύνολο</div>
                                        </li>
                                        {products.map(item =>
                                            <li className="my-order-item" key={item._id + item.model}>
                                                <div className="order-image photo-row flex-column">
                                                    {item.category !== "Φτιάξε τη Θήκη σου" ?
                                                        <img className="order-image-img" src={item.image} alt="product" /> :
                                                        <img className="order-image-img" src={item.image_case} alt="Φτιάξε τη θήκη σου" />
                                                    }
                                                </div>
                                                <div className="order-row">
                                                    {item._id}
                                                </div>
                                                <div className="order-name-model product-row">
                                                    <div className="order-name">
                                                        {item.name}
                                                    </div>
                                                </div>
                                                <div className="order-row">
                                                    {item.category}
                                                </div>
                                                {item.category === "Συλλογή" || item.category === "Φτιάξε τη Θήκη σου" ?
                                                    <div className="order-model order-row">
                                                        {item.model}
                                                    </div> :
                                                    <div className="order-row">

                                                    </div>}
                                                <div className="order-name order-row">
                                                    {item.quantity}
                                                </div>
                                                <div className="order-total-price order-row">
                                                    {(item.totalPrice * item.quantity).toFixed(2)} €
                                                </div>
                                            </li>)}
                                        </ul>
                                        <div className="admin-order-items-total-cost">
                                            <table className="admin-order-items-total-cost-table">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            Κόστος Προϊόντων ( {products.reduce((a, c) => a + Number(c.quantity), 0)} τεμ.) :
                                                    </td>
                                                        <td>
                                                            {products.reduce((a, c) => a + c.totalPrice * Number(c.quantity), 0).toFixed(2)} €
                                                    </td>
                                                    </tr>
                                                    {order.sendingMethod && <tr>
                                                        <td>
                                                            Κόστος Αποστολής :
                                                    </td>
                                                        <td>
                                                            {order.shippingPrice} €
                                                    </td>
                                                    </tr>}
                                                    {order.paymentMethod && <tr>
                                                        <td>
                                                            Κόστος Αποστολής :
                                                    </td>
                                                        <td>
                                                            {order.paymentMethodPrice} €
                                                    </td>
                                                    </tr>}
                                                    <tr>
                                                        <td>
                                                            <strong>Συνολικό Κόστος Παραγγελίας :</strong>
                                                        </td>
                                                        <td>
                                                            <strong>{order.totalPrice} €</strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    
                                </div>
                            </div>
                        </div>
                    )}
        </div>
    )
}

export default CustomerOrderDetails;