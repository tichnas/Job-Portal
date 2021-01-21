import { Button } from '@material-ui/core';

const getColumns = (deleteJob, setToEdit) => [
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
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
    field: 'applications',
    headerName: 'No. of Applications',
    width: 200,
    valueFormatter: params => params.value.length || '0',
  },
  {
    field: 'Positions Left',
    width: 150,
    valueGetter: params =>
      params.getValue('maxPositions') -
      params.getValue('applications').filter(a => a.status === 'A').length,
  },
  {
    field: 'Edit',
    renderCell: params => {
      console.log(params.getValue('deadline'));
      const deadline = new Date(params.getValue('deadline'))
        .toISOString()
        .split('T')[0];

      const deadlineTime = new Date(params.getValue('deadline'))
        .toISOString()
        .split('T')[1]
        .slice(0, 5);

      return (
        <Button
          onClick={() =>
            setToEdit({
              id: params.getValue('id'),
              maxApplicants: params.getValue('maxApplications'),
              maxPositions: params.getValue('maxPositions'),
              deadline,
              deadlineTime,
            })
          }>
          Edit
        </Button>
      );
    },
  },
  {
    field: 'Delete',
    renderCell: params => {
      return (
        <Button
          color='secondary'
          onClick={() => deleteJob(params.getValue('id'))}>
          Delete
        </Button>
      );
    },
  },
];

export default getColumns;
