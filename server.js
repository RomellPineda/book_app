'use strict';

const express = require('express');
const ejs = require('ejs');
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/hello', (req, res) => {
  res.render('pages/index');
});

// app.get('/', (req, res) => {
//   res.render('pages/index');
// })

// app.post('/', (req, res) => {
//   superagent.get(`https://www.googleapis.com/books/v1/volumes?q=author+inauthor:${req.body.author}`).then(data => {

//     const books = data.body.items.map(book => ({name: book.volumeInfo.title}));
//     console.log(data.body.items[0].volumeInfo.authors);
//     res.render('pages/searches', { books: books } );
//   });

// });

app.post('/', (req, res) => {
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=author+inauthor:${req.body.author}`).then(data => {
    // console.log('items', data.body.items[0]);

    // let image = data.body.items[0].volumeInfo.imageLinks.smallThumbnail;
    // let title = data.body.items[0].volumeInfo.title;
    // let author = data.body.items[0].volumeInfo.authors;

    // let summary = data.body.items[0].volumeInfo.description;
    // let isbn = data.body.items[0].volumeInfo.industryIdentifiers[0].identifier;
    // let categorie = data.body.items[0].volumeInfo.categories;

    // let testBook = new Book(image, title, author, summary, isbn, categorie);
    // console.log('test book', testBook);

    const books = data.body.items[0].volumeInfo.map(book => console.log(book));
    // console.log(data.body.items[0].volumeInfo.authors);
    res.render('pages/searches', { books: books });
  });

});

function Book(image, title, author, summary, isbn, categorie) {
  this.image = image;
  this.title = title;
  this.author = author;
  this.summary = summary;
  this.isbn = isbn;
  this.categorie = categorie;

}

app.listen(PORT, () => console.log(`app running on ${PORT}`));
