const DB_NAME 	= 'barDB';
const Fs 		= require('fs');
const Path 		= require('path');
const Sqlite 	= require('sqlite3');

try {
    Fs.unlinkSync(`./${DB_NAME}`);
}
catch (_ign) {}

let DB;
/**Function that initialize the DB with some data**/
const initAll = function (name) {

    DB = new Sqlite.Database(name);

    const init = Fs.readFileSync(Path.join(process.cwd(), './database/data.sql'), 'utf-8');

    DB.exec(init);
};

initAll(DB_NAME);

module.exports = DB;
module.exports.initAll = initAll;