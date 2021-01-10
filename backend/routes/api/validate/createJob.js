const { check } = require('express-validator');

module.exports = [
  check('title', 'Title must contain something').isString().trim().notEmpty(),
  check('maxApplications', 'Max applications must be a number >= 0')
    .isInt({
      min: 0,
    })
    .toInt(),
  check('maxPositions', 'Max positions must be a number >= 0')
    .isInt({
      min: 0,
    })
    .toInt(),
  check('deadline', 'Deadline should be a valid date')
    .isInt({ min: 0 })
    .toInt(),
  check('skills', 'Skills must be an array').isArray(),
  check('skills.*', 'Skill should be a valid string')
    .isString()
    .trim()
    .notEmpty(),
  check('type', 'Invalid type of job').isIn(['FT', 'PT', 'WH']),
  check('duration', 'Duration must be an integer between 0 and 6')
    .isInt({
      min: 0,
      max: 6,
    })
    .toInt(),
  check('salary', 'Salary must be an integer >= 0').isInt({ min: 0 }).toInt(),
];
