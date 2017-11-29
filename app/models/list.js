const db = require('./db')

module.exports = {

  getFullLists() {
    return db.asyncQuery(`
    SELECT c.name, 
    JSON_ARRAYAGG( 
      JSON_OBJECT('id', rutc.tid,'name', rutc.tname, 'users', rutc.users )) as cards
    FROM(
      SELECT t.id as tid, t.name as tname, 
      utc.list_id as cid, 
      JSON_ARRAYAGG( 
        JSON_OBJECT('id', u.id, 
        'firstname', u.firstname, 
        'lastname', u.lastname)) as users
      FROM users_cards_lists as utc
      JOIN users as u ON u.id = utc.user_id
      JOIN cards as t ON t.id = utc.card_id
      GROUP BY utc.list_id, utc.card_id
    ) as rutc
    JOIN lists as c ON c.id = rutc.cid
    GROUP BY c.id`)
    // cards has to be parse as JSON
    .then(result => result.map(item => Object.assign(item, { cards: JSON.parse(item.cards) })))
  },
  getLists() {
    return db.asyncQuery('SELECT * FROM lists ORDER BY id')
  },
  createList(name) {
    return db.asyncQuery(`INSERT INTO lists(name) VALUES ('${name}')`)
  },
  updateList({ id, name }) {
    return db.asyncQuery(`UPDATE lists SET name='${name}' WHERE id=${id}`)
  },
  deleteList(id) {
    return db.asyncQuery(`DELETE FROM lists WHERE id=${id}`)
  }

}

