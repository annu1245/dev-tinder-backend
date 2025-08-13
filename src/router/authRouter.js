const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt")
const User = require('../model/user');
const { validateSignUp, validateLogin } = require('../utils/validate')

authRouter.post('/signup', async (req, res) => {
  const data = req.body;
    try {
        validateSignUp(req.body);

        const existingUser = await User.findOne({email: req.body.email})
        if (existingUser) {
            return res.status(409).send("User already exists")
        }
        const password = data.password;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ ...data, password: hashPassword });
        
        await user.save();
        res.send(user);
    } catch (error) {
        console.log("SignUp error: ", error);
        res.status(400).send("SignUp failed: " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        validateLogin(req)
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("Invalid user Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        
        if (!isPasswordValid) {
             throw new Error("Invalid user Credentials");
        }
       
        const token = await user.getJWT();
        res.cookie("token", token, {expires: new Date(Date.now() + 12 * 3600000) });
        res.json({message: "User logged in successfully", data: user});

    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

authRouter.post('/logout', (req, res) => {
  res.cookie("token", null, {expires: new Date(Date.now())});
  res.send("Logout successfully")
})


module.exports = authRouter;