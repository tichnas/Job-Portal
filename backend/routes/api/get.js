const express = require('express');

const formatError = require('../../utils/formatError');
const { User } = require('../../models/User');
const auth = require('../../middleware/auth');

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

module.exports = router;
