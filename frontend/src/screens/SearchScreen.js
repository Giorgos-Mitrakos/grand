import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { filtersStore, searchForItem, selectItemsPerPage } from '../action/productActions';
import LoadingSpinner from '../components/LoadingSpinner';
import Product from '../components/product';
import './SearchScreen.css'

function SearchScreen(props) {
    const searchForItems = useSelector(state => state.searchForItems);
    const { searchItems, count, categories, subcategories, loading, error } = searchForItems;
    const perPageItems = useSelector(state => state.perPageItems);
    const { itemsPerPage } = perPageItems;
    const textSearch = useSelector(state => state.textSearch);
    const { searchText, filters } = textSearch;
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const offset = currentPage * itemsPerPage;
    const dispatch = useDispatch();

    useEffect(() => {
        setPageCount(Math.ceil(count / itemsPerPage))
    }, [count, itemsPerPage]);

    useEffect(() => {
        dispatch(searchForItem(searchText, itemsPerPage, offset,filters));
    }, [itemsPerPage, currentPage, offset, filters]);

    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage);
    }

    const itemsPerPageHandler = (numOfItemsPerPage) => {
        dispatch(selectItemsPerPage(numOfItemsPerPage))
    }

    const filterHandler = (checked, subcategory, category) => {
        if (checked) {
            let filt = [...filters];
            filt.push({category,subcategory});
            dispatch(filtersStore(filt))
            setCurrentPage(0);
        }
        else {
            let i = filters.indexOf({category,subcategory});
            let filt = [...filters];
            filt.splice(i, 1);
            dispatch(filtersStore(filt))
            setCurrentPage(0);
        }
    }

    return (
        <div>
            <div className="title">
                <h2 className="title-center">ΑΝΑΖΗΤΗΣΗ</h2>
            </div>
            {!loading && <div className="title">
                <h5 className="title-center">Βρέθηκαν {count} προϊόντα</h5>
                <h5 className="title-center">Περιορίστε την αναζήτηση στις κατηγορίες</h5>
            </div>}
            <ul className="search-filters">
                {categories && categories.map(x =>
                    <li className="filter-title">{x.category}
                    <hr className="filter-separator"/>
                        <ul className="filter-subtitle">
                            {subcategories && subcategories.map(y => (y.category === x.category) &&
                                <li className="filter-subcategory">
                                    <input type="checkbox" className="filterByFeatures" value={y.subcategory}
                                    onChange={(e) => filterHandler(e.target.checked, e.target.value,x.category)} checked={filters.map(z=>z.subcategory).includes(y.subcategory) && filters.map(w=>w.category).includes(x.category)}>
                                    </input>
                                    <label >{y.subcategory}</label>
                                </li>)}
                        </ul>
                    </li>)}
            </ul>
            <div className="filter_collection">
                <label>Εμφάνιση:</label>
                <select className="filter_collection_per_page" onChange={(e) => itemsPerPageHandler(e.target.value)}>
                    <option value="20">20</option>
                    <option value="40">40</option>
                    <option value="60">60</option>
                    <option value="80">80</option>
                </select>
            </div>
            {loading ? <LoadingSpinner /> :
                error ? <div>{error}</div> :
                    <div className="collection">
                        {searchItems && searchItems.map(product => (
                            <Product key={product._id} src={product.image} id={product._id} details={"/product/" + product._id} alt={product.name} productName={product.name} price={product.totalPrice} />
                        ))}
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

export default SearchScreen;