import React, { useEffect } from 'react';
import './CollectionScreen.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listCollection } from '../action/collectionActions.js';
import { useState } from 'react';
import { listModels } from '../action/modelActions.js';
import { addImageCaseToCart } from '../action/cartActions';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ReactPaginate from 'react-paginate';
import CarouselCard from '../components/CarouselCard.js';


function CollectionScreen() {

    const [image, setImage] = useState('');
    const [model, setModel] = useState('');
    const [qty, setQty] = useState(1);
    const collectionList = useSelector(state => state.collectionList);
    const { collection, loading, error } = collectionList;
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const modelList = useSelector(state => state.modelList);
    const { phoneModels, loadingModel, errorModel } = modelList;
    const cart = useSelector(state => state.cart);
    const { uploading } = cart;
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [pageCount, setPageCount] = useState(0);
    const [currentPageData, setCurrentPageData] = useState([]);
    const offset = currentPage * itemsPerPage;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listCollection());
        dispatch(listModels());
        window.scrollTo(0, 0);

        return () => {

        };
    }, [dispatch])

    useEffect(() => {
        if (collection) {
            setPageCount(Math.ceil(collection.length / itemsPerPage));
            setCurrentPageData(collection.slice(offset, offset + itemsPerPage))
        }
        return () => {

        }
    }, [collection, itemsPerPage, currentPage]);

    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (model) {
            if (userInfo) {
                const form = new FormData();
                form.append("email", userInfo.email);
                form.append("model", model);
                form.append("qty", qty);
                form.append("image", image);

                dispatch(addImageCaseToCart(form));
            }
            else {
                alert("Για να φτιάξετε τη δική σας θήκη κάντε"+<Link>Σύνδεση</Link>)
                // dispatch(addImageCaseToLocalCart(image, model, qty));
            }
        }
        else {
            alert("Παρακαλώ επιλέξτε το μοντέλο της συσκευής σας");
        }
    }

    return (
        <div>
            <div className="title">
                <h2>ΦΤΙΑΞΕ ΤΗ ΘΗΚΗ ΣΟΥ</h2>
            </div>
            <div>
                <ul class="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Φτιάξε τη θήκη σου</li>
                </ul>
            </div>
            <div className="make-your-case-wrapper">
                <div className="make-your-case-image-container">
                    <img className="make-your-case-image" src="./images/make-your-case-images.jpg" alt="Make your case" />
                </div>
                <div className="make-your-case">
                    <div className="make-your-case-description">
                        <p>
                            Στο grandmobile.gr δημιουργούμε την θήκη της επιλογής σου. Ανέβασε την εικόνα σου
                        <br />ή επέλεξε την θήκη που σου αρέσει απο την συλλογή μας.
                        </p>
                    </div>
                    <form className="make-your-case-upload" onSubmit={submitHandler} enctype="multipart/form-data">
                        <ul>
                            <li>
                                <label htmlFor="product-image">Φωτογραφία :  </label>
                                <input type="file" name="product-image" id="product-image" required
                                    accept=".jpg, .jpeg, .png" onChange={(e) => setImage(e.target.files[0])}>
                                </input>
                            </li>
                            <li className="product-phone-model">
                                <label for="select-model">Μοντέλο :</label>
                                {loadingModel ? <div>Loading...</div> :
                                    errorModel ? <div>{error}</div> :
                                        <select className="select-model" name="select-model"
                                            onChange={(e) => { setModel(e.target.value) }}>
                                            <option value="" disabled hidden selected>Επέλεξε το μοντέλο του κινητού σου</option>
                                            {phoneModels.map(model => (
                                                <option key={model.id} value={model.brand + " " + model.model}>
                                                    {model.brand + " " + model.model}
                                                </option>
                                            ))}
                                        </select>
                                }
                            </li>
                            <li>
                                <label className="select-qty-label" for="qty">Ποσότητα : </label>
                                <select className="select-qty" name="qty" id="qty"
                                    value={qty} onChange={(e) => { setQty(e.target.value) }}>
                                    {[...Array(10).keys()].map(x =>
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>)}
                                </select>
                            </li>
                            <li>
                                <button type='submit' className="button">{uploading ? <LoadingSpinner /> : "ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ"}</button>

                            </li>
                        </ul>
                    </form>
                </div>
            </div>
            <div className="title">
                <h2 className="title-center">Η ΣΥΛΛΟΓΉ ΜΑΣ</h2>
            </div>
            <div className="filter_collection">
                <label>Εμφάνιση:</label>
                <select className="filter_collection_per_page " onChange={(e) => {setItemsPerPage(parseInt(e.target.value)); setCurrentPage(0)}}>
                    <option value="20">20</option>
                    <option value="40">40</option>
                    <option value="60">60</option>
                    <option value="80">80</option>
                </select>
            </div>
            {loading ? <div>Loading...</div> :
                error ? <div>{error}</div> :
                    <div className="collection">
                        {currentPageData.map(col => (
                            <Link to={"/collection/" + col._id}>
                                <CarouselCard src={col.image} details={"/collection/" + col._id} alt={col.name} productName={col.name} price={col.totalPrice} />
                            </Link>))}
                    </div>
            }
            <div className="paginationList">
                <ReactPaginate
                    previousLabel={'<<'}
                    nextLabel={'>>'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    initialPage={currentPage}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                    forcePage={currentPage}
                /></div>
        </div>

    )
}

export default CollectionScreen;