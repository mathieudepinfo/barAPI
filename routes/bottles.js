const Express   = require('express');
const Joi       = require('joi');
const Celebrate = require('celebrate');
const DB        = require('../db.js');
const jwt       = require('jsonwebtoken');
const VerifyToken = require('../verifyToken');
const router    = Express.Router();

/** Route to get the list of bottles available in database**/
router.get('/', (req, res, next) => {

    console.log('GET /bottles');
    DB.all('SELECT * FROM BOTTLES', (err, data) => {

        if (err) {
            return next(err);
        }
        return res.json(data);
    });
});

/** Route to get a specific bottle available in database, id can either be the ID of the bottle or the brand of the bottle**/
router.get('/:id',(req, res, next) => {

    console.log(`GET /bottles/${req.params.id}`);
    
    DB.get('SELECT * FROM BOTTLES WHERE (ID = ? OR BRAND=?)', [req.params.id,req.params.id], (err, data) => {
        if (err) {
            return next(err);
        }
        return res.json(data);
    });
});

/** Route to add a new kind of bottle in the database, require to be an "admin" **/
router.post('/', VerifyToken.AsAdmin,Celebrate.celebrate(
    {//test on the request, needs a specific body
       body: Joi.object().keys({
            brand: Joi.string().required(),
            price: Joi.number().integer().required(),
            volume: Joi.number().integer().required(),
            number: Joi.number().integer().required()
        })
    }),
    (req, res, next) => {
        console.log(`INSERT new post ${req.body.brand}`);
        DB.run('INSERT INTO BOTTLES (BRAND,PRICE,VOLUME,NBR) VALUES (?, ?,?,?)', [req.body.brand, req.body.price,req.body.volume,req.body.number], (err) => {

            if (err) {
                console.log(err);
                return next(err);
            }
            console.log("added");
            res.status(201).end();

        });
    });

/**Route to post a new kind of bottle in the database, require to be a "user" **/
router.patch('/:id',VerifyToken.AsUser, Celebrate.celebrate(
    {//test on the request, needs a specific body
            body: Joi.object().keys({
            brand: Joi.string(),
            price: Joi.string(),
            volume: Joi.string(),
            number: Joi.number().integer()
        })
    }),
     (req, res, next) => {

    console.log(`UPDATE ${req.params.brand}`);
    DB.get('SELECT * FROM BOTTLES WHERE ID = ?', [req.params.id], (err, data) => {

        if (err) {
            return next(err);
        }

        //replace only defined params
        if(req.body.brand!= undefined){
            data.BRAND=req.body.brand;
        }
        if(req.body.price!= undefined){
            data.PRICE=req.body.price;
        }
        if(req.body.volume!= undefined){
            data.VOLUME=req.body.volume;
        }
        if(req.body.number!= undefined){
            data.NBR=req.body.number;
        }

        DB.run('UPDATE BOTTLES SET BRAND=?, PRICE=?,VOLUME=?,NUMBER=? WHERE (ID = ? OR BRAND= ?)', [data.BRAND,data.PRICE,data.VOLUME,data.NBR,req.params.id,req.params.id], (err) =>{

            if (err) {
                return next(err);
            }
            res.end();
        });
    });
});

router.delete('/:id',VerifyToken.AsAdmin, (req, res, next) => {

    console.log(`DELETE new post ${req.params.id}`);
    DB.run('DELETE FROM BOTTLES WHERE (ID = ? || BRAND = ?)', [req.params.id,req.params.id], (err) => {

        if (err) {
            return next(err);
        }
        return res.end();
    });
});


module.exports.router = router;