const mysql = require("mysql");
console.log(`HOST: ${process.env.DB_HOST}`);
console.log(`USER: ${process.env.DB_USER}`);
var connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = connection;