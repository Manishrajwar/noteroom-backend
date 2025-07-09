const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: {
        w: 'majority',
      },
    });

    // Use the modern findOneAndUpdate behavior
    mongoose.set('useFindAndModify', false);

    console.log("DATABASE CONNECTED");
  } catch (e) {
    console.error("DATABASE CONNECTION FAILED:", e.message);
  }
};

module.exports = connectDb;
