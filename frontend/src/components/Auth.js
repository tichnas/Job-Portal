import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Paper,
  Tabs,
  Tab,
  Container,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@material-ui/core';

import api from '../api';
import { setError, login } from '../store';
import ProfileHandler from './ProfileHandler';

const Auth = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [data, setData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'applicant',
    skills: [],
    education: [],
  });
  const [loading, setLoading] = useState(false);

  const loggedIn = useSelector(state => state.loggedIn);
  const role = useSelector(state => state.role);

  if (loggedIn)
    return <Redirect to={role === 'applicant' ? '/jobs' : '/myjobs'} />;

  const submit = async (action, newData) => {
    setLoading(true);

    try {
      const res = await api.post(`/api/users/${action}`, {
        ...data,
        ...newData,
      });

      dispatch(login(res));
      console.log(res);
    } catch (err) {
      if (err.errors) {
        dispatch(setError(err.errors[0].msg));
        console.error(err.errors);
      }
    }

    setLoading(false);
  };

  const handleChange = e =>
    setData(d => ({ ...d, [e.target.name]: e.target.value }));

  return (
    <Paper>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label='Login' />
        <Tab label='Register' />
      </Tabs>
      <Container>
        {tab ? (
          <>
            <Select value={data.role} name='role' onChange={handleChange}>
              <MenuItem value='applicant'>Applicant</MenuItem>
              <MenuItem value='recruiter'>Recruiter</MenuItem>
            </Select>
            <br />
            <br />
          </>
        ) : null}
        <TextField
          name='email'
          value={data.email}
          onChange={handleChange}
          label='Email'
        />
        <br />
        <TextField
          name='password'
          value={data.password}
          onChange={handleChange}
          label='Password'
          type='password'
        />
        <br />
        {tab ? (
          <ProfileHandler
            role={data.role}
            initialState={data}
            submitText='Register'
            onSubmit={newData => submit('register', newData)}
          />
        ) : (
          <Button disabled={loading} onClick={() => submit('login', {})}>
            Login
          </Button>
        )}
      </Container>
    </Paper>
  );
};

export default Auth;
