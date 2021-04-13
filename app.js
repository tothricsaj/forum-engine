const express = require('express')
const bodyParser = require('body-parser')

const db = require('./util/database')

const app = express()

const port = 3007

const firstDownload = true

const createTables = (req, res, next) => {

  const initQuery = `
    BEGIN;
    CREATE TABLE IF NOT EXISTS user_profile (
      user_id    serial PRIMARY KEY,
      user_name  varchar(70) NOT NULL,
      email      varchar(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS topic (
      topic_id   serial PRIMARY KEY ,
      topic_name varchar(70) NOT NULL
    );
    COMMIT;
  `

  // const initQuery = `
  //   CREATE TABLE IF NOT EXISTS user_profile (
  //     user_id    serial PRIMARY KEY,
  //     user_name  varchar(70) NOT NULL,
  //     email      varchar(255) NOT NULL
  //   );
  // `
      // adsfasdf
  const testQuery = `
    CREATE TABLE IF NOT EXISTS accounts (
      user_id serial PRIMARY KEY,
      username VARCHAR ( 50 ) UNIQUE NOT NULL,
      password VARCHAR ( 50 ) NOT NULL,
      email VARCHAR ( 255 ) UNIQUE NOT NULL
    );
  `
  if(firstDownload) {
    db
      .query(initQuery)
      // .query(testQuery)
      .then(dbRes => {
        console.log(dbRes)
        firstDownload = false
        next()
      })
      .catch(err => console.log(err))
  }

  next()
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