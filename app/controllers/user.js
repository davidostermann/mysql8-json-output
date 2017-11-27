const express = require('express')
const model = require('../models/user')

module.exports = express.Router()
  .get('/', (req, res) => {
    model.getUsers()
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })
  .post('/', (req, res) => {
    const { lastname, firstname } = req.body;
    model.createUser({ firstname, lastname })
      .then(result => res.send(result))
      .catch(err => console.log(err))
  })
  .put('/:userId/todo/:todoId/cat/:categoryId', (req, res) => {
    const { userId, todoId, categoryId } = req.params;
    model.setCategoryTodo({ userId, todoId, categoryId })
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })
  .put('/:userId/todo/:todoId', (req, res) => {
    const { userId, todoId } = req.params;
    model.addTodo({ userId, todoId })
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })
  .put('/:id', (req, res) => {
    const { id } = req.params;
    const { firstname, lastname } = req.body;
    model.updateUser({ id, firstname, lastname })
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })
  .delete('/:id', (req, res) => {
    const { id } = req.params;
    model.deleteUser(id)
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })