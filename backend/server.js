const express = require('express');
const connectDB = require('./utils/connectDB');

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

app.use('/api/users', require('./routes/api/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server Started'));
