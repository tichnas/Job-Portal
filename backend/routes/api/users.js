const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const formatError = require('../../utils/formatError');
const { User } = require('../../models/User');
const validate = require('./validate');

const router = express.Router();

/**
 * @route         POST api/users/register
 * @description   Register User
 * @access        Public
 */
router.post('/register', validate.registerUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);

    const { email, password } = req.body;

    let user = await User.findOne({ email }, '_id');
    if (user) return res.status(400).json(formatError('Email already exists'));

    const hashPassword = await bcrypt.hash(password, 10);

    user = new User({ ...req.body, password: hashPassword });

    await user.save();

    const payload = {
      id: user.id,
      password: hashPassword,
    };

    jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

module.exports = router;
