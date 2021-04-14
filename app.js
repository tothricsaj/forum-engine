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

app.use(createTables)

let counter = 0

app.get('/', (req, res, next) => {
  counter++
  console.log(`home is called ${counter} times!`)
  res.render('home')
})

app.listen(port)

console.log('app is listening on ' + port + ' port')