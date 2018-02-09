'use strict'
const Express 	= require('express');
const router 	= Express.Router();
const DB 		= require('../db.js');
const Passport 	= require('passport');
const bodyParser= require('body-parser');
const jwt 		= require('jsonwebtoken');
const bcrypt 	= require('bcryptjs');
const config 	= require('../config');
const BasicStrategy = require('passport-http').BasicStrategy;
const VerifyToken = require('../verifyToken');
const Joi       = require('joi');
const Celebrate = require('celebrate');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**Passport strategy used when a user tries to log in**/
Passport.use(new BasicStrategy((username,password,done)=>{

	DB.get('SELECT * FROM USERS WHERE USERNAME=?',[username],(err,user)=>{
		if(err){//bad request
			return done(err);
		}
		if(!user){//username not found
			return done(null,false,{message: "wrong username"});
		}

		if(bcrypt.compareSync(password, user.PASSWORD)){
			let token = jwt.sign({ id: user.USERNAME,role:user.ROLE }, config.secret, {
      		expiresIn: 86400 // expires in 24 hours
    		});
			return done(null,{token:token,auth:true});
		}
		return done(null,false,{message: "wrong password"});
	});
	
}));

/**Route used to login, returns a token and an auth param in res.req.user**/
router.get('/login',Celebrate.celebrate(
	{
		body:Joi.object().keys({
			username: Joi.string().required(),
            password: Joi.string().required(),
		})
	}),
	Passport.authenticate('basic',{session:false}),(req,res)=>{

	console.log(`GET /login from ${req.user}`);
	res.send(`${req.username} has logged in`);
});

/**Route used to register a user, require admin status**/
router.post('/register', VerifyToken.AsAdmin,Celebrate.celebrate(
	{
		body:Joi.object().keys({
			username: Joi.string().required(),
            password: Joi.string().required(),
            role: Joi.string().required()
		})
	}),
	function(req, res) {
  	//password is hashed before being stored into the DB
  	let hashedPassword = bcrypt.hashSync(req.body.password, 8);
  	console.log(hashedPassword);
  	DB.run('INSERT INTO USERS (USERNAME,PASSWORD,ROLE) VALUES (?,?,?)',[req.body.username,hashedPassword,req.body.role],(err) => {
    	if (err){
    		return res.status(500).send("There was a problem registering the user.");
    	} 
    	
    	res.status(200).end();
  	}); 
});

/**Route used to know the user data from a token**/
router.get('/me', VerifyToken.AsUser,function(req, res) {
  let token = req.headers['x-access-token'];
  if (!token){
  	 return res.status(401).send({ auth: false, message: 'No token provided.' });
  }
  
  jwt.verify(token, config.secret, function(err, decoded) {
  	if (err){
		return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
	}
    
    res.status(200).send(decoded);

  });
});

/**Route used to logout, the token isn't really destroyed**/
router.get('/logout', function(req, res) {
  	res.status(200).send({ auth: false, token: null });
});

module.exports.router = router;

router.get('/users/:id',VerifyToken.AsAdmin)
