const express = require("express");
const router = express.Router();
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const Baseinfo = require("../Baseinfo");

router.use(cors());
router.use(bodyParser.json());
router.get("/getuserinfo", async (req, res) => {
  try {
    const { nickname } = req.query;
    const apiUrl =
      Baseinfo.BaseApiUrl.baseURL + "/fconline/v1/id?nickname=" + nickname;

    const response = await axios.get(apiUrl, { headers: Baseinfo.headers });
    const { ouid } = response.data;
    const [userInfo, maxDivisionInfo] = await Promise.all([
      getuserinfo(ouid),
      getuserDevisioninfo(ouid),
    ]);
    const result = {
      ouid,
      level: userInfo.level,
      UserName: userInfo.nickname,
      ...maxDivisionInfo,
    };
    // 클라이언트에 응답 전송
    res.status(200).json(result);
  } catch (error) {
    console.error("에러:", error);
    const message = `[ERROR] GET /getuserinfo ${error.message}`;
    res.status(400).json({ message });
  }
});
const getuserinfo = async (ouid) => {
  const response = await axios.get(
    Baseinfo.BaseApiUrl.baseURL + "/fconline/v1/user/basic?ouid=" + ouid,
    { headers: Baseinfo.headers }
  );
  return response.data;
};

const getuserDevisioninfo = async (ouid) => {
  const response = await axios.get(
    Baseinfo.BaseApiUrl.baseURL + "/fconline/v1/user/maxdivision?ouid=" + ouid,
    { headers: Baseinfo.headers }
  );
  return response.data.find((data) => data.matchType === 50);
};

module.exports = router;
