const exportcsv = require("../controller/export");
module.exports = function (app) {
  app.get("/Exportlogs/:id/:date", exportcsv.Exportlogs);
  app.get("/exportExcel/:id/:date", exportcsv.exportExcel);
  app.get("/exportExcelDetail/:id/:date", exportcsv.exportExcelDetail);
  app.get("/exportExcelDatetoDate/:id/:date2/:todate", exportcsv.exportExcelDatetoDate);
  app.get("/ExportlogsDatetodate/:id/:date/:todate", exportcsv.ExportlogsDatetodate);
};
