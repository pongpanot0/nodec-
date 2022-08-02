const exportcsv = require("../controller/export");
module.exports = function (app) {
  app.get("/Exportlogs/:id/:date", exportcsv.Exportlogs);
  app.get("/exportExcel/:id/:date", exportcsv.exportExcel);
  app.get("/exportExcelDetail/:id/:date", exportcsv.exportExcelDetail);
  
};
