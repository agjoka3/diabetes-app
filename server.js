const express = require("express");
const app = express();

app.get("/news", (req, res) => {
  console.log("Here");
  res.send("Hi");
});

app.listen(3000);
