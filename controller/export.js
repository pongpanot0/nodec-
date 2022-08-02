const db = require("../config/db");
const conn = require("../config/mongodb");
const moment = require("moment");
var mysql = require("mysql2");
exports.Exportlogs = async (req, res) => {
  conn.connect();
  let id = "pom";
  var connection = {
    host: "119.59.97.193",
    user: "root",
    password: "123456",
    database: `${id.toLowerCase()}`,
    port: "33037",
    connectionLimit: 10,
  };
  let db2 = null;
  db2 = mysql.createPool(connection);
  // Database reference
  const connect = conn.db("logAttendance");
  const log = connect.collection("log");
  // Connect database to connection
  const date = req.params.date;
  // class key
  let count = `select * from employee`;
  db2.query(count, async (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      const lm = await log
        .find({ company_id: "pom", month: "08:2022" })

        .toArray();

      const output = lm.map((obj1) =>
        Object.assign(
          obj1,
          result.find((o2) => obj1.anSEnrollNumber === o2.Enrollnumber)
        )
      );
      console.log(output);
      const fastcsv = require("fast-csv");
      const fs = require("fs");
      const ws = fs.createWriteStream("data.csv");
      const data = [];
      for (let i = 0; i < output.length; i++) {
        const jsonData = [
          {
            Enrollnumber: output[i].Enrollnumber,
            name: output[i].Name,
            วันที่: output[i].date,
            เวลาที่แสกนนิ้ว: output[i].time,
          },
        ];
        data.push(...jsonData);
      }
      /*      for (let i = 0; i < output.length; i++) {
        if (output[i].start === undefined) {
       
          data.push(...jsonData);
        }
        if (output[i].start !== undefined) {
          for (const val of output) {
            console.log(val.start)
            const jsonData = [
              {
                Enrollnumber: output[i].Enrollnumber,
                name: output[i].Name,
                วันที่: val.start[i]._id.date,
                เวลาเข้างาน: val.start[i]._id.time,
                     เวลาออกงาน:  val.last[0].time, 
              },
            ];

            data.push(...jsonData);
          }
        }
      } */

      fastcsv
        .write(data, { headers: true })
        .on("finish", function () {
          console.log("Write to CSV successfully!");
        })
        .pipe(ws);
      res.send({
        data: data,
      });
    }
  });
};
