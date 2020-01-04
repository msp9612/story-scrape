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

mongoose.connect('mongodb://localhost/polygondb', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

app.listen(PORT, function() {
  console.log('App running on http://localhost:%s', PORT);
});

// Find data in database
app.get('/api/articles', async function(req, res) {
  try {
    const data = await db.Article.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({error: {name: err.name, message: err.message}});
  }
});

// Scrape articles
app.get('/api/scrape', async function(req, res) {
  const response = await axios.get('https://www.polygon.com/');
  const $ = cheerio.load(response.data);
  $('.c-showcase-eight-up__entry').each(async function(i, element) {
    const articleData = {};
    articleData.label = $(this).find('ul').find('li').find('a').find('span').text();
    articleData.title = $(this).find('h2').find('a').text();
    articleData.byline = $(this).find('div').find('.c-byline-wrapper').find('span').find('a').find('span').text();
    articleData.url = $(this).find('h2').find('a').attr('href');
    await db.Article.findOneAndUpdate({'url': articleData.url}, articleData, {upsert: true}, function(err) {
      if (err) return console.log(err);
    });
  });
  res.send('Scrape successful!');
});

// Clear all articles
app.delete('/api/clear', async function(req, res) {
  await db.Article.deleteMany({}, function(err) {
    if (err) return console.log(err);
  });
  res.send('Successfully cleared articles.');
});
