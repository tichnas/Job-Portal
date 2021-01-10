const mongoose = require('mongoose');

const { user } = require('./common');

const JobSchema = mongoose.Schema({
  title: String,
  recruiter: user,
  maxApplications: Number,
  maxPositions: Number,
  date: {
    type: Date,
    default: Date.now(),
  },
  deadline: Date,
  skills: [String],
  type: {
    type: String,
    enum: ['FT', 'PT', 'WH'],
    /**
     * FT = Full Time
     * PT = Part Time
     * WH = Work from Home
     */
  },
  duration: Number,
  salary: Number,
  rating: [
    {
      user,
      value: Number,
    },
  ],
  applicants: [
    {
      user,
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
      },
    },
  ],
});

module.exports = mongoose.model('job', JobSchema);
