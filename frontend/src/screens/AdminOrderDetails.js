import React, { Fragment, useEffect, useState } from 'react';
import './AdminOrderDetails.css';
import { detailsOrder, changeStatus, updateStatus, changeOrderDetails, updateChargerAddress, updateShippingToAddress, updateOrderQuantity, removeOrderItem } from '../action/orderActions';
import { useSelector, useDispatch } from 'react-redux';
import { sendEmailToConfirmOrder } from '../action/emailActions';
import { listPaymentMethods, listSendingMethods } from '../action/paymentActions';
import LoadingSpinner from '../components/LoadingSpinner';

function AdminOrdersDetailScreen(props) {

    const sendingMethodsList = useSelector(state => state.sendingMethodsList);
    const { sendingMethods, loading: loadingSendingMethods, error: errorSendingMethods } = sendingMethodsList;
    const paymentMethodsList = useSelector(state => state.paymentMethodsList);
    const { paymentMethods, loading: loadingPaymentMethods, error: errorPaymentMethods } = paymentMethodsList;
    const orderDetails = useSelector(state => state.orderDetails);
    const { loading, order, error, success, charger, shippingTo, products } = orderDetails;
    const updateOrderStatus = useSelector(state => state.updateOrderStatus);
    const { success: successUpdateStatus } = updateOrderStatus;
    const updateOrder = useSelector(state => state.updateOrder);
    const { success: successUpdate } = updateOrder;
    const deleteOrderItem = useSelector(state => state.deleteOrderItem);
    const { success: successDeleteOrderItem } = deleteOrderItem;
    const changeOrderStatus = useSelector(state => state.changeOrderStatus);
    const { successChangeStatus } = changeOrderStatus;
    const emailOrderCorfimation = useSelector(state => state.emailOrderCorfimation);
    const { successSending } = emailOrderCorfimation;
    const [orderStatus, setOrderStatus] = useState("");
    const [orderShippingPrice, setOrderShippingPrice] = useState(0);
    const [newΟrderStatus, setNewOrderStatus] = useState("");
    const [orderPaymentMethod, setOrderPaymentMethod] = useState("");
    const [orderPaymentMethodPrice, setOrderPaymentMethodPrice] = useState(0);
    const [orderPaymentType, setOrderPaymentType] = useState("");
    const [orderSendingMethod, setOrderSendingMethod] = useState("");
    const [chargerCompanyName, setChargerCompanyName] = useState("");
    const [chargerBussiness, setChargerBussiness] = useState("");
    const [chargerAfm, setChargerAfm] = useState("");
    const [chargerDoy, setChargerDoy] = useState("");
    const [chargerName, setChargerName] = useState("");
    const [chargerSubname, setChargerSubname] = useState("");
    const [chargerCountry, setChargerCountry] = useState("");
    const [chargerState, setChargerState] = useState("");
    const [chargerCity, setChargerCity] = useState("");
    const [chargerAddress, setChargerAddress] = useState("");
    const [chargerPostalCode, setChargerPostalCode] = useState("");
    const [chargerPhone, setChargerPhone] = useState("");
    const [chargerComments, setChargerComments] = useState("");
    const [shippingName, setShippingName] = useState("");
    const [shippingSubname, setShippingSubname] = useState("");
    const [shippingCountry, setShippingCountry] = useState("");
    const [shippingState, setShippingState] = useState("");
    const [shippingCity, setShippingCity] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [shippingPhone, setShippingPhone] = useState("");
    const [shippingPostalCode, setShippingPostalCode] = useState("");
    const [orderStatusModal, setOrderStatusModal] = useState(false);
    const [orderEditModal, setOrderEditModal] = useState(false);
    const [chargerAddressEditModal, setChargerAddressEditModal] = useState(false);
    const [shippingAddressEditModal, setShippingAddressEditModal] = useState(false);
    const [cartEditModal, setCartEditModal] = useState(false);
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(detailsOrder(props.match.params.id));
        window.scrollTo(0, 0)
        return () => {
            //
        };
    }, [props.match.params.id]);

    useEffect(() => {
        if (orderEditModal && order && order.length !== 0)
            dispatch(listSendingMethods());

    }, [orderEditModal]);
   
    useEffect(() => {
        if (sendingMethods && orderSendingMethod && sendingMethods.length !== 0) {
            const send = sendingMethods.find(x => x.sendingMethod === order.sendingMethod)
            dispatch(listPaymentMethods(send.sendingMethod_id));
        }

    }, [sendingMethods]);

    useEffect(() => {
        if (paymentMethods && paymentMethods.length !== 0)
            setOrderPaymentMethodPrice(paymentMethods[0].paymentMethodCost);

    }, [paymentMethods]);

    useEffect(() => {
        if (successUpdateStatus === true)
            dispatch(sendEmailToConfirmOrder(order.order_id));
        return () => {
            //
        };
    }, [successUpdateStatus]);

    useEffect(() => {
        if (successSending === true)
            dispatch(detailsOrder(props.match.params.id));
        return () => {
            //
        };
    }, [successSending]);

    useEffect(() => {
        if (successChangeStatus === true)
            dispatch(detailsOrder(props.match.params.id));
        return () => {
            //
        };
    }, [successChangeStatus]);

    useEffect(() => {
        if (successUpdate === true || successDeleteOrderItem===true)
            dispatch(detailsOrder(props.match.params.id));
        return () => {
            //
        };
    }, [successUpdate,successDeleteOrderItem]);

    useEffect(() => {
        if (success === true) {
            setOrderStatus(order.status);
            setNewOrderStatus(order.status);
            setOrderSendingMethod(order.sendingMethod);
            setOrderShippingPrice(order.shippingPrice);
            setOrderPaymentMethod(order.paymentMethod);
            setOrderPaymentMethodPrice(order.paymentMethodPrice);
            setOrderPaymentType(order.paymentType);
            setChargerCompanyName(charger.companyName);
            setChargerBussiness(charger.bussiness);
            setChargerAfm(charger.afm);
            setChargerDoy(charger.doy);
            setChargerName(charger.name);
            setChargerSubname(charger.subname);
            setChargerCountry(charger.country);
            setChargerState(charger.district);
            setChargerCity(charger.city);
            setChargerAddress(charger.street);
            setChargerPostalCode(charger.postalCode);
            setChargerPhone(charger.phoneNumber);
            setChargerComments(order.comments);
            if (shippingTo) {
                setShippingName(shippingTo.name);
                setShippingSubname(shippingTo.subname);
                setShippingCountry(shippingTo.country);
                setShippingState(shippingTo.district);
                setShippingCity(shippingTo.city);
                setShippingAddress(shippingTo.street);
                setShippingPostalCode(shippingTo.postalCode);
                setShippingPhone(shippingTo.phoneNumber);
            }
        }
        return () => {
            //
        };
    }, [success, order, charger, shippingTo]);

    useEffect(() => {
        if (charger) {
            setChargerCompanyName(charger.companyName);
            setChargerBussiness(charger.bussiness);
            setChargerAfm(charger.afm);
            setChargerDoy(charger.doy);
            setChargerName(charger.name);
            setChargerSubname(charger.subname);
            setChargerCountry(charger.country);
            setChargerState(charger.district);
            setChargerCity(charger.city);
            setChargerAddress(charger.street);
            setChargerPostalCode(charger.postalCode);
            setChargerPhone(charger.phoneNumber);
        }
        return () => {
            //
        };
    }, [success, charger]);

    useEffect(() => {
        if (shippingTo) {
            setShippingName(shippingTo.name);
            setShippingSubname(shippingTo.subname);
            setShippingCountry(shippingTo.country);
            setShippingState(shippingTo.district);
            setShippingCity(shippingTo.city);
            setShippingAddress(shippingTo.street);
            setShippingPostalCode(shippingTo.postalCode);
        }
        return () => {
            //
        };
    }, [success, shippingTo]);

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

    const changeStatusHandler = (newStatus) => {
        setNewOrderStatus(newStatus);
        var oldStatusIndex = orderStatusList.indexOf(orderStatus);
        var StatusIndex = orderStatusList.indexOf(newStatus);
        if (StatusIndex < oldStatusIndex) {
            setOrderStatusModal(true);
        }
        else {
            dispatch(updateStatus(order.order_id, newStatus, StatusIndex))
            setOrderStatus(newStatus);
        }
    }

    const okChargerAddressEditHandler = () => {
        var charger = {
            companyName: chargerCompanyName,
            bussiness: chargerBussiness,
            doy: chargerDoy,
            afm: chargerAfm,
            name: chargerName,
            subname: chargerSubname,
            country: chargerCountry,
            district: chargerState,
            city: chargerCity,
            street: chargerAddress,
            postalCode: chargerPostalCode,
            phoneNumber: chargerPhone,
            comments: chargerComments
        };

        dispatch(updateChargerAddress(order.order_id, orderPaymentType, charger));
        setChargerAddressEditModal(false);
        dispatch(detailsOrder(props.match.params.id));
    }

    const okShippingAddressEditHandler = () => {
        var shippingTo = {
            name: shippingName,
            subname: shippingSubname,
            country: shippingCountry,
            district: shippingState,
            city: shippingCity,
            street: shippingAddress,
            postalCode: shippingPostalCode,
            phoneNumber: shippingPhone
        };

        dispatch(updateShippingToAddress(order.order_id, order.shippingAddress, shippingTo));
        setShippingAddressEditModal(false);
        dispatch(detailsOrder(props.match.params.id));
    }

    const okStatusHandler = () => {
        var StatusIndex = orderStatusList.indexOf(newΟrderStatus);
        var dates = {
            proccessDate: "",
            delayDate: "",
            shippingDate: "",
            deletedDate: ""
        }

        switch (StatusIndex) {
            case 0:
                dates = {
                    proccessDate: null,
                    delayDate: null,
                    shippingDate: null,
                    cancelDate: null,
                    dateIndex: 0
                }
                break;
            case 1:
                dates = {
                    delayDate: null,
                    shippingDate: null,
                    cancelDate: null,
                    dateIndex: 1
                }
                break;
            case 2:
                dates = {
                    shippingDate: null,
                    cancelDate: null,
                    dateIndex: 2
                }
                break;
            case 3:
                dates = {
                    cancelDate: null,
                    dateIndex: 3
                }
                break;
            default:
                break;
        }

        dispatch(changeStatus(order.order_id, newΟrderStatus, dates));
        setOrderStatus(newΟrderStatus);
        setOrderStatusModal(false);
    }

    const okOrderEditHandler = () => {
        dispatch(changeOrderDetails(order.order_id, orderSendingMethod, orderShippingPrice, orderPaymentMethod, orderPaymentMethodPrice, orderPaymentType));
        setOrderEditModal(false);
        dispatch(detailsOrder(props.match.params.id));
    }

    const cancelStatusHandler = () => {

        setOrderStatus(orderStatus);
        setOrderStatusModal(false);
    }

    const removeFromCartHandler = (product_id, model) => {
        dispatch(removeOrderItem(order.order_id, product_id, model));
        dispatch(detailsOrder(props.match.params.id));
    }

    const updateCartHandler = (product_id, model, quantity) => {        
        dispatch(updateOrderQuantity(order.order_id, product_id, model, quantity));
    }
    const orderStatusList = ["Καταχωρήθηκε", "Επεξεργάζεται", "Αναμονή", "Ολοκληρώθηκε", "Ακυρώθηκε"];

    const sendingMethodHandler = (e) => {
        setOrderSendingMethod(e.target.value);
        setOrderPaymentMethod('');
        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index]
        let option = el.getAttribute('id');
        let cost = el.getAttribute('cost');
        setOrderShippingPrice(cost);
        dispatch(listPaymentMethods(option));
    }

    const paymentMethodHandler = (e) => {
        setOrderPaymentMethod(e.target.value);
        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index];
        let cost = el.getAttribute('cost');
        setOrderPaymentMethodPrice(cost);
    }

    const orderHistoryHandler = () =>{
        props.history.push(`/admin/orderHistory/${props.match.params.id}`)
    }

    return (
        <div>
            {loading ? <div>loading...</div> :
                error ? <div>{error.message}</div> :
                    (
                        <div className="order_details-wrapper">
                            <div className="order_history_wrapper">
                            {userInfo && userInfo.isAdmin===2 && <button className="button continuebtn" onClick={orderHistoryHandler}>Ιστορικό παραγγελίας</button>}
                            </div>
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
                                <div style={{ width: "80%" }}>
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
                                            <label>Ημ. αναμονής:</label>
                                            <div>
                                                {order.delayDate && convertDate(order.delayDate)}
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
                                            <label>Κατάσταση παραγγελίας:</label>
                                            <select className="select-order-status" value={orderStatus} onChange={(e) => { changeStatusHandler(e.target.value) }}>
                                                <option value={orderStatusList[0]}>{orderStatusList[0]}</option>
                                                <option value={orderStatusList[1]}>{orderStatusList[1]}</option>
                                                <option value={orderStatusList[2]}>{orderStatusList[2]}</option>
                                                <option value={orderStatusList[3]}>{orderStatusList[3]}</option>
                                                <option value={orderStatusList[4]}>{orderStatusList[4]}</option>
                                            </select>
                                            <div id="changeStatusModal" className="modal" style={{ display: orderStatusModal ? "block" : "none" }}>
                                                <div className="modal-content">
                                                    <div className="modalHeader">
                                                        <h2>Προσοχή!</h2>
                                                    </div>
                                                    <p>Η κατάσταση παραγγελίας που επιλέξατε ({newΟrderStatus}) προηγείται χρονικά της τρέχουσας κατάστασης ({orderStatus}).<br /><br />
                                            Είστε σίγουρος πως θέλετε να προχωρήσετε?<br /><br />
                                            Αν συνεχίσετε όλες οι ημερομηνίες που σχετίζονται με τις ενδιάμεσες καταστάσεις
                                            θα διαγραφουν οριστικά!
                                        </p>
                                                    <div className="okCancelButton-wrapper">
                                                        <button className="okCancelButton button" onClick={okStatusHandler}>OK</button>
                                                        <button className="okCancelButton button" onClick={cancelStatusHandler}>Ακύρωση</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
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
                                        <li>
                                            <button className="button continuebtn" onClick={() => setOrderEditModal(true)}>Επεξεργασία</button>
                                            <div id="orderEditModal" className="modal" style={{ display: orderEditModal ? "block" : "none" }}>
                                                <div className="modal-content">
                                                    <div className="modalHeader">
                                                        <h2>Στοιχεία παραγγελίας</h2>
                                                    </div>
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
                                                            <label>Τρόπος Αποστολής:</label>
                                                            {loadingSendingMethods ? <option><LoadingSpinner /></option> :
                                                                errorSendingMethods ? <div>{errorSendingMethods}</div> :
                                                                    <select type="text" onChange={(e) => sendingMethodHandler(e)} defaultValue={order.sendingMethod}>
                                                                        {sendingMethods.map(send =>
                                                                            <option key={send.sendingMethod_id} id={send.sendingMethod_id} cost={send.sendingMethodCost} value={send.sendingMethod}>{send.sendingMethod}</option>)}
                                                                    </select>}
                                                        </li>
                                                        <li>
                                                            <label>Τρόπος Πληρωμής:</label>
                                                            {loadingPaymentMethods ? <option><LoadingSpinner /></option> :
                                                                errorPaymentMethods ? <div>{errorPaymentMethods}</div> :
                                                                    <select type="text" onChange={(e) => paymentMethodHandler(e)} defaultValue={order.paymentMethod}>
                                                                        <option value="">Επέλεξε τρόπο πληρωμής</option>
                                                                        {paymentMethods.map((pay, index) =>
                                                                            <option key={index} id={pay.paymentMethod_id} cost={pay.paymentMethodCost} value={pay.paymentMethod}>{pay.paymentMethod}</option>)}
                                                                    </select>}
                                                        </li>
                                                        <li>
                                                            <label>Παραστατικό:</label>
                                                            <select type="text" value={orderPaymentType} onChange={(e) => setOrderPaymentType(e.target.value)}>
                                                                <option value="Απόδειξη">Απόδειξη</option>
                                                                <option value="Τιμολόγιο">Τιμολόγιο</option>
                                                            </select>
                                                        </li>
                                                    </ul>
                                                    <div className="okCancelButton-wrapper">
                                                        <button className="okCancelButton button" disabled={orderPaymentMethod === ""} onClick={okOrderEditHandler}>OK</button>
                                                        <button className="okCancelButton button" onClick={() => setOrderEditModal(false)}>Ακύρωση</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="charger-shipping-order">
                                <div className="charge-details">
                                    <h3>Στοιχεία Πελάτη</h3>
                                    <ul>
                                        {order.paymentType === 'Τιμολόγιο' &&
                                            <Fragment>
                                                <li>
                                                    <label>Επωνυμία :</label>
                                                    <div>{charger.companyName}</div>
                                                </li>
                                                <li>
                                                    <label> Επάγγελμα:</label>
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
                                        <li>
                                            <button className="button continuebtn" onClick={() => setChargerAddressEditModal(true)}>Επεξεργασία στοιχείων πελάτη</button>
                                            <div id="chargerAddressEditModal" className="modal" style={{ display: chargerAddressEditModal ? "block" : "none" }}>
                                                <div className="modal-content">
                                                    <div className="modalHeader">
                                                        <h2>Στοιχεία Πελάτη</h2>
                                                    </div>
                                                    <ul>
                                                        <li>
                                                            <label>Αρ. παραγγελίας:</label>
                                                            <div>{order.order_id}</div>
                                                            <label>Email Πελάτη:</label>
                                                            <div>{order.user_email}</div>
                                                        </li>
                                                        {order.paymentType === 'Τιμολόγιο' &&
                                                            <Fragment>
                                                                <li>
                                                                    <label>Επωνυμία:</label>
                                                                    <input type="text" name="charger-companyName" id="charger-companyName" required={order.paymentType === 'Τιμολόγιο'}
                                                                        onChange={(e) => setChargerCompanyName(e.target.value)} value={chargerCompanyName}>
                                                                    </input>
                                                                </li>
                                                                <li>
                                                                    <label>Επάγγελμα:</label>
                                                                    <input type="text" name="charger-bussiness" id="charger-bussiness" required={order.paymentType === 'Τιμολόγιο'}
                                                                        onChange={(e) => setChargerBussiness(e.target.value)} value={chargerBussiness}>
                                                                    </input>
                                                                </li>
                                                                <li>
                                                                    <label>Α.Φ.Μ:</label>
                                                                    <input type="text" name="charger-afm" id="charger-afm" required={order.paymentType === 'Τιμολόγιο'}
                                                                        onChange={(e) => setChargerAfm(e.target.value)} value={chargerAfm} maxLength='9'>
                                                                    </input>
                                                                    <label>Δ.Ο.Υ:</label>
                                                                    <input type="text" name="charger-doy" id="charger-doy" required={order.paymentType === 'Τιμολόγιο'}
                                                                        onChange={(e) => setChargerDoy(e.target.value)} value={chargerDoy}>
                                                                    </input>
                                                                </li>
                                                            </Fragment>
                                                        }
                                                        {order.paymentType === 'Απόδειξη' &&
                                                            <li>
                                                                <label>Όνομα:</label>
                                                                <input type="text" name="charger-name" id="charger-name" required={order.paymentType === 'Απόδειξη'}
                                                                    onChange={(e) => setChargerName(e.target.value)} value={chargerName}>
                                                                </input>
                                                                <label>Επίθετο:</label>
                                                                <input type="text" name="charger-subname" id="charger-subname" required={order.paymentType === 'Απόδειξη'}
                                                                    onChange={(e) => setChargerSubname(e.target.value)} value={chargerSubname}>
                                                                </input>
                                                            </li>}
                                                        <li>
                                                            <label>Χώρα:</label>
                                                            <input type="text" name="charger-country" id="charger-country" required
                                                                onChange={(e) => setChargerCountry(e.target.value)} value={chargerCountry}>
                                                            </input>
                                                            <label>Νομός:</label>
                                                            <input type="text" name="charger-state" id="charger-state" required
                                                                onChange={(e) => setChargerState(e.target.value)} value={chargerState}>
                                                            </input>
                                                            <label>Πόλη:</label>
                                                            <input type="text" name="charger-city" id="charger-city" required
                                                                onChange={(e) => setChargerCity(e.target.value)} value={chargerCity}>
                                                            </input>
                                                        </li>
                                                        <li>
                                                            <label>Διεύθυνση:</label>
                                                            <input type="text" name="charger-address" id="charger-address" required
                                                                onChange={(e) => setChargerAddress(e.target.value)} value={chargerAddress}>
                                                            </input>
                                                            <label>Τ.Κ:</label>
                                                            <input type="text" name="charger-postalCode" id="charger-postalCode" required
                                                                onChange={(e) => setChargerPostalCode(e.target.value)} value={chargerPostalCode}>
                                                            </input>
                                                            <label>Τηλέφωνο:</label>
                                                            <input type="tel" name="charger-phone" id="charger-phone" maxLength="10"
                                                                required value={chargerPhone}
                                                                onChange={(e) => setChargerPhone(e.target.value)}>
                                                            </input>
                                                        </li>
                                                        <li>
                                                            <label>Σχόλια Πελάτη:</label>
                                                            <textarea name="charger-comments" id="charger-comments" maxLength="1000" rows="3"
                                                                onChange={(e) => setChargerComments(e.target.value)} value={chargerComments}>
                                                            </textarea>
                                                        </li>
                                                    </ul>
                                                    <div className="okCancelButton-wrapper">
                                                        <button className="okCancelButton button" onClick={okChargerAddressEditHandler}>OK</button>
                                                        <button className="okCancelButton button" onClick={() => setChargerAddressEditModal(false)}>Ακύρωση</button>
                                                    </div>
                                                </div>
                                            </div>
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
                                                <li>
                                                    <label>Τηλέφωνο :</label>
                                                    <div>{shippingTo.phoneNumber}</div>
                                                </li>
                                            </Fragment>}
                                        <li>
                                            <button className="button continuebtn" onClick={() => setShippingAddressEditModal(true)}>Επεξεργασία στοιχείων παράδοσης</button>
                                            <div id="shippingAddressEditModal" className="modal" style={{ display: shippingAddressEditModal ? "block" : "none" }}>
                                                <div className="modal-content">
                                                    <div className="modalHeader">
                                                        <h2>Στοιχεία Παράδοσης</h2>
                                                    </div>
                                                    <ul>
                                                        <li>
                                                            <label>Αρ. παραγγελίας:</label>
                                                            <div>{order.order_id}</div>
                                                            <label>Email Πελάτη:</label>
                                                            <div>{order.user_email}</div>
                                                        </li>
                                                        <li>
                                                            <label>Όνομα:</label>
                                                            <input type="text" name="shipping-name" id="shipping-name" required
                                                                onChange={(e) => setShippingName(e.target.value)} value={shippingName}>
                                                            </input>
                                                            <label>Επίθετο:</label>
                                                            <input type="text" name="shipping-subname" id="shipping-subname" required
                                                                onChange={(e) => setShippingSubname(e.target.value)} value={shippingSubname}>
                                                            </input>
                                                        </li>
                                                        <li>
                                                            <label>Χώρα:</label>
                                                            <input type="text" name="shipping-country" id="shipping-country" required
                                                                onChange={(e) => setShippingCountry(e.target.value)} value={shippingCountry}>
                                                            </input>
                                                            <label>Νομός:</label>
                                                            <input type="text" name="shipping-state" id="shipping-state" required
                                                                onChange={(e) => setShippingState(e.target.value)} value={shippingState}>
                                                            </input>
                                                            <label>Πόλη:</label>
                                                            <input type="text" name="shipping-city" id="shipping-city" required
                                                                onChange={(e) => setShippingCity(e.target.value)} value={shippingCity}>
                                                            </input>
                                                            <label htmlFor="shipping-postalCode">Τ.Κ:</label>
                                                            <input type="text" name="shipping-postalCode" id="shipping-postalCode" required
                                                                onChange={(e) => setShippingPostalCode(e.target.value)} value={shippingPostalCode}>
                                                            </input>
                                                        </li>
                                                        <li>
                                                            <label>Διεύθυνση:</label>
                                                            <input type="text" name="shipping-address" id="shipping-address" required
                                                                onChange={(e) => setShippingAddress(e.target.value)} value={shippingAddress}>
                                                            </input>
                                                            <label>Τηλέφωνο:</label>
                                                            <input type="text" name="shipping-phone" id="shipping-phone" required maxLength="10"
                                                                onChange={(e) => setShippingPhone(e.target.value)} value={shippingPhone}>
                                                            </input>

                                                        </li>
                                                    </ul>
                                                    <div className="okCancelButton-wrapper">
                                                        <button className="okCancelButton button" onClick={okShippingAddressEditHandler}>OK</button>
                                                        <button className="okCancelButton button" onClick={() => setShippingAddressEditModal(false)}>Ακύρωση</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <div className="order-list-details">
                                    <ul className="order-list-details-container">
                                        <li>
                                            <h3>Παραγγελία</h3>
                                        </li>
                                        <li className="order-list-header">                                            
                                            <div></div>
                                            <div>Κωδ. Προϊόντος</div>
                                            <div>Προϊόν</div>
                                            <div>Κατηγορία</div>
                                            <div>Μοντέλο</div>
                                            <div>Ποσότητα</div>
                                            <div>Σύνολο</div>
                                        </li>
                                        {products.map(item =>
                                            <li className="order-item" key={item._id + item.model}>                                                
                                                <div className="order-image flex-column">
                                                    {item.category !== "Φτιάξε τη Θήκη σου" ?
                                                        <img className="order-image-img" src={item.image} alt="product" /> :
                                                        <Fragment>
                                                            <a href={item.image_case} download={item.image_case.slice(35, item.image_case.length)}>
                                                                <img className="order-image-img" src={item.image_case} alt="Φτιάξε τη θήκη σου" />
                                                            </a>
                                                            <a href={item.image_case} download={item.image_case.slice(35, item.image_case.length)}>
                                                                <button className="button download-button">Λήψη</button>
                                                            </a>
                                                        </Fragment>}
                                                </div>
                                                <div>
                                                    {item._id}
                                                </div>
                                                <div className="order-name-model">
                                                    <div className="order-name">
                                                        {item.name}
                                                    </div>
                                                </div>
                                                <div>
                                                    {item.category}
                                                </div>
                                                {item.category === "Συλλογή" || item.category === "Φτιάξε τη Θήκη σου" ?
                                                    <div className="order-model">
                                                        {item.model}
                                                    </div> :
                                                    <div>

                                                    </div>}
                                                <div className="order-name">
                                                    {item.quantity}
                                                </div>
                                                <div className="order-total-price">
                                                    {(item.totalPrice * item.quantity).toFixed(2)} €
                                                </div>
                                            </li>)}
                                        <li className="admin-order-items-total-cost">
                                            <div></div>
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
                                        </li>
                                        <li>
                                            <button className="button continuebtn" onClick={() => setCartEditModal(true)}>Επεξεργασία παραγγελίας</button>
                                            <div id="cartEditModal" className="modal" style={{ display: cartEditModal ? "block" : "none" }}>
                                                <div className="modal-content">
                                                    <div className="modalHeader">
                                                        <h2>Παραγγελία</h2>
                                                    </div>
                                                    <ul>
                                                        <li className="head-details">
                                                            <label>Αρ. παραγγελίας:</label>
                                                            <div>{order.order_id}</div>
                                                            <label>Email Πελάτη:</label>
                                                            <div>{order.user_email}</div>
                                                        </li>
                                                        <li>
                                                            <ul className="cart-item-width">
                                                                <li className="order-list-header">
                                                                    <div></div>
                                                                    <div>Προϊόν</div>
                                                                    <div>Κατηγορία</div>
                                                                    <div>Μοντέλο</div>
                                                                    <div>Τιμή</div>
                                                                    <div>Ποσότητα</div>
                                                                    <div>Σύνολο</div>
                                                                    <div></div>
                                                                </li>
                                                                {products.map(item =>
                                                                    <li className="cart-item cart-item-height " key={item._id + item.model}>
                                                                        <div className="cart-image-height">
                                                                            <img src={item.image} alt="product" />
                                                                        </div>
                                                                        <div className="cart-name-model">
                                                                            <div className="cart-name">
                                                                                {item.name}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            {item.category}
                                                                        </div>
                                                                        <div className="cart-model">
                                                                            {item.model}
                                                                        </div>
                                                                        <div className="cart-item-price">
                                                                            {item.totalPrice} €
                                                                        </div>
                                                                        <div className="cart-name">
                                                                            <select className="cart-select-qty" name="cart-select-qty" id="cart-select-qty"
                                                                                onChange={(e) => updateCartHandler(item._id, item.model, e.target.value)} defaultValue={item.quantity}>
                                                                                {[...Array(item.countInStock).keys()].map(x =>
                                                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>)}
                                                                            </select>
                                                                        </div>
                                                                        <div className="cart-total-price">
                                                                            {(item.totalPrice * item.quantity).toFixed(2)} €                                                        </div>
                                                                        <div>
                                                                            <button className="delete-item-button" onClick={() => removeFromCartHandler(item._id, item.model)} >
                                                                                <i className="material-icons">delete_forever</i>
                                                                            </button>
                                                                        </div>
                                                                    </li>)}
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    <div className="okCancelButton-wrapper">
                                                        <button className="okCancelButton button" onClick={() => setCartEditModal(false)}>Κλείσιμο</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
        </div>
    )
}

export default AdminOrdersDetailScreen;