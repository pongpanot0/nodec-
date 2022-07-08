

const { MongoClient } = require("mongodb");
const uri = "mongodb://119.59.97.193:27017/";
const conn = new MongoClient(uri);
conn.connect();
console.log('Start')
module.exports = conn;