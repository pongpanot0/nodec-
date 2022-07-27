const dashboard = require("../controller/dashboard");
module.exports = function (app) {
  app.get("/getGraph", dashboard.getGraph);
  app.get("/notstamp/:id", dashboard.notstamp);
  app.get("/stamp/:id", dashboard.stamp);
  app.get("/autoupdate",dashboard.autoupdate)
  app.get("/exportdate/:date/:id",dashboard.exportdate)
  app.get("/monthReport/:id",dashboard.monthReport)
  app.get("/employees/:id",dashboard.employees)
  app.post("/serial",dashboard.serial)
};
