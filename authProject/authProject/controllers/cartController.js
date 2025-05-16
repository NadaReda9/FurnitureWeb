const Cart = require('../models/cartModel');

// GET /api/cart/:userId
exports.getCart = async (req, res) => {
    const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

// POST /api/cart/:userId/add
exports.addToCart = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        // Create a new cart
        cart = new Cart({
          userId,
          items: [{ productId, quantity }],
        });
      } else {
        // Cart exists – check if product is already in cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
  
        if (existingItem) {
          // If item exists, increase quantity
          existingItem.quantity += quantity;
        } else {
          // If not, push new item
          cart.items.push({ productId, quantity });
        }
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };

// PUT /api/cart/:userId/update
exports.updateCartItem = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const item = cart.items.find(item => item.productId.toString() === productId);
  
      if (!item) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      item.quantity = quantity;
      await cart.save();
  
      res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update item' });
    }
  };
  

// DELETE /api/cart/:userId/remove/:productId
exports.removeItem = async (req, res) => {
    const { userId, productId } = req.params;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
  
      await cart.save();
      res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to remove item' });
    }
  };
  

// DELETE /api/cart/:userId/clear
exports.clearCart = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      cart.items = [];
      await cart.save();
  
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  };
  
