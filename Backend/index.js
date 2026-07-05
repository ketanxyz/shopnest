const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Shopnest Backend is running Properly");
});

app.use('api/auth', require('./routes/authRoutes.js'));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});