import React, { useState } from 'react';
import { Grid, MenuItem, Select, Divider } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';

import api from '../../api';
import { setError } from '../../store';
import getColumns from './getColumns';
import getRating from '../../utils/getRating';

const Employees = () => {
  const dispatch = useDispatch();
  const { data, error, mutate } = useSWR(`get-employees`, () =>
    api.get(`/api/employees`)
  );
  const [sort, setSort] = useState('name');
  const [sortType, setSortType] = useState(1);
  const [loading, setLoading] = useState(false);

  if (error && error.errors) dispatch(setError(error.errors[0].msg));

  const rate = async (userId, value) => {
    setLoading(true);

    try {
      await api.put(`/api/users/review/applicant/${userId}`, { value });
      await mutate();
    } catch (err) {
      if (err.errors) dispatch(setError(err.errors[0].msg));
    }

    setLoading(false);
  };

  let formattedData = (data || []).map(r => ({ ...r, id: r._id }));

  formattedData = formattedData.sort((a, b) => {
    if (sort === 'name')
      return sortType * a.user.name.localeCompare(b.user.name);
    if (sort === 'job')
      return sortType * a.job.title.localeCompare(b.job.title);
    if (sort === 'rating')
      return (
        sortType *
        (getRating(a.user.rating, true) - getRating(b.user.rating, true))
      );
    if (sort === 'date') {
      const d1 = new Date(a.joinDate);
      const d2 = new Date(b.joinDate);

      return d1 > d2 ? sortType : -sortType;
    }
    return 0;
  });

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={1} />
        <Grid item xs={2}>
          <Select value={sort} onChange={e => setSort(e.target.value)}>
            <MenuItem value='name'>Name</MenuItem>
            <MenuItem value='job'>Job</MenuItem>
            <MenuItem value='rating'>Rating</MenuItem>
            <MenuItem value='date'>Joining Date</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={2}>
          <Select value={sortType} onChange={e => setSortType(e.target.value)}>
            <MenuItem value={1}>Asc</MenuItem>
            <MenuItem value={-1}>Des</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} />
      </Grid>
      <Divider />
      <DataGrid
        autoHeight
        loading={(!data && !error) || loading}
        rows={formattedData}
        columns={getColumns(rate)}
      />
    </>
  );
};

export default Employees;
