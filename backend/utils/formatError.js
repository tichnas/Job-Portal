const { model } = require('mongoose');

const formatError = error => ({ errors: [{ msg: error }] });

module.exports = formatError;
