const express = require("express");
const userrank = require("./api/userrank");
const product = require("./api/product");
const cors = require("cors"); // cors 모듈 추가
const app = express();
const bodyParser = require("body-parser");
const userinfo = require("./api/userinfo");
const getuserinfo = require("./api/userinfo/getuserinfo");
const getmatchinfo = require("./api/match/usermatch");

const PORT = process.env.PORT || 8080;
app.use(express.json({ extended: false }));

app.use(cors());
app.use(bodyParser.json());

app.use("/api/userrank", userrank);

app.use("/api/userinfo", userinfo);

app.use("/api/getuserinfo", getuserinfo);

app.use("/api/getmatchinfo", getmatchinfo);

app.listen(PORT, () => {
  console.log("Server started on port 8080");
});
