'use strict';

const express = require('express');
const ejs = require('ejs');
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/hello', (req, res) => {
  res.render('pages/index');
});

// app.get('/', (req, res) => {
//   res.render('pages/index');
// })

app.post('/', (req, res) => {
  res.render('pages/index', { work : 'it worked'});
})

app.listen(PORT, () => console.log(`app running on ${PORT}`));
