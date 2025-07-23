const express = require('express');
const router = express.Router();

const { getAllProducts, createProduct, deleteProduct } = require('../controller/ProductsController');
const fileUpload = require('../middleware/file-upload');
//const { addToCart, getCart, removeFromCart } = require('../controller/Cart.js');
const checkAuth = require('../middleware/check-auth.js');

// Public route - no authentication required
router.get('/', getAllProducts); 

// Protected routes - requires valid auth token
router.use(checkAuth);

router.post('/', fileUpload.single('image'), createProduct); // handles PNG, JPG
router.delete('/:id', deleteProduct);


//router.post('/add-to-cart/:userId/:productId', addToCart); 
//router.get('/cart/:userId', getCart);  
//router.delete('/remove-from-cart/:userId/:productId', removeFromCart);  

module.exports = router;
