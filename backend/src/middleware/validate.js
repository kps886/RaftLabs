import { validationResult } from 'express-validator';

// Runs after express-validator checks and returns errors if any
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};