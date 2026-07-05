const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;