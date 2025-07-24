const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');


const signup = async (req, res, next) => {
  // STEP 1: Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Invalid inputs. Please try again.' });
  }

  const { name, email, password } = req.body;

  // STEP 2: Check for existing user
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed. Please try again later.' });
  }

  // STEP 3: Hash password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(500).json({ message: 'Could not create user. Please try again.' });
  }

  // STEP 4: Create user
  let user;
  try {
    user = await User.create({
      name,
      email,
      password: hashedPassword
    });
  } catch (err) {
    console.error('[ERROR] Creating user:', err.message);
    return res.status(500).json({ message: 'Failed to save user. Please try again.' });
  }

  // STEP 5: Generate token
  let token;
  try {
    token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
  } catch (err) {
    return res.status(500).json({ message: 'Could not generate token. Please try again.' });
  }

  // STEP 6: Respond to frontend
  res.status(201).json({
    token,
    userId: user._id,
    role: user.role,
    email: user.email
  });
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // adjust as needed

const login = async (req, res) => {
  const { email, password } = req.body;

  // STEP 1: Find the user by email
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed. Please try again later.' });
  }

  // STEP 2: If no user found
  if (!existingUser) {
    return res.status(422).json({ message: 'Invalid credentials.' });
  }

  // STEP 3: Check if password matches the hashed one
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    console.error('[LOGIN ERROR] Comparing password:', err.message);
    return res.status(500).json({ message: 'Could not verify credentials. Please try again.' });
  }

  // STEP 4: If password is incorrect
  if (!isValidPassword) {
    return res.status(422).json({ message: 'Invalid credentials.' });
  }

  // STEP 5: Generate JWT
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }

  // STEP 6: Return response with token and user info
  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
    token
  });
};

module.exports = { signup, login };
