const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid access token")
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedData;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found")
    } 
    req.user = user;
    next();

  } catch (error) {
    res.status(401).send("Authentication Failed: " + error.message)
  }
  
}

module.exports = userAuth;