const app = require("./app");
const mysql = require('mysql');
const config = require("./config");
const sqlDB = require("./model/db");
const dd = require("./model/query");
if (require.main === module) {
  app.listen(config.port);
  sqlDB.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
    // const user='dgdg';
    // dd.update('system_user',"",`Where username='${user}'`).then(res=>{
    //   console.log(res);
    // })
  });
}
