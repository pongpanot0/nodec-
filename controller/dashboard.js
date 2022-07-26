const db = require("../config/db");
const conn = require("../config/mongodb");
const Event = require("../Model/Event");
const moment = require("moment");
var mysql  = require('mysql2');
exports.getGraph = async (req, res) => {
  await conn.connect();
  const log = await conn.db("logAttendance").collection("log").distinct("Name");

  res.send({
    count: log,
  });
};

exports.distinct = async (req, res) => {
  conn.connect();

  // Database reference
  const connect = conn.db("logAttendance");

  // Connect database to connection
  const collection = connect.collection("log");

  // class key
  collection
    .distinct("anSEnrollNumber", { company_id: "1" })
    .then((ans) => {
      // Printing distinct value of class key
      res.send({ count: ans.length });
    })
    .catch((err) => {
      console.log(err.Message);
    });
};
exports.employees = async (req, res) => {
  let count = `select * from userinfo where company_id = 1`;
  db.query(count, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      res.send({
        count: result.length,
        data: result,
      });
    }
  });
};
exports.notstamp = async (req, res) => {
  let count = `select * from userinfo where company_id = 1 and Stamp = 1`;
  db.query(count, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      res.send({
        count: result.length,
        data: result,
      });
    }
  });
};
exports.stamp = async (req, res) => {
  let id = req.params.id
  var connection = ({
    host:'119.59.97.193',
    user:'root',
    password:'123456',
    database: `${id}`,
    port:'33037',
  })
  db2 = mysql.createPool(connection); 

  let count = `select * from employee where Stamp=0`;
  db2.query(count, async (err, result) => {
    if (err) {
      res.send(err);
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
              company_id: "1",
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
      res.send({
        count: output.length,
        data: output,
      });
    }
  });
};

exports.exportdate = async (req, res) => {
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
              monthReport:date
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
          lm.find((o2) => obj1.Badgenumber === o2._id.anSEnrollNumber)
        )
      );

      res.send({
        data: output,
      });
    }
  });
};

exports.monthReport = async (req, res) => {
  conn.connect();

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
          company_id: "1",
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
exports.autoupdate = async (req, res) => {
  conn.connect();
  const connect = conn.db("logAttendance");
  const collection = connect.collection("Employess");
  const col = await collection.updateMany(
    {},
    { $set: { stamp: false } },
    false,
    true
  );
  res.send(col);
};
