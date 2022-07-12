const db = require("../config/db");
const conn = require("../config/mongodb");
const Event = require("../Model/Event");
const moment = require("moment");

exports.getGraph = async (req, res) => {
  await conn.connect();
  const log = await conn.db("logAttendance").collection("log").distinct("Name");

  console.log(log.length);
  res.send({
    count: log,
  });
};

exports.getDate = async (req, res) => {
  await conn.connect();
  const event = await conn
    .db("logAttendance")
    .collection("log")
    .find({})
    .toArray();

  res.send(event);
};

exports.postDate = async (req, res) => {
  try {
    await conn.connect();
    const event = Event(req.body);
    await event.save();

    res.send(200);
  } catch (error) {
    console.log(error);
  }
};
const Author = require("../Model/Collection");

exports.testapi = async (req, res) => {
  try {
    const pipeline = [
      { $match: { anSEnrollNumber: "5" } },

      {
        $lookup: {
          from: "Employess",
          localField: "anSEnrollNumber",
          foreignField: "anSEnrollNumber",
          as: "fileList",
        },
      },
    ];

    await conn.connect();
    const log = await conn
      .db("logAttendance")
      .collection("log")
      .aggregate(pipeline)
      .toArray();
    for await (const doc of log) {
      console.log(doc);
    }

    res.send({
      data: log,
    });
  } catch (error) {
    console.log(error);
  }
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
const Log = require("../Model/Log");
exports.notstamp = async (req, res) => {
  conn.connect();

  // Database reference
  const connect = conn.db("logAttendance");
  const log = connect.collection("log");
  // Connect database to connection
  const collection = connect.collection("Employess");

  // class key
  const lm = await log
    .aggregate([
      { $match: { company_id: "1", time: null } },
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
        },
      },
      {
        $lookup: {
          from: "Employess",
          localField: "_id.anSEnrollNumber",
          foreignField: "anSEnrollNumber",
          as: "fileList2",
        },
      },
      {
        $project: {
          employess:{ $arrayElemAt: ["$fileList2", 0] },
          start: { $arrayElemAt: ["$fileList", 0] },
          last: { $arrayElemAt: ["$fileList", -1] },
          otherField:1,
        },
      },
    ])
    .toArray();

  res.send({
    count: lm.length,
    data: lm,
  });
};

exports.stamp = async (req, res) => {
  conn.connect();

  // Database reference
  const connect = conn.db("logAttendance");
  const log = connect.collection("log");
  // Connect database to connection
  const collection = connect.collection("Employess");

  // class key
  const lm = await log
    .aggregate([
      { $match: { company_id: "1", time: "22/07/65" } },
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
        },
      },
      {
        $lookup: {
          from: "Employess",
          localField: "_id.anSEnrollNumber",
          foreignField: "anSEnrollNumber",
          as: "fileList2",
        },
      },
      {
        $project: {
          employess:"$fileList2",
          start: { $arrayElemAt: ["$fileList", 0] },
          otherField:1,
          last: { $arrayElemAt: ["$fileList", -1] },
        },
      },
    ])
    .toArray();

  res.send({
    count: lm.length,
    data: lm,
  });
};
