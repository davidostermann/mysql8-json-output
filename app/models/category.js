const db = require('./db')

module.exports = {

  getFullCategories() {
    return db.asyncQuery(`
    SELECT c.name, 
    JSON_ARRAYAGG( 
      JSON_OBJECT('id', rutc.tid,'name', rutc.tname, 'users', rutc.users )) as tasks
    FROM(
      SELECT t.id as tid, t.name as tname, 
      utc.category_id as cid, 
      JSON_ARRAYAGG( 
        JSON_OBJECT('id', u.id, 
        'firstname', u.firstname, 
        'lastname', u.lastname)) as users
      FROM users_tasks_categories as utc
      JOIN users as u ON u.id = utc.user_id
      JOIN tasks as t ON t.id = utc.task_id
      GROUP BY utc.category_id, utc.task_id
    ) as rutc
    JOIN categories as c ON c.id = rutc.cid
    GROUP BY c.id
    `).then(result => result.map(item => Object.assign(item, {tasks: JSON.parse(item.tasks) })))
  },
  getCategories() {
    return db.asyncQuery('SELECT * FROM categories ORDER BY id')
  },
  createCategory(name) {
    return db.asyncQuery(`INSERT INTO categories(name) VALUES ('${name}')`)
  },
  updateCategory({ id, name }) {
    return db.asyncQuery(`UPDATE categories SET name='${name}' WHERE id=${id}`)
  },
  deleteCategory(id) {
    return db.asyncQuery(`DELETE FROM categories WHERE id=${id}`)
  }

}

