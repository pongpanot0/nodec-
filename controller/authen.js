const db = require("../config/db");
var jwt = require("jsonwebtoken");
exports.register =  (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  db.query(
    `SELECT COUNT(email) AS name FROM USERS WHERE email='${email}'`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result[0].name >= 1) {
        res.send("มีusernameแล้ว");
      }
      if (result[0].name == 0) {
        db.query(
          `INSERT INTO USERS (name,email,password)  VALUES ('${name}','${email}','${password}')`,
          (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              res.send({
                data: result,
                fill: req.body,
              });
            }
          }
        );
      }
    }
  );
};
exports.login = async (req, res) => {
  let email = req.body.email;
  db.query(
    `select u.*,c.* from USERS u LEFT outer JOIN company c on (u.Companyid = c.company_id) WHERE email = '${email}'`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        console.log(result);
      }
      if (result[0].password !== req.body.password) {
        res.send({
          status: 400,
          message: "ชื่อหรือรหัสผ่านไม่ถูกต้อง",
        });
      }
      if (result[0].password == req.body.password) {
        const token = jwt.sign(
          {
            username: result[0].email,
            id: result[0].id,
            Companyid: result[0].Companyid,
            company_name: result[0].company_name,
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
