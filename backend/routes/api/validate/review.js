const { check } = require('express-validator');

module.exports = [
  check('value', 'Rating value should be an integer between 1 and 5')
    .isInt({ min: 1, max: 5 })
    .toInt(),
];
