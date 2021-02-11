import React, { useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './AdminOrdersScreen.css';
import { listCustomerOrders } from '../action/orderActions';

function CustomerOrdersScreen(props) {
  const customerOrderList = useSelector(state => state.customerOrderList);
  const { loading, orders, error } = customerOrderList;
  const userSignin = useSelector(state=>state.userSignin);
  const {userInfo} = userSignin;
  
  const dispatch = useDispatch();
  
  useEffect(()=>{        
    if(userInfo===null){
        props.history.push("/");
    }
            
  },[userInfo,props.history]);

  useEffect(()=>{        
    if(userInfo)
    {            
        dispatch(listCustomerOrders(userInfo.email));
    }        
  },[userInfo,dispatch]);

  return loading ? <div>Loading...</div> :
        error?<div>{error}</div>:
        (
    <div className="content content-margined">
      <div className="order-header">
        <h3>Οι παραγγελίες μου</h3>
      </div>
      <div className="order-list">
        <table className="table">
          <thead>
            <tr>
              <th>Αρ. Παρ.</th>
              <th>Η/Μ Παραγγελίας</th>
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
              <td>{Intl.DateTimeFormat('en-GB',{
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    hour12: false}).format(Date.parse(order.orderDate))}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.paymentType}</td>
              <td>{order.shippingDate}</td>
              <td>{order.totalPrice} €</td>              
              <td>{order.status}</td>
              <td>
                <Link to={"/my-order-details/" + order.order_id} className="button admin-button" >Λεπτομέριες</Link>                
              </td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>)
}
export default CustomerOrdersScreen;