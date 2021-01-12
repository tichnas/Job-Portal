import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Box } from '@material-ui/core';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Auth from './components/Auth';
import Profile from './components/Profile';
import MyApplications from './components/MyApplications';
import RecruiterDashboard from './components/RecruiterDashboard';
import Employees from './components/Employees';
import ApplicantDashboard from './components/ApplicantDashboard';

const App = () => (
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
        path='/employees'
        component={Employees}
      />
    </Box>
  </Router>
);

export default App;
