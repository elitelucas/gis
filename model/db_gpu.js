const mysql = require('mysql');
const config = require("../config");
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'china_lin'
  });
module.exports=db;