const express = require('express');
const { validationResult } = require('express-validator');

const formatError = require('../../utils/formatError');
const Job = require('../../models/Job');
const Application = require('../../models/Application');
const validate = require('./validate');
const auth = require('../../middleware/auth');
const isRecruiter = require('../../middleware/isRecruiter');
const isApplicant = require('../../middleware/isApplicant');

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

/**
 * @route         PUT api/jobs/apply
 * @description   Apply to Job
 * @access        Applicant only
 */
router.put(
  '/:jobId/apply',
  auth,
  isApplicant,
  validate.applyJob,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json(errors);

      const jobId = req.params.jobId;

      const job = await Job.findById(jobId, 'maxApplications deadline');

      if (!job) return res.status(400).json(formatError('No job found'));

      if (Date.now() > job.deadline)
        return res.status(400).json(formatError('Deadline Expired'));

      const applicants = await Application.find({ job: jobId }, 'user');

      if (applicants.length >= job.maxApplications)
        return res.status(400).json(formatError('Applications full'));

      if (applicants.findIndex(a => String(a.user) === req.user.id) !== -1)
        return res.status(400).json(formatError('Already applied'));

      const user = req.user.id;

      const userApplications = await Application.find(
        {
          user,
          $or: [{ status: 'U' }, { status: 'S' }],
        },
        'id'
      );

      if (userApplications.length > 10)
        return res
          .status(400)
          .json(formatError('Max 10 Applications can be opened'));

      const application = new Application({
        user,
        job: jobId,
        sop: req.body.sop,
      });

      await application.save();

      return res.json({ id: application.id });
    } catch (err) {
      console.error(err.message);
      res.status(500).json(formatError('Server Error'));
    }
  }
);

/**
 * @route         DELETE api/jobs/:jobId
 * @description   Delete Job
 * @access        Recruiter only
 */
router.delete('/:jobId', auth, isRecruiter, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.jobId,
      recruiter: req.user.id,
    });

    if (!job)
      return res
        .status(400)
        .json(formatError('Not authorised or Job not found'));

    return res.json({ id: job.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

/**
 * @route         PUT api/jobs/application/:applicationId/:action(upgrade|reject)
 * @description   Upgrade the status of application or Reject
 * @access        Recruiter only
 */
router.put(
  '/application/:applicationId/:action(upgrade|reject)',
  auth,
  isRecruiter,
  async (req, res) => {
    try {
      const { applicationId, action } = req.params;

      const application = await Application.findById(
        applicationId,
        'status job joinDate user'
      ).populate({
        path: 'job',
        select: 'maxPositions',
        match: { recruiter: req.user.id },
      });

      if (!application || !application.job)
        return res
          .status(400)
          .json(formatError('Not authorised or Application not found'));

      if (application.status === 'A' || application.status === 'R')
        return res
          .status(400)
          .json(formatError('Applicant is already accepted/rejected'));

      if (action === 'reject') application.status = 'R';

      if (action == 'upgrade') {
        if (application.status === 'U') application.status = 'S';
        else if (application.status === 'S') {
          const acceptedApplications = await Application.find(
            { job: application.job.id, status: 'A' },
            'id'
          );
          if (acceptedApplications.length >= application.job.maxPositions)
            return res.status(400).json(formatError('Positions already full'));

          await Application.updateMany(
            { user: application.user },
            { status: 'R' }
          );

          application.status = 'A';
          application.joinDate = Date.now();
        }
      }

      await application.save();

      return res.json({ success: true });
    } catch (err) {
      console.error(err.message);
      res.status(500).json(formatError('Server Error'));
    }
  }
);

module.exports = router;
