const express = require("express");
const userRouter = express.Router();
const userAuth = require('../middleware/auth')
const { receivedRequest, sendRequest, connections, feed } = require('../controller/user')

userRouter.get('/request/received', userAuth, receivedRequest)
userRouter.get('/request/send', userAuth, sendRequest)
userRouter.get('/connections', userAuth, connections)
userRouter.get('/feed', userAuth, feed)

module.exports = userRouter;