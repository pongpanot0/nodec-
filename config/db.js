var mysql  = require('mssql');

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "119.59.97.193",
  user: "root",
  port:"33037",
  password: "123456"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
var connection = {
    user:"sa",
    password:"HIP@MASTER1234",
    server:"119.59.97.193",
    database:"ATTSENDLINE",
    trustServerCertificate: true,
    options: {
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        }
    }
}



const db = new mysql.ConnectionPool(connection);



module.exports = db