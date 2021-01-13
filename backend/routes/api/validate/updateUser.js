const { check } = require('express-validator');

module.exports = [
  check('name', 'Name must contain something')
    .isString()
    .trim()
    .notEmpty()
    .optional(),
  check('phone', '10 digit phone no. is required')
    .isString()
    .isLength({ min: 10, max: 10 })
    .optional(),
  check('bio', 'Bio must be string')
    .isString()
    .trim()
    .custom(bio => bio.split(' ').filter(w => w != '').length <= 250)
    .optional(),
  check('education.*.institution', 'Institution should be a string')
    .isString()
    .trim()
    .notEmpty(),
  check('education.*.start', 'Start year should be a positive integer')
    .isInt({ min: 0 })
    .toInt(),
  check('education.*.end', 'End year should not be there or a positive integer')
    .isInt()
    .toInt()
    .optional(),
  check(
    'education',
    'Educations must be an array with every start year < end year'
  )
    .isArray()
    .bail()
    .custom(arr => arr.findIndex(e => e.start >= e.end) === -1)
    .optional(),
  check('skills', 'Skills must be an array').isArray().optional(),
  check('skills.*', 'Skill should be a valid string')
    .isString()
    .trim()
    .notEmpty(),
  check('photo', 'Invalid photo url').isString().optional(),
  check('resume', 'Invalid resume url').isString().optional(),
];
