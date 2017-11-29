const db = require('./db')
const defaultCatId = 1;

module.exports = {

  getUsers() {
    return db.asyncQuery('SELECT * FROM users ORDER BY id')
  },
  createUser({ firstname, lastname }) {
    return db.asyncQuery(`
    INSERT INTO users(firstname, lastname)
    VALUES ('${firstname}', '${lastname}')`)
  },
  updateUser({ id, firstname, lastname }) {
    return db.asyncQuery(`
    UPDATE users 
    SET firstname='${firstname}', lastname='${lastname}'
    WHERE id=${id}`)
  },
  deleteUser(id) {
    return db.asyncQuery(`DELETE FROM users WHERE id=${id}`)
  },
  addCard({userId, cardId}) {
    return db.asyncQuery(`
    INSERT INTO users_cards_lists SET 
    user_id=${userId}, 
    card_id=${cardId}, 
    list_id=${defaultCatId}`)
  },
  setListCard({ userId, cardId, listId }) {
    return db.asyncQuery(`
    UPDATE users_cards_lists 
    SET list_id=${listId}
    WHERE user_id=${userId} 
    AND card_id=${cardId}`)
  }

}