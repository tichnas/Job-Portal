import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

const App = () => (
  <Router>
    <Navbar />
  </Router>
);

export default App;
