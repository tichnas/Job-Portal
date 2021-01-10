const { check } = require('express-validator');

module.exports = [
  check('email', 'Email is invalid').isEmail(),
  check('password', 'Password is invalid').isString(),
];
