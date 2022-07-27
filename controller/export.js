const db = require("../config/db");
const conn = require("../config/mongodb");
const moment = require("moment");
exports.Exportlogs = async (req, res) => {
  conn.connect();
  // Database reference
  const connect = conn.db("logAttendance");
  const log = connect.collection("log");
  // Connect database to connection
  const date = req.params.date;
  // class key
  let count = `select * from userinfo where company_id = 1`;
  db.query(count, async (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      const lm = await log
        .aggregate([
          {
            $match: {
              company_id: "1",
            },
          },

          {
            $group: {
              _id: {
                name: "$log",
                anSEnrollNumber: "$anSEnrollNumber",
                date: "$date",
              },
            },
          },
          {
            $lookup: {
              from: "log",
              localField: "_id.anSEnrollNumber",
              foreignField: "anSEnrollNumber",
              as: "fileList",
              pipeline: [
                {
                  $group: {
                    _id: "$date",
                    start: { $first: "$time" },
                    last: { $last: "$time" },
                  },
                },
              ],
            },
          },

          {
            $project: {
              start:  "$fileList",
              scan: { $size: "$fileList" },
            },
          },
        ])
        .toArray();
      const output = result.map((obj1) =>
        Object.assign(
          obj1,
          lm.find((o2) => obj1.Badgenumber === o2._id.anSEnrollNumber)
        )
      );
      const fastcsv = require("fast-csv");
      const fs = require("fs");
      const ws = fs.createWriteStream("data.csv");
      const data = [];
      for(const val of output) {
        console.log(val)
    }
      for (let i = 0; i < output.length; i++) {
        if (output[i].start === undefined) {
          const jsonData = [
            {
              Badgenumber: output[i].Badgenumber,
              name: output[i].Name,
              วันที่: "ไม่ข้อมูล",
              เวลาเข้างาน: "ไม่มีข้อมูล",
              เวลาออกงาน: "ไม่มีข้อมูล",
            },
          ];
          data.push(...jsonData);
        }
        if (output[i].start !== undefined) {
       
          const jsonData = [
            {
              Badgenumber: output[i].Badgenumber,
              name: output[i].Name,
              วันที่: output[i].start._id,
              เวลาเข้างาน: output[i].start.start,
              เวลาออกงาน: output[i].start.last,
            },
          ];
          data.push(...jsonData);
        }
      }

      fastcsv
        .write(data, { headers: true })
        .on("finish", function () {
          console.log("Write to CSV successfully!");
        })
        .pipe(ws);
      res.send({
        data: output,
      });
    }
  });
};
