import { Button } from '@material-ui/core';
import getRating from './getRating';

const getColumns = setToApply => [
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
  },
  {
    field: 'recruiter',
    headerName: 'Recruiter',
    valueFormatter: params => params.value.name,
    width: 150,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    valueFormatter: params => {
      const reviews = params.value;
      return `${getRating(reviews)}/5 (${reviews.length})`;
    },
  },
  {
    field: 'salary',
    headerName: 'Salary',
  },
  {
    field: 'duration',
    headerName: 'Duration',
    width: 150,
    valueFormatter: params =>
      params.value ? `${params.value} months` : 'indefinite',
  },
  {
    field: 'deadline',
    headerName: 'Deadline',
    width: 150,
    valueFormatter: params => {
      const d = new Date(params.value);
      return d.toDateString();
    },
  },
  {
    field: 'Apply',
    renderCell: params => {
      const applications = params.getValue('applications');
      const applied = params.getValue('applied');
      const full =
        applications.length >= params.getValue('maxApplications') ||
        applications.filter(a => a.status === 'A').length >=
          params.getValue('maxPositions');

      return (
        <Button
          disabled={full || applied}
          onClick={() => setToApply(params.getValue('id'))}>
          {applied ? 'Applied' : full ? 'Full' : 'Apply'}
        </Button>
      );
    },
  },
];

export default getColumns;
