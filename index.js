var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
var multer = require("multer");
const conn = require("./config/mongodb");
var upload = multer()
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors({ origin: "*" }));
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


var moment = require("moment");
app.listen(8080, () => {
  console.log("server start ");
});

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


/* console.log(moment(new Date()).format("hh:mm"))
console.log(moment(new Date()).format("DD:MM:YYYY"));
console.log(moment(new Date()).subtract(1, "days").format("DD:MM:YYYY"));
console.log(moment(new Date()).format("hh:mm:ss")); */
