const express = require('express');
const { validationResult } = require('express-validator');

const formatError = require('../../utils/formatError');
const Job = require('../../models/Job');
const validate = require('./validate');
const auth = require('../../middleware/auth');
const isRecruiter = require('../../middleware/isRecruiter');

const router = express.Router();

/**
 * @route         POST api/jobs
 * @description   Add Job
 * @access        Recruiter only
 */
router.post('/', auth, isRecruiter, validate.createJob, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);

    job = new Job({ ...req.body, recruiter: req.user.id });

    await job.save();

    res.json({ id: job.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

/**
 * @route         PUT api/jobs/:jobId
 * @description   Update Job
 * @access        Recruiter only
 */
router.put(
  '/:jobId',
  auth,
  isRecruiter,
  validate.updateJob,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json(errors);

      const job = await Job.findById(req.params.jobId, 'recruiter');

      if (!job) return res.status(400).json(formatError('No job found'));
      if (String(job.recruiter) !== req.user.id)
        return res.status(401).json(formatError('Not the owner of job'));

      const { maxApplications, maxPositions, deadline } = req.body;

      if (maxApplications) job.maxApplications = maxApplications;
      if (maxPositions) job.maxPositions = maxPositions;
      if (deadline) job.deadline = deadline;

      await job.save();

      res.json({ success: true });
    } catch (err) {
      console.error(err.message);
      res.status(500).json(formatError('Server Error'));
    }
  }
);

module.exports = router;
