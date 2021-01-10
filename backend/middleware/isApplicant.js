const formatError = require('../utils/formatError');

/**
 * @param req
 * @param res
 * @param next
 * @description allow only an applicant
 */
const isApplicant = async (req, res, next) => {
  if (req.user.role !== 'applicant')
    return res.status(401).json(formatError('Not an applicant'));

  next();
};

module.exports = isApplicant;
