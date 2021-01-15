import React, { useState } from 'react';
import {
  InputBase,
  Grid,
  MenuItem,
  Select,
  Divider,
  Checkbox,
  TextField,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';

import api from '../../api';
import { setError } from '../../store';
import getRating from './getRating';
import ApplyJob from './ApplyJob';
import getColumns from './getColumns';

const ApplicantDashboard = () => {
  const dispatch = useDispatch();
  const { data, error } = useSWR('get-jobs', () => api.get('/api/jobs'));
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('salary');
  const [sortType, setSortType] = useState(1);
  const [toApply, setToApply] = useState();
  const [jobType, setJobType] = useState({ WH: true, PT: true, FT: true });
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(9999999);
  console.log(data);

  if (error && error.errors) dispatch(setError(error.errors[0].msg));

  const changeJobType = e =>
    setJobType(old => ({ ...old, [e.target.name]: e.target.checked }));

  let formattedData = (data || []).map(r => ({ ...r, id: r._id }));

  formattedData = formattedData.sort((a, b) => {
    if (sort === 'salary') return sortType * (a.salary - b.salary);
    if (sort === 'rating')
      return sortType * (getRating(a.rating) - getRating(b.rating));
    if (sort === 'duration')
      return (
        sortType *
        (a.duration === 0 ? 1 : b.duration === 0 ? -1 : a.duration - b.duration)
      );
    return 0;
  });

  formattedData = formattedData.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  formattedData = formattedData.filter(
    d => d.salary >= minSalary && d.salary <= maxSalary
  );

  // TODO: filter by duration

  return (
    <>
      <ApplyJob toApply={toApply} setToApply={setToApply} />
      <Grid container spacing={1}>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <InputBase
            style={{ border: '1px solid blue' }}
            fullWidth
            color='secondary'
            placeholder='Search'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={3} />

        <Grid item xs={2} />
        <Grid item xs={1}>
          <Select value={sort} onChange={e => setSort(e.target.value)}>
            <MenuItem value='salary'>Salary</MenuItem>
            <MenuItem value='duration'>Duration</MenuItem>
            <MenuItem value='rating'>Rating</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={2}>
          <Select value={sortType} onChange={e => setSortType(e.target.value)}>
            <MenuItem value={1}>Asc</MenuItem>
            <MenuItem value={-1}>Des</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={3}>
          <Checkbox name='WH' checked={jobType.WH} onChange={changeJobType} />
          Work from Home
        </Grid>
        <Grid item xs={2}>
          <Checkbox name='PT' checked={jobType.PT} onChange={changeJobType} />
          Part-Time
        </Grid>
        <Grid item xs={2}>
          <Checkbox name='FT' checked={jobType.FT} onChange={changeJobType} />
          Full-time
        </Grid>

        <Grid item xs={2} />
        <Grid item xs={3}>
          <TextField
            value={minSalary}
            onChange={e => setMinSalary(e.target.value)}
            label='Min Salary'
            type='number'
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            value={maxSalary}
            onChange={e => setMaxSalary(e.target.value)}
            label='Max Salary'
            type='number'
          />
        </Grid>
        <Grid item>
          <Select></Select>
        </Grid>

        <Grid item xs={12} />
      </Grid>
      <Divider />
      <DataGrid
        autoHeight
        loading={!data && !error}
        rows={formattedData}
        columns={getColumns(setToApply)}
      />
    </>
  );
};

export default ApplicantDashboard;
