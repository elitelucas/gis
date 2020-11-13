const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const { createToken, hashPassword, verifyPassword } = require('../utils/authentication');
const crypto = require('crypto');
const query = require('../model/query');
const ctrlFile = require('../file');
//for admin
let getSystemUser = async (req, res) => {
  const { user } = req.body;
  let result;
  if(user.username=='admin')   result = await query.get('system_user', '*', `Where NOT username="admin" AND NOT username="${user.username}"`)
  else { result = await query.get('system_user', '*', `Where NOT username="admin" AND NOT username="${user.username}" AND NOT role="super"`) }
  res.json({ message: 'success', result: result });
};
let editSystemUser = async (req, res) => {
  const { user, data } = req.body;
  const user_system = await query.get('system_user', '*', `Where username='${data.username}' AND NOT id=${data.id}`);
  const user_company = await query.get('company_user', '*', `Where username='${data.username}'`);
  const user_individual = await query.get('individual_user', '*', `Where username='${data.username}'`);
  if (user_system.length > 0 || user_company.length > 0 || user_individual.length > 0) {
    ctrlFile.deleteItem(data.avatar);
    return res.status(403).json({
      message: 'username doublicated!'
    });
  }
  const password =  await query.get('system_user', 'password', `Where id=${data.id}`);
  if(password[0].password!=data.password){
    data.password = await hashPassword(data.password);
  }
  data.created_at = new Date().toISOString();
  const result = await query.update('system_user', data, `Where id=${data.id}`);
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'failure', result: result }); }
};
let delSystemUser = async (req, res) => {
  const { user, data } = req.body;
  if(data.username=='admin') res.status(401).json({ message: 'not allow to delete default admin', result: result })
  const result = await query.del('system_user', `Where id=${data.id}`);
  ctrlFile.deleteItem(data.avatar);
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
};
let addSystemUser = async (req, res) => {
  const { user, data } = req.body;
  const user_system = await query.get('system_user', '*', `Where username='${data.username}'`);
  const user_company = await query.get('company_user', '*', `Where username='${data.username}'`);
  const user_individual = await query.get('individual_user', '*', `Where username='${data.username}'`);
  if (user_system.length > 0 || user_company.length > 0 || user_individual.length > 0) {
    ctrlFile.deleteItem(data.avatar);
    return res.status(403).json({
      message: 'username doublicated!'
    });
  }
  data.password = await hashPassword(data.password);
  data.created_at = new Date().toISOString();

  const result = await query.create('system_user', data);
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
};
let getCompany = async (req, res) => {
  const { user } = req.body;
  const result = await query.get('company_user', '*', '');
    res.json({ message: 'success', result: result });
};
let editCompany = async (req, res) => {
  const { user, data } = req.body;
  const user_system = await query.get('system_user', '*', `Where username='${data.username}'`);
  const user_company = await query.get('company_user', '*', `Where username='${data.username}' AND NOT id=${data.id}`);
  const user_individual = await query.get('individual_user', '*', `Where username='${data.username}'`);
  if (user_system.length > 0 || user_company.length > 0 || user_individual.length > 0) {
    ctrlFile.deleteItem(data.avatar);

    return res.status(403).json({
      message: 'username doublicated!'
    });
  }
  //for camera
  // const search1 = await query.get('company_user', 'username', `Where id=${data.id}`);
  // const camerausername = search1[0]['username'];
  // const camera_edit = await query.update('camera_user', {username:data.username}, `Where username='${camerausername}'`);
  //for password
  const password =  await query.get('company_user', 'password', `Where id=${data.id}`);
  if(password[0].password!=data.password){
    data.password = await hashPassword(data.password);
  }  data.created_at = new Date().toISOString();
  data.available_to = convertYYMMDD(data.available_to);
  data.available_from = convertYYMMDD(data.available_from);
  const result = await query.update('company_user', data, `Where id=${data.id}`);
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
};
let delCompany = async (req, res) => {
  const { user, data } = req.body;
  const result = await query.del('company_user', `Where id=${data.id}`);
  // const camera_id = await query.get('camera_user', 'camera_id', `Where username='${data.username}'`);
  // if(camera_id.length>0){
  //   const camera_edit = await query.update('camera', {assign_status:'off',run_status:'off'}, `Where camera_id='${camera_id[0]['camera_id']}'`);
  //   const camera_user_delete = await query.del('camera_user', `Where username='${data.username}'`);
  // }
  ctrlFile.deleteItem(data.avatar);

  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
};
let addCompany = async (req, res) => {
  const { user, data } = req.body;
  const user_system = await query.get('system_user', '*', `Where username='${data.username}'`);
  const user_company = await query.get('company_user', '*', `Where username='${data.username}'`);
  const user_individual = await query.get('individual_user', '*', `Where username='${data.username}'`);
  if (user_system.length > 0 || user_company.length > 0 || user_individual.length > 0) {
    ctrlFile.deleteItem(data.avatar);

    return res.status(403).json({
      message: 'username doublicated!'
    });
  }

  data.password = await hashPassword(data.password);
  data.created_at = new Date().toISOString();
  data.available_to = convertYYMMDD(data.available_to);
  data.available_from = convertYYMMDD(data.available_from);
  const result = await query.create('company_user', data);
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
};
let getIndividual = async (req, res) => {
  const { user } = req.body;
  const result = await query.get('individual_user', '*', '');
    res.json({ message: 'success', result: result });
};
let editIndividual = async (req, res) => {
  const { user, data } = req.body;
  const user_system = await query.get('system_user', '*', `Where username='${data.username}'`);
  const user_company = await query.get('company_user', '*', `Where username='${data.username}'`);
  const user_individual = await query.get('individual_user', '*', `Where username='${data.username}' AND NOT id=${data.id}`);
  if (user_system.length > 0 || user_company.length > 0 || user_individual.length > 0) {
    ctrlFile.deleteItem(data.avatar);

    return res.status(403).json({
      message: 'username doublicated!'
    });
  }
  //for camera_user
  // const search1 = await query.get('individual_user', 'username', `Where id=${data.id}`);
  // const camerausername = search1[0]['username'];
  // const camera_edit = await query.update('camera_user_individual', {username:data.username}, `Where username='${camerausername}'`);
  //for password
  const password =  await query.get('individual_user', 'password', `Where id=${data.id}`);
  if(password[0].password!=data.password){
    data.password = await hashPassword(data.password);
  }  data.created_at = new Date().toISOString();
  data.available_to = convertYYMMDD(data.available_to);
  data.available_from = convertYYMMDD(data.available_from);
  const result = await query.update('individual_user', data, `Where id=${data.id}`);
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
};
let delIndividual = async (req, res) => {
  const { user, data } = req.body;
  const result = await query.del('individual_user', `Where id=${data.id}`);
  const camera_id = await query.get('camera_user_individual', 'camera_id', `Where username='${data.username}'`);
  if(camera_id.length>0){
    const camera_edit = await query.update('camera', {assign_status:'off',run_status:'off'}, `Where camera_id='${camera_id[0]}'`);
    const camera_user_delete = await query.del('camera_user_individual', `Where username='${data.username}'`);
  }
  ctrlFile.deleteItem(data.avatar);

  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
};
let addIndividual = async (req, res) => {
  const { user, data } = req.body;
  const user_system = await query.get('system_user', '*', `Where username='${data.username}'`);
  const user_company = await query.get('company_user', '*', `Where username='${data.username}'`);
  const user_individual = await query.get('individual_user', '*', `Where username='${data.username}'`);
  if (user_system.length > 0 || user_company.length > 0 || user_individual.length > 0) {
    ctrlFile.deleteItem(data.avatar);

    return res.status(403).json({
      message: 'username doublicated!'
    });
  }
  data.password = await hashPassword(data.password);
  data.created_at = new Date().toISOString();
  data.available_to = convertYYMMDD(data.available_to);
  data.available_from = convertYYMMDD(data.available_from);
  const result = await query.create('individual_user', data);
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
};
function convertYYMMDD(dd){
  var year        = dd.substring(0,4);
  var month       = dd.substring(5,7);
  var day         = dd.substring(8,10);
  var date        = new Date(year, month, day);
  return date.toISOString();
}
module.exports = {
  getSystemUser: getSystemUser,
  editSystemUser: editSystemUser,
  delSystemUser: delSystemUser,
  addSystemUser: addSystemUser,
  getCompany: getCompany,
  editCompany: editCompany,
  delCompany: delCompany,
  addCompany: addCompany,
  getIndividual: getIndividual,
  editIndividual: editIndividual,
  delIndividual: delIndividual,
  addIndividual: addIndividual,
}
