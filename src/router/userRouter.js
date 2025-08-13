const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require('../model/connectionRequest');
const User = require('../model/user');

const userAuth = require('../middleware/auth')

const SHARED_USER_DATA = ["firstName", "lastName", "age", "skills", "about", "photoUrl", "gender"];

userRouter.get('/request/received', userAuth, async(req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested'
    }).populate("fromUserId", SHARED_USER_DATA)
   
    res.status(200).json({message: "Pending requests", data: connectionRequest});

  } catch (error) {
    res.sendStatus(400).send("ERROR: "+ error.message)
  }
})

userRouter.get('/request/send', userAuth, async(req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: 'interested'
    }) .select('toUserId')
    .populate("toUserId", SHARED_USER_DATA)
   
    
    res.status(200).json({message: 'request send', data: connectionRequest})

  } catch (error) {
    res.status(400).send("send request ERROR: "+ error.message)
  }
})

userRouter.get('/connections', userAuth, async(req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id
        }
      ],
      status: 'accepted'
    }).populate("fromUserId toUserId", SHARED_USER_DATA)

    console.log(connectionRequest)
   
    const connections = connectionRequest.map(connection => {
      let userData;
      if (connection.fromUserId._id.toString() == loggedInUser._id.toString()) {
        userData = connection.toUserId;
      }else {
        userData = connection.fromUserId;
      }
      return {
        _id: connection._id,
        userDetails: userData
      }
    })

    res.status(200).json({message: "Your connections", data: connections})
  } catch (error) {
    res.status(400).send("Connection API ERROR: "+ error.message)
    
  }
})

userRouter.get('/feed', userAuth, async(req, res) => {
  try {
    const SHOW_USER_DATA = "_id firstName lastName age skills gender"

    const currentUserId = req.user._id;
    const page = req.query?.page || 1;
    let limit = req.query?.limit || 10;
    const skip = (page - 1) * limit;
    limit = limit < 50 ? limit : 50;
    
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: currentUserId
        },
        {
          toUserId: currentUserId
        }
      ]
    }).select("fromUserId toUserId -_id")
    
    const excludingUsers = new Set([currentUserId]);
    connectionRequest.map((user) => {
      excludingUsers.add(user.fromUserId.toString());
      excludingUsers.add(user.toUserId.toString());
    })
    const excludingUsersArray = [...excludingUsers];
    
    const user = await User.find({
      _id: { $nin: excludingUsersArray }
    }).select(SHOW_USER_DATA)
    .skip(skip)
    .limit(limit)

    res.json(user);

  } catch (error) {
    res.status(400).send("Feed API ERROR: "+ error.message)
  }
})
module.exports = userRouter;