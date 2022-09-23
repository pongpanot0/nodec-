const db = require("../config/db");
const conn = require("../config/mongodb");
var moment = require("moment");
const Event = require("../Model/Event");

exports.insertAttendance = async (req, res) => {
  const checksame = {
    astrSerialNo: req.body.astrSerialNo,
  };
  let check = `select * from serail where serialnumber='${checksame.astrSerialNo}'`;

  db.query(check, async (err, result) => {

    if (err) {
      res.send(err)
      return;
    }
    if (checksame.astrSerialNo === null) {
      res.send(err)
      return;
    }
    if (result === null || result == [] || result === undefined) {
      res.send(err)
      return;
    }
    if (result.length === 0) {
      res.send('มีบางอย่างผิดพลาด')
      return;
    }
    if (result.length !== 0) {
      const event = {
        anSEnrollNumber: req.body.anSEnrollNumber,
        anVerifyMode: req.body.anVerifyMode,
        anInOutMode: req.body.anInOutMode,
        anIanLogDatenOutMode: moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD-MM-YYYY HH:mm:SS"),
        date: moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD:MM:YYYY"),
        time: moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("HH:mm"),
        month: moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("MM:YYYY"),
        monthReport: moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS')
          .format("MM:YYYY")
          .toString()
          .replace(":", ""),
        year: moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("YYYY"),
        astrDeviceIP: req.body.astrDeviceIP,
        anDevicePort: req.body.anDevicePort,
        anDeviceID: req.body.anDeviceID,
        astrSerialNo: req.body.astrSerialNo,
        astrRootIP: req.body.astrRootIP,
        company_id: result[0].db_name,
      };


      let db_name = result[0].db_name;

      await conn.connect();
      await conn
        .db("logAttendance")
        .collection("log")
        .insertOne(event, async (err, result) => {
          if (err) {
            res.send(err)
          }
          if (result) {
            const idp = result.insertedId;
            var mysql = require("mysql2");
            var connection = {
              host: "119.59.97.193",
              user: "root",
              password: "123456",
              database: `${db_name.toLowerCase()}`,
              port: "33037",
              connectionLimit: 10,
            };

            let db2 = null
            db2 = mysql.createConnection(connection);
            let device_name = []
            let search = `select * from machine  where Series='${event.astrSerialNo}'`;
            db2.query(search, async (err, result) => {
              if (err) {
                const lineNotify = require("line-notify-nodejs")(
                  `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                );
                await lineNotify
                  .notify({
                    message: `${event.company_id}
Error = ${err} หา Machine ไม่เจอ`,
                  })
                  res.send(err)
              }
              if (result === null) {
                const lineNotify = require("line-notify-nodejs")(
                  `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                );
                await lineNotify
                  .notify({
                    message: `${event.company_id}
Error = ${err} หา Machine ไม่เจอ`,
                  })
                  res.send(err)
                return
              }
              if (result.length > 0) {

                device_name.push(result[0].Name)

              }

            })
            let update = `update employee set Stamp = 0  where Enrollnumber=${event.anSEnrollNumber}`;
            db2.query(update, async (err, result) => {
              if (err) {
                const lineNotify = require("line-notify-nodejs")(
                  `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                );
                await lineNotify
                  .notify({
                    message: `${event.company_id}
Error = ${err} หาEmployees ไม่เจอ`,
                  })
                  res.send(err)
              }
              if (result) {
                let user = `select u.*,c.*,a.* from employee u  LEFT outer JOIN department c on (u.Depcode = c.Depcode)  left outer join company a ON (a.Companycode=c.Companycode)  where  u.Enrollnumber=${event.anSEnrollNumber}`;
                db2.query(user, async (err, result) => {
                  if (err) {
                    const lineNotify = require("line-notify-nodejs")(
                      `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                    );
                    await lineNotify
                      .notify({
                        message: `${event.company_id}
  Error = ${err} หาEmployees ไม่เจอ`,
                      })
                      res.send(err)
                  }
                  if (result[0] === null) {
                    const lineNotify = require("line-notify-nodejs")(
                      `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                    );
                    await lineNotify
                      .notify({
                        message: `${event.company_id}
 หาEmployees ไม่เจอ`,
                      })
                      res.send(err)
                      return
                  }
                  if (result[0] === []) {
                    const lineNotify = require("line-notify-nodejs")(
                      `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                    );
                    await lineNotify
                      .notify({
                        message: `${event.company_id}
 หาEmployees ไม่เจอ`,
                      })
                      res.send(err)
                      return
                  }
                  if (result[0] === undefined) {
                    const lineNotify = require("line-notify-nodejs")(
                      `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                    );
                    await lineNotify
                      .notify({
                        message: `${event.company_id}
 หาEmployees ไม่เจอ`,
                      })
                      
                      res.send(err)
                  }
                  if (result) {
                    let Name = result[0].Name;
                    let organize = result[0].Depname;
                    let company_id = result[0].Companyname;
                    let Depcode = result[0].Depcode;
                    let Companycode = result[0].Companycode;
                    let ckline = `select * from setting`;
                    db2.query(ckline, async (err, result) => {

                      if (err) {
                        res.send(err);
                      }
                      if (
                        event.time >
                        moment(result[0].Outwork, "HH:mm")
                          .format("HH")
                          .replace(":", "")
                      ) {
                        if (result[0].ActiveLinecompany === 1) {
                          let sendline = `select Linetoken from company where Companycode = "${Companycode}"`;
                          db2.query(sendline, async (err, result2) => {
                            if (err) {
                              const lineNotify = require("line-notify-nodejs")(
                                `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                              );
                              await lineNotify
                                .notify({
                                  message: `${event.company_id}
Error = ${err} หาLine Token ไม่เจอ`,
                                })

                            }
                            if (result2[0].Linetoken === '') {
                              const lineNotify = require("line-notify-nodejs")(
                                `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                              );
                              await lineNotify
                              .notify({
                                message: `${event.company_id}
Error = ${err} หาLine Token ไม่เจอ`,
                              })

                                .then((result2) => {
                                  res.send(result2);
                                  db2.end()
                                })
                                .catch((err) => {
                                  res.send(err);
                                  db2.end()
                                });
                            }
                            if (result2[0].Linetoken !== null) {

                              const lineNotify = require("line-notify-nodejs")(
                                `${result2[0].Linetoken}`
                              );
                              await lineNotify
                                .notify({
                                  message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา  : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,

                                })

                                .then((result2) => {
                                  res.send(result2);
                                  db2.end()
                                })
                                .catch((err) => {
                                  res.send(err);
                                  db2.end()
                                });
                            }

                          });

                        }
                        if (result[0].ActiveLineDep === 1) {
                          let sendline = `select Linetoken from department where Depcode = "${Depcode}"`;
                          db2.query(sendline, async (err, result2) => {

                            if (err) {
                              res.send(err);
                            }
                            if (result2[0].Linetoken === '') {
                              const lineNotify = require("line-notify-nodejs")(
                                `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                              );
                              await lineNotify
                              .notify({
                                message: `${event.company_id}
Error = ${err} หาLine Token ไม่เจอ`,
                              })

                                .then((result2) => {
                                  res.send(result2);
                                  db2.end()
                                })
                                .catch((err) => {
                                  res.send(err);
                                  db2.end()
                                });
                            }
                            if (result2[0].Linetoken !== null) {
                              const lineNotify = require("line-notify-nodejs")(
                                `${result2[0].Linetoken}`
                              );
                              await lineNotify
                                .notify({
                                  message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber}) 
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา  : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                })
                             
                                .then((result2) => {
                                  res.send(result2);
                                  db2.end()
                                })
                                .catch((err) => {
                                  res.send(err);
                                  db2.end()
                                });
                            }
                          });
                        }
                      } else {


                        if (result[0].ActiveShift === 0) {
                          if (result[0].ActiveLinecompany === 1) {
                            let sendline = `select Linetoken from company where Companycode = "${Companycode}"`;
                            db2.query(sendline, async (err, result2) => {
                              if (err) {
                                res.send(err);
                              }
                              if (result2[0].Linetoken !== null) {
                                const lineNotify = require("line-notify-nodejs")(
                                  `${result2[0].Linetoken}`
                                );
                                await lineNotify
                                  .notify({
                                    message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber}) 
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา  : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                  })
                             
                                  .then((result2) => {
                                    res.send(result2);
                                    db2.end()
                                  })
                                  .catch((err) => {
                                    res.send(err);
                                    db2.end()
                                  });
                              }
                            });
                          }

                          if (result[0].ActiveLineDep === 1) {
                            let sendline = `select Linetoken from department where Depcode = "${Depcode}"`;
                            db2.query(sendline, async (err, result2) => {
                              if (err) {
                                res.send(err);
                              }
                              if (result2[0].Linetoken !== null) {
                                const lineNotify = require("line-notify-nodejs")(
                                  `${result2[0].Linetoken}`
                                );
                                await lineNotify
                                  .notify({
                                    message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber}) 
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา  : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                  })

                                  .then((result2) => {
                                    res.send(result2);
                                    db2.end()
                                  })
                                  .catch((err) => {
                                    res.send(err);
                                  });
                              }
                            });
                          }
                          return;
                        } else {
                          if (result[0].ActiveOT === 1) {
                            if (
                              event.time >
                              moment(result[0].Outwork, "HH:mm")
                                .format("HH")
                                .replace(":", "")
                            ) {
                              if (result[0].ActiveLinecompany === 1) {
                                let sendline = `select Linetoken from company where Companycode = "${Companycode}"`;
                                db2.query(sendline, async (err, result2) => {
                                  if (err) {
                                    res.send(err);
                                    db2.end()
                                  }
                                
                                  if (result2[0].Linetoken === '') {
                                    const lineNotify =
                                      require("line-notify-nodejs")(
                                        `${result2[0].Linetoken}`
                                      );
                                    await lineNotify
                                      .notify({
                                        message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา  : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                      })
                                      .then((result2) => {
                                        res.send(result2);
                                        db2.end()
                                      })
                                      .catch((err) => {
                                        res.send(err);
                                        db2.end()
                                      });
                                  }
                                  if (result2[0].Linetoken !== null) {
                                    const lineNotify =
                                      require("line-notify-nodejs")(
                                        `${result2[0].Linetoken}`
                                      );
                                    await lineNotify
                                      .notify({
                                        message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา  : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                      })
                                      .then((result2) => {
                                        res.send(result2);
                                        db2.end()
                                      })
                                      .catch((err) => {
                                        res.send(err);
                                        db2.end()
                                      });
                                  }
                                });
                              }

                              if (result[0].ActiveLineDep === 1) {
                                let sendline = `select Linetoken from department where Depcode = "${Depcode}"`;
                                db2.query(sendline, async (err, result2) => {
                                  if (err) {
                                    res.send(err);
                                  }
                                  if (result2[0].Linetoken === '') {
                                    const lineNotify = require("line-notify-nodejs")(
                                      `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                    );
                                    await lineNotify
                                    .notify({
                                      message: `${event.company_id}
      Error = ${err} หาLine Token ไม่เจอ`,
                                    })
      
                                      .then((result2) => {
                                        res.send(result2);
                                        db2.end()
                                      })
                                      .catch((err) => {
                                        res.send(err);
                                        db2.end()
                                      });
                                  }
                                  if (result2[0].Linetoken !== null) {
                                    const lineNotify =
                                      require("line-notify-nodejs")(
                                        `${result2[0].Linetoken}`
                                      );
                                    await lineNotify
                                      .notify({
                                        message: `${event.company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber}) 
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา  : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                      })

                                      .then((result2) => {
                                        res.send(result2);
                                        db2.end()
                                      })
                                      .catch((err) => {
                                        res.send(err);
                                        db2.end()
                                      });
                                  }
                                });
                              }
                            } else {
                              if (result[0].ActiveLate === 1) {
                                if (result[0].ActiveLinecompany === 1) {
                                  let Inwork = result[0].Inwork;
                                  let sendline = `select * from company where Companycode = "${Companycode}"`;

                                  db2.query(sendline, async (err, result2) => {
                                    console.log(result2[0].Linetoken)
                                    if (err) {
                                      const lineNotify = require("line-notify-nodejs")(
                                        `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                      );
                                      await lineNotify
                                      .notify({
                                        message: `${event.company_id}
Error = ${err} หาLine Token ไม่เจอ`,
                                      })
        
                                        .then((result2) => {
                                          res.send(result2);
                                          db2.end()
                                        })
                                        .catch((err) => {
                                          res.send(err);
                                          db2.end()
                                        });
                                    }
                                    if(result2[0].Linetoken === ''){
                                      const lineNotify = require("line-notify-nodejs")(
                                        `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                      );
                                      await lineNotify
                                      .notify({
                                        message: `${event.company_id}
Error = ${err} หาLine Token ไม่เจอ`,
                                      })
        
                                        .then((result2) => {
                                          res.send(result2);
                                          db2.end()
                                        })
                                        .catch((err) => {
                                          res.send(err);
                                          db2.end()
                                        });
                                    }
                                    if(result2[0].Linetoken === null){
                                      const lineNotify = require("line-notify-nodejs")(
                                        `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                      );
                                      await lineNotify
                                      .notify({
                                        message: `${event.company_id}
Error = ${err} หาLine Token ไม่เจอ`,
                                      })
        
                                        .then((result2) => {
                                          res.send(result2);
                                          db2.end()
                                        })
                                        .catch((err) => {
                                          res.send(err);
                                          db2.end()
                                        });
                                    }
                                    if (result2[0].Linetoken !== null) {
                                      const lineNotify =
                                        require("line-notify-nodejs")(
                                          `${result2[0].Linetoken}`
                                        );
                                      let latehh = moment(
                                        event.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS'
                                      )
                                        .format("HH")
                                        .replace(":", "");
                                      let defhh = moment(Inwork, "HH:mm")
                                        .format("HH")
                                        .replace(":", "");
                                      let latemm = moment(
                                        event.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS'
                                      )
                                        .format("mm")
                                        .replace(":", "");
                                      let defmm = moment(Inwork, "HH:mm")
                                        .format("mm")
                                        .replace(":", "");
                                      var w3 = latemm - defmm;
                                      var w4 = latehh - defhh;
                                      await conn.connect();
                                      const cos = await conn
                                        .db("logAttendance")
                                        .collection("log")
                                        .updateOne(
                                          { _id: idp },
                                          { $set: { late: w4 * 60 + w3 } }
                                        );

                                      if (w4 < 0 || latehh < defhh) {
                                        await lineNotify
                                          .notify({
                                            message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber}) 
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                          })

                                          .then((result2) => {
                                            res.send(result2);
                                            db2.end()
                                          })
                                          .catch((err) => {
                                            res.send(err);
                                            db2.end()
                                          });
                                      }
                                      if (w4 > 0) {
                                        await lineNotify
                                          .notify({
                                            message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
สาย : ${w4} ชั่วโมง  ${w3} นาที
ดูสรุป :${process.env.FRONT_END_URL}`,
                                          })
                                          .then((result2) => {

                                            res.send(result2);
                                            db2.end()
                                          })
                                          .catch((err) => {
                                            res.send(err);
                                          });
                                      } if (w3 > 0 && w4 <= 0) {
                                        await conn.connect();
                                        const cos = await conn
                                          .db("logAttendance")
                                          .collection("log")
                                          .updateOne(
                                            { _id: idp },
                                            { $set: { late: w3 } }
                                          );
                                        await lineNotify
                                          .notify({
                                            message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
สาย : ${w3} นาที
ดูสรุป :${process.env.FRONT_END_URL}`,
                                          })
                                          .then((result2) => {
                                            res.send(result2);
                                            db2.end()
                                          })
                                          .catch((err) => {
                                            res.send(err);
                                            db2.end()
                                          });

                                      }
                                      if (w3 == 0 && w3 < 0) {
                                        await conn.connect();
                                        const cos = await conn
                                          .db("logAttendance")
                                          .collection("log")
                                          .updateOne(
                                            { _id: idp },
                                            { $set: { late: w3 } }
                                          );
                                        await lineNotify
                                          .notify({
                                            message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                          })

                                          .then((result2) => {

                                            res.send(result2);
                                            db2.end()
                                          })
                                          .catch((err) => {
                                            res.send(err);
                                            db2.end()
                                          });

                                      }
                                    }
                                  });
                                }
                                if (result[0].ActiveLineDep === 1) {
                                  let Inwork = result[0].Inwork;
                                  let sendline = `select * from department where Depcode = "${Depcode}"`;
                                  db2.query(sendline, async (err, result2) => {
                                    if (err) {
                                      res.send(err);
                                    }
                                    if(result2[0].Linetoken === ''){
                                      const lineNotify = require("line-notify-nodejs")(
                                        `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                      );
                                      await lineNotify
                                      .notify({
                                        message: `${event.company_id}
        Error = ${err} หาLine Token ไม่เจอ`,
                                      })
        
                                        .then((result2) => {
                                          res.send(result2);
                                          db2.end()
                                        })
                                        .catch((err) => {
                                          res.send(err);
                                          db2.end()
                                        });
                                    }
                                    if (result2[0].Linetoken !== null) {
                                      const lineNotify =
                                        require("line-notify-nodejs")(
                                          `${result2[0].Linetoken}`
                                        );
                                      let latehh = moment(
                                        event.anIanLogDatenOutMode
                                      )
                                        .format("HH")
                                        .replace(":", "");
                                      let defhh = moment(Inwork, "HH:mm")
                                        .format("HH")
                                        .replace(":", "");
                                      let latemm = moment(
                                        event.anIanLogDatenOutMode
                                      )
                                        .format("mm")
                                        .replace(":", "");
                                      let defmm = moment(Inwork, "HH:mm")
                                        .format("mm")
                                        .replace(":", "");
                                      var w3 = latemm - defmm;
                                      var w4 = latehh - defhh;
                                      if (w4 < 0 || latehh < defhh) {
                                        await lineNotify
                                          .notify({
                                            message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                          })

                                          .then((result2) => {
                                            res.send(result2);
                                            db2.end()
                                          })
                                          .catch((err) => {
                                            res.send(err);
                                            db2.end()
                                          });
                                      }
                                      if (w4 > 0) {
                                        await lineNotify
                                          .notify({
                                            message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
สาย : ${w4} ชั่วโมง  ${w3} นาที
ดูสรุป :${process.env.FRONT_END_URL}`,
                                          })

                                          .then((result2) => {
                                            res.send(result2);
                                            db2.end()
                                          })
                                          .catch((err) => {
                                            res.send(err);
                                            db2.end()
                                          });
                                      } if (w3 > 0) {
                                        await conn.connect();
                                        const cos = await conn
                                          .db("logAttendance")
                                          .collection("log")
                                          .updateOne(
                                            { _id: idp },
                                            { $set: { late: w3 } }
                                          );
                                        await lineNotify
                                          .notify({
                                            message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
สาย : ${w3} นาที
ดูสรุป :${process.env.FRONT_END_URL}`,
                                          })

                                          .then((result2) => {

                                            res.send(result2);
                                            db2.end()
                                          })
                                          .catch((err) => {
                                            res.send(err);
                                            db2.end()
                                          });

                                      }
                                      if (w3 == 0 || w3 < 0) {
                                        await conn.connect();
                                        const cos = await conn
                                          .db("logAttendance")
                                          .collection("log")
                                          .updateOne(
                                            { _id: idp },
                                            { $set: { late: w3 } }
                                          );
                                        await lineNotify
                                          .notify({
                                            message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                          })

                                          .then((result2) => {

                                            res.send(result2);
                                            db2.end()
                                          })
                                          .catch((err) => {
                                            res.send(err);
                                            db2.end()
                                          });

                                      }
                                    }
                                  });
                                }
                              }
                              if (result[0].ActiveLate === 0) {
                                if (result[0].ActiveLineDep === 1) {
                                  let sendline = `select * from company where Companycode = "${Companycode}"`;
                                  db2.query(sendline, async (err, result2) => {
                                    if (err) {
                                      res.send(err);
                                    }
                                    if (result2[0].Linetoken === '') {
                                      const lineNotify = require("line-notify-nodejs")(
                                        `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                      );
                                      await lineNotify
                                      .notify({
                                        message: `${event.company_id}
        Error = ${err} หาLine Token ไม่เจอ`,
                                      })
        
                                        .then((result2) => {
                                          res.send(result2);
                                          db2.end()
                                        })
                                        .catch((err) => {
                                          res.send(err);
                                          db2.end()
                                        });
                                    }
                                    if (result2[0].Linetoken !== null) {
                                      const lineNotify =
                                        require("line-notify-nodejs")(
                                          `${result2[0].Linetoken}`
                                        );

                                      await lineNotify
                                        .notify({
                                          message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                        })

                                        .then((result2) => {
                                          res.send(result2);
                                        })
                                        .catch((err) => {
                                          res.send(err);
                                        });
                                    }
                                  });
                                }
                                if (result[0].ActiveLinecompany === 1) {
                                  let sendline = `select * from company where Companycode = "${Companycode}"`;
                                  db2.query(sendline, async (err, result2) => {
                                    if (err) {
                                      res.send(err);
                                    }
                                    if (result2[0].Linetoken === '') {
                                      const lineNotify = require("line-notify-nodejs")(
                                        `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                      );
                                      await lineNotify
                                      .notify({
                                        message: `${event.company_id}
        Error = ${err} หาLine Token ไม่เจอ`,
                                      })
        
                                        .then((result2) => {
                                          res.send(result2);
                                          db2.end()
                                        })
                                        .catch((err) => {
                                          res.send(err);
                                          db2.end()
                                        });
                                    }
                                    if (result2[0].Linetoken !== null) {
                                      const lineNotify =
                                        require("line-notify-nodejs")(
                                          `${result2[0].Linetoken}`
                                        );
                                      await lineNotify
                                        .notify({
                                          message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                        })

                                        .then((result2) => {
                                          res.send(result2);
                                          db2.end()
                                        })
                                        .catch((err) => {
                                          res.send(err);
                                        });
                                    }
                                  });
                                }
                              }
                            }
                          }
                        }

                        if (result[0].ActiveOT === 0) {
                          if (result[0].ActiveLate === 1) {
                            if (result[0].ActiveLinecompany === 1) {
                              let Inwork = result[0].Inwork;
                              let sendline = `select * from company where Companycode = "${Companycode}"`;
                              db2.query(sendline, async (err, result2) => {
                                if (err) {
                                  res.send(err);
                                }
                                if (result2[0].Linetoken === '') {
                                  const lineNotify = require("line-notify-nodejs")(
                                    `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                  );
                                  await lineNotify
                                  .notify({
                                    message: `${event.company_id}
    Error = ${err} หาLine Token ไม่เจอ`,
                                  })
    
                                    .then((result2) => {
                                      res.send(result2);
                                      db2.end()
                                    })
                                    .catch((err) => {
                                      res.send(err);
                                      db2.end()
                                    });
                                }
                                if (result2[0].Linetoken !== null) {
                                  const lineNotify =
                                    require("line-notify-nodejs")(
                                      `${result2[0].Linetoken}`
                                    );
                                  let latehh = moment(event.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS')
                                    .format("HH")
                                    .replace(":", "");
                                  let defhh = moment(Inwork, "HH:mm")
                                    .format("HH")
                                    .replace(":", "");
                                  let latemm = moment(event.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS')
                                    .format("mm")
                                    .replace(":", "");
                                  let defmm = moment(Inwork, "HH:mm")
                                    .format("mm")
                                    .replace(":", "");
                                  var w3 = latemm - defmm;
                                  var w4 = latehh - defhh;




                                  if (w4 <= 0 && w3 <= 0) {
                                    await lineNotify
                                      .notify({
                                        message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                      })

                                      .then((result2) => {
                                        res.send(result2);
                                        db2.end()
                                      })
                                      .catch((err) => {
                                        res.send(err);
                                      });
                                  }
                                  if (w4 > 0) {
                                    await lineNotify
                                      .notify({
                                        message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
สาย : ${w4} ชั่วโมง  ${w3} นาที
ดูสรุป :${process.env.FRONT_END_URL}`,
                                      })

                                      .then((result2) => {
                                        res.send(result2);
                                      })
                                      .catch((err) => {
                                        res.send(err);
                                      });
                                  } if (w4 == 0 && w3 > 0) {
                                    console.log('1234')
                                    await lineNotify
                                      .notify({
                                        message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
สาย : ${w3} นาที
ดูสรุป :${process.env.FRONT_END_URL}`,
                                      })
                                      .then((result2) => {
                                        res.send(result2);
                                        db2.end()
                                      })
                                      .catch((err) => {
                                        res.send(err);
                                        db2.end()
                                      });
                                  }

                                }
                              });
                            }
                            if (result[0].ActiveLineDep === 1) {
                              let Inwork = result[0].Inwork;
                              let sendline = `select * from department where Depcode = "${Depcode}"`;
                              db2.query(sendline, async (err, result2) => {
                                if (err) {
                                  res.send(err);
                                }
                                if (result2[0].Linetoken === '') {
                                  const lineNotify = require("line-notify-nodejs")(
                                    `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                  );
                                  await lineNotify
                                  .notify({
                                    message: `${event.company_id}
    Error = ${err} หาLine Token ไม่เจอ`,
                                  })
    
                                    .then((result2) => {
                                      res.send(result2);
                                      db2.end()
                                    })
                                    .catch((err) => {
                                      res.send(err);
                                      db2.end()
                                    });
                                }
                                if (result2[0].Linetoken !== null) {
                                  const lineNotify =
                                    require("line-notify-nodejs")(
                                      `${result2[0].Linetoken}`
                                    );
                                  let latehh = moment(event.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS')
                                    .format("HH")
                                    .replace(":", "");
                                  let defhh = moment(Inwork, "HH:mm")
                                    .format("HH")
                                    .replace(":", "");
                                  let latemm = moment(event.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS')
                                    .format("mm")
                                    .replace(":", "");
                                  let defmm = moment(Inwork, "HH:mm")
                                    .format("mm")
                                    .replace(":", "");
                                  var w3 = latemm - defmm;
                                  var w4 = latehh - defhh;
                                  console.log(latehh)

                                  if (w4 <= 0 && latehh <= defhh) {

                                    await lineNotify
                                      .notify({
                                        message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                      })

                                      .then((result2) => {
                                        res.send(result2);
                                        db2.end()
                                      })
                                      .catch((err) => {
                                        res.send(err);
                                      });
                                  }
                                  if (w4 > 0) {
                                    await lineNotify
                                      .notify({
                                        message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
สาย : ${w4} ชั่วโมง  ${w3} นาที
ดูสรุป :${process.env.FRONT_END_URL}`,
                                      })

                                      .then((result2) => {
                                        res.send(result2);
                                      })
                                      .catch((err) => {
                                        res.send(err);
                                      });
                                  } if (w4 == 0 && w3 > 0) {
                                    console.log('1234')
                                    await lineNotify
                                      .notify({
                                        message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
สาย : ${w3} นาที
ดูสรุป :${process.env.FRONT_END_URL}`,
                                      })

                                      .then((result2) => {
                                        res.send(result2);
                                        db2.end()
                                      })
                                      .catch((err) => {
                                        res.send(err);
                                        db2.end()
                                      });
                                  }

                                }

                              });
                            }
                          }
                          if (result[0].ActiveLate === 0) {
                            if (result[0].ActiveLineDep === 1) {
                              let sendline = `select * from company where Companycode = "${Companycode}"`;
                              db2.query(sendline, async (err, result2) => {
                                if (err) {
                                  res.send(err);
                                }
                                if (result2[0].Linetoken === '') {
                                  const lineNotify = require("line-notify-nodejs")(
                                    `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                  );
                                  await lineNotify
                                  .notify({
                                    message: `${event.company_id}
    Error = ${err} หาLine Token ไม่เจอ`,
                                  })
    
                                    .then((result2) => {
                                      res.send(result2);
                                      db2.end()
                                    })
                                    .catch((err) => {
                                      res.send(err);
                                      db2.end()
                                    });
                                }
                                if (result2[0].Linetoken !== null) {
                                  const lineNotify =
                                    require("line-notify-nodejs")(
                                      `${result2[0].Linetoken}`
                                    );

                                  await lineNotify
                                    .notify({
                                      message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                    })

                                    .then((result2) => {
                                      res.send(result2);
                                      db2.end()
                                    })
                                    .catch((err) => {
                                      res.send(err);
                                    });
                                }
                              });
                            }
                            if (result[0].ActiveLinecompany === 1) {
                              let sendline = `select * from company where Companycode = "${Companycode}"`;
                              db2.query(sendline, async (err, result2) => {
                                if (err) {
                                  res.send(err);
                                }
                                if (result2[0].Linetoken === '') {
                                  const lineNotify = require("line-notify-nodejs")(
                                    `SLwUUXRNzFN9sbBuzz6DvSsLgVtfwzh6XOxT3OVETPX`
                                  );
                                  await lineNotify
                                  .notify({
                                    message: `${event.company_id}
    Error = ${err} หาLine Token ไม่เจอ`,
                                  })
    
                                    .then((result2) => {
                                      res.send(result2);
                                      db2.end()
                                    })
                                    .catch((err) => {
                                      res.send(err);
                                      db2.end()
                                    });
                                }
                                if (result2[0].Linetoken !== null) {
                                  const lineNotify =
                                    require("line-notify-nodejs")(
                                      `${result2[0].Linetoken}`
                                    );
                                  await lineNotify
                                    .notify({
                                      message: `${company_id}
คุณ : ${Name} (รหัส:${event.anSEnrollNumber})
แผนก : ${organize} 
บันทึกเวลา : @${device_name}
วันที่ : ${moment(req.body.anIanLogDatenOutMode, 'DD-MM-YYYY HH:mm:SS').format("DD/MM/YYYY")}
เวลา : ${event.time}
ดูสรุป :${process.env.FRONT_END_URL}`,
                                    })

                                    .then((result2) => {
                                      res.send(result2);
                                      db2.end()
                                    })
                                    .catch((err) => {

                                      res.send(err);
                                      db2.end()
                                    })


                                }
                              });
                            }

                          }

                        }
                      }
                    });
                  }
                });
              }

            });
          }
        });
    }

  })


};

/* let sendline = `select Linetoken from company where Companycode = "${Companycode}"`;
db2.query(sendline, async (err, result2) => {
  console.log(result2);
  if (err) {
    res.send(err);
  }
  if (result2[0].Linetoken !== null) {
    const lineNotify =
      require("line-notify-nodejs")(
        `${result2[0].Linetoken}`
      );
    let latehh = moment(event.anIanLogDatenOutMode)
      .format("HH")
      .replace(":", "");
    let defhh = moment(Inwork, "HH:mm")
      .format("HH")
      .replace(":", "");
    let latemm = moment(event.anIanLogDatenOutMode)
      .format("mm")
      .replace(":", "");
    let defmm = moment(Inwork, "HH:mm")
      .format("mm")
      .replace(":", "");
    var w3 = latemm - defmm;
    var w4 = latehh - defhh;
    if (w4 === 0) {
      await lineNotify
        .notify({
          message: `${company_id}
คุณ : ${Name} 
แผนก : ${organize} 
บันทึกเวลา : @${event.anDeviceID}
วันที่ : ${(event.date)}
เวลา : ${(event.time)}
คุณสาย : ${w3} นาที
ดูสรุป :${process.env.FRONT_END_URL}`,
        })
        .then((result2) => {
          res.send(result2);
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      await lineNotify
        .notify({
          message: `${company_id}
คุณ : ${Name} 
แผนก : ${organize} 
บันทึกเวลา : @${event.anDeviceID}
วันที่ : ${(event.date)}
เวลา : ${(event.time)}
คุณสาย : ${w4} ชั่วโมง  ${w3} นาที
ดูสรุป :${process.env.FRONT_END_URL}`,
        })
        .then((result2) => {
          res.send(result2);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  }
}); */
