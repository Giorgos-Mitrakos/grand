import React, { useEffect, useState } from 'react';
import './SearchButton.css'
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { filtersStore, resetFiltersStore, searchForItem, searchTextStore } from '../action/productActions';

function SearchButton(props) {
    const perPageItems = useSelector(state => state.perPageItems);
    const { itemsPerPage } = perPageItems;
    const textSearch = useSelector(state => state.textSearch);
    const { searchText } = textSearch;
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (searchText.trim() !== "") {
            history.push("/Search");
        }
        dispatch(searchForItem(searchText,itemsPerPage, 0,null));
    }, [searchText]);

    const handleSearchText =(text)=>{
        dispatch(searchTextStore(text))
        dispatch(resetFiltersStore())
    }

    return (
        <div className="searchButtonForm">
            <input onChange={(e) => handleSearchText(e.target.value)} type="text" placeholder="Αναζήτηση..." name="search" />
            <button><i className="material-icons">search</i></button>
        </div>
    )

}

export default SearchButton