const db = require("../config/db");
const conn = require("../config/mongodb");
var moment = require("moment");
const Event = require("../Model/Event");
var mysql  = require('mysql2');
exports.insertAttendance = async (req, res) => {

    var connection = ({
      host:'119.59.97.193',
      user:'root',
      password:'123456',
      database: `siam`,
      port:'33037',
    })
    db2 = mysql.createPool(connection); 
    const event = {
      anSEnrollNumber: req.body.anSEnrollNumber,
      anVerifyMode: req.body.anVerifyMode,
      anInOutMode: req.body.anInOutMode,
      anIanLogDatenOutMode: req.body.anIanLogDatenOutMode,
      date: moment(new Date()).format("DD:MM:YYYY"),
      time: moment(new Date()).format("hh:mm"),
      month: moment(new Date()).format("MM:YYYY"),
      monthReport: moment(new Date())
        .format("MM:YYYY")
        .toString()
        .replace(":", ""),
      year: moment(new Date()).format("YYYY"),
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
          let update = `update employee set Stamp = 0  where Enrollnumber=${event.anSEnrollNumber} `;
          console.log(update)
          db2.query(update, async (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              let user = `select u.*,c.* from userinfo u  LEFT outer JOIN company c on (u.company_id = c.company_id) where  u.company_id =${event.company_id} and u.Badgenumber=${event.anSEnrollNumber}`;
              db.query(user, async (err, result) => {
                if (err) {
                  console.log(err);
                }
                if (result) {
                  let Name = result[0].Name;
                  let organize = result[0].street;
                  let company_id = result[0].company_name;
                  let sendline = `select linetoken from company where company_id =${event.company_id}`;
                  db.query(sendline, async (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    if (result.linetoken == null) {
                      const lineNotify = require("line-notify-nodejs")(
                        `${result[0].linetoken}`
                      );
                      await lineNotify
                        .notify({
                          message: `${company_id}
คุณ : ${Name} 
แผนก : ${organize} 
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
                    if (result.linetoken !== null) {
                      const lineNotify = require("line-notify-nodejs")(
                        `X3IJzb8yQoEftREDZ5y2vznzVr0TRJWog2ESj7ym3Yw`
                      );
                      await lineNotify
                        .notify({
                          message: `${company_id}
คุณ : ${Name} 
แผนก : ${organize} 
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
                  });
                }
              });
            }
          });
        }
      });

};
