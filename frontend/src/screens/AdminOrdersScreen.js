import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useSelector, useDispatch } from 'react-redux';
import './AdminOrdersScreen.css';
import { listOrders } from '../action/orderActions';

function AdminOrdersScreen(props) {
  const orderList = useSelector(state => state.orderList);
  const { loading, orders, error, count } = orderList;
  const [filter,setFilter]= useState("Όλες");
  const [filteredOrders,setFilteredOrders]= useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const offset = currentPage * itemsPerPage;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrders(filter,itemsPerPage, offset));
    window.scrollTo(0,0)
    
  }, [dispatch]);

  useEffect(() => {
    dispatch(listOrders(filter,itemsPerPage, offset));
    
  }, [filter,currentPage, offset]);

  useEffect(() => {
    setPageCount(Math.ceil(count/itemsPerPage))
}, [count,itemsPerPage]);

  useEffect(()=>{
    if(orders)
    setFilteredOrders(orders);
    return () => {
      //
    };
  },[orders]);

  const orderFilterHandler = (val) =>{
    switch (val) {
      case "new_entries_orders":
        setFilteredOrders(orders.filter(order=> order.status=== "Καταχωρήθηκε"));
        break;
      case "proccessed_orders":
        setFilteredOrders(orders.filter(order=> order.status=== "Επεξεργάζεται"));
        break;
      case "waited_orders":
        setFilteredOrders(orders.filter(order=> order.status=== "Αναμονή"));
        break;
      case "completed_orders":
        setFilteredOrders(orders.filter(order=> order.status=== "Ολοκληρώθηκε"));
        break;
      case "canceled_orders":
        setFilteredOrders(orders.filter(order=> order.status=== "Ακυρώθηκε"));
        break;    
      default:
        setFilteredOrders(orders);
        break;
    }
  }

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
}

  return loading ? <div>Loading...</div> :
        error?<div>{error}</div>:
        (
    <div className="content content-margined">
      <div className="order-header">
        <h3>Παραγγελίες</h3>
      </div>
      <div className="filter-container"> 
          <label htmlFor="canceled-orders">Αναζήτηση:</label>
          <select className="filter_orders select-model" value={filter} onChange={(e)=>setFilter(e.target.value)}>
            <option value="Όλες">Όλες</option>
            <option value="Καταχωρήθηκε">Καταχωρήμένες</option>
            <option value="Επεξεργάζετε">Επεξεργασμένες</option>
            <option value="Αναμονή">Σε αναμονή</option>
            <option value="Ολοκληρώθηκε">Ολοκληρωμένες</option>
            <option value="Ακυρώθηκε">Ακυρωμένες</option>
          </select>
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
      <div className="order-list">
        <table className="table">
          <thead>
            <tr>
              <th>Αρ. Παρ.</th>
              <th>Η/Μ Παραγγελίας</th>
              <th>Email</th>
              <th>Τρόπος Πληρωμής</th>
              <th>Παραστατικό</th>
              <th>Η/Μ Αποστολής</th>
              <th>Σύνολο</th>
              <th>Κατάσταση</th>
              <th>Λεπτομέριες</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (<tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.orderDate && Intl.DateTimeFormat('en-GB',{
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    hour12: false}).format(Date.parse(order.orderDate))}</td>
              <td>{order.user_email}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.paymentType}</td>
              <td>{order.shippingDate}</td>
              <td>{order.totalPrice} €</td>              
              <td>{order.status}</td>
              <td>
                <Link to={"/admin/order/" + order.order_id} className="button admin-button" >Λεπτομέριες</Link>                
              </td>
            </tr>))}
          </tbody>
        </table>

      </div>
    </div>)
}
export default AdminOrdersScreen;