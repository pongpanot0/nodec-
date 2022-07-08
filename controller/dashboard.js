const db = require("../config/db");
const conn = require("../config/mongodb");
exports.getGraph = async (req, res) => {
    await conn.connect();
    const log = await conn
      .db("logAttendance")
      .collection("log")
      .distinct('Name')
    await conn.close();
    console.log(log.length);
    res.send({
      count: log
    });
}