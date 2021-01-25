import React from 'react';

import Rating from '../Rating';

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
    field: 'status',
    headerName: 'Status',
    valueFormatter: params => {
      switch (params.value) {
        case 'U':
          return 'Applied';
        case 'S':
          return 'Shortlisted';
        case 'A':
          return 'Accepted';
        case 'R':
          return 'Rejected';
      }
    },
  },
  {
    field: 'joinDate',
    headerName: 'Date of Joining',
    width: 150,
    valueFormatter: params => {
      if (!params.value) return '-';

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
      return (
        <Rating setRating={val => rate(params.getValue('job')._id, val)} />
      );
    },
  },
];

export default getColumns;
