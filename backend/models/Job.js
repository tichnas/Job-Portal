const mongoose = require('mongoose');

const { user } = require('./common');
const Application = require('./Application');

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
});

JobSchema.post('findOneAndDelete', async (job, next) => {
  try {
    await Application.deleteMany({ job: job.id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('job', JobSchema);
