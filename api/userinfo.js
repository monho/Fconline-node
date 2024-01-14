const express = require("express");
const router = express.Router();
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const Baseinfo = require("./Baseinfo");

router.use(cors());
router.use(bodyParser.json());

router.post("/getuserinfo", async (req, res) => {
  try {
    const { message: nickname, currentIndex = 0 } = req.body;
    const { ouid } = await getOuid(nickname);

    const [userInfo, maxDivisionInfo, matchIds] = await Promise.all([
      getuserinfo(ouid),
      getuserDevisioninfo(ouid),
      getuserMatctLog(ouid, currentIndex),
    ]);

    const matchDetails = await Promise.all(matchIds.map(getuserMatchDetail));

    const result = {
      ouid,
      level: userInfo.level,
      UserName: userInfo.nickname,
      ...maxDivisionInfo,
      matchDetails,
    };

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
        `/fconline/v1/user/match?ouid=${ouid}&matchtype=50&offset=${currentIndex}&limit=10`,
      { headers: Baseinfo.headers }
    );
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
  return response.data.find((data) => data.matchId === matchId);
};
router.get("/getuserinfos", async (req, res) => {
  try {
    const { value } = req.query;
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`<h1>querystring value: ${value}</h1>`);
  } catch (error) {
    console.error("에러:", error);
    const message = `[ERROR] POST /getuserinfo ${error.message}`;
    res.status(400).json({ message });
  }
});
module.exports = router;
