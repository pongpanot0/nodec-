

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/";
const conn = new MongoClient(uri);
conn.connect();
console.log('Start')
module.exports = conn;