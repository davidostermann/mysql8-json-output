const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/lists', require('./controllers/list'))
app.use('/cards', require('./controllers/card'))
app.use('/users', require('./controllers/user'))

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Connected server on port ${port} ( http://localhost:${port} )`)
})
.on('error', err => console.log('erreur de connexion : ', err))