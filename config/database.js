const mysql = require('mysql');
require('dotenv').config();

const con = mysql.createPool({
  host: process.env.DB_HOST, //host
  user: process.env.DB_USER,  //user name
  password: process.env.DB_PASSWORD,  // password
  database: process.env.DB_DATABASE,
  multipleStatements: true
});

module.exports = con;
