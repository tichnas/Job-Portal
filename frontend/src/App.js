import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Provider } from 'react-redux';

import store from './store';
import Error from './Error';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Auth from './components/Auth';
import Profile from './components/Profile';
import MyApplications from './components/MyApplications';
import RecruiterDashboard from './components/RecruiterDashboard';
import JobApplications from './components/JobApplications';
import Employees from './components/Employees';
import ApplicantDashboard from './components/ApplicantDashboard';

const App = () => (
  <Provider store={store}>
    <Router>
      <Navbar />
      <Box mt={10}>
        <Route exact path='/' component={Auth} />
        <PrivateRoute exact path='/profile' component={Profile} />
        <PrivateRoute
          role='applicant'
          exact
          path='/jobs'
          component={ApplicantDashboard}
        />
        <PrivateRoute
          role='applicant'
          exact
          path='/applications'
          component={MyApplications}
        />
        <PrivateRoute
          role='recruiter'
          exact
          path='/myjobs'
          component={RecruiterDashboard}
        />
        <PrivateRoute
          role='recruiter'
          exact
          path='/myjobs/:jobId'
          component={JobApplications}
        />
        <PrivateRoute
          role='recruiter'
          exact
          path='/employees'
          component={Employees}
        />
      </Box>
      <Error />
    </Router>
  </Provider>
);

export default App;
