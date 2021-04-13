const express = require('express')
const bodyParser = require('body-parser')

const db = require('./util/database')

const app = express()

const port = 3007

app.set('view engine', 'ejs')
app.set('views', 'view')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))

const queryStr = `
  SELECT
    title, release_year
  FROM
    film
  WHERE
    length < $1
  LIMIT $2
`

app.get('/', (req, res, next) => {
  db
    .query(queryStr, [100, 5])
    .then(dbRes => {
      res.render('home', {
        films: dbRes.rows
      })
    })
    .catch(err => console.log(err))
})

app.listen(port)

console.log('app is listening on ' + port + ' port')