const express = require("express");
const userrank = require("./api/userrank");
const product = require("./api/product");
const cors = require("cors"); // cors 모듈 추가
const app = express();
const bodyParser = require("body-parser");
const userinfo = require("./api/userinfo");


const PORT = process.env.PORT || 8080;
app.use(express.json({ extended: false }));

app.use(cors());
app.use(bodyParser.json());

app.use("/api/userrank", userrank);

app.use("/api/userinfo", userinfo);


app.listen(PORT, () => {
  console.log("Server started on port 8080");
});
