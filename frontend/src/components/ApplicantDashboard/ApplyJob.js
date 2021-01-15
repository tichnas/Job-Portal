import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Modal,
  Paper,
  TextField,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';

import api from '../../api';
import { setError } from '../../store';

const ApplyJob = ({ toApply, setToApply }) => {
  const dispatch = useDispatch();
  const [SOP, setSOP] = useState('');
  const [loading, setLoading] = useState(false);

  const apply = async () => {
    setLoading(true);

    try {
      await api.put(`/api/jobs/${toApply}/apply`, { sop: SOP });
      setSOP('');
      setToApply();
    } catch (err) {
      if (err.errors) dispatch(setError(err.errors[0].msg));
    }

    setLoading(false);
  };

  const cancel = () => {
    setToApply();
    setSOP('');
  };

  return (
    <Modal open={toApply}>
      <Paper>
        <Container>
          <h2>Statement of Purpose</h2>
          <TextField
            multiline
            fullWidth
            variant='outlined'
            helperText='max 250 words'
            value={SOP}
            onChange={e => setSOP(e.target.value)}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Button onClick={cancel}>Cancel</Button>
              <Button onClick={apply}>Submit</Button>
            </>
          )}
        </Container>
      </Paper>
    </Modal>
  );
};

export default ApplyJob;
