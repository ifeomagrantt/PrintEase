const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./lib/db.js');
const userRoutes = require('./routes/Users.js');
const productRoutes = require('./routes/Products.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS setup to allow requests from React frontend on localhost:3000
app.use(cors({
  origin: process.env.REACT_APP_URL, // Your React app's URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', 'images', filename);
  console.log('Download requested for:', filePath);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(404).send('File not found');
    }
  });
});



// Preflight OPTIONS request handling
app.options('*', cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Define API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Generic error handler middleware
app.use((error, req, res, next) => {
  console.error('ERROR:', error);
  res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred!' });
});

// Connect to DB and start the server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('DB connection failed:', err);
});
