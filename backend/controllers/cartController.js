const Cart = require('../models/Cart');
const asyncHandler = require('../middleware/asyncHandler');

// @desc Get cart
exports.getUserCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId', 'name price image');
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
    return res.status(201).json(cart);
  }
  res.json(cart);
});

// @desc Add item
exports.addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });

  const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  cart = await cart.populate('items.productId', 'name price image');
  res.json(cart);
});

// @desc Update item
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id, 'items.productId': productId },
    { $set: { 'items.$.quantity': quantity } },
    { new: true }
  ).populate('items.productId', 'name price image');

  if (!cart) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  res.json(cart);
});

// @desc Remove item
exports.removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { items: { productId } } },
    { new: true }
  ).populate('items.productId', 'name price image');

  res.json(cart);
});

// @desc Clear cart
exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user._id });
  res.json({ message: 'Cart cleared' });
});
