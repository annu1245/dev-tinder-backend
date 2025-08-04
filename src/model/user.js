const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    requied: true,
    trim: true,
    minLength: 4,
    maxLength: 50,
    index: true
  },
  lastName: {
    type: String,
    trim: true,
    minLength: 4,
    maxLength: 50
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 4,
    maxLength: 50,
    validate: {
      validator: v => validator.isEmail(v),
      message: props => `${props.value} is not valid email`
    }
  },
  password: {
    type: String,
    require: true,
    validate(value) {
      if(!validator.isStrongPassword(value)) {
        throw new Error("Enter a Strong Password: " + value)
      }
    }
  },
  age: {
    type: Number,
    min: 10
  },
  gender: {
    type: String,
    validate(value) {
      if (!['male', 'female', 'other'].includes(value)) {
        throw new Error("Gender data is not valid")
      }
    }
  },
  about: {
    type: String,
    default: "This is default about",
    maxLength: [100, "About is too large"]
  },
  skills: {
    type: [String],
    validate(value) {
      if (value.length > 10) {
        throw new Error("Skills can't be more than 10")
      }
    }
  },
  photoUrl: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/10337/10337609.png",
    validate: {
      validator: v => validator.isURL(v),
      message: props => `${props.value} is not valid URL!` 
    }
  }
}, {timestamps: true});

userSchema.methods.getJWT = async function() {
  const user = this;
  const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashPassword);
  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;