import { validationResult } from 'express-validator';

export function handleInputErrors(req, res, next) {
  const errors = validationResult(req);
  console.log(errors);

  // if errors is not empty, send a 400 status code and the errors
  if (!errors.isEmpty()) {
    res.status(400);
    res.json({ errors: errors.array() }); // array of errors from the validationResult
  } else {
    next();
  }
}
