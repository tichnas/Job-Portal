import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Modal,
  Paper,
  TextField,
  Box,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';

import api from '../../api';
import { setError } from '../../store';

const EditJob = ({ toEdit, setToEdit, mutate }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);

    const formattedDeadline = new Date(
      Date.parse(toEdit.deadline + 'T' + toEdit.deadlineTime)
    );
    formattedDeadline.setHours(formattedDeadline.getHours() + 5);
    formattedDeadline.setMinutes(formattedDeadline.getMinutes() + 30);

    try {
      await api.put(`/api/jobs/${toEdit.id}`, {
        maxApplications: toEdit.maxApplicants,
        maxPositions: toEdit.maxPositions,
        deadline: formattedDeadline.valueOf(),
      });
      await mutate();
      setToEdit({});
    } catch (err) {
      if (err.errors) dispatch(setError(err.errors[0].msg));
    }

    setLoading(false);
  };

  const cancel = () => {
    setToEdit({});
  };

  const handleChange = e => {
    if (
      e.target.value >= 0 ||
      e.target.name === 'deadline' ||
      e.target.name === 'deadlineTime'
    )
      setToEdit(old => ({ ...old, [e.target.name]: e.target.value }));
  };

  console.log(toEdit.deadline);

  return (
    <Modal open={toEdit.id}>
      <Paper>
        <Container>
          <Box p={10} m={10}>
            <TextField
              variant='outlined'
              value={toEdit.maxApplicants}
              name='maxApplicants'
              onChange={handleChange}
              label='Max Applicants'
              type='number'
            />
            <br />
            <br />
            <TextField
              variant='outlined'
              value={toEdit.maxPositions}
              name='maxPositions'
              onChange={handleChange}
              label='Max Positions'
              type='number'
            />
            <br />
            <br />
            <TextField
              variant='outlined'
              value={toEdit.deadline}
              name='deadline'
              onChange={handleChange}
              label='Deadline'
              type='date'
            />
            <br />
            <br />
            <TextField
              variant='outlined'
              value={toEdit.deadlineTime}
              name='deadlineTime'
              onChange={handleChange}
              label='Deadline Time'
              type='time'
            />
            <br />
            <br />
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Button onClick={cancel}>Cancel</Button>
                <Button onClick={save}>Save</Button>
              </>
            )}
          </Box>
        </Container>
      </Paper>
    </Modal>
  );
};

export default EditJob;
