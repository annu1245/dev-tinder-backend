const express = require("express");
const connectMongo = require("./database/db")
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const port = process.env.PORT;
const router = require("./router/index");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [process.env.REACT_ORIGIN_1, process.env.REACT_ORIGIN_2],
  credentials: true,
}));
app.use(router);

app.use(errorHandler);

connectMongo()
.then(() => {
  console.log("mongoose databse connected");
})
.then(() => {
  app.listen(port, () => {
    console.log("app listning on port: ", port);
  })
})
