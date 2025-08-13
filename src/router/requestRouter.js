const express = require("express");
const requestRouter = express.Router();
const User = require("../model/user");
const ConnectionRequest = require("../model/connectionRequest");
const userAuth = require("../middleware/auth");

requestRouter.post('/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        // is status valid
        const ALLOWED_STATUS = ["ignored", "interested"];
        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status });
        }

        // is toUserId valid
        const existingUser = await User.findOne({ _id: toUserId });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection already exist" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        let customMessage;
        if (status == "interested") {
            customMessage = `${req.user.firstName} is Interested in ${existingUser.firstName}`
        } else if (status == "ignored") {
            customMessage = `${req.user.firstName} has ignored ${existingUser.firstName}`
        } 
        await connectionRequest.save();

        res.json({ message: customMessage });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

requestRouter.post('/review/:status/:requestId', userAuth, async(req, res) => {
    try {
        const status = req.params.status;
        const requestId = req.params.requestId;
        const loggedInUser = req.user;

        const ALLOWED_STATUS = ['accepted', 'rejected'];
        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).send("Invalid Status")
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", "firstName")

        if (!connectionRequest) {
            return res.status(404).send("Connection request not Found")
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save()
        
        let customMessage; 
        if (status == 'accepted') {
            customMessage = `${loggedInUser.firstName} has accepted the connection request of ${data.fromUserId.firstName}`
        } else if (status == 'rejected') {
            customMessage = `${loggedInUser.firstName} rejected the connection request of ${data.fromUserId.firstName}`
        }
        return res.status(200).json({message: customMessage})

    } catch (error) {
        res.status(400).send("ERROR: "+ error.message)
    }
})

// delete a sended request
requestRouter.delete('/:requestId', userAuth, async(req, res) => {
    const requestId = req.params.requestId;
    try {
        await ConnectionRequest.findByIdAndDelete({_id: requestId})
        return res.json({message: "request deleted"})
    } catch (error) {
        res.status(400).send("ERROR: "+ error.message)
    }
})

module.exports = requestRouter;
