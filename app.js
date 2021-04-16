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
      res.render('home', {
        topics: dbRes.rows
      })
    })
    .catch(err => console.log(err))
})
// TODO(tothricsaj): eliminate whitespaces from url (topic name)
app.post('/add-topic', (req, res, next) => {
  const topicName = req.body.topicName
  db
    .query(
      'INSERT INTO topic (topic_name) VALUES ($1)',
      [topicName]
    )
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.get('/topic/:name/:id', (req, res, next) => {
  const topicId = req.params.id
  const topicName = req.params.name
  db
    .query(`
      SELECT * FROM comment
      WHERE topic_id=${topicId}
    `)
    .then(dbRes => {
      console.log(dbRes.rows)
      res.render('comment', {
        topicName: topicName,
        topicId: topicId,
        comments: dbRes.rows
      })
    })
    .catch(err => console.log(err))
})

app.post('/add-comment', (req, res, next) => {
  const title = req.body.title
  const commentTxt = req.body.commentTxt
  const owner = req.body.owner
  const topicId = req.body.topicId
  const redirectURL = req.body.redirectURL

  db
    .query(
      `INSERT INTO comment (title, comment_txt, owner, topic_id) VALUES ($1, $2, $3, $4);`,
      [title, commentTxt, owner, topicId]
    )
    .then(() => res.redirect(redirectURL))
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