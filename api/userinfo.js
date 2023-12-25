// userinfo.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const bodyParser = require("body-parser");
const Baseinfo = require("./Baseinfo");

router.use(bodyParser.json());

router.get("/", async (req, res) => {
  try {
    const inputValue = req.body.nickname;
    const response = await axios.get(
      Baseinfo.BaseApiUrl.baseURL + "/fconline/v1/id?nickname=" + inputValue,
      { headers: Baseinfo.headers }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
