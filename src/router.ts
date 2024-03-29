import { Router } from 'express';
import { body, validationResult, oneOf } from 'express-validator';
import { handleInputErrors } from './modules/middleware';
import {
  getCustomers,
  createCustomer,
  getOneCustomer,
  deleteCustomer,
  updateCustomer,
} from './handlers/customer';

const router = Router();

/**
 * CUSTOMER ROUTES
 */

// gets / reads all customer
router.get('/customer', getCustomers);

// gets / reads a single customer
router.get('/customer/:resellerId', getOneCustomer);

// updates a customer
router.put(
  '/customer/:id',
  body('name').isString(),
  body('email').isString(),
  handleInputErrors,
  updateCustomer
);

// creates a customer
router.post(
  '/customer',
  body('name').isString(),
  handleInputErrors,
  createCustomer
);

// deletes a customer
router.delete('/customer/:id', deleteCustomer);

router.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: 'Oops...something went wrong in router handler' });
});

export default router;
