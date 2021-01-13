const { check, body } = require('express-validator');

module.exports = [
  check('name', 'Name must contain something').isString().trim().notEmpty(),
  check('email', 'Email is invalid').isEmail(),
  check('password', 'Password should be >= 6 characters').isString().isLength({
    min: 6,
  }),
  check('role', 'Role should be either applicant or recruiter').isIn([
    'applicant',
    'recruiter',
  ]),
  check('phone', '10 digit phone no. is required')
    .if(body('role').equals('recruiter'))
    .isString()
    .isLength({ min: 10, max: 10 }),
  check('bio', 'Bio must be string')
    .if(body('role').equals('recruiter'))
    .isString()
    .trim()
    .custom(bio => bio.split(' ').filter(w => w != '').length <= 250),
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
    .if(body('role').equals('applicant'))
    .isArray()
    .bail()
    .custom(arr => arr.findIndex(e => e.start >= e.end) === -1),
  check('skills', 'Skills must be an array')
    .if(body('role').equals('applicant'))
    .isArray(),
  check('skills.*', 'Skill should be a valid string')
    .isString()
    .trim()
    .notEmpty(),
  check('photo', 'Invalid photo url')
    .if(body('role').equals('applicant'))
    .isString()
    .optional(),
  check('resume', 'Invalid resume url')
    .if(body('role').equals('applicant'))
    .isString()
    .optional(),
];
