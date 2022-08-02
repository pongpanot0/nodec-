const db = require("../config/db");
const conn = require("../config/mongodb");
const moment = require("moment");
var mysql = require("mysql2");
const XLSX = require("xlsx");
exports.Exportlogs = async (req, res) => {
  conn.connect();
  let id = req.params.id;
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
        .find({ company_id: `${id}`, monthReport: date })

        .toArray();

      const output = lm.map((obj1) =>
        Object.assign(
          obj1,
          result.find((o2) => obj1.anSEnrollNumber === o2.Enrollnumber)
        )
      );
      const fastcsv = require("fast-csv");

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
      console.log(data);
      const convertJsonToexcel = () => {
        //binary string
        const csv = require("csv-parser");
        var csvContent =
          "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent);
        const fs = require("fs"); // workbook options
        fastcsv.write(data, { headers: true }).on("finish", function () {
          console.log("1234");
        }); // write workbook file
        const ws = fs.createReadStream("data.csv"); // create read stream
        ws.on("open", function () {
          ws.pipe(csv());
          res.header("Content-type", "text/csv; charset=utf-8");
          res.header(`Content-disposition', 'attachment; filename=${date}.csv`);
          // This just pipes the read stream to the response object (which goes to the client)
          ws.pipe(res);
        });
      };
      convertJsonToexcel();
    }
  });
};
exports.exportExcel = async (req, res) => {
  conn.connect();
  let id = req.params.id;
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
        .find({ company_id: `${id.toLowerCase()}`, monthReport: date })
        .toArray();
      const output = lm.map((obj1) =>
        Object.assign(
          obj1,
          result.find((o2) => obj1.anSEnrollNumber === o2.Enrollnumber)
        )
      );

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
      const convertJsonToexcel = () => {
        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook, workSheet, "HouseData");
        //binary buffer
        XLSX.write(workBook, {
          bookType: "xlsx",
          type: "buffer",
        });
        //binary string
        const fs = require("fs");
        const filename = "users.xlsx";
        const wb_opts = { bookType: "xlsx", type: "binary" }; // workbook options
        XLSX.writeFile(workBook, filename, wb_opts); // write workbook file
        const stream = fs.createReadStream(filename); // create read stream
        stream.on("open", function () {
          // This just pipes the read stream to the response object (which goes to the client)
          stream.pipe(res);
        });
      };
      convertJsonToexcel();
    }
  });
};
exports.exportExcelDetail = async (req, res) => {
  let id = req.params.id;
  let date = req.params.date;
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
  let count = `select e.*,c.* from employee e LEFT outer JOIN department c on (e.Depcode = c.Depcode)`;
  db2.query(count, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      conn.connect();
      // Database reference
      const connect = conn.db("logAttendance");
      const log = connect.collection("log");
      // Connect database to connection
      // class key
      const lm = await log
      .aggregate([
        {
          $match: {
            company_id: `${id.toLowerCase()}`,
            monthReport: `${date.toLowerCase()}`,
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
          },
        },
        {
          $project: {
            start: { $arrayElemAt: ["$fileList", 0] },
            otherField: 1,
            last: { $arrayElemAt: ["$fileList", -1] },
          },
        },
      ])
      .toArray();

      const output = result.map((obj1) =>
        Object.assign(
          obj1,
          lm.find((o2) => obj1.Enrollnumber === o2._id.anSEnrollNumber)
        )
      );
      /*      console.log(result[0].total); */
      res.send(output);
      const data = [];
      for (let i = 0; i < output.length; i++) {
        if(output[i].start === undefined){
          const jsonData = [
            {
              Enrollnumber: output[i].Enrollnumber,
              name: output[i].Name,
              วันที่: 'ไม่มีข้อมูล',
              เวลาที่แสกนนิ้วเข้า: 'ไม่มีข้อมูล',
              เวลาที่แสกนนิ้วออก: 'ไม่มีข้อมูล',
            },
          ];
          data.push(...jsonData);
        }
        if(output[i].start !== undefined){
          const jsonData = [
            {
              Enrollnumber: output[i].Enrollnumber,
              name: output[i].Name,
              วันที่: output[i].start.date,
              เวลาที่แสกนนิ้วเข้า: output[i].start.time,
              เวลาที่แสกนนิ้วออก: output[i].last.time,
            },
          ];
          data.push(...jsonData);
        }
      }
      
      const convertJsonToexcel = () => {
        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook, workSheet, "HouseData");
        //binary buffer
        XLSX.write(workBook, {
          bookType: "xlsx",
          type: "buffer",
        });
        //binary string
        const fs = require("fs");
        const filename = "users.xlsx";
        const wb_opts = { bookType: "xlsx", type: "binary" }; // workbook options
        XLSX.writeFile(workBook, filename, wb_opts); // write workbook file
        const stream = fs.createReadStream(filename); // create read stream
        stream.on("open", function () {
          // This just pipes the read stream to the response object (which goes to the client)
          stream.pipe(res);
        });
      };
      convertJsonToexcel();
    }
  });
};
