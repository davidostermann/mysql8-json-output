const express = require('express')
const model = require('../models/category')

module.exports = express.Router()
.get('/full', (req, res) => {
  model.getFullCategories()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
.get('/', (req, res) => {
  model.getCategories()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
.post('/', (req, res) => {
  const { name } = req.body;
  model.createCategory(name)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  model.updateCategory({ id, name })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
.delete('/:id', (req, res) => {
  const { id } = req.params;
  model.deleteCategory(id)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})