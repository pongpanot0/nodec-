const db = require("../config/db");
var jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let user = `insert into users(name,email,password)  values("${name}","${email}","${password}")`;
  db.query(user, (err, result) => {
    if (err) {
      console.log(err, "err");
    }
    if (result) {
      res.send({
        message: "all user data ",
        data: result,
      });
    }
  });
};
exports.login = (req, res) => {
  db.query(
    `select * from users where email = ${db.escape(req.body.email)};`,
    (err, result) => {
      if (result[0]["password"] !== req.body.password) {
        res.send({
            status:400,
          message: "ชื่อหรือรหัสผ่านไม่ถูกต้อง",
        });
      }
      if (result[0]["password"] == req.body.password) {
        const token = jwt.sign(
          {
            username: result[0].username,
            id: result[0].id,
          },
          "zuHbAry/7IrrSQaynzj4c8i8n1iO+CCqzdyeXgRNlfDdQBUJcX9yrYGc98fqp169/ELDSLwtvzebeQ0nf6WkOiXUhOdStRMhPykd/nJwEdmENXThvX9Map7k1gwvXvciZ48DYVc7nntfN82k+ZXSRX2+rTN8YEK3S7tP/0csBYdQwB6OS5FzMHM1gQvK3VX4QAlC6nDbvLsYOBqZcYsDlvlL/Uglw57wNNpLfwjQQC+zXBFvGnROVNLh//yyBl1kB+YmIZXrnkrUkNbLm7QteW+6nXUWZ1gQOEatjCr9NnYxaY4Ve0QABq0sHzifZ65Bz4HVFptun97VS4LSTJmxeQ==",
          { expiresIn: "7d" }
        );
        res.send({
            status:200,
          token: token,
          user: result,
        });
      }
    }
  );
};
