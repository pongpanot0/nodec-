const db = require("../config/db");
const conn = require("../config/mongodb");
exports.insert = async (req, res) => {
  const moment = require("moment");
  const today = new Date();
  // current minutes
  const dateObject = new Date();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();

  // current seconds
  const seconds = dateObject.getSeconds();
  let date = today.toLocaleDateString("en-US");
  let start = dateObject.getHours() + ":" + dateObject.getMinutes();
  let late = "8:30";
  let end = today.toLocaleDateString("en-US");
  let name = req.body.name;
  let organize = req.body.organize;
  let machine = req.body.machine;
  console.log(moment(start, "hh:mm").minute());
  console.log(moment(late, "mm"));
  let insert = `insert into expoetexcel(date,start,end,name) value("${date}","${start}","${end}","${name}") `;
  console.log(today.toLocaleDateString("en-US"));
  db.query(insert, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (start < late) {
      const lineNotify = require("line-notify-nodejs")(
        "7t5hc3d22TFAsM6tKOLyMNtEmL2mHE1JcN7KqnpArKX"
      );
      lineNotify
        .notify({
          message: `คุณ ${name} 
แผนก ${organize} 
บันทึกเวลา @${machine}
วันที่ ${date}
เวลา${start}`,
        })
        .then(() => {
          res.send("SendComplete");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (start > late) {
      const lineNotify = require("line-notify-nodejs")(
        "7t5hc3d22TFAsM6tKOLyMNtEmL2mHE1JcN7KqnpArKX"
      );
      lineNotify
        .notify({
          message: `คุณ ${name} 
แผนก ${organize} 
บันทึกเวลา @${machine}
วันที่ ${date}
เวลา${start}
คุณเข้างานสาย${
            moment(start, "hh:mm").minute() - moment(late, "hh:mm").minute()
          }นาที
คลิกดูสรุป`,
        })
        .then(() => {
          res.send("SendComplete");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};
exports.get = async (req, res) => {
  await conn.connect();
  const log = await conn
    .db("logAttendance")
    .collection("log")
    .find({}).limit(10)
    .toArray();
  await conn.close();
  console.log(log.length);
  res.send({
    count: log.length,
    data: log,
  });
};
exports.insertExample = async (req, res) => {
  try {
    await db.connect();
    const result = await db.query(
      "select * from dbo.USERINFO ORDER BY USERID OFFSET 0 ROWS"
    );
    const user = req.body;
    await conn.connect();

    var doc = [];
    const count = result.recordsets;
    const total = count.Total;
    console.log(result.recordset.length);

    for (let i = 0; i < result.recordset.length; i++) {
      const docs = [
        [
          {
            USERID: result.recordset[0]["USERID"],
            Badgenumber: result.recordset[0]["Badgenumber"],
            SSN: result.recordset[0]["SSN"],
            Name: result.recordset[0]["Name"],
            BIRTHDAY: result.recordset[0]["BIRTHDAY"],
            HIREDDAY: result.recordset[0]["HIREDDAY"],
            street: result.recordset[0]["street"],
            DEFAULTDEPTID: result.recordset[0]["DEFAULTDEPTID"],
            SECURITYFLAGS: result.recordset[0]["SECURITYFLAGS"],
            ATT: result.recordset[0]["ATT"],
            INLATE: result.recordset[0]["INLATE"],
            OUTEARLY: result.recordset[0]["OUTEARLY"],
            OVERTIME: result.recordset[0]["OVERTIME"],
            SEP: result.recordset[0]["SEP"],
            HOLIDAY: result.recordset[0]["HOLIDAY"],
            LUNCHDURATION: result.recordset[0]["LUNCHDURATION"],
            PHOTO: result.recordset[0]["PHOTO"],
            Notes: result.recordset[0]["Notes"],
            privilege: result.recordset[0]["privilege"],
            InheritDeptSch: result.recordset[0]["InheritDeptSch"],
            InheritDeptSchClass: result.recordset[0]["InheritDeptSchClass"],
            AutoSchPlan: result.recordset[0]["AutoSchPlan"],
            MinAutoSchInterval: result.recordset[0]["MinAutoSchInterval"],
            RegisterOT: result.recordset[0]["RegisterOT"],
            InheritDeptRule: result.recordset[0]["InheritDeptRule"],
            EMPRIVILEGE: result.recordset[0]["EMPRIVILEGE"],
            CardNo: result.recordset[0]["CardNo"],
          },
        ],
      ];
      console.log(...docs[0]);
      doc.push(...docs[0]);
    }

    await conn.db("logAttendance").collection("log").insertMany(doc);
    await conn.close();
    return res.status(200).send({
      user: "res",
    });
  } catch (error) {
    console.log(error);
  }
};




exports.getall = async (req, res) => {
  id = req.params.id
  var ObjectId = require('mongodb').ObjectID;
  const query = { "Badgenumber": "1" };
  await conn.connect();
  const log = await conn
    .db("logAttendance")
    .collection("log")
    .find(query).toArray()
  await conn.close();

  res.send({
    data: log,
  });
};
exports.insert = async (req, res) => {
  id = req.params.id
  var ObjectId = require('mongodb').ObjectID;
  const query = { "Badgenumber": "1" };
  await conn.connect();
  const log = await conn
    .db("logAttendance")
    .collection("log")
    .find(query).toArray()
  await conn.close();

  res.send({
    data: log,
  });
};
