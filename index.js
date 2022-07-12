var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");

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

app.listen(8080, () => {
  console.log("server start ");
});
