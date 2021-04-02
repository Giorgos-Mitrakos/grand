import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './AdminOrdersScreen.css';
import { listOrders } from '../action/orderActions';

function AdminOrdersScreen(props) {
  const orderList = useSelector(state => state.orderList);
  const { loading, orders, error } = orderList;
  const [filteredOrders,setFilteredOrders]= useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrders());
    window.scrollTo(0,0)
    
    return () => {
      //
    };
  }, [dispatch]);

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
        setFilteredOrders(orders.filter(order=> order.status=== "Επεξεργάζετε"));
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

  return loading ? <div>Loading...</div> :
        error?<div>{error}</div>:
        (
    <div className="content content-margined">
      <div className="order-header">
        <h3>Παραγγελίες</h3>
      </div>
      <div className="filter-container"> 
          <label htmlFor="canceled-orders">Αναζήτηση:</label>
          <select className="filter_orders select-model" onChange={(e)=>orderFilterHandler(e.target.value)}>
            <option value="all_orders" selected>Όλες</option>
            <option value="new_entries_orders">Καταχωρήμένες</option>
            <option value="proccessed_orders">Επεξεργασμένες</option>
            <option value="waited_orders">Σε αναμονή</option>
            <option value="completed_orders">Ολοκληρωμένες</option>
            <option value="canceled_orders">Ακυρωμένες</option>
          </select>
      </div>
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
            {filteredOrders.map(order => (<tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{Intl.DateTimeFormat('en-GB',{
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