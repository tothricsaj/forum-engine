require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const db = require('./util/database')

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
  db
    .query('SELECT * FROM topic LIMIT 10')
    .then(dbRes => {
      console.log(dbRes)
      res.render('home', {
        topics: [{topic_name: 'foo'}]
      })
    })
    .catch(err => console.log(err))
})

app.get('/registration', (req, res, next) => {
  res.render('registration')
})

app.post('/registration', (req, res, next) => {
  const userName = req.body.userName
  const email = req.body.email

  const insertQuery = `
    INSERT INTO user_profile (user_name, email) VALUES ($1, $2);
  `

  db
    .query(insertQuery, [userName, email])
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.listen(port)

console.log('app is listening on ' + port + ' port')