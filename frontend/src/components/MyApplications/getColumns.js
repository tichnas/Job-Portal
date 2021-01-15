import { Button, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';

const Rating = ({ jobId, setRating }) => {
  const [val, setVal] = useState(3);

  return (
    <>
      <Select value={val} onChange={e => setVal(e.target.value)}>
        {[1, 2, 3, 4, 5].map(i => (
          <MenuItem key={i} value={i}>
            {i}
          </MenuItem>
        ))}
      </Select>
      <Button onClick={() => setRating(jobId, val)}>Submit</Button>
    </>
  );
};

const getColumns = rate => [
  {
    field: 'job',
    headerName: 'Title',
    valueFormatter: params => params.value.title,
    width: 200,
  },
  {
    field: 'Recruiter',
    valueGetter: params => params.getValue('job').recruiter.name,
    width: 150,
  },
  {
    field: 'joinDate',
    headerName: 'Date of Joining',
    width: 150,
    valueFormatter: params => {
      const d = new Date(params.value);
      return d.toDateString();
    },
  },
  {
    field: 'Salary',
    valueGetter: params => params.getValue('job').salary,
  },
  {
    field: 'Rate',
    width: 150,
    renderCell: params => {
      if (params.getValue('job').rated)
        return <p>Rated {params.getValue('job').rated}/5</p>;
      return <Rating jobId={params.getValue('job')._id} setRating={rate} />;
    },
  },
];

export default getColumns;
