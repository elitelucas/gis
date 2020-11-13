const mysql = require('mysql');
const config = require("../config");
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'GIS'
  });
module.exports=db;