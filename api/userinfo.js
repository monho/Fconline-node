// userinfo.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const Baseinfo = require("./Baseinfo");
router.use(cors());
router.use(bodyParser.json());

// Baseinfo.js
const BaseApiUrl = {
  baseURL: "https://open.api.nexon.com",
};

const headers = {
  "x-nxopen-api-key":
    "test_e9335a6787866a3cc9067b9336d410d9deda234d1ecd92a9b62e5b50be43978e09a938e49b96a3c2f6bbfda5e4ea66eb", // Replace with your actual API key
};

router.post("/getuserinfo", async (req, res) => {
  try {
    const { message: nickname } = req.body;
    const { ouid } = await getOuid(nickname);

    const { level, nickname: UserName } = await getuserinfo(ouid);
    result = {
      ouid,
      level,
      UserName,
    };
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    const message = `[ERROR] POST /getuserinfo ${error.message}`;
    res.status(400).json({ message });
  }
});

const getOuid = async (nickname) => {
  const response = await axios.get(
    Baseinfo.BaseApiUrl.baseURL + "/fconline/v1/id?nickname=" + nickname,
    { headers: Baseinfo.headers }
  );
  return response.data;
};

const getuserinfo = async (ouid) => {
  const response = await axios.get(
    Baseinfo.BaseApiUrl.baseURL + "/fconline/v1/user/basic?ouid=" + ouid,
    { headers: Baseinfo.headers }
  );
  return response.data;
};

module.exports = router;
