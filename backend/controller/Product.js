const Product = require('../models/Product.js');
const fs = require('fs');
const { validationResult } = require('express-validator');


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  // STEP 1: Check role
  if (req.userData.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can upload products.' });
  }

  // STEP 2: Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Invalid input.' });
  }

  const { title } = req.body;
  const imagePath = req.file.path;

  // STEP 3: Check if image exists
  if (!imagePath) {
    return res.status(400).json({ message: 'Image upload required.' });
  }

  // STEP 4: Create and save product
  let product;
  try {
    product = new Product({
      title,
      image: imagePath,
      creator: req.userData.userId
    });

    await product.save();
  } catch (err) {
    return res.status(500).json({ message: 'Creating product failed. Please try again later.' });
  }
  
  // STEP 5: Return response
  res.status(201).json(product);
};

const deleteProduct = async (req, res) => {
  // STEP 1: Check admin role
  if (req.userData.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can delete products.' });
  }

  const { id } = req.params;

  // STEP 2: Try deleting the product
  let product;
  try {
    product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Deleting product failed.' });
  }

  // STEP 3: Remove associated image file
  fs.unlink(product.image, (err) => {
    if (err) {
      console.error('Failed to delete image:', err.message);
    }
  });

  // STEP 4: Return success response
  res.status(200).json({ message: 'Product deleted successfully.' });
};


const updateProduct = async (req, res) => {
  // STEP 1: Check admin role
  if (req.userData.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can edit products.' });
  }

  const { id } = req.params;
  const { title } = req.body;

  // STEP 2: Find the existing product
  let product;
  try {
    product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Product not found.'  });
  }

  // STEP 3: Delete old image if new one is uploaded
  if (req.file && product.image) {
    const oldImagePath = path.join(__dirname, '..', product.image);
    fs.unlink(oldImagePath, (err) => {
      if (err) {
        console.error('Image deletion error',err.message);
      }
    });
  }

  // STEP 4: Update product fields
  product.title = title || product.title;
  if (req.file) {
    product.image = req.file.path;
  }

  // STEP 5: Save updated product
  try {
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Updating product failed.' });
  }
};

module.exports = { getAllProducts, createProduct, deleteProduct, updateProduct };
