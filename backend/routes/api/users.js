const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const formatError = require('../../utils/formatError');
const { User } = require('../../models/User');
const validate = require('./validate');
const auth = require('../../middleware/auth');

const router = express.Router();

const getToken = ({ id, password }) =>
  jwt.sign({ id, password }, process.env.SECRET_KEY);

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

    let user = await User.findOne({ email }, 'id');
    if (user) return res.status(400).json(formatError('Email already exists'));

    const hashPassword = await bcrypt.hash(password, 10);

    user = new User({ ...req.body, password: hashPassword });

    await user.save();

    res.json({ token: getToken({ id: user.id, password: hashPassword }) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

/**
 * @route         POST api/users/login
 * @description   Login User
 * @access        Public
 */
router.post('/login', validate.loginUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);

    const { email, password } = req.body;

    const user = await User.findOne({ email }, 'id password');

    if (!user)
      return res.status(401).json(formatError('Invalid Email or Password'));

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword)
      return res.status(401).json(formatError('Invalid Email or Password'));

    res.json({ token: getToken(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

/**
 * @route         PUT api/users/
 * @description   Update User
 * @access        Private
 */
router.put('/', auth, validate.updateUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);

    const possibleUpdates = [
      'name',
      'phone',
      'bio',
      'education',
      'skills',
      'resume',
      'photo',
    ];

    const user = await User.findById(req.user.id);

    possibleUpdates.forEach(p => {
      if (req.body[p]) user[p] = req.body[p];
    });

    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
});

module.exports = router;
