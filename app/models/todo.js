const db = require('./db')

module.exports = {

  getTodos() {
    return db.asyncQuery('SELECT * FROM tasks ORDER BY id')
  },
  createTodo({ name, masterId }) {
    return db.asyncQuery(`INSERT INTO tasks(name, master_id) VALUES ('${name}', '${masterId}')`)
  },
  updateTodo({ id, name, masterId }) {
    return db.asyncQuery(`UPDATE tasks SET name='${name}', master_id='${masterId}' WHERE id=${id}`)
  },
  deleteTodo(id) {
    return db.asyncQuery(`DELETE FROM tasks WHERE id=${id}`)
  }

}