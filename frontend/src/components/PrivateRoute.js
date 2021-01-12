import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, role, ...rest }) => {
  const loggedIn = true;
  const myRole = 'applicant';

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
