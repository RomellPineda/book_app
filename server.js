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

app.post('/searches', (req, res) => {
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.query}+in${req.body.search}`).then(data => {


  // let testBook = new Book(image, title, author, summary, isbn, categorie);
    // console.log('test book', testBook);
    
    const books = data.body.items.map(book => new Book(book));
    
    // console.log(data.body.items[0].volumeInfo.authors);
    res.render('pages/searches', { books: books });
  });
  
});

function Book(bookObj) {
  this.image = bookObj.volumeInfo.imageLinks && bookObj.volumeInfo.imageLinks.thumbnail;
  this.title = bookObj.volumeInfo.title;
  this.author = bookObj.volumeInfo.authors;
  
  this.summary = bookObj.volumeInfo.description;
  this.categorie = bookObj.volumeInfo.categories;
  
  //ISBN work when all other properties on the constructor are ommented out
  // this.isbn = bookObj.volumeInfo.industryIdentifiers[0].identifier;
};



app.listen(PORT, () => console.log(`app running on ${PORT}`));
