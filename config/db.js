const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    //   Since mongoose.connect returns promise we have to give it a async await function
    await mongoose.connect(db);
    // If database is successfully connected then,
    console.log("MongoDB connected..");
  } catch (err) {
    console.error(err.message);
    //   Exit process with failure
    process.exit(1);
  }
};

// Exporting the function
module.exports = connectDB;
