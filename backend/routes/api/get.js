const express = require('express');

const formatError = require('../../utils/formatError');
const { User } = require('../../models/User');
const Application = require('../../models/Application');
const Job = require('../../models/Job');
const auth = require('../../middleware/auth');
const isApplicant = require('../../middleware/isApplicant');

const router = express.Router();

/**
 * @route         GET api/user
 * @description   Get current User
 * @access        Private
 */
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

/**
 * @route         GET api/jobs
 * @description   Get all jobs
 * @access        Applicant only
 */
router.get('/jobs', auth, isApplicant, async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          as: 'applications',
          foreignField: 'job',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'recruiter',
          as: 'recruiter',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          recruiter: { $arrayElemAt: ['$recruiter', 0] },
        },
      },
    ]);

    const formattedJobs = jobs.map(j => ({
      ...j,
      applied:
        j.applications.findIndex(
          a => String(a.user) === String(req.user.id)
        ) !== -1,
    }));

    res.json(formattedJobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

/**
 * @route         GET api/myapplications
 * @description   Get My Applications
 * @access        Applicant only
 */
router.get('/myapplications', auth, isApplicant, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate({
        path: 'job',
        select: 'title salary recruiter rating',
        populate: {
          path: 'recruiter',
          select: 'name',
        },
      })
      .lean();

    applications.forEach(app => {
      const index = app.job.rating.findIndex(
        r => String(r.user) === String(req.user.id)
      );
      if (index !== -1) app.job.rated = app.job.rating[index].value;
    });

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

module.exports = router;
