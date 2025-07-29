const express = require("express");
const connectDB = require("./database/db")
const app = express();
const userRouter = require('./router/user');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const port = process.env.PORT;


app.use(express.json());
app.use(cookieParser())

app.use('/', userRouter);

connectDB()
.then(() => {
  console.log("mongoose databse connected");
})
.then(() => {
  app.listen(port, () => {
    console.log("app listning on port: ", port)
  })
})

