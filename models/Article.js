/* Dependencies */

const mongoose = require('mongoose');


/* Global variables and instances */

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  byline: {
    type: String,
  },
  url: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const Article = mongoose.model('Article', ArticleSchema);


/* MAIN */

module.exports = Article;
