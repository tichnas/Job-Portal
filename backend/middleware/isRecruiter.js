const formatError = require('../utils/formatError');

/**
 * @param req
 * @param res
 * @param next
 * @description allow only a recruiter
 */
const isRecruiter = async (req, res, next) => {
  if (req.user.role !== 'recruiter')
    return res.status(401).json(formatError('Not a recruiter'));

  next();
};

module.exports = isRecruiter;
