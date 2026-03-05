import { Router } from 'express';
import { body } from 'express-validator';
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

router.get('/reseller', getResellers);

router.get('/reseller/:resellerId', getOneReseller);

router.put(
  '/reseller/:id',
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  handleInputErrors,
  updateReseller
);

router.post(
  '/reseller',
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('backerId').isString().trim().notEmpty(),
  body('resellerId').isString().trim().notEmpty(),
  body('pledgeAmount').isString().trim().notEmpty(),
  body('backerNumber').isInt(),
  handleInputErrors,
  createReseller
);

router.delete('/reseller/:id', deleteReseller);

export default router;
