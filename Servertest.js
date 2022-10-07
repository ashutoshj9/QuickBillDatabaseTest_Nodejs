const bodyParser = require("body-parser");
const { response } = require("express");
var express = require("express");
var app = express();
require("dotenv").config();

// connect to your database
//const poolp = require('./Database')
// var sql = require('mssql')

var sql = require("mssql");
var config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  requestTimeout: 600000,
  options: {
    encrypt: true,
    trustedConnection: true,
    trustServerCertificate: true,
    useUTC: true,
    enableArithAbort: true,
  },
  pool: {
    max: 1000,
    min: 0,
    idleTimeoutMillis: 600000,
    acquireTimeoutMillis: 600000,
    createTimeoutMillis: 600000,
    destroyTimeoutMillis: 600000,
    reapIntervalMillis: 600000,
    createRetryIntervalMillis: 600000,
  },
};

//config.connectionTimeout = 30000;

//For Getting Body Content
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.post("/Pos", function (req, res) {
  const start = process.hrtime.bigint();
  //JSON DATA
  sql.connect(config, function (err) {
    if (err) console.log(err);
    var request = new sql.Request();

    // function randomIntFromInterval(min, max) {
    //   return Math.floor(Math.random() * (max - min + 1) + min);
    // }
    // const rndInt = randomIntFromInterval(1, 25);
    // console.log(rndInt);
    // if(rndInt == 2) process.exit();

    var load = JSON.stringify(req.body);
    //Request Start
    request
      .input("playload", sql.VarChar, load)
      .output("Response", sql.VarChar)
      .execute("QBSP_Online_DataLoading_V1", function (err, recordset) {
        if (err) console.log(err);
        res.send(recordset);
      });
    // Request End
  });
});

var server = app.listen(5000, function () {
  console.log("Server is running..");
});
