import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner.js';
import './ProductHistoryScreen.css';
import { getProductHistory } from '../action/productActions.js';

function ProductHistoryScreen(props) {

    const productHistory = useSelector(state => state.productHistory);
    const { prodHistory, productCompHistory, productFeatHistory, loading, error } = productHistory;
    const [editProductModal, setEditProductModal] = useState(false);
    const [editCompModal, setEditCompModal] = useState(false);
    const [editFeatModal, setEditFeatModal] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProductHistory(props.match.params.id));
        return () => {

        }
    }, [props.match.params.id]);

    return (
        <div>
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Ιστορικό Προϊόντος</li>
                </ul>
            </div>
            <div className="product_history_wrapper">
                <div className="product_history_header" onClick={() => setEditProductModal(!editProductModal)}>
                    <h4 className="expand">Ιστορικό Προϊόντος</h4>
                    <i className="material-icons expand">{!editProductModal ? "expand_more" : "expand_less"}</i>
                </div>
                {editProductModal &&
                    (loading ? <div><LoadingSpinner /></div> :
                        error ? <div>{error}</div> :
                            <div className="product_history_table_wrapper">
                                <div className="product_history_table">
                                    <div><label>Φώτο</label></div>
                                    <div><label>Όνομα</label></div>
                                    <div><label>Κατηγορία</label></div>
                                    <div><label>Υποκατηγορία</label></div>
                                    <div><label>Κατασκευαστής</label></div>
                                    <div><label>Τιμή Αγοράς</label></div>
                                    <div><label>Κέρδος</label></div>
                                    <div><label>Προμηθευτής</label></div>
                                    <div><label>Εμφάνιση</label></div>
                                    <div><label>Διαθεσιμότητα</label></div>
                                    <div><label>Δημιουργήθηκε Από</label></div>
                                    <div><label>Δημιουργήθηκε Στις</label></div>
                                    <div><label>Επεξεργάστηκε Από</label></div>
                                    <div><label>Επεξεργάστηκε Στις</label></div>
                                </div>
                                {prodHistory.map(product => (
                                    <div key={product.ID} className="product_history_table">
                                        <div><img className="admin-product-image" src={product.image} alt={props.alt} /></div>
                                        <div>{product.name}</div>
                                        <div>{product.category}</div>
                                        <div>{product.subcategory}</div>
                                        <div>{product.brand}</div>
                                        <div>{product.price} €</div>
                                        <div>{product.percentage}%</div>
                                        <div>{product.supplier}</div>
                                        <div>
                                            <input type="checkbox" name="visibility_checkbox" id="visibility_checkbox"
                                                checked={product.visibility} disabled>
                                            </input>
                                        </div>
                                        <div>{product.availability}</div>
                                        <div>{product.CreatedBy}</div>
                                        <div>{product.CreatedAt && Intl.DateTimeFormat('en-GB', {
                                            year: 'numeric', month: 'numeric', day: 'numeric',
                                            hour: 'numeric', minute: 'numeric', second: 'numeric',
                                            hour12: false
                                        }).format(Date.parse(product.CreatedAt))}
                                        </div>
                                        <div>{product.UpdatedBy}</div>
                                        <div>{product.UpdatedAt && Intl.DateTimeFormat('en-GB', {
                                            year: 'numeric', month: 'numeric', day: 'numeric',
                                            hour: 'numeric', minute: 'numeric', second: 'numeric',
                                            hour12: false
                                        }).format(Date.parse(product.UpdatedAt))}
                                        </div>
                                    </div>
                                ))}
                            </div>)}
            </div>
            <div className="product_history_wrapper">
                <div className="product_history_header" onClick={() => setEditCompModal(!editCompModal)}>
                    <h4 className="expand">Ιστορικό Συμβατοτήτων Προϊόντος</h4>
                    <i className="material-icons expand">{!editCompModal ? "expand_more" : "expand_less"}</i>
                </div>
                {editCompModal &&
                    <div className="product_history_table_wrapper">
                        <table >
                            <thead>
                                <tr>
                                    <th>Εταιρία</th>
                                    <th>Μοντέλο</th>
                                    <th>Επεξεργάστηκε Από</th>
                                    <th>Επεξεργάστηκε Στις</th>
                                    <th>Ενέργεια</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? <tr><td><LoadingSpinner /></td></tr> :
                                    error ? <tr><td><div>{error}</div></td></tr> :
                                        productCompHistory.map(comp => (
                                            <tr>
                                                <td>{comp.compatibility_company}</td>
                                                <td>{comp.compatibility_model}</td>
                                                <td>{comp.UpdatedBy}</td>
                                                <td>{comp.UpdatedAt && Intl.DateTimeFormat('en-GB', {
                                                    year: 'numeric', month: 'numeric', day: 'numeric',
                                                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                                                    hour12: false
                                                }).format(Date.parse(comp.UpdatedAt))}</td>
                                                <td>{comp.actions}</td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    </div>}
            </div>
            <div className="product_history_wrapper">
                <div className="product_history_header" onClick={() => setEditFeatModal(!editFeatModal)}>
                    <h4 className="expand">Ιστορικό Χαρακτηριστικών Προϊόντος</h4>
                    <i className="material-icons expand">{!editFeatModal ? "expand_more" : "expand_less"}</i>
                </div>
                {editFeatModal &&
                    <div className="product_history_table_wrapper">
                        <table >
                            <thead>
                                <tr>
                                    <th>Τίτλος</th>
                                    <th>Χαρακτηριστικό</th>
                                    <th>Επεξεργάστηκε Από</th>
                                    <th>Επεξεργάστηκε Στις</th>
                                    <th>Ενέργεια</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? <tr><td><LoadingSpinner /></td></tr> :
                                    error ? <tr><td><div>{error}</div></td></tr> :
                                        productFeatHistory.map(feat => (
                                            <tr>
                                                <td>{feat.feature_title}</td>
                                                <td>{feat.feature}</td>
                                                <td>{feat.UpdatedBy}</td>
                                                <td>{feat.UpdatedAt && Intl.DateTimeFormat('en-GB', {
                                                    year: 'numeric', month: 'numeric', day: 'numeric',
                                                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                                                    hour12: false
                                                }).format(Date.parse(feat.UpdatedAt))}</td>
                                                <td>{feat.actions}</td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    </div>}
            </div>

        </div>
    )
}

export default ProductHistoryScreen;