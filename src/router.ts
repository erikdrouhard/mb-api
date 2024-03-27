import { Router } from 'express';
import { body, validationResult, oneOf } from 'express-validator';
import { handleInputErrors } from './modules/middleware';
import {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
} from './handlers/product';

const router = Router();

/**
 * PRODUCTS
 */

// gets / reads all products
router.get('/product', getProducts);

// gets / reads a single product
router.get('/product/:id', getProduct);

// updates a product
router.put(
  '/product/:id',
  body('name').isString(),
  handleInputErrors,
  (req, res) => {}
);

// creates a product
router.post(
  '/product',
  body('name').isString(),
  handleInputErrors,
  createProduct
);

// deletes a product
router.delete('/product:id', deleteProduct);

router.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: 'Oops...something went wrong in router handler' });
});

export default router;
