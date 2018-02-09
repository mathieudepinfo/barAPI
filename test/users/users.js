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



