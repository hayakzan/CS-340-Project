const mysql = require("mysql2");

const pool = mysql.createPool({
  waitForConnections: true,
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_haviceh',
  password: '4481',
  database: 'cs340_haviceh'
}).promise();

module.exports = pool;
