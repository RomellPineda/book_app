'use strict';

const express = require('express');
const ejs = require('ejs');
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const app = express();
const pg = require('pg');
// const client = new pg.Client(process.env.DATABASE_URL);

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');


// client.on('error', (e) => console.error(e));
// client.connect();


app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/hello', (req, res) => {
  res.render('pages/hello');
});

app.post('/searches', (req, res) => {
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.query}+in${req.body.search}`).then(data => {
    const books = data.body.items.map(book => new Book(book));
    res.render('pages/searches', { books });
  }).catch(error => {
    res.render('pages/error', { error });
  });
});

function Book(bookObj) {
  this.image_url = bookObj.volumeInfo.imageLinks && bookObj.volumeInfo.imageLinks.thumbnail;
  this.title = bookObj.volumeInfo.title;
  this.author = bookObj.volumeInfo.authors;
  this.summary = bookObj.volumeInfo.description;
  this.categorie = bookObj.volumeInfo.categories;
  this.isbn = bookObj.volumeInfo.industryIdentifiers[0].identifier;
}

app.listen(PORT, () => console.log(`app running on ${PORT}`));
