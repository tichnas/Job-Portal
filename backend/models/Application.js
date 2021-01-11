const mongoose = require('mongoose');

const { user } = require('./common');

const ApplicationSchema = mongoose.Schema({
  user,
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'job',
  },
  sop: String,
  status: {
    type: String,
    enum: ['U', 'S', 'A', 'R'],
    /**
     * U = Under review or Applied
     * S = Shortlisted
     * A = Accepted
     * R = Rejected
     */
    default: 'U',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  joinDate: Date,
});

module.exports = mongoose.model('application', ApplicationSchema);
