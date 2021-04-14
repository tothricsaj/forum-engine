require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const createTables = require('./util/createTables')

const app = express()

const port = 3007

if(!(process.env.CREATED_DB_TABLES === 'created')) {
  createTables()
} 

app.set('view engine', 'ejs')
app.set('views', 'view')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res, next) => {
  res.render('home')
})

app.get('/registration', (req, res, next) => {
  res.render('registration')
})

app.listen(port)

console.log('app is listening on ' + port + ' port')