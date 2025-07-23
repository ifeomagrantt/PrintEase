const express = require('express');
const router = express.Router();


const {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct
} = require('../controller/Product.js');

const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

// Public route - anyone can view products
router.get('/', getAllProducts);

// Apply auth middleware to all routes below
router.use(checkAuth);

// Protected routes below
router.post('/', fileUpload.single('image'), createProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id', fileUpload.single('image'), updateProduct);

module.exports = router;
