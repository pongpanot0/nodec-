const dashboard = require("../controller/dashboard");
module.exports = function (app) {
  app.get("/getGraph", dashboard.getGraph);
  app.get("/distinct", dashboard.distinct);
  app.get("/notstamp", dashboard.notstamp);
  app.get("/stamp", dashboard.stamp);
  app.get("/autoupdate",dashboard.autoupdate)
  app.get("/exportdate/:date",dashboard.exportdate)
  app.get("/monthReport",dashboard.monthReport)
  app.get("/employees",dashboard.employees)
};
