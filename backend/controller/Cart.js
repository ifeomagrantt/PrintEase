const User = require('../models/User.js');

const addToCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // check if product already exists in cart
    const alreadyInCart = user.cartItems.some(item => item.product.toString() === productId);
    if (alreadyInCart) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    // push new product to cart
    user.cartItems.push({ product: productId });
    await user.save();

    res.status(200).json({ message: "Product added to cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getCart = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate('cartItems.product');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.cartItems);
};

const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out the product from the cart
    user.cartItems = user.cartItems.filter(
      item => item.product.toString() !== productId
    );

    await user.save();
    res.status(200).json({ message: "Product removed from cart" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addToCart, getCart, removeFromCart };