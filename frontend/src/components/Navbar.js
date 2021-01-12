import React from 'react';
import { AppBar, Toolbar, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { logout } from '../store';

const Navbar = () => {
  const dispatch = useDispatch();
  const loggedIn = useSelector(state => state.loggedIn);
  const role = useSelector(state => state.role);

  if (!loggedIn) return null;

  return (
    <AppBar color='transparent'>
      <Toolbar>
        {role === 'applicant' ? (
          <>
            <Box m={2}>
              <Link to='/jobs'>Jobs</Link>
            </Box>
            <Box m={2}>
              <Link to='/applications'>My Applications</Link>
            </Box>
          </>
        ) : (
          <>
            <Box m={2}>
              <Link to='/myjobs'>My Jobs</Link>
            </Box>
            <Box m={2}>
              <Link to='/employees'>My Employees</Link>
            </Box>
          </>
        )}
        <Box m={2}>
          <Link to='/profile'>Profile</Link>
        </Box>
        <Box m={2}>
          <Link onClick={() => dispatch(logout())}>Logout</Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
