const express = require("express");
const router = express.Router();
const axios = require('axios');
const path = require('path');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser = require('body-parser');  // body-parser 모듈 추가



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


router.get("/",async (req , res)=>{
    try {
        const browser = await puppeteer.launch({
          // node14에서 지원되는 옵션을 추S
          args: ['--no-sandbox'],
        });
        const page = await browser.newPage();
    
        // 페이지에 접속
        await page.goto('https://fconline.nexon.com/datacenter/rank');
    
        // 동적으로 데이터가 로드되기를 기다림 (예: 0.2초 동안 대기)
        await page.waitForTimeout(200);
    
        // 동적으로 로드된 데이터 크롤링 (상위 5개의 tr 요소만 선택)
        const crawledData = await page.evaluate(() => {
          const data = [];
    
          // tr 클래스명이 'tr'인 요소들 선s택
          const trElements = document.querySelectorAll('.tr');
    
          // 상위 5개의 tr 요소만 추출 1부터 시작하는 이유는 초기 n/a  더미데이터가 나오기때문에
          for (let i = 1; i < Math.min(6, trElements.length); i++) {
            const trElement = trElements[i];
            const name = trElement.querySelector('.name.profile_pointer')?.textContent?.trim() || 'N/A';
            const rankRWinPoint = trElement.querySelector('.td.rank_r_win_point')?.textContent?.trim() || 'N/A';
            const rankNo = trElement.querySelector('.td.rank_no')?.textContent?.trim() || 'N/A';
    
            // 각각의 객체를 배열에 추가
            data.push({
              name: name,
              rankRWinPoint: rankRWinPoint,
              rankNo: rankNo,
            });
          }
    
          return data;
        });
    
        await browser.close();
    
        res.json({ crawledData });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
});



module.exports = router;