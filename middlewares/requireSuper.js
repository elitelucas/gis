const jwt = require('jsonwebtoken');
const config = require('../config');

const requireAdmin = (req, res, next) => {
  if (req.user.role==='super'){
    next();
    
  } else{
    return res.status(401).json({
      message: "not an super account"
    });
  }
};

module.exports = requireAdmin;
