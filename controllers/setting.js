const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const { createToken, hashPassword, verifyPassword } = require('../utils/authentication');
const crypto = require('crypto');
const query = require('../model/query');
const ctrlFile = require('../file');
//for normalAdmin
let getSetting = async (req, res) => {
  const result = await query.get('setting', '*', '');
  res.json({ message: 'success', result: result });
};
let updateSetting = async (req, res) => {
  const  d= await query.del('setting','');
  const result = await query.create('setting', req.body);
  if (result.affectedRows > 0) {
    res.json({ message: 'success', result: result });
  } else { res.status(401).json({ message: 'no record', result: result }); }
}

module.exports = {
  updateSetting:updateSetting,
  getSetting:getSetting
}
