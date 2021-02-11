import React, { useEffect, useState } from 'react';
import './ProductsByCategoryScreen.css';
import { Link, useParams } from 'react-router-dom';
import ProductMenu from '../menu/ProductMenu';
import Product from '../components/product.js';
import { useDispatch, useSelector } from 'react-redux';
import { getCompatibilities, getFeatureNameByCategory, getFeatures, getFeatureTitlesByCategory, getProductsByCategory } from '../action/productActions';
import { productMenuToggle } from '../action/menuActions';
import ReactPaginate from 'react-paginate';
import LoadingSpinner from '../components/LoadingSpinner';
import FilterContainer from '../components/FilterContainer';

function ProductsByCategoryScreen(props) {
    const compatibilitiesByCategory = useSelector(state => state.compatibilitiesByCategory);
    const { compatibilities, loading: loadingCompatibilities, error: errorCompatibilities } = compatibilitiesByCategory;
    const productList = useSelector(state => state.productList);
    const { products, loading, error } = productList;
    const productMenu = useSelector(state => state.productMenu);
    const { isProductMenuOpen } = productMenu;
    const featureTitlesByCategory = useSelector(state => state.featureTitlesByCategory);
    const { featureTitles, loading: loadingFeatureTitles, error: errorFeatureTitles } = featureTitlesByCategory;
    const featureNamesByCategory = useSelector(state => state.featureNamesByCategory);
    const { featureNames } = featureNamesByCategory;
    const productFeatures = useSelector(state => state.productFeatures);
    const { features } = productFeatures;
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [data, setData] = useState([]);
    const [sortType, setSortType] = useState("Προεπιλογή");
    const [filters, setFilters] = useState([]);
    const [brandFilters, setBrandFilters] = useState([]);
    const [compatibleCompanyFilters, setCompatibleCompanyFilters] = useState([]);
    const [compatibleModelFilters, setCompatibleModelFilters] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [filterModal, setFilterModal] = useState(false);
    const offset = currentPage * itemsPerPage;
    const dispatch = useDispatch();
    let { category, subcategory } = useParams();
    const [uniqueBrands, setUniqueBrands] = useState([]);

    const findUniqueBrands = () => {
        if (products && products.length !== 0) {
            let arr = [];
            products.forEach(x => {
                if (arr.indexOf(x.brand) === -1) {
                    arr.push(x.brand)
                }
            })

            setUniqueBrands(arr);
        }
    }

    useEffect(() => {
        setUniqueBrands([]);
        findUniqueBrands();
        return () => {

        }
    }, [loading]);

    useEffect(() => {
        if (data) {
            setPageCount(Math.ceil(data.length / itemsPerPage));
            setCurrentPageData(data.slice(offset, offset + itemsPerPage))
        }
        return () => {

        }
    }, [data, itemsPerPage, currentPage]);

    useEffect(() => {
        if (data) {
            setCurrentPageData(data.slice(offset, offset + itemsPerPage))
            console.log(data.slice(offset, offset + itemsPerPage))
        }
        return () => {

        }
    }, [currentPage]);

    useEffect(() => {
        dispatch(getProductsByCategory(category, subcategory));
        dispatch(getFeatureTitlesByCategory(category, subcategory));
        dispatch(getFeatureNameByCategory(category, subcategory));
        dispatch(getFeatures());
        dispatch(getCompatibilities(category, subcategory));
        window.scrollTo(0, 0);
        setFilters([]);
        setBrandFilters([]);
        setCompatibleCompanyFilters([]);
        setCompatibleModelFilters([]);
        return () => {

        };
    }, [category, subcategory])

    useEffect(() => {

        window.scrollTo(0, 80)

        return () => {

        };
    }, [currentPage])

    useEffect(() => {

        sortedData();

        return () => {

        };
    }, [sortType])

    useEffect(() => {
        setCurrentPage(0);
        setData(products);
        return () => {

        };
    }, [products])

    useEffect(() => {
        var multiFilter = products;
        if (filters.length !== 0) {
            let ft = features.filter(x => filters.includes(x.feature));
            let arr = [];
            ft.forEach(element => {
                arr.push(element.product_id)
            });

            multiFilter = products.filter(x => arr.includes(x._id));
        }
        if (brandFilters.length !== 0) {
            multiFilter = multiFilter.filter(x => brandFilters.includes(x.brand));

        }
        if (compatibleCompanyFilters.length !== 0) {
            multiFilter = multiFilter.filter(x => compatibilityCompaniesId.includes(x._id));
        }
        if (compatibleModelFilters.length !== 0) {
            multiFilter = multiFilter.filter(x => compatibilityModelsId.includes(x._id));
        }
        setData(multiFilter);
        setSortType("Προεπιλογή");
        return () => {

        };
    }, [filters, brandFilters, compatibleCompanyFilters, compatibleModelFilters])

    useEffect(() => {

        // Handler to call on window resize

        function handleResize() {

            // Set window width/height to state
            if (window.innerWidth > 1024) {
                dispatch(productMenuToggle(true));

            }
            else {
                dispatch(productMenuToggle(false));
            }

        }
        // Add event listener

        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size

        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);

    }, []); // Empty array ensures that effect is only run on mount

    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(parseInt(selectedPage));
    }

    const filterHandler = (checked, value) => {
        if (checked) {
            let filt = [...filters];
            filt.push(value);
            setFilters(filt);
        }
        else {
            let i = filters.indexOf(value);
            let filt = [...filters];
            filt.splice(i, 1);
            setFilters(filt);
        }
    }

    const filterBrandHandler = (checked, value) => {
        if (checked) {
            let filt = [...brandFilters];
            filt.push(value);
            setBrandFilters(filt);
        }
        else {
            let i = brandFilters.indexOf(value);
            let filt = [...brandFilters];
            filt.splice(i, 1);
            setBrandFilters(filt);
        }
    }

    const filterByCompatibilityCompany = (checked, value) => {
        if (checked) {
            let filt = [...compatibleCompanyFilters];
            filt.push(value);
            setCompatibleCompanyFilters(filt);
        }
        else {
            let i = compatibleCompanyFilters.indexOf(value);
            let filt = [...compatibleCompanyFilters];
            filt.splice(i, 1);
            setCompatibleCompanyFilters(filt);
        }
    }

    const filterByCompatibilityModel = (checked, value) => {
        if (checked) {
            let filt = [...compatibleModelFilters];
            filt.push(value);
            setCompatibleModelFilters(filt);
        }
        else {
            let i = compatibleModelFilters.indexOf(value);
            let filt = [...compatibleModelFilters];
            filt.splice(i, 1);
            setCompatibleModelFilters(filt);
        }
    }

    const sortedData = () => {
        let sorted = [];

        switch (sortType) {
            case "Προεπιλογή":
                setData(data);
                break;
            case "Αλφαβητικά: Α-Ω":
                sorted = [...data].sort((a, b) => a.name > b.name ? 1 : -1);
                setData(sorted);
                break;
            case "Αλφαβητικά: Ω-Α":
                sorted = [...data].sort((a, b) => a.name > b.name ? 1 : -1);
                sorted.reverse();
                setData(sorted);
                break;
            case "Τιμή αύξουσα":
                sorted = [...data].sort((a, b) => a.totalPrice - b.totalPrice);
                setData(sorted);
                break;
            case "Τιμή φθίνουσα":
                sorted = [...data].sort((a, b) => b.totalPrice - a.totalPrice);
                setData(sorted);
                break;
            default:
                break;
        }
    }

    const compCompanies = compatibilities && [...new Set(compatibilities.map(mod => mod.compatibility_company))]

    const compatibilityCompaniesId = compatibilities && [...new Set(compatibilities.filter(comp => compatibleCompanyFilters.includes(comp.compatibility_company)).map(id => id.product_id))]

    const compModels = compatibilities && [...new Set(compatibilities.filter(comp => compatibleCompanyFilters.includes(comp.compatibility_company)).map(mod => mod.compatibility_model))]

    const compatibilityModelsId = compatibilities && [...new Set(compatibilities.filter(comp => compatibleModelFilters.includes(comp.compatibility_model)).map(id => id.product_id))]

    return (
        <div className="products-by-category-wrapper">
            <div className="product-menu-sidebar" style={{ display: isProductMenuOpen ? "block" : "none" }}>
                <ProductMenu />
            </div>
            <div className="products-by-category-container" id="products-by-category-container" style={{ display: isProductMenuOpen && window.innerWidth < 1024 ? "none" : "block" }}>
                <div style={{ display: 'flex' }}>
                    <button className="filter_button" onClick={() => dispatch(productMenuToggle(true))}>
                        <i className="material-icons" style={{ fontSize: "2rem" }}>sort</i>
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
                        <div id="filterModal" className="modal" style={{ display: filterModal ? "block" : "none" }}>
                            <div className="filter-modal-content">
                                <div className="modalHeader">
                                    <h2>Φίλτρα</h2>
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
                                    filterByCompatibilityCompany={filterByCompatibilityCompany}
                                    compModels={compModels}
                                    filterByCompatibilityModel={filterByCompatibilityModel}
                                    uniqueBrands={uniqueBrands}
                                    subcategory={subcategory}
                                    filterBrandHandler={filterBrandHandler} />
                                <div className="okCancelButton-wrapper">
                                    <button className="okCancelButton button" onClick={() => setFilterModal(false)}>Εφαρμογή</button>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <label>Εμφάνιση:</label>
                        <select className="filter_items_per_page" onChange={(e) => setItemsPerPage(parseInt(e.target.value))}>
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                            <option value="96">96</option>
                        </select>
                    </li>
                    <li>
                        <label>Ταξινόμηση:</label>
                        <select className="filter_items_per_page" value={sortType} onChange={(e) => setSortType(e.target.value)} selected={sortType}>
                            <option value="Προεπιλογή">Προεπιλογή</option>
                            <option value="Αλφαβητικά: Α-Ω">Αλφαβητικά: Α-Ω</option>
                            <option value="Αλφαβητικά: Ω-Α">Αλφαβητικά: Ω-Α</option>
                            <option value="Τιμή αύξουσα">Τιμή αύξουσα</option>
                            <option value="Τιμή φθίνουσα">Τιμή φθίνουσα</option>
                        </select>
                    </li>
                </ul>
                <div>
                    {loading ? <LoadingSpinner /> :
                        error ? <div>{error}</div> :
                            <div className="collection">
                                {currentPageData.map(product => (
                                    <Product src={product.image} id={product._id} details={"/product/" + product._id} alt={product.name} productName={product.name} price={product.totalPrice} />
                                ))}
                            </div>
                    }
                </div>
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
        </div>
    )
}

export default ProductsByCategoryScreen;