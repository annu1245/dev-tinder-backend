const mongoose = require("mongoose");



const connectMongo = async() => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/devTinderTwo")
  } catch (error) {
    console.log("Mongoose connection error: ", error)
  }
}

module.exports = connectMongo;