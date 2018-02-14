const jwt     = require('jsonwebtoken');
const config  = require('./config');


function verifyToken(req, res, next) {
  let token = req.headers['x-access-token'];
  if (!token){
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err){
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}

function verifyTokenAsAdmin(req, res, next) {
  let token = req.headers['x-access-token'];
  if (!token){
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err){
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    // if everything good, check the role
    if(decoded.role!=="admin"){
      console.log(decoded.role);
      return res.status(500).send({ auth: false, message: 'Unauthorized.' });
    }
    req.userId = decoded.id;
    next();
  });
}

module.exports.AsUser = verifyToken;
module.exports.AsAdmin = verifyTokenAsAdmin;