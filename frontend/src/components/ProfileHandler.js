import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Chip,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core';

const ProfileHandler = ({ role, initialState, onSubmit, submitText }) => {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({
    institution: '',
    start: '',
    end: '',
  });

  const submit = async () => {
    setLoading(true);
    await onSubmit({ ...data });
    setLoading(false);
  };

  const handleChange = e =>
    setData(d => ({ ...d, [e.target.name]: e.target.value }));

  const addSkill = () => {
    setData(d => ({ ...d, skills: [...d.skills, newSkill] }));
    setNewSkill('');
  };

  const skillDelete = s => {
    const index = data.skills.indexOf(s);
    setData(d => ({
      ...d,
      skills: [...d.skills.slice(0, index), ...d.skills.slice(index + 1)],
    }));
  };

  const addEducation = () => {
    setData(d => ({ ...d, education: [...d.education, newEducation] }));
    setNewEducation({ institution: '', start: '', end: '' });
  };

  const deleteEducation = i =>
    setData(d => ({
      ...d,
      education: [...d.education.slice(0, i), ...d.education.slice(i + 1)],
    }));

  return (
    <>
      <TextField
        name='name'
        value={data.name}
        onChange={handleChange}
        label='Name'
      />
      <br />
      {role === 'recruiter' ? (
        <>
          <TextField
            name='phone'
            value={data.phone}
            onChange={handleChange}
            label='Phone'
          />
          <br />
          <TextField
            name='bio'
            value={data.bio}
            onChange={handleChange}
            label='Bio'
          />
          <br />
        </>
      ) : (
        <>
          <br />
          <p>Skills</p>
          {data.skills.map((s, i) => (
            <Chip key={i} label={s} onDelete={() => skillDelete(s)} />
          ))}
          {data.skills.length ? <br /> : null}
          <TextField
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            label='New Skill'
          />
          <Button disabled={!newSkill} onClick={addSkill}>
            Add
          </Button>
          <br />
          <br />
          <br />
          <p>Education</p>
          {data.education.map((e, i) => (
            <Card variant='outlined' key={i}>
              <CardContent>
                <p>{e.institution}</p>
                <p>
                  {e.start} to {e.end ? e.end : 'current'}
                </p>
              </CardContent>
              <CardActions>
                <Button color='secondary' onClick={() => deleteEducation(i)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
          <Card variant='outlined'>
            <CardContent>
              <TextField
                value={newEducation.institution}
                onChange={e =>
                  setNewEducation({
                    ...newEducation,
                    institution: e.target.value,
                  })
                }
                label='Institution Name'
              />
              <br />
              <TextField
                value={newEducation.start}
                onChange={e =>
                  setNewEducation({
                    ...newEducation,
                    start: e.target.value,
                  })
                }
                label='Start Year'
              />
              <TextField
                value={newEducation.end}
                onChange={e =>
                  setNewEducation({
                    ...newEducation,
                    end: e.target.value,
                  })
                }
                label='End Year'
              />
            </CardContent>
            <CardActions>
              <Button
                disabled={
                  !newEducation.institution ||
                  !newEducation.start ||
                  !newEducation.end
                }
                onClick={addEducation}>
                Add
              </Button>
            </CardActions>
          </Card>
        </>
      )}
      <Button disabled={loading} onClick={submit}>
        {submitText}
      </Button>
    </>
  );
};

export default ProfileHandler;
