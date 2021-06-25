import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ReactPaginate from 'react-paginate';
import './AdminAdministratorsScreen.css';
import { listNewsletters } from '../action/userActions.js';

function NewslettersScreen(props) {

    const [newsletterListModal, setNewsletterListModal] = useState(true);
    const NewsletterList = useSelector(state => state.NewsletterList);
    const { newsletterList, count, loading, error } = NewsletterList;
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [pageCount, setPageCount] = useState(0);
    const offset = currentPage * itemsPerPage;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listNewsletters(itemsPerPage,offset));
        return () => {

        }
    }, []);

    useEffect(() => {console.log(count)
        setPageCount(Math.ceil(count / itemsPerPage))
    }, [count, itemsPerPage]);


    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage);
    }

    return (
        <div>
            <div>
                <ul className="breadcrumb">
                    <li><Link to="/">Αρχική</Link></li>
                    <li>Newsletters</li>
                </ul>
            </div>
            <div className="color-wrapper">
                <div className="card-list-header" onClick={() => setNewsletterListModal(!newsletterListModal)}>
                <h4 className="expand">Λίστα εγγεγραμένων στο Newsletter</h4>
                    <i className="material-icons expand">{!newsletterListModal ? "expand_more" : "expand_less"}</i>
                </div>
                {newsletterListModal &&<div className="admin-info">
                    <div className="auto-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Ενέργεια</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? <div><LoadingSpinner /></div> :
                                    error ? <div>{error}</div> :
                                    newsletterList &&
                                    newsletterList.map(news =>
                                            <tr key={news.email}>
                                                <td>{news.email}</td>                                                
                                            </tr>)}
                            </tbody>
                        </table>
                        <div className="paginationList">
            <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                forcePage={currentPage}
            /></div>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default NewslettersScreen;