/* Dependencies */

const mongoose = require('mongoose');


/* Global variables and instances */

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: String,
});

const Comment = mongoose.model('Comment', CommentSchema);


/* MAIN */

module.exports = Comment;
