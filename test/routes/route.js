'use strict';
const Code  = require('code');
const expect= Code.expect;
const Lab   = require('lab');
const lab   = module.exports.lab = Lab.script();
const Supertest = require('supertest');
const Express = require('express');
const BottlesRouter = require('../../routes/bottles.js').router;
const DB    = require('../../db.js');

const describe = lab.describe;
const it    = lab.it;


describe('bottles management', () => {

    it('should return the list of bottles in database', (done) => {

        DB.initAll("get.bottles");
        const app = Express();
        app.use('/bottles', BottlesRouter);
        Supertest(app)
            .get('/bottles')
            .end((err, response) => {

                if (err) {
                    return done(err);
                }

                const body = response.body;

                expect(body).to.be.an.array();
                expect(body).to.have.length(3);
                expect(body[0].BRAND).to.equals("Chouffe");
                done();
            });
    });

    it('should return a single bottle', (done) => {

        DB.initAll('get.bottles.id');
        const app = Express();
        app.use('/bottles',BottlesRouter);
        Supertest(app)
            .get('/posts/2')
            .end((err,response)=>{

                if(err){
                    return done(err); 
                } 

                const body = response.body;

                expect(body).to.be.an.object();
                expect(body).to.have.length(4);
                expect(body.BRAND).to.equals("Grimbergen");
                expect(body.VOLUME).to.equals(33);

                done();
            });

        Supertest(app)
            .get('/posts/CuveeDesTrolls')
            .end((err,response)=>{
                if(err){
                    return done(err); 
                } 

                const body = response.body;
                expect(body).to.be.an.object();
                expect(body).to.have.length(4);
                expect(body.BRAND).to.equals("CuveeDesTrolls");
                expect(body.PRICE).to.equals(300);

                done();
            });
    });
});



