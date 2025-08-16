const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middleware/auth');
const { view, edit } = require('../controller/profile')

profileRouter.get('/view', userAuth, view)
profileRouter.patch('/edit', userAuth, edit)

module.exports = profileRouter;