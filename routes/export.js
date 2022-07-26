const exportcsv = require("../controller/export");
module.exports = function (app) {
  app.get("/Exportlogs", exportcsv.Exportlogs);
};
