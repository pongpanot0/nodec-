var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
const conn = require("./config/mongodb");

app.use(bodyParser.json());
const cors = require("cors");
app.use(cors({ origin: "*" }));
app.use(function (req, res, next) {
  next();
});

fs.readdirSync("routes").forEach(function (file) {
  if (file[0] == ".") return;
  var routeName = file.substr(0, file.indexOf("."));
  require("./routes/" + routeName)(app);
});
var moment = require("moment");
app.listen(8080, () => {
  console.log("server start ");
});
var cron = require('node-cron');

cron.schedule('0 0 0 * * *', () => {
  conn.connect();
  const connect = conn.db("logAttendance");
  const collection = connect.collection("Employess");
  const col = collection.updateMany(
    {},
    { $set: { stamp: false } },
    false,
    true
  );
  console.log(col);
}, {
  scheduled: true,
  timezone:"Asia/Singapore"
});
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


console.log(moment(new Date()).format("DD:MM:YYYY"));
console.log(moment(new Date()).subtract(1, "days").format("DD:MM:YYYY"));
