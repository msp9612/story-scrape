/* Dependencies */

const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./models');


/* Global variables and instances */

const PORT = process.env.PORT || 3000;
const app = express();


/* MAIN */

app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/polygondb', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

app.listen(PORT, function() {
  console.log('App running on http://localhost:%s', PORT);
});
