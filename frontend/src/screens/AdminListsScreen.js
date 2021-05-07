import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPhoneModels, insertPhoneBrand, insertPhoneModel, listPhoneBrands } from '../action/modelActions';
import {
    createPaymentMethod, createSendingMethods, deleteManufacturer, deletePaymentMethod,
    deleteSendingMethod, deleteSupplier, editPaymentMethods, editSendingMethods, getCompatibilityModels, getFeatureNames,
    insertCompatibilityCompany, insertCompatibilityModel,
    insertFeatureName, insertFeatureTitle, insertManufacturer,
    insertSupplier,
    listCompatibilityCompanies,
    listFeatureTitles, listManufacturers,
    listPaymentMethodsAdmin, listSendingMethods, listSuppliers
} from '../action/productActions';
import './AdminListsScreen.css';

function AdminListsScreen(props) {

    const compatibilityModels = useSelector(state => state.compatibilityModels);
    const { models, loading: loadingCompatibilityModels, error: errorCompatibilityModels } = compatibilityModels;
    const compatibilityCompanies = useSelector(state => state.compatibilityCompanies);
    const { companies, loading: loadingcompatibilityCompanies, error: errorcompatibilityCompanies } = compatibilityCompanies;
    const paymentList = useSelector(state => state.paymentList);
    const { paymentMethods, loading: loadingPaymentMethods, error: errorPaymentMethods } = paymentList;
    const sendingList = useSelector(state => state.sendingList);
    const { sendingMethods, loading: loadingSendingMethods, error: errorSendingMethods } = sendingList;
    const phonesBrandList = useSelector(state => state.phonesBrandList);
    const { phoneBrands, loadingBrand, errorBrand } = phonesBrandList;
    const phoneModelList = useSelector(state => state.phoneModelList);
    const { phoneModels, loadingModel, errorModel } = phoneModelList;
    const manufacturersList = useSelector(state => state.manufacturersList);
    const { manufacturers, loading, error } = manufacturersList;
    const featureTitleList = useSelector(state => state.featureTitleList);
    const { featureTitles, loading: featureTitleLoading, error: featureTitleError } = featureTitleList;
    const featureNameList = useSelector(state => state.featureNameList);
    const { featureNames, loading: featureNamesLoading, error: featureNamesError } = featureNameList;
    const suppliersList = useSelector(state => state.suppliersList);
    const { suppliers, loading: suppliersLoading, error: suppliersError } = suppliersList;
    const [phoneBrandModelModal, setPhoneBrandModelModal] = useState(false);
    const [compatibilityModal, setCompatibilityModal] = useState(false);
    const [supplierModal, setSupplierModal] = useState(false);
    const [newSupplier, setNewSupplier] = useState("")
    const [brandModal, setBrandModal] = useState(false);
    const [newBrand, setNewBrand] = useState("");
    const [phoneBrand, setPhoneBrand] = useState("");
    const [phoneBrandId, setPhoneBrandId] = useState("");
    const [newModel, setNewModel] = useState("");
    const [featureNameModal, setFeatureNameModal] = useState(false);
    const [newManufacturer, setNewManufacturer] = useState("");
    const [featureTitle, setFeatureTitle] = useState("");
    const [featureTitleId, setFeatureTitleId] = useState("");
    const [newFeatureTitle, setNewFeatureTitle] = useState("");
    const [newFeatureName, setNewFeatureName] = useState("");
    const [sendingMethodModal, setSendingMethodModal] = useState(false);
    const [sendingMethodId, setSendingMethodId] = useState('');
    const [sendingMethod, setSendingMethod] = useState('');
    const [sendingMethodCost, setSendingMethodCost] = useState('');
    const [sendingMethodsEditModal, setSendingMethodsEditModal] = useState(false);
    const [newSendingMethod, setNewSendingMethod] = useState('');
    const [newSendingMethodCost, setNewSendingMethodCost] = useState('');
    const [newSendingMethodsCreateModal, setNewSendingMethodsCreateModal] = useState(false);
    const [paymentMethodModal, setPaymentMethodModal] = useState(false);
    const [paymentMethodsEditModal, setPaymentMethodsEditModal] = useState(false);
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentMethodCost, setPaymentMethodCost] = useState('');
    const [newPaymentMethod, setNewPaymentMethod] = useState('');
    const [newPaymentMethodCost, setNewPaymentMethodCost] = useState('');
    const [newPaymentMethodsCreateModal, setNewPaymentMethodsCreateModal] = useState(false);
    const [compatibilityCompany, setCompatibilityCompany] = useState('');
    const [compatibilityCompanyId, setCompatibilityCompanyId] = useState('');
    const [newCompatibilityCompany, setNewCompatibilityCompany] = useState('');
    const [newCompatibilityModel, setNewCompatibilityModel] = useState('');

    const dispatch = useDispatch();

    const insertManufacturerHandler = () => {
        dispatch(insertManufacturer(newManufacturer));
        setNewManufacturer("");
    }

    const removeManufacturerHandler =(id) =>{
        dispatch(deleteManufacturer(id));
    }

    const insertSupplierHandler = () => {
        dispatch(insertSupplier(newSupplier));
        setNewSupplier("");
    }

    const removeSupplierHandler = (id) => {
        dispatch(deleteSupplier(id));
    }

    const radioChangeHandler = (e) => {
        setPhoneBrand(e.target.value);
        setPhoneBrandId(e.target.id);
        dispatch(getPhoneModels(e.target.id));
    }

    const featureTitlesChangeHandler = (e) => {
        setFeatureTitle(e.target.value);
        setFeatureTitleId(e.target.id);
        dispatch(getFeatureNames(e.target.id));
    }

    const insertFeatureTitleHandler = () => {
        dispatch(insertFeatureTitle(newFeatureTitle));
        setNewFeatureTitle("");
    }

    const insertPhoneBrandHandler = () => {
        dispatch(insertPhoneBrand(newBrand));
        setNewBrand("");
    }

    const insertPhoneModelHandler = () => {
        dispatch(insertPhoneModel(phoneBrandId, newModel));
        setNewModel("");
    }

    const insertFeatureNameHandler = () => {
        dispatch(insertFeatureName(featureTitleId, newFeatureName));
        setNewFeatureName("");
    }

    const sendingMethodModalOkHandler = () => {
        dispatch(editSendingMethods(sendingMethodId, sendingMethod, sendingMethodCost));
        setSendingMethodsEditModal(false);
    }

    const newSendingMethodModalOkHandler = () => {
        dispatch(createSendingMethods(newSendingMethod, newSendingMethodCost));
        setNewSendingMethodsCreateModal(false);
    }

    const openSendingMethodsEditModal = (id, method, cost) => {
        setSendingMethodId(id);
        setSendingMethod(method);
        setSendingMethodCost(cost);
        setSendingMethodsEditModal(true);
    }

    const removeSendingMethod = (id) => {
        dispatch(deleteSendingMethod(id));
    }

    const radioSendingMethodsHandler = (methodId) => {
        dispatch(listPaymentMethodsAdmin(methodId));
        setSendingMethodId(methodId);
    }

    const openPaymentMethodsEditModal = (id, method, cost) => {
        setPaymentMethodId(id);
        setPaymentMethod(method);
        setPaymentMethodCost(cost);
        setPaymentMethodsEditModal(true);
    }

    const paymentMethodEditModalOkHandler = () => {
        dispatch(editPaymentMethods(paymentMethodId, paymentMethod, paymentMethodCost, sendingMethodId));
        setPaymentMethodsEditModal(false);
    }

    const newPaymentMethodModalOkHandler = () => {
        dispatch(createPaymentMethod(newPaymentMethod, newPaymentMethodCost, sendingMethodId))
        setNewPaymentMethodsCreateModal(false);
    }

    const removePaymentMethod = (paymentid) => {
        dispatch(deletePaymentMethod(paymentid, sendingMethodId));
    }

    const compatibilityCompaniesChangeHandler = (e) => {
        setCompatibilityCompany(e.target.value);
        dispatch(getCompatibilityModels(e.target.id));
        setCompatibilityCompanyId(e.target.id);
    }

    const insertCompatibilityCompanyHandler = () => {
        dispatch(insertCompatibilityCompany(newCompatibilityCompany));
        setNewCompatibilityCompany("");
    }

    const insertCompatibilityModelHandler = () => {
        dispatch(insertCompatibilityModel(compatibilityCompanyId, newCompatibilityModel));
        setNewCompatibilityModel('');
    }

    useEffect(() => {
        dispatch(listPhoneBrands());
        dispatch(listFeatureTitles());
        dispatch(listManufacturers());
        dispatch(listSendingMethods());
        dispatch(listCompatibilityCompanies());
        dispatch(listSuppliers());
        return () => {

        }
    }, []);

    return (
        <div>
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Λίστες</li>
                </ul>
            </div>
            <div className="color-wrapper">
                <div className="card-list-header" onClick={() => setPhoneBrandModelModal(!phoneBrandModelModal)}>
                    <h4 className="expand">Εταιρίες Τηλεφώνων & Μοντέλα</h4>
                    <i className="material-icons expand">{!phoneBrandModelModal ? "expand_more" : "expand_less"}</i>
                </div>
                {phoneBrandModelModal &&
                    <div className="color-info ">
                        <div>
                            <label className="header-label">Εταιρίες Τηλεφώνων</label>
                            <div className="auto-scroll">
                                {loadingBrand ? <div>Loading...</div> :
                                    errorBrand ? <div>{errorBrand}</div> :
                                        phoneBrands.map(phonesBrand =>
                                            <div className="radiobutton" key={phonesBrand.phone_brand_id}>
                                                <input type="radio" id={phonesBrand.phone_brand_id} name="phoneBrands"
                                                    value={phonesBrand.brand} onChange={(e) => radioChangeHandler(e)}></input>
                                                <label htmlFor={phonesBrand.phone_brand_id}>{phonesBrand.brand}</label>
                                            </div>
                                        )}
                            </div>
                            <div>
                                <label>Νέα Εταιρία: </label>
                                <input type="text" value={newBrand} onChange={(e) => setNewBrand(e.target.value)} />
                            </div>
                            <div>
                                <button className="button continuebtn justify-right" onClick={insertPhoneBrandHandler} disabled={newBrand === ""}>Προσθήκη Εταιρίας</button>
                            </div>
                        </div>
                        <div>
                            <label className="header-label">Μοντέλα {phoneBrand}</label>
                            {phoneModels &&
                                <ul className="auto-scroll">
                                    {loadingModel ? <div>Loading...</div> :
                                        errorModel ? <div>{errorModel}</div> :
                                            phoneModels.map(phoneModel =>
                                                <li>{phoneModel.model}</li>)}
                                </ul>}
                            {phoneBrand && <div>
                                <div>
                                    <label>Νέο Μοντέλο</label>
                                    <input type="text" value={newModel} onChange={(e) => setNewModel(e.target.value)} />
                                </div>
                                <div>
                                    <button className="button continuebtn justify-right" onClick={insertPhoneModelHandler} disabled={newModel === ""}>Προσθήκη Μοντέλου</button>
                                </div>
                            </div>}
                        </div>
                    </div>}
            </div>
            <div className="color-wrapper">
                <div className="card-list-header" onClick={() => setSendingMethodModal(!sendingMethodModal)}>
                    <h4 className="expand">Τρόποι Αποστολής & Κόστος</h4>
                    <i className="material-icons expand">{!sendingMethodModal ? "expand_more" : "expand_less"}</i>
                </div>
                {sendingMethodModal &&
                    <div className="color-info ">
                        <div>
                            <label className="header-label">Τρόποι Αποστολής</label>
                            <div className="auto-scroll">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Τρόπος Αποστολής</th>
                                            <th>Κόστος</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingSendingMethods ? <div>Loading...</div> :
                                            errorSendingMethods ? <div>{errorSendingMethods}</div> :
                                                sendingMethods.map(send =>
                                                    <tr key={send.sendingMethod_id}>
                                                        <td>{send.sendingMethod}</td>
                                                        <td>{send.sendingMethodCost} €</td>
                                                        <td><button className="button radio-edit-button" onClick={() => openSendingMethodsEditModal(send.sendingMethod_id, send.sendingMethod, send.sendingMethodCost)}>Επεξεργασία</button></td>
                                                        <td><button className="button radio-edit-button" onClick={() => removeSendingMethod(send.sendingMethod_id)}>Διαγραφή</button></td>
                                                    </tr>
                                                )}
                                    </tbody>
                                </table>
                                <div id="sendingMethodsEditModal" className="modal" style={{ display: sendingMethodsEditModal ? "block" : "none" }}>
                                    <div className="modal-content">
                                        <div className="modalHeader">
                                            <h2>Επεξεργασία Τρόπου Αποστολής</h2>
                                        </div>
                                        <ul>
                                            <li>
                                                <label>Τρόπος Αποστολής:</label>
                                                <input value={sendingMethod} onChange={(e) => setSendingMethod(e.target.value)}></input>
                                            </li>
                                            <li>
                                                <label>Κόστος Αποστολής:</label>
                                                <input value={sendingMethodCost} onChange={(e) => setSendingMethodCost(e.target.value)}></input>
                                            </li>
                                        </ul>
                                        <div className="okCancelButton-wrapper">
                                            <button className="okCancelButton button" onClick={sendingMethodModalOkHandler} disabled={sendingMethod === "" || sendingMethodCost === ""}>OK</button>
                                            <button className="okCancelButton button" onClick={() => setSendingMethodsEditModal(false)}>Ακύρωση</button>
                                        </div>
                                    </div>
                                </div>
                                <div id="newSendingMethodsEditModal" className="modal" style={{ display: newSendingMethodsCreateModal ? "block" : "none" }}>
                                    <div className="modal-content">
                                        <div className="modalHeader">
                                            <h2>Δημιουργία Τρόπου Αποστολής</h2>
                                        </div>
                                        <ul>
                                            <li>
                                                <label>Τρόπος Αποστολής:</label>
                                                <input value={newSendingMethod} onChange={(e) => setNewSendingMethod(e.target.value)}></input>
                                            </li>
                                            <li>
                                                <label>Κόστος Αποστολής:</label>
                                                <input value={newSendingMethodCost} onChange={(e) => setNewSendingMethodCost(e.target.value)}></input>
                                            </li>
                                        </ul>
                                        <div className="okCancelButton-wrapper">
                                            <button className="okCancelButton button" onClick={newSendingMethodModalOkHandler} disabled={newSendingMethod === "" || newSendingMethodCost === ""}>OK</button>
                                            <button className="okCancelButton button" onClick={() => setNewSendingMethodsCreateModal(false)}>Ακύρωση</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className="button continuebtn justify-right" onClick={() => setNewSendingMethodsCreateModal(true)}>Νέος Τρόπος Αποστολής</button>
                            </div>
                        </div>
                    </div>}
            </div>
            <div className="color-wrapper">
                <div className="card-list-header" onClick={() => setPaymentMethodModal(!paymentMethodModal)}>
                    <h4 className="expand">Τρόποι Πληρωμής & Κόστος</h4>
                    <i className="material-icons expand">{!paymentMethodModal ? "expand_more" : "expand_less"}</i>
                </div>
                {paymentMethodModal &&
                    <div className="color-info ">
                        <div style={{ flexGrow: 1 }}>
                            <label className="header-label">Τρόποι Αποστολής</label>
                            <div className="auto-scroll">
                                {loadingSendingMethods ? <div>Loading...</div> :
                                    errorSendingMethods ? <div>{errorSendingMethods}</div> :
                                        sendingMethods.map(send =>
                                            <div className="radiobutton" key={send.sendingMethod_id}>
                                                <input type="radio" id={send.sendingMethod_id} name="payment-methods-radio"
                                                    value={send.sendingMethod} onChange={(e) => radioSendingMethodsHandler(send.sendingMethod_id)}></input>
                                                <label htmlFor={send.sendingMethod_id}>{send.sendingMethod}</label>
                                            </div>
                                        )}
                                <div id="sendingMethodsEditModal" className="modal" style={{ display: sendingMethodsEditModal ? "block" : "none" }}>
                                    <div className="modal-content">
                                        <div className="modalHeader">
                                            <h2>Επεξεργασία Τρόπου Αποστολής</h2>
                                        </div>
                                        <ul>
                                            <li>
                                                <label>Τρόπος Αποστολής:</label>
                                                <input value={sendingMethod} onChange={(e) => setSendingMethod(e.target.value)}></input>
                                            </li>
                                            <li>
                                                <label>Κόστος Αποστολής:</label>
                                                <input value={sendingMethodCost} onChange={(e) => setSendingMethodCost(e.target.value)}></input>
                                            </li>
                                        </ul>
                                        <div className="okCancelButton-wrapper">
                                            <button className="okCancelButton button" onClick={sendingMethodModalOkHandler} disabled={sendingMethod === "" || sendingMethodCost === ""}>OK</button>
                                            <button className="okCancelButton button" onClick={() => setSendingMethodsEditModal(false)}>Ακύρωση</button>
                                        </div>
                                    </div>
                                </div>
                                <div id="newSendingMethodsEditModal" className="modal" style={{ display: newSendingMethodsCreateModal ? "block" : "none" }}>
                                    <div className="modal-content">
                                        <div className="modalHeader">
                                            <h2>Δημιουργία Τρόπου Αποστολής</h2>
                                        </div>
                                        <ul>
                                            <li>
                                                <label>Τρόπος Αποστολής:</label>
                                                <input value={newSendingMethod} onChange={(e) => setNewSendingMethod(e.target.value)}></input>
                                            </li>
                                            <li>
                                                <label>Κόστος Αποστολής:</label>
                                                <input value={newSendingMethodCost} onChange={(e) => setNewSendingMethodCost(e.target.value)}></input>
                                            </li>
                                        </ul>
                                        <div className="okCancelButton-wrapper">
                                            <button className="okCancelButton button" onClick={newSendingMethodModalOkHandler} disabled={newSendingMethod === "" || newSendingMethodCost === ""}>OK</button>
                                            <button className="okCancelButton button" onClick={() => setNewSendingMethodsCreateModal(false)}>Ακύρωση</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ flexGrow: 2 }}>
                            <label className="header-label">Τρόποι Πληρωμής</label>
                            <div className="auto-scroll">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Τρόπος Πληρωμής</th>
                                            <th>Κόστος</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingPaymentMethods ? <div>Loading...</div> :
                                            errorPaymentMethods ? <div>{errorPaymentMethods}</div> :
                                                paymentMethods.map(pay =>
                                                    <tr key={pay.paymentMethod_id}>
                                                        <td>{pay.paymentMethod}</td>
                                                        <td>{pay.paymentMethodCost} €</td>
                                                        <td><button className="button radio-edit-button" onClick={() => openPaymentMethodsEditModal(pay.paymentMethod_id, pay.paymentMethod, pay.paymentMethodCost)}>Επεξεργασία</button></td>
                                                        <td><button className="button radio-edit-button" onClick={() => removePaymentMethod(pay.paymentMethod_id)}>Διαγραφή</button></td>
                                                    </tr>
                                                )}
                                    </tbody>
                                </table>
                                <div id="paymentMethodsEditModal" className="modal" style={{ display: paymentMethodsEditModal ? "block" : "none" }}>
                                    <div className="modal-content">
                                        <div className="modalHeader">
                                            <h2>Επεξεργασία Τρόπου Πληρωμής</h2>
                                        </div>
                                        <ul>
                                            <li>
                                                <label>Τρόπος Πληρωμής:</label>
                                                <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}></input>
                                            </li>
                                            <li>
                                                <label>Κόστος Αποστολής:</label>
                                                <input value={paymentMethodCost} onChange={(e) => setPaymentMethodCost(e.target.value)}></input>
                                            </li>
                                        </ul>
                                        <div className="okCancelButton-wrapper">
                                            <button className="okCancelButton button" onClick={paymentMethodEditModalOkHandler} disabled={paymentMethod === "" || paymentMethodCost === ""}>OK</button>
                                            <button className="okCancelButton button" onClick={() => setPaymentMethodsEditModal(false)}>Ακύρωση</button>
                                        </div>
                                    </div>
                                </div>
                                <div id="newSendingMethodsEditModal" className="modal" style={{ display: newPaymentMethodsCreateModal ? "block" : "none" }}>
                                    <div className="modal-content">
                                        <div className="modalHeader">
                                            <h2>Δημιουργία Τρόπου Πληρωμής</h2>
                                        </div>
                                        <ul>
                                            <li>
                                                <label>Τρόπος Πληρωμής:</label>
                                                <input value={newPaymentMethod} onChange={(e) => setNewPaymentMethod(e.target.value)}></input>
                                            </li>
                                            <li>
                                                <label>Κόστος Πληρωμής:</label>
                                                <input value={newPaymentMethodCost} onChange={(e) => setNewPaymentMethodCost(e.target.value)}></input>
                                            </li>
                                        </ul>
                                        <div className="okCancelButton-wrapper">
                                            <button className="okCancelButton button" onClick={newPaymentMethodModalOkHandler} disabled={newPaymentMethod === "" || newPaymentMethodCost === ""}>OK</button>
                                            <button className="okCancelButton button" onClick={() => setNewPaymentMethodsCreateModal(false)}>Ακύρωση</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className="button continuebtn justify-right" onClick={() => setNewPaymentMethodsCreateModal(true)} disabled={sendingMethodId === ""}>Νέος Τρόπος Πληρωμής</button>
                            </div>
                        </div>
                    </div>}

            </div>
            <div className="color-wrapper">
                <div className="card-list-header" onClick={() => setSupplierModal(!supplierModal)}>
                    <h4 className="expand">Προμηθευτές</h4>
                    <i className="material-icons expand">{!supplierModal ? "expand_more" : "expand_less"}</i>
                </div>
                {supplierModal &&
                    <div className="color-info">
                        <div className="auto-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Προμηθευτές</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliersLoading ? <div>Loading...</div> :
                                        suppliersError ? <div>{suppliersError}</div> :
                                            suppliers.map(sup =>
                                                <tr key={sup.supplier_id}>
                                                    <td>{sup.supplier}</td>
                                                    <td><button className="button radio-edit-button" onClick={() => removeSupplierHandler(sup.supplier_id)}>Διαγραφή</button></td>
                                                </tr>)}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <label className="header-label">Νέος Προμηθευτής</label>
                            <input type="text" value={newSupplier} onChange={(e) => setNewSupplier(e.target.value)} />
                            <button className="button continuebtn" onClick={insertSupplierHandler} disabled={newSupplier === ""}>Προσθήκη Προμηθευτής</button>
                        </div>
                    </div>}
            </div>

            <div className="color-wrapper">
                <div className="card-list-header" onClick={() => setBrandModal(!brandModal)}>
                    <h4 className="expand">Κατασκευαστές</h4>
                    <i className="material-icons expand">{!brandModal ? "expand_more" : "expand_less"}</i>
                </div>
                {brandModal &&
                    <div className="color-info">
                        <div className="auto-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Κατασκευαστές</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? <div>Loading...</div> :
                                        error ? <div>{error}</div> :
                                            manufacturers.map(manufacturer =>
                                                <tr key={manufacturer.manufacturer_id}>
                                                    <td>{manufacturer.name}</td>
                                                    <td><button className="button radio-edit-button" onClick={() => removeManufacturerHandler(manufacturer.manufacturer_id)}>Διαγραφή</button></td>
                                                </tr>)}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <label className="header-label">Νέος Κατασκευαστής</label>
                            <input type="text" value={newManufacturer} onChange={(e) => setNewManufacturer(e.target.value)} />
                            <button className="button continuebtn" onClick={insertManufacturerHandler} disabled={newManufacturer === ""}>Προσθήκη Κατασκευαστή</button>
                        </div>
                    </div>}
            </div>
            <div className="color-wrapper">
                <div className="card-list-header" onClick={() => setFeatureNameModal(!featureNameModal)}>
                    <h4 className="expand">Χαρακτηριστικά</h4>
                    <i className="material-icons expand">{!featureNameModal ? "expand_more" : "expand_less"}</i>
                </div>
                {featureNameModal &&
                    <div className="color-info ">
                        <div>
                            <label className="header-label">Τίτλος Χαρακτηριστικού</label>
                            <div className="auto-scroll">
                                {featureTitleLoading ? <div>Loading...</div> :
                                    featureTitleError ? <div>{featureTitleError}</div> :
                                        featureTitles.map(featureTitle =>
                                            <div className="radiobutton" key={featureTitle.feature_title_id}>
                                                <input type="radio" id={featureTitle.feature_title_id} name="featureTitles"
                                                    value={featureTitle.feature_title} onChange={(e) => featureTitlesChangeHandler(e)}></input>
                                                <label htmlFor={featureTitle.feature_title_id}>{featureTitle.feature_title}</label>
                                            </div>
                                        )}
                            </div>
                            <div>
                                <label>Νέος Τίτλος: </label>
                                <input type="text" value={newFeatureTitle} onChange={(e) => setNewFeatureTitle(e.target.value)} />
                            </div>
                            <div>
                                <button className="button continuebtn justify-right" onClick={insertFeatureTitleHandler} disabled={newFeatureTitle === ""}>Προσθήκη Τίτλου</button>
                            </div>
                        </div>
                        <div>
                            <label className="header-label">Χαρακτηριστικό {featureTitle}</label>
                            {featureNames &&
                                <ul className="auto-scroll">
                                    {featureNamesLoading ? <div>Loading...</div> :
                                        featureNamesError ? <div>{featureNamesError}</div> :
                                            featureNames.map(featureName =>
                                                <li>{featureName.feature_name}</li>)}
                                </ul>}
                            {featureTitle && <div>
                                <div>
                                    <label>Νέο Χαρακτ.</label>
                                    <input type="text" value={newFeatureName} onChange={(e) => setNewFeatureName(e.target.value)} />
                                </div>
                                <div>
                                    <button className="button continuebtn justify-right" onClick={insertFeatureNameHandler} disabled={newFeatureName === ""}>Προσθήκη Χαρακτηριστικού</button>
                                </div>
                            </div>}
                        </div>
                    </div>}
            </div>
            <div className="color-wrapper">
                <div className="card-list-header" onClick={() => setCompatibilityModal(!compatibilityModal)}>
                    <h4 className="expand">Συμβατότητα</h4>
                    <i className="material-icons expand">{!compatibilityModal ? "expand_more" : "expand_less"}</i>
                </div>
                {compatibilityModal &&
                    <div className="color-info ">
                        <div>
                            <label className="header-label">Εταιρία</label>
                            <div className="auto-scroll">
                                {loadingcompatibilityCompanies ? <div>Loading...</div> :
                                    errorcompatibilityCompanies ? <div>{errorcompatibilityCompanies}</div> :
                                        companies.map(comp =>
                                            <div className="radiobutton" key={comp.compatibility_company_id}>
                                                <input type="radio" id={comp.compatibility_company_id} name="compatibilityCompanies"
                                                    value={comp.company} onChange={(e) => compatibilityCompaniesChangeHandler(e)}></input>
                                                <label htmlFor={comp.compatibility_company_id}>{comp.company}</label>
                                            </div>
                                        )}
                            </div>
                            <div>
                                <label>Νέα Εταιρία: </label>
                                <input type="text" value={newCompatibilityCompany} onChange={(e) => setNewCompatibilityCompany(e.target.value)} />
                            </div>
                            <div>
                                <button className="button continuebtn justify-right" onClick={insertCompatibilityCompanyHandler} disabled={newCompatibilityCompany === ""}>Προσθήκη Εταιρίας</button>
                            </div>
                        </div>
                        <div>
                            <label className="header-label">Μοντέλο {compatibilityCompany}</label>
                            {models &&
                                <ul className="auto-scroll">
                                    {loadingCompatibilityModels ? <div>Loading...</div> :
                                        errorCompatibilityModels ? <div>{errorCompatibilityModels}</div> :
                                            models.map(mod =>
                                                <li>{mod.model}</li>)}
                                </ul>}
                            {compatibilityCompany && <div>
                                <div>
                                    <label>Νέο Μοντέλο</label>
                                    <input type="text" value={newCompatibilityModel} onChange={(e) => setNewCompatibilityModel(e.target.value)} />
                                </div>
                                <div>
                                    <button className="button continuebtn justify-right" onClick={insertCompatibilityModelHandler} disabled={newCompatibilityModel === ""}>Προσθήκη Μοντέλου</button>
                                </div>
                            </div>}
                        </div>
                    </div>}
            </div>
        </div>
    )
}
export default AdminListsScreen;