const mongoose = require("mongoose");

async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);

    console.log("DB connected");
  } catch (err) {
    console.log("Error in connecting DB : ", err);
  }
}

module.exports = connectDB;
