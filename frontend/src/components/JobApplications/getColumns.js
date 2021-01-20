import { Button } from '@material-ui/core';
import getRating from '../../utils/getRating';

const getColumns = (upgrade, reject) => [
  {
    field: 'Name',
    valueGetter: params => params.getValue('user').name,
    width: 150,
  },
  {
    field: 'Rating',
    valueGetter: params => getRating(params.getValue('user').rating),
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 150,
    valueFormatter: params => {
      const d = new Date(params.value);
      return d.toDateString();
    },
  },
  {
    field: 'Skills',
    width: 150,
    valueGetter: params => params.getValue('user').skills.join(', '),
  },
  {
    field: 'Education',
    width: 200,
    valueGetter: params =>
      params
        .getValue('user')
        .education.map(
          e => `${e.institution} (${e.start} - ${e.end || 'current'})`
        )
        .join(', '),
  },
  {
    field: 'sop',
    headerName: 'SoP',
    width: 200,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 110,
    valueFormatter: params => {
      switch (params.value) {
        case 'U':
          return 'Applied';
        case 'S':
          return 'Shortlisted';
        case 'A':
          return 'Accepted';
      }
    },
  },
  {
    field: 'Upgrade',
    width: 110,
    renderCell: params => (
      <Button
        disabled={params.getValue('status') === 'A'}
        onClick={() => upgrade(params.getValue('id'))}>
        {params.getValue('status') === 'U' ? 'Shortlist' : 'Accept'}
      </Button>
    ),
  },
  {
    field: 'Reject',
    renderCell: params => (
      <Button
        disabled={params.getValue('status') === 'A'}
        color='secondary'
        onClick={() => reject(params.getValue('id'))}>
        Reject
      </Button>
    ),
  },
];

export default getColumns;
