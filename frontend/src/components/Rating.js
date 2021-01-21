import { Button, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';

const Rating = ({ setRating }) => {
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
      <Button onClick={() => setRating(val)}>Submit</Button>
    </>
  );
};

export default Rating;
