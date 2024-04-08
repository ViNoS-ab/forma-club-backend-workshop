const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;

module.exports = async function connectDB() {
  try {
    await mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log("MongoDB connected");
    
  } catch (err) {
    console.log(err);
  }
};
