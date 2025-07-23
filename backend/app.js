const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require("./routes/Users.js");
const productRoutes = require("./routes/Products.js");
const connectDB = require('./lib/db.js');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For JSON bodies

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Debug log (optional)
app.use((req, res, next) => {
  console.log('[CORS DEBUG]', req.method, req.headers.origin);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.use((error, req, res, next) => {
  console.error('ERROR', error);
  res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred!' });
});

// DB Connection 
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('DB connection failed:', err);
});
