import React from 'react';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';
import {
  CircularProgress,
  TextField,
  Paper,
  Container,
} from '@material-ui/core';

import { setError } from '../store';
import api from '../api';
import ProfileHandler from './ProfileHandler';

const Profile = () => {
  const dispatch = useDispatch();
  const { data, error } = useSWR('get-user', () => api.get('/api/user'));

  if (!data) {
    if (error && error.errors) dispatch(setError(error.errors[0].msg));
    else return <CircularProgress />;
  }

  const submit = async newData => {
    try {
      await api.put('/api/users', newData);
    } catch (err) {
      if (err.errors) dispatch(setError(err.errors[0].msg));
    }
  };

  console.log(data);

  return (
    <Paper>
      <Container>
        <TextField disabled value={data.email} label='Email' />
        <br />
        <ProfileHandler
          initialState={data}
          role={data.role}
          submitText='Update'
          onSubmit={submit}
        />
      </Container>
    </Paper>
  );
};

export default Profile;
