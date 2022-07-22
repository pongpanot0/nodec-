

var mysql = require('mysql2');


let db = mysql.createConnection({
    host: "119.59.97.193",
    user: "root",
    port:"33037",
    password: "123456",
    database: 'user'
});



db.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });





module.exports = db