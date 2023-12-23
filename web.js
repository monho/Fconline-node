const express = require("express");
const app = express();
const topdata = require("./api/top5data");


app.use(express.json({ extended : false}));

app.use("/api/top5data", topdata);

const PORT = porcess.env.PORT || 8080;
app.listen(PORT, ()=> console.log('server run ${PORT}'));