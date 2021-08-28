import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { changeCollectionVisibility, listCollectionAdmin, saveCollection } from '../action/collectionActions.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ReactTooltip from 'react-tooltip';
import './AdminProductsScreen.css';

function AdminCollectionScreen(props) {

    const [modalVisible, setModalVisible] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const collectionAdmin = useSelector(state => state.collectionAdmin);
    const { collection, loading, loadingSave, error, successSave, errorSave, loadingVisibility } = collectionAdmin;
    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(listCollectionAdmin());

        return () => {

        }
    }, []);

    useEffect(() => {
        if (successSave) {
            setModalVisible(false);
            dispatch(listCollectionAdmin());
        }
        return () => {

        }
    }, [successSave]);

    const openModal = (collection) => {
        setModalVisible(true);
        setId(collection._id);
        setName(collection.name);
        setImage(collection.image);
        setPrice(collection.price);
        setDescription(collection.description);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const coll = new FormData();
        coll.append('collection_id', id);
        coll.append('name', name);
        coll.append('image', image);
        coll.append('price', price);
        coll.append('description', description);

        dispatch(saveCollection(id, coll));
    }

    const visibilityChangeHandler = (col) => {
        dispatch(changeCollectionVisibility(col._id, !col.visibility));
    }

    return <div className="content content-margined">
        <div className="product-header">
            <h3>Συλλογή</h3>
            <button className="button admin-button" onClick={() => openModal({})}>Δημιουργία Προϊόντος Συλλογής</button>
        </div>
        {modalVisible &&
            <div>
                <div className="modal" style={{ display: modalVisible ? "block" : "none", overflowY: "scroll", maxHeight: "40rem" }}>
                    <div className="form-create-product">
                        <form onSubmit={submitHandler} encType="multipart/form-data">
                            <ul className="form-container">
                                <li>
                                    <h2>
                                        {id ? "Ενημέρωση Προϊόντος" : "Δημιουργία Προϊόντος"}
                                    </h2>
                                </li>
                                <li>
                                    {successSave && <div>Loading...</div>}
                                    {errorSave && <div>{error}<br />Η σύνδεση έληξε, παρακαλώ συνδεθείτε ξανά!</div>}
                                </li>
                                <li>
                                    <label htmlFor="product-name">Όνομα:</label>
                                    <input type="text" name="product-name" id="product-name" value={name} required
                                        onChange={(e) => setName(e.target.value)}>
                                    </input>
                                </li>
                                <li>
                                    <label htmlFor="product-image">Φωτογραφία:</label>
                                    <input type="file" name="product-image" id="product-image" required={!image}
                                        accept=".jpg, .jpeg, .png" onChange={(e) => setImage(e.target.files[0])}>
                                    </input>
                                </li>
                                <li>
                                    <label htmlFor="product-price">Τιμή:</label>
                                    <input type="text" name="product-price" id="product-price" value={price} required
                                        onChange={(e) => setPrice(e.target.value)}>
                                    </input>
                                </li>
                                <li>
                                    <label htmlFor="product-description">Περιγραφή:</label>
                                    <textarea name="product-description" id="product-description" value={description} required
                                        onChange={(e) => setDescription(e.target.value)}>
                                    </textarea>
                                </li>
                                <li>
                                    <button type="submit" className="button" disabled={loadingSave}>{loadingSave ? <LoadingSpinner /> : id ? "Ενημέρωση" : "Δημιουργία"}</button>
                                </li>
                                <li>
                                    <button className="button" onClick={() => setModalVisible(false)}>Επιστροφή</button>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
        }
        <div className="product-list">
            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Φώτο</th>
                        <th>Όνομα</th>
                        <th>Τιμή</th>
                        <th>Εμφάνιση</th>
                        <th>Ενέργεια</th>
                    </tr>
                </thead>
                <tbody>
                    {loading || successSave || loadingVisibility ? <LoadingSpinner /> :
                        error || errorSave ? <div>{error}</div> :
                            collection.map(col => (
                                <tr key={col._id}>
                                    <td>{col._id}</td>
                                    <td><img className="admin-product-image" src={col.image} alt={props.alt} /></td>
                                    <td><Link to={"/product/" + col._id}>{col.name}</Link></td>
                                    <td>{(col.price).toFixed(2)} €</td>
                                    <td>
                                        <input type="checkbox" name="visibility_checkbox" id="visibility_checkbox"
                                            checked={col.visibility} onChange={(e) => visibilityChangeHandler(col)}>
                                        </input>
                                    </td>
                                    <td>
                                        <button className="button admin-button" onClick={() => openModal(col)}>
                                        <span class="material-icons" data-tip data-for="admin_edit_collection">
                                                edit
                                            </span>
                                        </button>
                                        <ReactTooltip backgroundColor="#deccf0" textColor="#312f8b" id="admin_edit_collection" place="top" effect="solid">
                                            Επεξεργασία
                                        </ReactTooltip>
                                    </td>
                                </tr>
                            ))}
                </tbody>
            </table>
        </div>
    </div>
}

export default AdminCollectionScreen;