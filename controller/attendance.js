const db = require("../config/db");
const conn = require("../config/mongodb");

exports.get = async (req, res) => {
  await conn.connect();
  const log = await conn
    .db("logAttendance")
    .collection("log")
    .find({})
    .limit(10)
    .toArray();

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

    return res.status(200).send({
      user: "res",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getall = async (req, res) => {
  id = req.params.id;
  const pipeline = [
    { $match: { title: "name" } },
    {
      $group: {
        _id: { name: "$title", start: "$start", _id: "$_id" },
        count: { $sum: 1 }, //$sum accumulator
        totalValue: { $sum: "$value" }, //$sum accumulator
      },
    },
  ];

  const query = { Badgenumber: "1" };
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
};

exports.getId = async (req, res) => {
  id = req.params.id;
  var ObjectId = require("mongodb").ObjectID;
  const query = { Badgenumber: "1" };
  await conn.connect();
  const log = await conn
    .db("logAttendance")
    .collection("log")
    .find(query)
    .toArray();

  res.send({
    data: log,
  });
};
var moment = require("moment");
const Event = require("../Model/Event");
exports.insertAttendance = async (req, res) => {
  try {
    const event = {
      anSEnrollNumber: req.body.anSEnrollNumber,
      anVerifyMode: req.body.anVerifyMode,
      anInOutMode: req.body.anInOutMode,
      anIanLogDatenOutMode: req.body.anIanLogDatenOutMode,
      date: moment(new Date()).format("DD:MM:YYYY"),
      time: moment(new Date()).format("hh:mm"),
      month:moment(new Date()).format("MM:YYYY"),
      monthReport:moment(new Date()).format("MM:YYYY").toString().replace(":", ''),
      year:moment(new Date()).format("YYYY"),
      astrDeviceIP: req.body.astrDeviceIP,
      anDevicePort: req.body.anDevicePort,
      anDeviceID: req.body.anDeviceID,
      astrSerialNo: req.body.astrSerialNo,
      astrRootIP: req.body.astrRootIP,
      company_id: req.body.company_id,
    };
    console.log(event)
    await conn.connect();
    await conn
      .db("logAttendance")
      .collection("log")
      .insertOne(event, async (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          await conn
            .db("logAttendance")
            .collection("Employess")
            .findOneAndUpdate(
              { anSEnrollNumber: req.body.anSEnrollNumber },
              { $set: { stamp: true } },
              async (err, result) => {
                if (err) {
                  res.send(err);
                }
                if (result) {
                  const Employess = await conn
                    .db("logAttendance")
                    .collection("Employess")
                    .findOne({ anSEnrollNumber: event.anSEnrollNumber });
                  if (Employess.linetoken == null) {
                    const lineNotify = require("line-notify-nodejs")(
                      `X3IJzb8yQoEftREDZ5y2vznzVr0TRJWog2ESj7ym3Yw`
                    );
                    await lineNotify
                      .notify({
                        message: `${Employess.company}
คุณ : ${Employess.name} 
แผนก : ${Employess.organize} 
บันทึกเวลา : @${event.anDeviceID}
วันที่ : ${moment(event.anIanLogDatenOutMode).format("DD/MM/YY")}
เวลา : ${moment(event.anIanLogDatenOutMode).format("HH:MM")}
ดูสรุป : www.HIPezline.co.th`,
                      })
                      .then((result) => {
                        res.send(result);
                      })
                      .catch((err) => {
                        res.send(err);
                      });
                  }
                  if (Employess.linetoken !== null) {
                    const lineNotify = require("line-notify-nodejs")(
                      `X3IJzb8yQoEftREDZ5y2vznzVr0TRJWog2ESj7ym3Yw`
                    );
                    await lineNotify
                      .notify({
                        message: `${Employess.company}
คุณ : ${Employess.name} 
แผนก : ${Employess.organize} 
บันทึกเวลา : @${event.anDeviceID}
วันที่ : ${moment(event.anIanLogDatenOutMode).format("DD/MM/YY")}
เวลา : ${moment(event.anIanLogDatenOutMode).format("HH:MM")}
ดูสรุป : www.HIPezline.co.th`,
                      })
                      .then((result) => {
                        res.send(result);
                      })
                      .catch((err) => {
                        res.send(err);
                      });
                  }
                }
              }
            );
        }
      });
  } catch (error) {
    res.send(error);
  }
};
