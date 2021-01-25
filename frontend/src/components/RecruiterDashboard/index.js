import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import api from '../../api';
import { setError } from '../../store';
import EditJob from './EditJob';
import AddJob from './AddJob';
import getColumns from './getColumns';

const ApplicantDashboard = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { data, error, mutate } = useSWR('get-my-jobs', () =>
    api.get('/api/myjobs')
  );
  const [toEdit, setToEdit] = useState({});
  const [toAdd, setToAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(data);

  if (error && error.errors) dispatch(setError(error.errors[0].msg));

  const deleteJob = async job => {
    setLoading(true);

    try {
      if (window.confirm('Are you sure you want to delete the job?')) {
        await api.delete(`/api/jobs/${job}`);
        await mutate();
      }
    } catch (err) {
      if (err.errors) dispatch(setError(err.errors[0].msg));
    }

    setLoading(false);
  };

  const formattedData = (data || [])
    .map(r => ({ ...r, id: r._id }))
    .filter(
      r => r.applications.filter(a => a.status === 'A').length < r.maxPositions
    );

  return (
    <>
      <EditJob toEdit={toEdit} setToEdit={setToEdit} mutate={mutate} />
      <AddJob toAdd={toAdd} setToAdd={setToAdd} mutate={mutate} />
      <Button variant='contained' onClick={() => setToAdd(true)}>
        Add New Job
      </Button>
      <DataGrid
        autoHeight
        loading={(!data && !error) || loading}
        rows={formattedData}
        columns={getColumns(deleteJob, setToEdit)}
        onCellClick={({ field, row }) => {
          if (field !== 'Delete' && field !== 'Edit')
            history.push(`/myjobs/${row.id}`);
        }}
      />
    </>
  );
};

export default ApplicantDashboard;
