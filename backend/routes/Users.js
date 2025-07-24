const express = require('express');
const { check } = require('express-validator');

const {signup, logout, login} = require('../controller/Auth.js');

const router = express.Router();

router.post('/signup',
  [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').normalizeEmail().isEmail().withMessage('Please provide a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  signup);
   
router.post('/login',
  [
    check('email').isEmail().withMessage('Please provide a valid email'),
    check('password').not().isEmpty().withMessage('Password is required')
  ],
  login); 



module.exports = router;


