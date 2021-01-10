const { check } = require('express-validator');

module.exports = [
  check('maxApplications', 'Max applications must be a number >= 0')
    .isInt({
      min: 0,
    })
    .toInt()
    .optional(),
  check('maxPositions', 'Max positions must be a number >= 0')
    .isInt({
      min: 0,
    })
    .toInt()
    .optional(),
  check('deadline', 'Deadline should be a valid date')
    .isInt({ min: 0 })
    .toInt()
    .optional(),
];
