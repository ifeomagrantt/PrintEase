const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const downloadRoutes = require('./routes/Downloads');
const connectDB = require('./lib/db.js');
const userRoutes = require('./routes/Users.js');
const productRoutes = require('./routes/Products.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// serve static files to upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS setup 
app.use(cors({
  origin: process.env.REACT_APP_URL, // Your React app URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());


// Middleware to parse JSON bodies
app.use(express.json());

//Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/download', downloadRoutes);

//Global Error
app.use((error, req, res,next) => {

  if(res.headerSent) {
      return next(error);
  }
  res.status(error.code || 500);  
  res.json( { message: error.message || 'An unknown error occured'  });

});
// Connect to DB and start the server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('DB connection failed:', err);
});
