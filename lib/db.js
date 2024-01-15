var mysql = require('mysql');

/* DB 정보 */
var db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'opentutorials'
});
db.connect();
module.exports = db;