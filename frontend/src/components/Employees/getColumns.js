import React from 'react';

import getRating from '../../utils/getRating';
import Rating from '../Rating';

const getColumns = rate => [
  {
    field: 'Name',
    width: 150,
    valueGetter: params => params.getValue('user').name,
  },
  {
    field: 'Rating',
    valueGetter: params => getRating(params.getValue('user').rating),
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
    field: 'Job Type',
    width: 150,
    valueGetter: params => {
      switch (params.getValue('job').type) {
        case 'FT':
          return 'Full Time';
        case 'PT':
          return 'Part Time';
        case 'WH':
          return 'Work from Home';
      }
    },
  },
  {
    field: 'Job',
    valueGetter: params => params.getValue('job').title,
  },
  {
    field: 'Rate',
    width: 150,
    renderCell: params => {
      if (params.getValue('user').rated)
        return <p>Rated {params.getValue('user').rated}/5</p>;
      return (
        <Rating setRating={val => rate(params.getValue('user')._id, val)} />
      );
    },
  },
];

export default getColumns;
