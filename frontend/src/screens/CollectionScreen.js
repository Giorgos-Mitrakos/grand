import React, { useEffect } from 'react';
import './CollectionScreen.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listCollection } from '../action/collectionActions.js';
import { useState } from 'react';
import { getPhoneModels, listPhoneBrands } from '../action/modelActions.js';
import { addImageCaseToCart } from '../action/cartActions';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ReactPaginate from 'react-paginate';
import CarouselCard from '../components/CarouselCard.js';
import { Helmet } from 'react-helmet';


function CollectionScreen() {

    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [brandId, setBrandId] = useState('');
    const [model, setModel] = useState('');
    const [qty, setQty] = useState(1);
    const collectionList = useSelector(state => state.collectionList);
    const { collection, loading, error } = collectionList;
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    // const modelList = useSelector(state => state.modelList);
    // const { phoneModels, loadingModel, errorModel } = modelList;

    const phonesBrandList = useSelector(state => state.phonesBrandList);
    const { phoneBrands, loadingBrand, errorBrand } = phonesBrandList;
    const phoneModelList = useSelector(state => state.phoneModelList);
    const { phoneModels, loadingModel, errorModel } = phoneModelList;

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
        dispatch(listPhoneBrands())
        window.scrollTo(0, 0);
    }, [dispatch])

    useEffect(() => {
        if (brandId) {
            dispatch(getPhoneModels(brandId));
        }
    }, [dispatch, brandId])

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
                form.append("model", `${brand}-${model}`);
                form.append("qty", qty);
                form.append("image", image);

                dispatch(addImageCaseToCart(form));
            }
            else {
                alert("Για να φτιάξετε τη δική σας θήκη πρέπει να συνδεθείτε με το λογαριασμό σας!")
                // dispatch(addImageCaseToLocalCart(image, model, qty));
            }
        }
        else {
            alert("Παρακαλώ επιλέξτε το μοντέλο της συσκευής σας");
        }
    }

    const selectBrandHandler = (e) => {
        setBrand(e.target.value)
        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index]
        let option = el.getAttribute('id');
        setBrandId(option)
    }

    return (
        <div>
            <Helmet>
                <title>Grand Mobile Accessories-Φτιάξε τη θήκη σου</title>
                <meta name="description" content="Φτιάξε τη θήκη σου.Στο grandmobile.gr δημιουργούμε την θήκη της επιλογής σου. Ανέβασε την εικόνα σου
                    ή επέλεξε την θήκη που σου αρέσει απο την συλλογή μας." />
                <meta name="keywords" content="θήκες, κινητά, tablet, smartphone, τάμπλετ" />
            </Helmet>
            <div className="title">
                <h2>ΦΤΙΑΞΕ ΤΗ ΘΗΚΗ ΣΟΥ</h2>
            </div>
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Φτιάξε τη θήκη σου</li>
                </ul>
            </div>
            <div className="make-your-case-wrapper">
                <div className="make-your-case-image-container">
                    <img className="make-your-collection-image" src="./images/make-your-case-images.webp" alt="Make your case" />
                </div>
                <div className="make-your-case">
                    <div className="make-your-case-description">
                        <p>
                            Στο grandmobile.gr δημιουργούμε την θήκη της επιλογής σου. Ανέβασε την εικόνα σου
                        <br />ή επέλεξε την θήκη που σου αρέσει απο την συλλογή μας.
                        </p>
                    </div>
                    <form className="make-your-case-upload" onSubmit={submitHandler} encType="multipart/form-data">
                        <ul>
                            <li>
                                <label htmlFor="product-image">Φωτογραφία :  </label>
                                <input type="file" name="product-image" id="product-image" required
                                    accept=".jpg, .jpeg, .png, .webp" onChange={(e) => setImage(e.target.files[0])}>
                                </input>
                            </li>
                            <li className="product-phone-model">
                                <label htmlFor="select-brand">Εταιρία :</label>
                                {loadingBrand ? <div>Loading...</div> :
                                    errorBrand ? <div>{error}</div> :
                                        <select className="select-model" name="select-brand" defaultValue=""
                                            onChange={(e) => { selectBrandHandler(e) }}>
                                            <option value="" disabled hidden>Επέλεξε εταιρία</option>
                                            {phoneBrands.map(brand => (
                                                <option key={brand.phone_brand_id} id={brand.phone_brand_id} value={brand.brand}>
                                                    {brand.brand}
                                                </option>
                                            ))}
                                        </select>
                                }
                            </li>
                            <li className="product-phone-model">
                                <label htmlFor="select-model">Μοντέλο :</label>
                                {loadingModel ? <div>Loading...</div> :
                                    errorModel ? <div>{errorModel}</div> :
                                        <select className="select-model" name="select-model" defaultValue=""
                                            onChange={(e) => { setModel(e.target.value) }}>
                                            <option value="" disabled hidden>Επέλεξε Μοντέλο</option>
                                            {phoneModels.map(model => (
                                                <option key={model.phone_model_id} value={model.model}>
                                                    {model.model}
                                                </option>
                                            ))}
                                        </select>
                                }
                            </li>
                            <li>
                                <label className="select-qty-label" htmlFor="qty">Ποσότητα : </label>
                                <select className="select-model" name="qty" id="qty"
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
                <select className="filter_collection_per_page" onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(0) }}>
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
                            <Link key={col._id} to={"/collection/" + col._id}>
                                <CarouselCard src={col.image} details={"/collection/" + col._id} alt={col.name} productName={col.name} price={col.totalPrice} />
                            </Link>))}
                    </div>
            }
            <div className="paginationList">
                <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
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