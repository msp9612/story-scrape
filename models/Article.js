/* Dependencies */

const mongoose = require('mongoose');


/* Global variables and instances */

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
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
