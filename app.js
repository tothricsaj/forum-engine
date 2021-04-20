require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const bcrypt = require('bcryptjs')

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
app.use(
  session({
    store: new pgSession({
      pool: db
    }),
    secret: 'cat tourch',
    resave: false,
    saveUninitialized: false
  })
)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLogged
  next()
})

app.get('/', (req, res, next) => {
  if(req.session.isLogged) {
    db
      .query('SELECT * FROM topic LIMIT 10')
      .then(dbRes => {
        return res.render('home', {
          topics: dbRes.rows,
          userName: req.session.userName
        })
      })
      .catch(err => console.log(err))
  } else {
    res.redirect('/login')
  }

})

app.get('/login', (req, res, next) => {
  res.render('login')
})

app.post('/login', (req, res, next) => {
  const userName = req.body.userName
  const password = req.body.password

  let user

  db
    .query(
      'SELECT user_name, password FROM user_profile WHERE user_name=($1)',
      [userName]
    )
    .then(dbRes => {
      console.log(dbRes.rows[0])
      user = dbRes.rows[0]
      if(!!user) {
        return bcrypt.compare(password, user.password)
      }
      res.redirect('/login')
    })
    .then(doMatch => {
      if(doMatch) {
        req.session.isLogged = true
        req.session.userName = user.user_name
        return req.session.save(err => {
          if(err) console.log(err)
          return res.redirect('/')
        })
      }
      res.redirect('/login')
    })
    .catch(err => console.log(err))
})

app.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if(err) console.log(err)

    // this is not working.
    // pgSession.close()

    res.redirect('/login')
  })
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
  const password = req.body.password

  let hashedPass

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      hashedPass = hashedPassword
      return db.query('SELECT email FROM user_profile WHERE email=($1)', [email])
    })
    .then(dbRes => {
      const userEmail = dbRes.rows[0] ? dbRes.rows[0].email : 'not exist'
      if(userEmail === email) {
        console.log('Existing email')
        return res.redirect('/registration')
      } else {
        const insertQuery = `
          INSERT INTO user_profile (user_name, email, password) VALUES ($1, $2, $3);
        `
        db
          .query(insertQuery, [userName, email, hashedPass])

        return res.redirect('/')
      }
    })
    .catch(err => console.log(err))
})

app.listen(port)

console.log('app is listening on ' + port + ' port')