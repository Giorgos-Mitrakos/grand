import React from 'react';
import { Redirect, Route} from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component, ...rest }) => {

    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;

    return (
      <Route {...rest} render={
        props =>userInfo && (userInfo.isAdmin===1 || userInfo.isAdmin===2)? <Component {...rest} {...props} />
        :<Redirect to ="/"/>
      } />
    )
  }

  export default ProtectedRoute;