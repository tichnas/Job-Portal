import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { setError } from './store';

const Error = () => {
  const error = useSelector(state => state.error);
  const dispatch = useDispatch();

  const hideError = () => dispatch(setError());

  if (!error) return null;

  return (
    <Snackbar open autoHideDuration={5000} onClose={hideError}>
      <Alert severity='error'>{error}</Alert>
    </Snackbar>
  );
};

export default Error;
