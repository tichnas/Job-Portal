import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, role, ...rest }) => {
  const loggedIn = useSelector(state => state.loggedIn);
  const myRole = useSelector(state => state.role);

  return (
    <Route
      {...rest}
      render={props =>
        loggedIn && (!role || role === myRole) ? (
          <Component {...props} />
        ) : (
          <Redirect to='/' />
        )
      }
    />
  );
};

export default PrivateRoute;
