const mongoose = require('mongoose');

module.exports = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
};
