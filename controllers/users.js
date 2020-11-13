const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const { createToken, hashPassword, verifyPassword } = require('../utils/authentication');
const crypto = require('crypto');
const query = require('../model/query');
const ctrlFile = require('../file');
let login = async (req, res) => {
  // const pss= await hashPassword('12345678');
  // console.log(pss);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }
  try {
    const { username, password } = req.body;
    const user_system = await query.get('system_user', '*', `Where username='${username}'`);
    const user_company = await query.get('company_user', '*', `Where username='${username}'`);
    const user_individual = await query.get('individual_user', '*', `Where username='${username}'`);
    let user;
    if (user_system.length == 0 && user_company.length == 0 && user_individual.length == 0) {
      return res.status(403).json({
        message: 'Wrong username'
      });
    } else {
      if (user_system.length > 0) user = user_system[0]
      else if (user_company.length > 0) user = user_company[0]
      else if (user_individual.length > 0) user = user_individual[0]
    }
    if (user.status == 'off') res.status(403).json({ message: 'You are not allowed to visit this site.' });
    const passwordValid = await verifyPassword(password, user.password);
    if (passwordValid) {
      const token = createToken(user);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const userInfo = user;
      res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      res.status(403).json({
        message: 'Wrong password.'
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};
let editPassword = async (req, res) => {
  const { user, data } = req.body;
  if(data.password=="")  return res.status(403).json({message: 'empty password'})
  const user_system = await query.get('system_user', '*', `Where username='${data.username}'`);
  const user_company = await query.get('company_user', '*', `Where username='${data.username}'`);
  const user_individual = await query.get('individual_user', '*', `Where username='${data.username}'`);
  let result;
  let confirm=[];
  const  passwordData = await hashPassword(data.password);
  if(user_system.length>0) confirm = await query.get('system_user', '*', `Where username="${user.username}"`)
  else if(user_company.length>0) confirm = await query.get('company_user', '*', `Where username="${user.username}"`)
  else if(user_individual.length>0)  confirm = await query.get('individual_user', '*', `Where username="${user.username}"`)
  if(confirm.length>0){
    const passwordValid = await verifyPassword(data.previous,confirm[0].password);
    if(!passwordValid)  return res.status(401).json({ message: 'previous password is incorrect!'});
  } else return res.status(401).json({ message: 'Your data do not exist'})

  if(user_system.length>0) result = await query.update('system_user', {password:passwordData}, `Where username="${user.username}"`)
  else if(user_company.length>0)  result = await query.update('company_user', {password:passwordData}, `Where username="${user.username}"`)
  else if(user_individual.length>0)  result = await query.update('individual_user', {password:passwordData}, `Where username="${user.username}"`)
  if (result.affectedRows > 0) return res.json({ message: 'success', result: result });
  else return res.status(401).json({ message: 'failure', result: result });
}
//for normalAdmin
let getCompany = async (req, res) => {
  const { user } = req.body;
  const companyuser = await query.get('company_user', '*', `Where id=${user.id}`);
  if(companyuser.length==0)  res.json({ message: 'your data not exist', result: result });
  const result = await query.get('company_user', '*', `Where NOT username="${companyuser[0].username}" AND company="${companyuser[0].company}"`);
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
  // const password =  await query.get('company_user', 'password', `Where id=${data.id}`);
  // if(password[0].password!=data.password){
  //   data.password = await hashPassword(data.password);
  // }  data.created_at = new Date().toISOString();
  data.available_to = convertYYMMDD(data.available_to);
  data.available_from = convertYYMMDD(data.available_from);
  const result = await query.update('company_user', data, `Where id=${data.id} AND company="${user.company}"`);
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
};
let delCompany = async (req, res) => {
  const { user, data } = req.body;
  const result = await query.del('company_user', `Where id=${data.id} AND company="${user.company}"`);
  // const camera_id = await query.get('camera_user', 'camera_id', `Where username='${data.username}'`);
  // if(camera_id.length>0){
  //   const camera_edit = await query.update('camera', {assign_status:'off',run_status:'off'}, `Where camera_id='${camera_id[0]['camera_id']}'`);
  //   const camera_user_delete = await query.del('camera_user', `Where username='${data.username}'`);
  // }

  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { 
    ctrlFile.deleteItem(data.avatar);
    res.status(401).json({ message: 'no record', result: result }); 
  }
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
  const companyuser = await query.get('company_user', '*', `Where id=${user.id}`);
  if(companyuser.length==0)  res.json({ message: 'your data not exist', result: result });
  const result = await query.get('individual_user', '*', `Where created_by="${companyuser[0].company}"`);
    res.json({ message: 'success', result: result });
};
let editIndividual = async (req, res) => {
  const { user, data } = req.body;
  const companyuser = await query.get('company_user', '*', `Where id=${user.id}`);
  if(companyuser.length==0)  res.json({ message: 'your data not exist', result: result });
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
  // const password =  await query.get('individual_user', 'password', `Where id=${data.id}`);
  // if(password[0].password!=data.password){
  //   data.password = await hashPassword(data.password);
  // }  data.created_at = new Date().toISOString();
  data.available_to = convertYYMMDD(data.available_to);
  data.available_from = convertYYMMDD(data.available_from);
  const result = await query.update('individual_user', data, `Where id=${data.id} AND created_by="${companyuser[0].company}"`);
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
};
let delIndividual = async (req, res) => {
  const { user, data } = req.body;
  const companyuser = await query.get('company_user', '*', `Where id=${user.id}`);
  if(companyuser.length==0)  res.json({ message: 'your data not exist', result: result });
  const result = await query.del('individual_user', `Where id=${data.id}`);
  const camera_id = await query.get('camera_user_individual', 'camera_id', `Where username='${data.username}'`);
  if(camera_id.length>0){
    const camera_edit = await query.update('camera', {assign_status:'off',run_status:'off'}, `Where camera_id='${camera_id[0]}'`);
    const camera_user_delete = await query.del('camera_user_individual', `Where username='${data.username}' AND created_by="${companyuser[0].company}"`);
  }
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else {
    ctrlFile.deleteItem(data.avatar);
    res.status(401).json({ message: 'no record', result: result }); }
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
  } else { res.status(401).json({ message: 'failure', result: result }); }
};
function convertYYMMDD(dd){
  var year        = dd.substring(0,4);
  var month       = dd.substring(5,7);
  var day         = dd.substring(8,10);
  var date        = new Date(year, month, day);
  return date.toISOString();
}
module.exports = {
  login: login,
  editPassword: editPassword,
  getCompany: getCompany,
  editCompany: editCompany,
  delCompany: delCompany,
  addCompany: addCompany,
  getIndividual: getIndividual,
  editIndividual: editIndividual,
  delIndividual: delIndividual,
  addIndividual: addIndividual
}
