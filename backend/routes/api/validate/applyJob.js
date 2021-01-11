const { check } = require('express-validator');

module.exports = [
  check('sop', 'SoP must be supplied with max 250 words')
    .isString()
    .trim()
    .notEmpty()
    .custom(sop => sop.split(' ').filter(w => w != '').length <= 250),
];
