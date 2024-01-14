const express = require("express");
const router = express.Router();
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const Baseinfo = require("../Baseinfo");

router.use(cors());
router.use(bodyParser.json());
router.get("/getmatchinfo", async (req, res) => {
  try {
    const { nickname } = req.query;
    const { currentIndex = 0 } = req.body;
    const apiUrl =
      Baseinfo.BaseApiUrl.baseURL + "/fconline/v1/id?nickname=" + nickname;

    const response = await axios.get(apiUrl, { headers: Baseinfo.headers });
    const { ouid } = response.data;
    const [matchIds] = await Promise.all([getuserMatctLog(ouid, currentIndex)]);
    const matchDetails = await Promise.all(matchIds.map(getuserMatchDetail));
    const result = {
      ouid,
      matchDetails,
    };
    // 클라이언트에 응답 전송
    res.status(200).json(result);
  } catch (error) {
    console.error("에러:", error);
    const message = `[ERROR] GET /getmatchinfo ${error.message}`;
    res.status(400).json({ message });
  }
});

const getuserMatctLog = async (ouid, currentIndex) => {
  try {
    const response = await axios.get(
      Baseinfo.BaseApiUrl.baseURL +
        `/fconline/v1/user/match?ouid=${ouid}&matchtype=50&offset=${currentIndex}&limit=10`,
      { headers: Baseinfo.headers }
    );
    return response.data;
  } catch (error) {
    throw new Error(`getuserMatching ${error.message}`);
  }
};
const getuserMatchDetail = async (matchId) => {
  try {
    const response = await axios.get(
      Baseinfo.BaseApiUrl.baseURL +
        "/fconline/v1/match-detail?matchid=" +
        matchId,
      { headers: Baseinfo.headers }
    );
    return response.data;
  } catch (error) {
    throw new Error(`getuserMatchDetail ${error.message}`);
  }
};
module.exports = router;
