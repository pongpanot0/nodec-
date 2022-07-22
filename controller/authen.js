const db = require("../config/db");
var jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  try {
    await db.connect();
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    const query = await db.query(
      `SELECT COUNT(name) AS name FROM dbo.USERS WHERE name='${name}' ;`
    );
    console.log(query.recordsets);
    if (query.recordset[0].name >= 1) {
      res.send("มีusernameแล้ว");
    }
    if (query.recordset[0].name == 0) {
      const result = await db.query(
        `INSERT INTO dbo.USERS (id,name,email,password)  VALUES ('1','${name}','${email}','${password}')`
      );
      res.send({
        data: result,
        fill: req.body,
      });
    }
  } catch (error) {
    res.send(error);
  }
};
exports.login = async (req, res) => {
  let email = req.body.email;
  await db.connect();
  db.query(
    `select * from dbo.USERS WHERE email = '${email}'`,
    (err, result) => {
      if (err) {
        res.send(err);
        return;
      }
      if (result.recordset[0] === null) {
        res.send({
          status: 400,
          message: "ชื่อหรือรหัสผ่านไม่ถูกต้อง",
        });
      }
      if (result.recordset[0].password != req.body.password) {
        res.send({
          status: 400,
          message: "ชื่อหรือรหัสผ่านไม่ถูกต้อง",
        });
      }
      if (result.recordset[0].password == req.body.password) {
        const token = jwt.sign(
          {
            username: result.recordset[0].email,
            id: result.recordset[0].id,
            Companyid: result.recordset[0].CompanyID,
          },
          "zuHbAry/7IrrSQaynzj4c8i8n1iO+CCqzdyeXgRNlfDdQBUJcX9yrYGc98fqp169/ELDSLwtvzebeQ0nf6WkOiXUhOdStRMhPykd/nJwEdmENXThvX9Map7k1gwvXvciZ48DYVc7nntfN82k+ZXSRX2+rTN8YEK3S7tP/0csBYdQwB6OS5FzMHM1gQvK3VX4QAlC6nDbvLsYOBqZcYsDlvlL/Uglw57wNNpLfwjQQC+zXBFvGnROVNLh//yyBl1kB+YmIZXrnkrUkNbLm7QteW+6nXUWZ1gQOEatjCr9NnYxaY4Ve0QABq0sHzifZ65Bz4HVFptun97VS4LSTJmxeQ==",
          { expiresIn: "7d" }
        );

        res.send({
          status: 200,
          token: token,
          user: result,
        });
      }
    }
  );
};
