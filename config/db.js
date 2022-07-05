var mysql  = require('mssql');

/* var config = {
    user:"sa",
    password:"HIP@MASTER1234",
    server:"119.59.97.193",
    database:"",
    option:{
        "encrypt":false,
        "enableArithAbort":true
    }
} */

/* var connection = ({
  host:'119.59.97.193',
  user:'sa',
  password:'HIP@MASTER1234',
  database: 'test',
  port:'1433',
}) */
 var connection = ({
  host:'127.0.0.1',
  user:'root',
  password:'',
  database: 'test',
  port:'3306',
}) 
let db=null;

function handleDisconnect() {
  db = mysql.createPool(connection); // Recreate the connection, since

  db.getConnection(function(err) { // The server is either down
      if (err) { // or restarting (takes a while sometimes).
          console.log('error when connecting to db:', err);
          setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
      } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  db.on('error', function(err) {
      console.log('db error', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
          handleDisconnect(); // lost due to either server restart, or a

      } else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){

      console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
      handleDisconnect(); // lost due to either server restart, or a

      } else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){

        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        handleDisconnect(); // lost due to either server restart, or a

      } else { // connnection idle timeout (the wait_timeout
          throw err; // server variable configures this)
      }
  });
}

setInterval(function () {
  db.query('SELECT 1');
}, 120000);
handleDisconnect(); 


module.exports = db