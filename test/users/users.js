'use strict'

const Code  = require('code');
const expect= Code.expect;
const Lab   = require('lab');
const lab   = module.exports.lab = Lab.script();
const Supertest = require('supertest');
const Express = require('express');
const BottlesRouter = require('../../routes/bottles.js').router;
const DB    = require('../../db.js');
const BP 	= require('body-parser');

const describe = lab.describe;
const it    = lab.it;


/*
describe('user management', () => {

	const app = Express();
	app.use('/bottles', BottlesRouter);
	app.use(BP.json());
	DB.initAll("userTests");
	let token;

    it('should login', () => {
        
        Supertest(app)
        	.post('/login')
        	.send({username:'Pierre',password:'password'})

		});



    it('should register Brian',()=>{

    	Supertest(app)
    		.post('/register')
    		.send({username:"Brian",password:"pwd",role:"user"})
    })

    it('should test if brian exists',())
});
*/