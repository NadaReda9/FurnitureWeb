const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


// http://localhost:8000/api/cart



// get cart 
router.get('/', cartController.getCart);
// add item to cart
router.post('/add', cartController.addToCart);
// update item quantity
router.put('/update', cartController.updateCartItem);
// remove specific item
router.delete('/remove', cartController.removeItem);
// clear all items
router.delete('/clear', cartController.clearCart);
module.exports = router;


