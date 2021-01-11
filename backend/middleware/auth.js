const jwt = require('jsonwebtoken');

const formatError = require('../utils/formatError');
const { User } = require('../models/User');

/**
 * @param req
 * @param res
 * @param next
 * @description protect private routes
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json(formatError('Token not found'));

    let decoded;
    jwt.verify(token, process.env.SECRET_KEY, (err, verified) => {
      if (!err && verified) decoded = verified;
    });

    if (decoded) {
      const user = await User.findById(decoded.id, 'id');
      if (user) {
        req.user = user;
        next();
        return;
      }
    }

    return res.status(401).json(formatError('Invalid Token'));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatError('Server Error'));
  }
};

module.exports = auth;
