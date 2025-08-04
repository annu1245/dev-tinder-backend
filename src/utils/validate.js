const validator = require('validator');

const validateSignUp = (data) => {
    const {firstName, lastName, email, password} = data;
    const ALLOWED_DATA = ["firstName", "lastName", "email", "password"];
    const isSignUpAllowed = Object.keys(data).every((k) => ALLOWED_DATA.includes(k));

    if (!isSignUpAllowed) {
        throw new Error("Invalid signUp data");
    }

    if (!firstName || !lastName) {
      throw new Error("Name is required")
    } else if (!email) {
      throw new Error("EmailId is required")
    } else if (!password) {
      throw new Error("Password is required")
    } else if (!validator.isEmail(email)) {
      throw new Error("Invalid Email Id")
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Please write Strong password")
    }
};

const validateLogin = (req) => {
  const {email, password} = req.body;

  if(!email) {
    throw new Error("EmailId is required")
  } else if (!password) {
    throw new Error("Password is required")
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid credentials")
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Invalid credentials")
  }
}

const validateEditRoute = (req) => {
  const ALLOWED_EDIT = ["gender", "age", "profileUrl", "about", "skills"];
  const isEditAllowed = Object.keys(req.body).every(key => ALLOWED_EDIT.includes(key));
  return isEditAllowed;
}

module.exports = { validateSignUp, validateLogin, validateEditRoute }
