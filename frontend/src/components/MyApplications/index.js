import React, { useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';

import api from '../../api';
import { setError } from '../../store';
import getColumns from './getColumns';

const MyApplications = () => {
  const dispatch = useDispatch();
  const { data, error, mutate } = useSWR('get-my-applications', () =>
    api.get('/api/myapplications')
  );
  const [loading, setLoading] = useState(false);
  console.log(data);

  if (error && error.errors) dispatch(setError(error.errors[0].msg));

  const rate = async (jobId, value) => {
    setLoading(true);

    try {
      await api.put(`/api/users/review/job/${jobId}`, { value });
      await mutate();
    } catch (err) {
      if (err.errors) dispatch(setError(err.errors[0].msg));
    }

    setLoading(false);
  };

  const formattedData = (data || []).map(r => ({ ...r, id: r._id }));

  return (
    <DataGrid
      autoHeight
      loading={(!data && !error) || loading}
      rows={formattedData}
      columns={getColumns(rate)}
    />
  );
};

export default MyApplications;
