'use strict';

const express = require('express');
const ejs = require('ejs');
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const app = express();
const pg = require('pg');
const expressLayouts = require('express-ejs-layouts');

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);


const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (e) => console.error(e));
client.connect();

app.get('/search', (req, res) => {
  res.render('pages/googleSearch');
});

app.get('/', (req, res) => {
  const instruction = 'SELECT * FROM books;';
  client.query(instruction).then(function (sqlData) {
    console.log(sqlData.rows);
    const booksArray = sqlData.rows;
    booksArray.length > 0 ? res.render('pages/index', { booksArray }) : res.render('pages/index');
  });
});

app.get('/hello', (req, res) => {
  res.render('pages/hello');
});

app.get('/books/:id', getOneBook);

app.post('/searches', (req, res) => {
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.query}+in${req.body.search}`).then(data => {
    const books = data.body.items.map(book => new Book(book));
    res.render('pages/searches', { books });
  }).catch(error => {
    res.render('pages/error', { error });
  });
});

app.post('/save-book', (req, res) => {
  client.query(`INSERT INTO books (image_url, title, author, isbn, categorie,summary)
  VALUES ($1, $2, $3, $4, $5, $6);`, Object.values(req.body)).then(() => {
    client.query('SELECT * FROM books ORDER BY id DESC LIMIT 1;').then(newBook => {
      res.redirect(`/books/${newBook.rows[0].id}`);
    })
  });
});

app.post('/edit', (req, res) => {
  res.render('pages/editForm', { book: req.body });
});

app.delete('/delete', deleteOne);

app.put('/books/:tomato_book_id', (req, res) => {
  const sqlQuery = 'UPDATE books SET title=$1, image_url=$2, author=$3, isbn=$4, categorie=$5, summary=$6 WHERE id = $7';
  const values = [req.body.title, req.body.image_url, req.body.author, req.body.isbn, req.body.categorie, req.body.summary, req.params.tomato_book_id];
  client.query(sqlQuery, values).then(() => {
    res.redirect('/');
  });
});

function Book(bookObj) {
  this.image_url = bookObj.volumeInfo.imageLinks && bookObj.volumeInfo.imageLinks.thumbnail;
  this.title = bookObj.volumeInfo.title;
  this.author = bookObj.volumeInfo.authors;
  this.summary = bookObj.volumeInfo.description;
  // this.categorie = bookObj.volumeInfo.categories;
  this.isbn = bookObj.volumeInfo.industryIdentifiers[0].identifier;
}

function getOneBook(req, res) {
  const instructions = 'SELECT * FROM books WHERE id=$1';
  const values = [req.params.id];
  client.query(instructions, values).then(resultFromSql => {
    res.render('pages/singleBook', { oneBook: resultFromSql.rows[0] });
  });
}

app.listen(PORT, () => console.log(`app running on ${PORT}`));

function deleteOne(req, res) {
  client.query('DELETE FROM books WHERE id=$1', [req.body.sqlId]).then(() => {
    res.redirect('/');
  });

}

