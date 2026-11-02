const { validationResult } = require('express-validator');

// Middleware to handle express-validator errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError, errors: errors.array() });
  }
  next();
};

module.exports = validate;
