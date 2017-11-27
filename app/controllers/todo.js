const express = require('express')
const model = require('../models/todo')

module.exports = express.Router()
.get('/', (req, res) => {
  model.getTodos()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
.post('/', (req, res) => {
  const { name, masterId } = req.body;
  model.createTodo({ name, masterId })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, masterId } = req.body;
  model.updateTodo({ id, name, masterId })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
.delete('/:id', (req, res) => {
  const { id } = req.params;
  model.deleteTodo(id)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})