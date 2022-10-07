const bodyParser = require('body-parser');

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
  options: {
    encrypt: true,
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

// app.get('/', function (req, res) {
//     sql.connect(config, function (err) {
//         if (err) console.log(err);
//         var request = new sql.Request();

//         request.query('select * from  sampletable', function (err, recordset) {
//             if (err) console.log(err)
//             // send records as a response
//             res.send(recordset);
//         });
//     });

//     // let out = request.input('playload', sql.VarChar(300), playload).output('Response', sql.VarChar(300)).execute("Pr_test");
//     // console.dir(out);
//     // request.input('playload', sql.VarChar, playload).output('Response', sql.VarChar).execute("Pr_test", function(err, recordset) {
//     //     if (err) console.log(err)
//     //     // console.log(recordset);
//     //     res.send(recordset);
//     // });
//     // console.dir(out);
// });

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

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

    // var playload = JSON.stringify({
    //     "from": "917535017222",
    //     "to": "917973471597",
    //     "type": "template",
    //     "message": {
    //         "templateid": "17599",
    //         "url": "https://pinnacle.in/assets/img/hlr/hlr.png",
    //         "placeholders": []
    //     }
    // });

    //Request Start
    var load = JSON.stringify(req.body);

    request
      .input("playload", sql.VarChar, load)
      .output("Response", sql.VarChar)
      .execute("QBSP_Online_DataLoading_V1", function (err, recordset) {
        if (err) console.log(err);

        // console.log("Insider", recordset.output.Response);
        res.send(recordset);

        // const end = process.hrtime.bigint();
        // const time = Date.now();
        // console.log(time);
        // const elapsed = Number(end - start) / 1000000;
        // console.log(
        //   elapsed,
        //   `${
        //     Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
        //     100
        //   } MB`
        // );
      });
      //Request End
      
  });
});

var server = app.listen(5000, function () {
  console.log("Server is running..");
});
