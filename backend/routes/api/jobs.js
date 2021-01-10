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

module.exports = router;
