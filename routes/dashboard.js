const dashboard = require("../controller/dashboard");
module.exports = function (app) {
  app.get("/getGraph", dashboard.getGraph);
  app.get("/getDate", dashboard.getDate);
  app.post("/postdate", dashboard.postDate);
  app.get("/testapi", dashboard.testapi);
  app.get("/distinct", dashboard.distinct);
  app.get("/notstamp", dashboard.notstamp);
  app.get("/stamp", dashboard.stamp);
  app.get("/autoupdate",dashboard.autoupdate)
  app.get("/countEmployees",dashboard.countEmployees)
  app.get("/exportdate/:date",dashboard.exportdate)
  app.get("/monthReport/",dashboard.monthReport)
  
};
