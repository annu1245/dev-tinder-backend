const express = require("express");
const connectDB = require("./database/db")
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const port = process.env.PORT;

const authRouter = require('./router/authRouter');
const profileRouter = require('./router/profileRouter');
const requestRouter = require('./router/requestRouter');
const userRouter = require('./router/userRouter');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.REACT_ORIGIN,
  credentials: true,
}));

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter)

connectDB()
.then(() => {
  console.log("mongoose databse connected");
})
.then(() => {
  app.listen(port, () => {
    console.log("app listning on port: ", port)
  })
})

