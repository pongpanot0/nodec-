var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
var multer = require("multer");
const conn = require("./config/mongodb");
require("dotenv").config();
var upload = multer();
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors({ origin: "*" }));
const db = require('./config/db')
app.use(function (req, res, next) {
  next();
});
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(upload.array());
fs.readdirSync("routes").forEach(function (file) {
  if (file[0] == ".") return;
  var routeName = file.substr(0, file.indexOf("."));
  require("./routes/" + routeName)(app);
});

app.listen(7000, () => {
  console.log("server start ");
});

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

const cron = require("node-cron");
 
cron.schedule(
  "0 00 * * *",
  () => {
    const mysql = require("mysql2");

    let getdb = `select * from serail`;
    let cs = `update employee set Stamp = 1`;
    db.query(getdb, async (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        const data = [];
        for (let i = 0; i < result.length; i++) {
          const connection = {
            host: `${process.env.db_host}`,
            user: `${process.env.db_user}`,
            password: `${process.env.db_password}`,
            database: `${result[i].db_name}`,
            port: `${process.env.db_port}`,
            connectionLimit: 1000,
          };

          data.push(connection);
        }
        console.log(data);
        db2 = mysql.createConnection(...data);

        db2.query(cs, async (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result) {
            console.log(result)
          }
        });
      }
    });
  },
  { scheduled: true, timezone: "Asia/Bangkok" }
);
console.log(process.env.FRONT_END_URL);
/* console.log(moment(new Date()).format("hh:mm"))
console.log(moment(new Date()).format("DD:MM:YYYY"));
console.log(moment(new Date()).subtract(1, "days").format("DD:MM:YYYY"));
console.log(moment(new Date()).format("hh:mm:ss")); */
