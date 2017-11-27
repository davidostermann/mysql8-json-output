const db = require('./db')
const defaultCatId = 1;

module.exports = {

  getUsers() {
    return db.asyncQuery('SELECT * FROM users ORDER BY id')
  },
  createUser({ firstname, lastname }) {
    return db.asyncQuery(`
     INSERT INTO users(firstname, lastname)
     VALUES ('${firstname}', '${lastname}')
     `)
  },
  updateUser({ id, firstname, lastname }) {
    return db.asyncQuery(`
     UPDATE users 
     SET firstname='${firstname}', lastname='${lastname}'
     WHERE id=${id}
     `)
  },
  deleteUser(id) {
    return db.asyncQuery(`DELETE FROM users WHERE id=${id}`)
  },
  addTodo({userId, todoId}) {
    return db.asyncQuery(`
    INSERT INTO users_tasks_categories SET 
    user_id=${userId}, 
    task_id=${todoId}, 
    category_id=${defaultCatId}`)
  },
  setCategoryTodo({ userId, todoId, categoryId }) {
    return db.asyncQuery(`
    UPDATE users_tasks_categories 
    SET category_id=${categoryId}
    WHERE user_id=${userId} 
    AND task_id=${todoId}
    `)
  }

}