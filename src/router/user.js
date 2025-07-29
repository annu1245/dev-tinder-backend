const express = require("express");
const userRouter = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {validateSignUp, validateLogin} = require("../utils/validate");
const jwt = require('jsonwebtoken');
const userAuth = require("../middleware/auth");

userRouter.post("/signup", async (req, res) => {
    const data = req.body;
    try {
        validateSignUp(req.body);
        const password = data.password;
        const hashPassword = await bcrypt.hash(password, 10);
        console.log("hasPassword: ", hashPassword);

        const user = new User({ ...data, password: hashPassword });
        
        await user.save();
        res.send(user);
    } catch (error) {
        console.log("SignUp error: ", error);
        res.status(400).send("SignUp failed: " + error.message);
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        validateLogin(req.body)
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
        res.status(200).send("User Login Successfull");

    } catch (error) {
        res.status(400).send("login failed: " + error.message);
    }
});


userRouter.get('/profile', userAuth, async(req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})
userRouter.put("/edit/:id", async (req, res) => {
    const userId = req.params.id;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ["gender", "skills", "age", "photoUrl"];
        isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update not Allowed");
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { runValidators: true });

        if (!user) throw new Error("Invalid user id");
        res.status(200).json({ status: 200, message: "User data updated" });
    } catch (error) {
        console.log("Edit user error: ", error);
        res.status(400).send("Update user failed: " + error.message);
    }
});

userRouter.delete("/del/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            throw new Error("User Not Found");
        }
        res.send("user deleted");
    } catch (error) {
        console.log("Delete user error: ", error.message);
        res.status(404).json({ status: 404, message: error.message });
    }
});

module.exports = userRouter;
