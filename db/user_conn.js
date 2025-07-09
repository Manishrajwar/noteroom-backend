const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("DATABASE CONNECTED"))
    .catch((e) => console.log("database connection failed", e.message));
};

module.exports = connectDb;
