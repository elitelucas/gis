const db = require("./db");
const makeUpdateData = function (obj) {
    console.log(obj)
    const obKey=Object.keys(obj);
    let setQuery='';
    for(var i=0;i<obKey.length;i++){
        if(i==0) setQuery = ''+obKey[i]+' = '+obj[obKey[i]];
        else setQuery = ','+obKey[i]+' = '+obj[obKey[i]];
        setQuery += ',"'+obKey[i]+'" = '+"'"+data[obKey[i]]+"'";
    }
    return setQuery;
}
const makeCondition = function (obj)  {
    const obKey=Object.keys(obj);
    let setQuery='';
    for(var i=0;i<obKey.length;i++){
        if(i==0) setQuery = ''+obKey[i]+' = '+obj[obKey[i]];
        else setQuery = ','+obKey[i]+' = '+obj[obKey[i]];
        setQuery += ' and "'+obKey[i]+'" = '+"'"+data[obKey[i]]+"'";
    }
    return setQuery;
}
const create = (table,data) =>
  new Promise((resolve, reject) => {
    db.query('INSERT INTO '+table+' SET ?', data, (err, res) => {
        if(err){
          return reject(err);
        }
        return resolve(res)
      });
    });
const del = (table,criteria) =>
  new Promise((resolve, reject) => {
    db.query(
        'DELETE FROM '+table+' '+criteria, (err, res) => {
            if(err){
                return reject(err);
              }
              return resolve(res)
        }
      );
    });   
const update = (table,data,criteria) =>
    new Promise((resolve, reject) => {
        db.query(
            'UPDATE '+table+' SET ? '+criteria,[data], (err, res) => {
                if(err){
                    return reject(err);
                  }
                  return resolve(res)
            }
          );
        });
const get = (table,key,criteria) =>
    new Promise((resolve, reject) => {
        db.query(
            'Select '+key+' From '+table+' '+criteria, (err, res) => {
                if(err){
                    return reject(err);
                  }
                  return resolve(res)
            }
          );
        });                
 module.exports={
    create:create,
    del:del,
    update:update,
    get:get
}