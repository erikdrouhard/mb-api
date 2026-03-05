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
  body('name').isString(),
  body('email').isString(),
  handleInputErrors,
  updateReseller
);

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

router.delete('/reseller/:id', deleteReseller);

export default router;
