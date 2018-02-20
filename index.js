'use strict';
const Express 	= require('express');
const BP 		= require('body-parser');

const app = Express();

app.use((req,res,next)=>{

	res.header('Access-Control-Allow-Origin','*');
	res.header("Access-Control-Allow-Headers","*");
	res.header("Access-Control-Allow-Methods","*");
	next();

});

app.use(BP.json());
app.use(BP.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/bottles', require('./routes/bottles').router);
app.use(require('./routes/users').router);

app.listen(3000, (err) => {

    if (err) {
        console.log(err);
    }
    else {
        console.log('app listening on port 3000');
    }
});
