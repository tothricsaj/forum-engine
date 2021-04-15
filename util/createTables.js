// TODO(tothricsaj):
// So, it is not the most elegant solution. Find one

const db = require('./database')

const createTables = () => {

  const initQuery = `
    BEGIN;
    CREATE TABLE IF NOT EXISTS user_profile (
      user_id    serial PRIMARY KEY,
      user_name  varchar(70) NOT NULL,
      email      varchar(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS topic (
      topic_id   serial PRIMARY KEY,
      topic_name varchar(70) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS comment (   
      comment_id serial PRIMARY KEY,
      title      varchar(255) NOT NULL,
      comment_txt text NOT NULL,
      topic_id   integer NOT NULL,
      FOREIGN KEY(topic_id) REFERENCES topic(topic_id)
    );
    COMMIT;
  `
  
  const testQuery = `
    CREATE TABLE IF NOT EXISTS test (
      user_id serial PRIMARY KEY,
      username VARCHAR ( 50 ) UNIQUE NOT NULL,
      password VARCHAR ( 50 ) NOT NULL,
      email VARCHAR ( 255 ) UNIQUE NOT NULL
    );
  `
  db
    .query(initQuery)
    // .query(testQuery)
    .then(dbRes => {
      console.log(dbRes)
      firstDownload = false
    })
    .catch(err => console.log(err))
}

module.exports = createTables