const express = require('express')
const model = require('../models/card')

module.exports = express.Router()
.get('/', (req, res) => {
  model.getCards()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
.post('/', (req, res) => {
  const { name, masterId } = req.body;
  model.createCard({ name, masterId })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, masterId } = req.body;
  model.updateCard({ id, name, masterId })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
.delete('/:id', (req, res) => {
  const { id } = req.params;
  model.deleteCard(id)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})