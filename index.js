const express = require("express");
const userrank = require('./api/userrank');
const cors = require('cors'); // cors 모듈 추가
const app = express();

const PORT = process.env.PORT || 8080;


app.use(cors());
app.use("api/userrank",userrank);


app.listen(PORT, () => {
  console.log("Server started on port 8080");
});