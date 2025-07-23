const express = require('express');
const app = express();

const port  = '7777';

app.use("/", (req, res) => {
  res.send("hello world")
})

app.use('/test', (req, res) => {
  res.send("Hello from the test")
})




app.listen(port, () => {
  console.log("app listning on port :", port);
})