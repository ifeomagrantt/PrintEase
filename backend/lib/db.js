const mongoose = require("mongoose");

const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MONGODB", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;