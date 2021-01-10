const mongoose = require('mongoose');

const { user } = require('./common');

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ['applicant', 'recruiter'],
    },
  },
  { discriminatorKey: 'role' }
);

const RecruiterSchema = new mongoose.Schema({
  phone: String,
  bio: String,
});

const ApplicantSchema = new mongoose.Schema({
  education: [
    {
      institution: String,
      start: Number,
      end: Number,
    },
  ],
  skills: [String],
  rating: [
    {
      user,
      value: Number,
    },
  ],
  photo: String,
  resume: String,
});

const User = mongoose.model('user', UserSchema);
const Recruiter = User.discriminator('recruiter', RecruiterSchema);
const Applicant = User.discriminator('applicant', ApplicantSchema);

module.exports = {
  User,
  Applicant,
  Recruiter,
};
