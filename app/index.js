const express = require('express')

const app = express()

app.use(express.json())

app.use('/categories', require('./controllers/category'))
app.use('/todos', require('./controllers/todo'))
app.use('/users', require('./controllers/user'))

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Connected server on port ${port} ( http://localhost:${port} )`)
})
.on('error', err => console.log('erreur de connexion : ', err))