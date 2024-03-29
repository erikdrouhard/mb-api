import { Router } from 'express';
import { body, validationResult, oneOf } from 'express-validator';
import { handleInputErrors } from './modules/middleware';
import {
  getResellers,
  createReseller,
  getOneReseller,
  deleteReseller,
  updateReseller,
} from './handlers/reseller';

const router = Router();

/**
 * RESELLER ROUTES
 */

// gets / reads all resellers
router.get('/reseller', getResellers);

// gets / reads a single reseller
router.get('/reseller/:resellerId', getOneReseller);

// updates a reseller
router.put(
  '/reseller/:id',
  body('name').isString(),
  body('email').isString(),
  handleInputErrors,
  updateReseller
);

// creates a reseller
router.post(
  '/reseller',
  body('name').isString(),
  body('email').isString(),
  body('backerId').isString(),
  body('resellerId').isString(),
  body('pledgeAmount').isString(),
  body('backerNumber').isInt(),
  handleInputErrors,
  createReseller
);

// deletes a reseller
router.delete('/reseller/:id', deleteReseller);

router.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: 'Oops...something went wrong in router handler' });
});

export default router;
