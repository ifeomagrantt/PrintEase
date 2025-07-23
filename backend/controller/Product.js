const Product = require('../models/Product.js');
const fs = require('fs');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can upload products.' });
  }

  const { title } = req.body;
  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).json({ message: 'Image upload required.' });
  }

  try {
    const product = new Product({
      title,
      image: imagePath,
      creator: req.userData.userId
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('[CREATE PRODUCT ERROR]', err);
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can delete products.' });
  }

  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    fs.unlink(product.image, (err) => {
      if (err) console.error('Failed to delete image:', err);
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can edit products.' });
  }

  const { title } = req.body;
  const { id } = req.params;

  try {
    const update = { title };

    if (req.file) {
      update.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(id, update, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct
};
