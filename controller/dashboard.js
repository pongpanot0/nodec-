const db = require("../config/db");
const conn = require("../config/mongodb");
const Event = require("../Model/Event");
const moment = require("moment");
var mysql = require("mysql2");
exports.getGraph = async (req, res) => {
  await conn.connect();
  const log = await conn.db("logAttendance").collection("log").distinct("Name");

  res.send({
    count: log,
  });
};

exports.employees = async (req, res) => {
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

  let count = `select * from employee`;

  db2.query(count, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      res.send({
        count: result.length,
        data: result,
      });
      db2.end();
    }
  });
};
exports.notstamp = async (req, res) => {
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

  let count = `select e.*,c.* from employee e LEFT outer JOIN department c on (e.Depcode = c.Depcode) where e.Stamp = 1`;
  db2.query(count, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      res.send({
        count: result.length,
        data: result,
      });
      db2.end();
    }
  });
};
exports.stamp = async (req, res) => {
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
  let limit = req.params.limit;
  let offset = req.params.offset;
 

  let count = `select e.*,c.*, (select count(*)  from employee where Active=1) as total , (select count(*)  from employee where Stamp = 0) as total2  from employee e LEFT outer JOIN department c on (e.Depcode = c.Depcode) where e.Stamp = 0 limit ${limit} offset ${offset} `;
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
              date: moment(new Date()).format("DD:MM:YYYY"),
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
                { $match: { date: moment(new Date()).format("DD:MM:YYYY") } },
              ],
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
      if (result.length <= 0) {
        res.send({
          count3: "0",
          count2: "0",
        });
      }
      if (result.length > 0) {
        res.send({
          count3: result[0].total2,
          count2: result[0].total,
          count: output.length,
          data: output,
        });
      }

      db2.end();
    }
  });
};

exports.exportdate = async (req, res) => {
  const id = req.params.id;
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
  conn.connect();
  // Database reference
  const connect = conn.db("logAttendance");
  const log = connect.collection("log");
  // Connect database to connection
  const date = req.params.date;
  // class key
  let count = `select e.*,c.* from employee e LEFT outer JOIN department c on (e.Depcode = c.Depcode)`;
  db2.query(count, async (err, result) => {
    console.log(result);
    if (err) {
      res.send(err);
    }
    if (result) {
      const lm = await log
        .aggregate([
          {
            $match: {
              company_id: id.toLowerCase(),
              monthReport: date,
            },
          },

          {
            $group: {
              _id: {
                name: "$log",
                anSEnrollNumber: "$anSEnrollNumber",
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
                    late: { $first: "$late" },
                    last: { $last: "$time" },
                  },
                },
              ],
            },
          },

          {
            $project: {
              start: ["$fileList", 0],
              last: ["$fileList", -1],
              scan: { $size: "$fileList" },
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
      res.send({
        data: output,
      });
      db2.end();
    }
  });
};

exports.monthReport = async (req, res) => {
  conn.connect();
  const id = req.params.id;
  // Database reference
  const connect = conn.db("logAttendance");
  const log = connect.collection("log");
  // Connect database to connection
  const collection = connect.collection("Employess");

  // class key
  const lm = await log
    .aggregate([
      {
        $match: {
          company_id: id.toLowerCase(),
          month: {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: { month: "$month", monthReport: "$monthReport" },
        },
      },
    ])
    .toArray();

  res.send({
    count: lm.length,
    data: lm,
  });
};
exports.serial = async (req, res) => {
  let db_name = req.body.db_name;
  let serialnumber = req.body.serialnumber;
  let same = `SELECT COUNT(serialnumber) AS serialnumber FROM serail WHERE serialnumber='${serialnumber}'`;
  let count = `insert into serail (db_name,serialnumber)  VALUES ('${db_name}','${serialnumber}')`;
  db.query(same, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      db.query(count, (err, result) => {
        if (err) {
          res.send(err);
        }
        if (result) {
          console.log(result);
          res.send({
            count: result.length,
            data: result,
          });
          db2.end();
        }
      });
    }
  });
};
exports.setting = async (req, res) => {
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
  let count = `select * from setting`;

  db2.query(count, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      console.log(result);
      res.send({
        count: result.length,
        data: result,
      });
      db2.end();
    }
  });
};
