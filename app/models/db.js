const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'example',
  database: 'boarddb2'
});

db.connect((err) => {
  if (err) {
    return console.log(err)
  }
  console.log('DB CONNECTED !!!!')
})

db.asyncQuery = (query) => new Promise( (resolve, reject) => {
  db.query(query, (err, result) => {
    err ? reject(err) : resolve(result)
  })
})

db.quoteEscape = (str) => str.replace('\'', '\'\'')

module.exports = db