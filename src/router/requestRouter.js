const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");
const { send, review, deleteConnection } = require('../controller/request');

//send a new request to ignore or interested
requestRouter.post('/send/:status/:toUserId', userAuth, send);
// review the coming requests
requestRouter.post('/review/:status/:requestId', userAuth, review)
// delete a sended request
requestRouter.delete('/:requestId', userAuth, deleteConnection)

module.exports = requestRouter;
