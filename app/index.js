const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// middleware to escape simple quotes
// I use simple quotes in SQL queries (cf. model)
app.use((req, res, next) => {
  req.body = Object.entries(req.body).reduce(( acc, [key, value] ) => {
    acc[key] = (typeof value === 'string') ? value.replace(/\'/g, '\'\'') : value
    return acc
  }, {})
  next();
})

app.use('/lists', require('./controllers/list'))
app.use('/cards', require('./controllers/card'))
app.use('/users', require('./controllers/user'))

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Connected server on port ${port} ( http://localhost:${port} )`)
})
.on('error', err => console.log('erreur de connexion : ', err))