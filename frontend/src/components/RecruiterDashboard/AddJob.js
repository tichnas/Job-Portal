import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Modal,
  Paper,
  TextField,
  Box,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  Chip,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';

import api from '../../api';
import { setError } from '../../store';
import { initialSkills } from '../../constants';

const initialState = {
  title: '',
  maxApplications: 0,
  maxPositions: 0,
  deadline: new Date().toISOString().split('T')[0],
  type: 'FT',
  duration: 1,
  salary: 0,
  skills: [],
};

const AddJob = ({ toAdd, setToAdd, mutate }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialState);
  const [newSkill, setNewSkill] = useState('');

  const cancel = () => {
    setToAdd(false);
    setData(initialState);
  };

  const save = async () => {
    setLoading(true);

    try {
      await api.post(`/api/jobs`, {
        ...data,
        deadline: Date.parse(data.deadline),
      });
      await mutate();
      cancel();
    } catch (err) {
      if (err.errors) dispatch(setError(err.errors[0].msg));
    }

    setLoading(false);
  };

  const handleChange = e => {
    console.log(e.target.value >= 0);
    if (e.target.value >= 0 || !parseInt(e.target.value))
      setData(old => ({ ...old, [e.target.name]: e.target.value }));
  };

  const addSkill = s => {
    setData(d => ({
      ...d,
      skills: [...d.skills, typeof s === 'string' ? s : newSkill],
    }));
    if (typeof s !== 'string') setNewSkill('');
  };

  const skillDelete = s => {
    const index = data.skills.indexOf(s);
    setData(d => ({
      ...d,
      skills: [...d.skills.slice(0, index), ...d.skills.slice(index + 1)],
    }));
  };

  return (
    <Modal open={toAdd}>
      <Paper>
        <Container>
          <Box p={5} m={5}>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <TextField
                  variant='outlined'
                  value={data.title}
                  name='title'
                  onChange={handleChange}
                  label='Title'
                />
                <br />
                <br />
                <TextField
                  variant='outlined'
                  value={data.maxApplications}
                  name='maxApplications'
                  onChange={handleChange}
                  label='Max Applicants'
                  type='number'
                />
                <br />
                <br />
                <TextField
                  variant='outlined'
                  value={data.deadline}
                  name='deadline'
                  onChange={handleChange}
                  label='Deadline'
                  type='date'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant='outlined'
                  value={data.maxPositions}
                  name='maxPositions'
                  onChange={handleChange}
                  label='Max Positions'
                  type='number'
                />
                <br />
                <br />
                <TextField
                  variant='outlined'
                  value={data.salary}
                  name='salary'
                  onChange={handleChange}
                  label='Salary'
                  type='number'
                />
                <br />
                <br />
                <Select
                  value={data.duration}
                  onChange={handleChange}
                  name='duration'>
                  <MenuItem value={1}>1 month</MenuItem>
                  <MenuItem value={2}>2 months</MenuItem>
                  <MenuItem value={3}>3 months</MenuItem>
                  <MenuItem value={4}>4 months</MenuItem>
                  <MenuItem value={5}>5 months</MenuItem>
                  <MenuItem value={6}>6 months</MenuItem>
                  <MenuItem value={0}>Indefinite</MenuItem>
                </Select>
                <br />
                <br />
                <Select value={data.type} onChange={handleChange} name='type'>
                  <MenuItem value='FT'>Full Time</MenuItem>
                  <MenuItem value='PT'>Part Time</MenuItem>
                  <MenuItem value='WH'>Work from Home</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={1}>
                <p>Skills</p>
              </Grid>
              <Grid item xs={11}>
                {initialSkills.map(s => (
                  <span key={s}>
                    <Checkbox
                      checked={data.skills.includes(s)}
                      onChange={e => {
                        if (e.target.checked) addSkill(s);
                        else skillDelete(s);
                      }}
                    />
                    <span>{s}</span>
                  </span>
                ))}
                {data.skills
                  .filter(s => !initialSkills.includes(s))
                  .map((s, i) => (
                    <Chip key={i} label={s} onDelete={() => skillDelete(s)} />
                  ))}
                <br />
                <TextField
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  label='New Skill'
                />
                <Button disabled={!newSkill} onClick={addSkill}>
                  Add
                </Button>
              </Grid>
            </Grid>

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

export default AddJob;
