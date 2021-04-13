const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dvdrental',
  password: 'postgres',
  port: 5432
})

module.exports = pool