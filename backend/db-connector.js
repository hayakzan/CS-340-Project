const mysql = require("mysql2");

const pool = mysql.createPool({
  waitForConnections: true,
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_kolaty',
  password: '5134',
  database: 'cs340_kolaty'
}).promise();

module.exports = pool;
