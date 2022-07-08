var mysql  = require('mssql');

var connection = {
    user:"sa",
    password:"HIP@MASTER1234",
    server:"119.59.97.193",
    database:"ATTSENDLINE",
    trustServerCertificate: true,
    option:{
        "encrypt":false,
      
    }
}



const db = new mysql.ConnectionPool(connection);



module.exports = db