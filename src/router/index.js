const express = require("express");
const router = express.Router();

const authRouter = require('./authRouter');
const profileRouter = require('./profileRouter');
const requestRouter = require('./requestRouter');
const userRouter = require('./userRouter');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/request', requestRouter);
router.use('/user', userRouter)

module.exports = router;
