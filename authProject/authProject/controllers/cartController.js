const Cart = require('../models/cartModel');


// get cart 
exports.getCart = async (req,res)=>{
  const{userId,guestId} = req.query;
  if(!userId && !guestId){
    return res.status(400).json({message:"userId or guestId is required"});
  }

    
  try {
    let cart = null;

    //merge when guest logged in
    if (userId && guestId) {
      const guestCart = await Cart.findOne({ guestId }).populate('items.productId');
      let userCart = await Cart.findOne({ userId });

  if (guestCart && guestCart.items.length > 0) {
    if (!userCart) {
      userCart = new Cart({
        userId,
        items: guestCart.items,
      });
    } else {
      for (const guestItem of guestCart.items) {
        const existingItem = userCart.items.find(
          item => item.productId._id.toString() === guestItem.productId._id.toString()
        );

        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          userCart.items.push({
            productId: guestItem.productId._id,
            quantity: guestItem.quantity
          });
        }
      }
    }

    await userCart.save();
    await Cart.deleteOne({ guestId });
  }
}

    if (userId) {
      cart = await Cart.findOne({ userId }).populate('items.productId');
    } else {
      cart = await Cart.findOne({ guestId }).populate('items.productId');
    }


    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get cart" });
  }
};

// add to cart
exports.addToCart = async (req, res) => {
  const { userId, guestId, productId, quantity } = req.body;

  if (!userId && !guestId) {
    return res.status(400).json({ message: "userId or guestId is required" });
  }

  try {
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else {
      cart = await Cart.findOne({ guestId });
    }
    

    if (!cart) {
      cart = new Cart({
        userId: userId || null,
        guestId: guestId || null,
        items: [{ productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add to cart" });
  }
};


// update cart item
exports.updateCartItem = async (req,res)=>{
  const {userId,guestId,productId,quantity} = req.body;
  if(!userId && !guestId){
    return res.status(400).json({message:"userId or guestId is required"});
  }
  try{
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else {
      cart = await Cart.findOne({ guestId });

    }

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update cart item" });
  }
}

// remove item from cart
exports.removeItem = async (req,res)=>{
  const {userId,guestId,productId}=req.body;
  if(!userId && !guestId){
    return res.status(400).json({message:"userId or guestId is required"});
  }
  try {
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId });
    }
    else {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to remove item from cart" });
  }
}

// clear cart
exports.clearCart = async (req,res)=>{
  const {userId,guestId} = req.body;
  if(!userId && !guestId){
    return res.status(400).json({message:"userId or guestId is required"});
  }
  try {
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    cart.items = [];
    await cart.save();
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to clear cart" });
  }
}



