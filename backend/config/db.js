const mongoose = require("mongoose");

const DBConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("DB CONNECTED");
  } catch (error) {
    console.error("DB Connection Error:", error);
    throw error;
  }
};

module.exports =  DBConnect ;
