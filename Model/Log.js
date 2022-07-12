const mongoose = require("mongoose");
const LogSchema = mongoose.Schema({
  anSEnrollNumber: String,
  anVerifyMode: String,
  anInOutMode: String,
  start: String,
  astrDeviceIP: String,
  anDevicePort: String,
  anDeviceID: String,
  astrSerialNo: String,
  astrRootIP: String,
});

const Log = mongoose.model("Log", LogSchema);

module.exports = Log;
