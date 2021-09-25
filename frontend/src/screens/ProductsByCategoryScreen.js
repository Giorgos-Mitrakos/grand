import React, { useEffect, useRef, useState } from 'react';
import './ProductsByCategoryScreen.css';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';
import ProductMenu from '../menu/ProductMenu';
import Product from '../components/product.js';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCompatibilities, getFeatureNameByCategory, getFeatures,
    getFeatureTitlesByCategory, getProductsByCategory, storeBrandFilters, storeCompatibleCompanyFilters, storeCompatibleModelFilters, storeFilters
} from '../action/productActions';
import { productMenuToggle } from '../action/menuActions';
import ReactPaginate from 'react-paginate';
import LoadingSpinner from '../components/LoadingSpinner';
import FilterContainer from '../components/FilterContainer';
import { Helmet } from 'react-helmet';

function ProductsByCategoryScreen(props) {
    const compatibilitiesByCategory = useSelector(state => state.compatibilitiesByCategory);
    const { compatibilities, loading: loadingCompatibilities, error: errorCompatibilities } = compatibilitiesByCategory;
    const productList = useSelector(state => state.productList);
    const { products, count, distinctBrands, excludedBrands, loading, error } = productList;
    const productMenu = useSelector(state => state.productMenu);
    const { isProductMenuOpen } = productMenu;
    const featureTitlesByCategory = useSelector(state => state.featureTitlesByCategory);
    const { featureTitles, loading: loadingFeatureTitles, error: errorFeatureTitles } = featureTitlesByCategory;
    const featureNamesByCategory = useSelector(state => state.featureNamesByCategory);
    const { featureNames } = featureNamesByCategory;
    const productFeatures = useSelector(state => state.productFeatures);
    const { features } = productFeatures;
    const filtersStore = useSelector(state => state.filtersStore);
    const { atrFilter, brFilter, compCompFilter, compModelFilter } = filtersStore;
    const [currentPage, setCurrentPage] = useState();
    const [itemsPerPage, setItemsPerPage] = useState();
    const [sortType, setSortType] = useState("Προεπιλογή");
    const [pageCount, setPageCount] = useState(0);
    const [filterModal, setFilterModal] = useState(false);
    const [inclBrands, setInclBrands] = useState([])
    let location = useLocation();
    let query = useQuery();
    const dispatch = useDispatch();
    let { category, subcategory } = useParams();
    const [uniqueBrands, setUniqueBrands] = useState([]);
    const history = useHistory();
    const modalRef = useRef();

    const findUniqueBrands = () => {
        if (distinctBrands && distinctBrands.length !== 0) {

            setUniqueBrands(distinctBrands);
        }
    }

    useEffect(() => {

        setUniqueBrands([]);
        findUniqueBrands();
        return () => {

        }
    }, [loading]);

    useEffect(() => {
        if (window.innerWidth < 1024) {
            dispatch(productMenuToggle(false));
        }
        else {
            dispatch(productMenuToggle(true));
        }
        // alert(props.match.params.category)

    }, [dispatch, props.match.params.category, props.match.params.subcategory]);

    useEffect(() => {
        setPageCount(Math.ceil(count / itemsPerPage));
        if(count && currentPage>(count/itemsPerPage))
        {
            setCurrentPage(0)
        }
    }, [count, itemsPerPage]);

    useEffect(() => {
        if(currentPage)
        {
        query.set("Page",currentPage+ 1)
        history.push({ search: query.toString() })}
        window.scrollTo(0, 80)

        return () => {

        };
    }, [currentPage])

    useEffect(() => {
        if (parseInt(query.get("ItemsPerPage"))) {
            setItemsPerPage(parseInt(query.get("ItemsPerPage")))
        }
        else {
            setItemsPerPage(12)
        }
    }, [query.get("ItemsPerPage")]);

    useEffect(() => {
        if (parseInt(query.get("Page"))) {
            setCurrentPage(parseInt(query.get("Page") - 1))
        }
        else {
            setCurrentPage(0)
        }
    }, [query.get("Page")]);

    useEffect(() => {
        if (query.get("SortBy")) {
            setSortType(query.get("SortBy"))
        }
        else {
            setSortType("Προεπιλογή")
        }
    }, [query.get("SortBy")]);

    useEffect(() => {
        if (query.get("filter") === null) {
            dispatch(storeFilters([]))
        }
        else {

//             const filt = query.get("filter").split('&')

//             dispatch(storeFilters(filt));
        }
    }, [query.get("filter")]);

    useEffect(() => {
        if (query.get("comp") === null) {
            dispatch(storeCompatibleCompanyFilters([]))
        }
        // else {

        //     const filt = query.get("filter").split('&')

        //     dispatch(storeFilters(filt));
        // }
    }, [query.get("comp")]);

    useEffect(() => {
        if (query.get("model") === null) {
            dispatch(storeCompatibleModelFilters([]))
        }
        // else {

        //     const filt = query.get("filter").split('&')

        //     dispatch(storeFilters(filt));
        // }
    }, [query.get("model")]);

    useEffect(() => {
        if (query.get("brand") === null) {
            dispatch(storeBrandFilters([]))
        }
        // else {
        //     const filt = query.get("brand")
        //     setBrandFilters(filt)
        // }
    }, [query.get("brand")]);

    const setFilterURLString = () => {
        let filterStr = ''
        if (atrFilter.length > 0) {
            for (let index = 0; index < atrFilter.length; index++) {
                if (index === 0) {
                    filterStr += atrFilter[index]
                }
                else {
                    filterStr += '&' + atrFilter[index]
                }
            }
        }

        if (atrFilter.length > 0) {
            query.set("filter", filterStr)
        }
        else {
            query.delete("filter")
        }
        history.push({ search: query.toString() })
    }

    const setCCompURLString = () => {
        let filterStr = ''
        if (compCompFilter.length > 0) {
            for (let index = 0; index < compCompFilter.length; index++) {
                if (index === 0) {
                    filterStr += compCompFilter[index]
                }
                else {
                    filterStr += '&' + compCompFilter[index]
                }
            }
        }

        if (compCompFilter.length > 0) {
            query.set("comp", filterStr)
        }
        else {
            query.delete("comp")
        }
        history.push({ search: query.toString() })
    }

    const setCModelURLString = () => {
        let filterStr = ''
        if (compModelFilter.length > 0) {
            for (let index = 0; index < compModelFilter.length; index++) {
                if (index === 0) {
                    filterStr += compModelFilter[index]
                }
                else {
                    filterStr += '&' + compModelFilter[index]
                }
            }
        }

        if (compModelFilter.length > 0) {
            query.set("model", filterStr)
        }
        else {
            query.delete("model")
        }
        history.push({ search: query.toString() })
    }

    const setBrandFilterURLString = () => {
        let filterStr = ''
        if (brFilter.length > 0) {
            for (let index = 0; index < brFilter.length; index++) {
                if (index === 0) {
                    filterStr += brFilter[index]
                }
                else {
                    filterStr += '&' + brFilter[index]
                }
            }
        }

        if (brFilter.length > 0) {
            query.set("brand", filterStr)
        }
        else {
            query.delete("brand")
        }
        history.push({ search: query.toString() })
    }

    useEffect(() => {
        if (atrFilter.length > 0) {
            setFilterURLString()
        }
        else {
            query.delete("filter")
            history.push({ search: query.toString() })
        }
    }, [atrFilter]);

    useEffect(() => {
        if (compCompFilter.length > 0) {
            setCCompURLString()
        }
        else {
            query.delete("comp")
            history.push({ search: query.toString() })
        }
    }, [compCompFilter]);

    useEffect(() => {
        if (compModelFilter.length > 0) {
            setCModelURLString()
        }
        else {
            query.delete("model")
            history.push({ search: query.toString() })
        }
    }, [compModelFilter]);

    useEffect(() => {
        if (brFilter.length > 0) {
            setBrandFilterURLString()
        }
        else {
            query.delete("brand")
            history.push({ search: query.toString() })
        }
    }, [brFilter]);

    useEffect(() => {
        let filt = [];
        excludedBrands && excludedBrands.forEach(element => {

            filt.push(element.brand);
        });
        setInclBrands(filt)
    }, [excludedBrands])

    useEffect(() => {
        if(itemsPerPage)
        dispatch(getProductsByCategory(category, subcategory, itemsPerPage, currentPage, sortType, atrFilter, brFilter, compCompFilter, compModelFilter));
        window.scrollTo(0, 0);
        // setFilters([]);
        // setBrandFilters([]);
        // setCompatibleCompanyFilters([]);
        // setCompatibleModelFilters([]);
        return () => {

        };
    }, [dispatch, category, subcategory, itemsPerPage, currentPage, sortType, atrFilter, brFilter, compCompFilter, compModelFilter])


    useEffect(() => {
        dispatch(getFeatureTitlesByCategory(category, subcategory));
        dispatch(getFeatureNameByCategory(category, subcategory));
        dispatch(getFeatures());
        dispatch(getCompatibilities(category, subcategory));
        window.scrollTo(0, 0);
        return () => {

        };
    }, [dispatch, category, subcategory])

    

    useEffect(() => {
        const handleHoverOutside = (event) => {
            if (!modalRef?.current?.contains(event.target)) {
                setFilterModal(false);
            }
        };
        document.addEventListener("mouseover", handleHoverOutside);
    }, [modalRef]);

    function useQuery() {
        return new URLSearchParams(location.search);
    }

    function handlePageClick({ selected: selectedPage }) {
        query.set("Page", parseInt(selectedPage) + 1)
        history.push({ search: query.toString() })
        setCurrentPage(parseInt(selectedPage));
    }

    const filterHandler = (checked, value) => {
        if (checked) {
            let filt = [...atrFilter];
            filt.push(value);
            dispatch(storeFilters(filt))
        }
        else {
            let i = atrFilter.indexOf(value);
            let filt = [...atrFilter];
            filt.splice(i, 1);
            dispatch(storeFilters(filt));
        }
        query.delete("Page")
        history.push({ search: query.toString() })
        setCurrentPage(0)
    }

    const filterBrandHandler = (checked, value) => {
        if (checked) {
            let filt = [...brFilter];
            filt.push(value);
            dispatch(storeBrandFilters(filt))
        }
        else {
            let i = brFilter.indexOf(value);
            let filt = [...brFilter];
            filt.splice(i, 1);
            dispatch(storeBrandFilters(filt))
        }
        query.delete("Page")
        history.push({ search: query.toString() })
        setCurrentPage(0)
    }

    const filterByCompatibilityCompany = (checked, value) => {
        if (checked) {
            let filt = [...compCompFilter];
            filt.push(value);
            dispatch(storeCompatibleCompanyFilters(filt))
        }
        else {
            let i = compCompFilter.indexOf(value);
            let filt = [...compCompFilter];
            filt.splice(i, 1);
            dispatch(storeCompatibleCompanyFilters(filt))
        }
        query.delete("Page")
        history.push({ search: query.toString() })
        setCurrentPage(0)
    }

    const filterByCompatibilityModel = (checked, value) => {
        if (checked) {
            let filt = [...compModelFilter];
            filt.push(value);
            dispatch(storeCompatibleModelFilters(filt));
        }
        else {
            let i = compModelFilter.indexOf(value);
            let filt = [...compModelFilter];
            filt.splice(i, 1);
            dispatch(storeCompatibleModelFilters(filt));
        }
        query.delete("Page")
        history.push({ search: query.toString() })
        setCurrentPage(0)
    }

    const compCompanies = compatibilities && [...new Set(compatibilities.map(mod => mod.compatibility_company))]

    // const compatibilityCompaniesId = compatibilities && [...new Set(compatibilities.filter(comp => compCompFilter.includes(comp.compatibility_company)).map(id => id.product_id))]

    const compModels = compatibilities && [...new Set(compatibilities.filter(comp => compCompFilter.includes(comp.compatibility_company)).map(mod => mod.compatibility_model))]

    // const compatibilityModelsId = compatibilities && [...new Set(compatibilities.filter(comp => compatibleModelFilters.includes(comp.compatibility_model)).map(id => id.product_id))]

    const itemsPerPageHandler = (ipp) => {
        query.set("ItemsPerPage", ipp)
        history.push({ search: query.toString() })
        setItemsPerPage(ipp)
        query.set("Page", 1)
        history.push({ search: query.toString() })
        setCurrentPage(0)
    }

    const sortTypeHandler = (srt) => {
        query.set("SortBy", srt)
        history.push({ search: query.toString() })
        setSortType(srt)
    }

    return (
        <div className="products-by-category-wrapper">
            <Helmet>
                <title>{`Grand Mobile Accessories-${subcategory}`}</title>
                <meta name="description" content={`Στο grandmobile.gr θα βρείτε μεγάλη ποικιλία από ${subcategory} στις καλύτερες τιμές! `} />
                <meta name="keywords" content={`${category},${subcategory},Χαλκίδα,xalkida`} />
            </Helmet>
            <div className="product-menu-sidebar" style={{ display: isProductMenuOpen ? "block" : "none" }}>
                <ProductMenu />
            </div>
            <div className="products-by-category-container" id="products-by-category-container" style={{ display: isProductMenuOpen && window.innerWidth < 1024 ? "none" : "block" }}>
                <div style={{ display: 'flex' }}>
                    <button className="filter_button" onClick={() => dispatch(productMenuToggle(true))}>
                        <i className="material-icons" style={{ fontSize: "2rem" }}>sort</i>
                        <h3>Κατηγορίες</h3>
                    </button>
                    <ul className="breadcrumb">
                        <li><Link to="/">Αρχική</Link></li>
                        <li><Link to="/products">Προϊόντα</Link></li>
                        <li>{category}</li>
                        <li>{subcategory}</li>
                    </ul>
                </div>
                <ul className="filter_items">
                    <li>
                        <button className="filter-button" onClick={() => setFilterModal(true)}>Φίλτρα</button>
                        <div id="filterModal"
                            className="modal filterModal"
                            style={{ display: filterModal ? "block" : "none" }}
                        >
                            <div className="filter-modal-content" ref={modalRef}>
                                <div className="filterHeader">
                                    <h2>Φίλτρα</h2>
                                    <button className="exitButton" onClick={() => setFilterModal(false)}><span className="material-icons">
                                        close
                                    </span></button>
                                </div>
                                <FilterContainer                                    
                                    loadingFeatureTitles={loadingFeatureTitles}
                                    errorFeatureTitles={errorFeatureTitles}
                                    featureTitles={featureTitles}
                                    featureNames={featureNames}
                                    filterHandler={filterHandler}
                                    loadingCompatibilities={loadingCompatibilities}
                                    errorCompatibilities={errorCompatibilities}
                                    compatibilities={compatibilities}
                                    compCompanies={compCompanies}
                                    filter={atrFilter}
                                    brandFilter={brFilter}
                                    compFilter={compCompFilter}
                                    modelFilter={compModelFilter}
                                    excludedBrands={inclBrands}
                                    filterByCompatibilityCompany={filterByCompatibilityCompany}
                                    compModels={compModels}
                                    filterByCompatibilityModel={filterByCompatibilityModel}
                                    uniqueBrands={uniqueBrands}
                                    subcategory={subcategory}
                                    filterBrandHandler={filterBrandHandler} />
                            </div>
                        </div>
                    </li>
                    <li>
                        <label>Εμφάνιση:</label>
                        <select className="filter_items_per_page select-model" value={itemsPerPage} onChange={(e) => itemsPerPageHandler(parseInt(e.target.value))}>
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                            <option value="96">96</option>
                        </select>
                    </li>
                    <li>
                        <label>Ταξινόμηση:</label>
                        <select className="filter_items_per_page select-model" value={sortType} onChange={(e) => sortTypeHandler(e.target.value)} selected={sortType}>
                            <option value="Προεπιλογή">Προεπιλογή</option>
                            <option value="alphabetic">Αλφαβητικά: Α-Ω</option>
                            <option value="alphabeticDESC">Αλφαβητικά: Ω-Α</option>
                            <option value="price">Τιμή αύξουσα</option>
                            <option value="priceDESC">Τιμή φθίνουσα</option>
                        </select>
                    </li>
                </ul>
                <div>
                    {loading ? <LoadingSpinner /> :
                        error ? <div>{error}</div> :
                            <div className="collection">
                                {products.map(product => (
                                    <Product key={product._id} src={product.image} id={product._id} details={"/product/" + product._id} alt={product.name} productName={product.name} price={product.totalPrice} />
                                ))}
                            </div>
                    }
                </div>
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
        </div>
    )
}

export default ProductsByCategoryScreen;