import React from 'react';
import { AppBar, Toolbar, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const loggedIn = true;
  const role = 'applicant';

  if (!loggedIn) return null;

  return (
    <AppBar color='transparent'>
      <Toolbar>
        <Box m={2}>
          <Link to='/'>Dashboard</Link>
        </Box>
        {role === 'applicant' ? (
          <Box m={2}>
            <Link to='/applications'>My Applications</Link>
          </Box>
        ) : (
          <Box m={2}>
            <Link to='/employees'>My Employees</Link>
          </Box>
        )}
        <Box m={2}>
          <Link to='/profile'>Profile</Link>
        </Box>
        <Box m={2}>
          <Link onClick={() => console.log('Logout')}>Logout</Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
