const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET cart by userId
router.get('/:userId', cartController.getCart);

// POST add item to cart
router.post('/:userId/add', cartController.addToCart);

// PUT update item quantity
router.put('/:userId/update', cartController.updateCartItem);

// DELETE remove specific item
router.delete('/:userId/remove/:productId', cartController.removeItem);

// DELETE clear all items
router.delete('/:userId/clear', cartController.clearCart);

module.exports = router;

