const express = require("express");
const userrank = require('./api/userrank');
const product = require("./api/product");
const cors = require('cors'); // cors 모듈 추가
const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json({ extended: false }));


app.use(cors());

app.use("/api/userrank", userrank);

app.use("/api/product", product);

app.listen(PORT, () => {
  console.log("Server started on port 8080");
});