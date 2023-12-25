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
    console.log("요청 본문:", req.body);

    const { message: nickname, currentIndex = 0 } = req.body;
    console.log("닉네임:", nickname);

    const { ouid } = await getOuid(nickname);
    console.log("OUID:", ouid);

    const { level, nickname: UserName } = await getuserinfo(ouid);
    const maxdivisionInfo = await getuserDevisioninfo(ouid);
    const matchids = await getuserMatctLog(ouid, currentIndex);
    const matchDetail = await getuserMatchDetails(matchids);

    console.log(maxdivisionInfo);
    result = {
      ouid,
      level,
      UserName,
      ...maxdivisionInfo, // 스프레드 연산자
      matchids,
    };

    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error("에러:", error);
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

const getuserDevisioninfo = async (ouid) => {
  const response = await axios.get(
    Baseinfo.BaseApiUrl.baseURL + "/fconline/v1/user/maxdivision?ouid=" + ouid,
    { headers: Baseinfo.headers }
  );
  return response.data.find((data) => data.matchType === 50);
};

const getuserMatctLog = async (ouid, currentIndex) => {
  try {
    const response = await axios.get(
      Baseinfo.BaseApiUrl.baseURL +
        "/fconline/v1/user/match?ouid=" +
        ouid +
        `&matchtype=50&offset=${currentIndex * 10}&limit=10`,
      { headers: Baseinfo.headers }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(`getuserMatching ${error.message}`);
  }
};

const getuserMatchDetails = async (matchids) => {
  try {
    const result = [];
    for (const matchId of matchids) {
      const userMatchDetail = await getuserMatchDetail(matchId);
      result.push(userMatchDetail);
    }
    return result;
  } catch (error) {
    throw new Error(`getuserMatchDetails ${error.message}`);
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

const getCurrentIndex = async (nickname) => {
  const response = await axios.get(
    Baseinfo.BaseApiUrl.baseURL + "/fconline/v1/id?nickname=" + nickname,
    { headers: Baseinfo.headers }
  );
  return response.data;
};

module.exports = router;
