const express = require('express');
const connectDB = require('./utils/connectDB');

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/jobs', require('./routes/api/jobs'));
app.use('/api', require('./routes/api/get'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server Started'));
