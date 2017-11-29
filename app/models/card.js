const db = require('./db')

module.exports = {

  getCards() {
    return db.asyncQuery('SELECT * FROM cards ORDER BY id')
  },
  createCard({ name, masterId }) {
    return db.asyncQuery(`INSERT INTO cards(name, master_id) VALUES ('${name}', '${masterId}')`)
  },
  updateCard({ id, name, masterId }) {
    return db.asyncQuery(`UPDATE cards SET name='${name}', master_id='${masterId}' WHERE id=${id}`)
  },
  deleteCard(id) {
    return db.asyncQuery(`DELETE FROM cards WHERE id=${id}`)
  }

}