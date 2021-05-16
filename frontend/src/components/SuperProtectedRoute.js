import React from 'react';
import { Redirect, Route} from 'react-router-dom';
import { useSelector } from 'react-redux';

const SuperProtectedRoute = ({ component: Component, ...rest }) => {

    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;

    return (
      <Route {...rest} render={
        props =>userInfo && userInfo.isAdmin===2? <Component {...rest} {...props} />
        :<Redirect to ="/"/>
      } />
    )
  }

  export default SuperProtectedRoute;