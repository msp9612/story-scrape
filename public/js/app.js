/* Dependencies */

// [none]


/* Global variables and instances */

let articleContainer;


/* MAIN */

/**
 * When adding new articles, the entire list of articles is refreshed.
 * When deleting one article (not all), that article is simply removed.
 *
 * The comments in the comment box mirror this behavior.
 */

// Start the fun once the DOM is ready
$(document).ready(function() {
  articleContainer = $('.article-container');
  $('.scrape-new-articles').on('click', handleScrapeNew);
  $('.clear-all-articles').on('click', handleClearAll);
  $(document).on('click', '.comments', handleCommentsBox);
  // $(document).on('click', '.COMMENT_SAVE', handleCOMMENT_SAVE);
  // $(document).on('click', '.COMMENT_DELETE', handleCOMMENT_DELETE);
  $(document).on('click', '.delete-article', handleDeleteArticle);
  loadSavedArticles();
});

// Find articles in database, then display
function loadSavedArticles() {
  $.get('/api/articles').then(function(data) {
    articleContainer.empty();
    if (data && data.length) {
      const articleCards = [];
      for (let i = 0; i < data.length; i++) {
        articleCards.push(createCard(data[i]));
      }
      articleContainer.append(articleCards);
    }
  });
}

// Create article bootstrap card
function createCard(article) {
  const card = $('<div class=\'card\'>');
  const cardHeader = $('<div class=\'card-header\'>').append(article.label);
  const cardBody = $('<h3>').append(
      $('<div class=\'card-body\'>'),
      $('<a class=\'article-link\' target=\'_blank\' rel=\'noopener noreferrer\'>')
          .attr('href', article.url)
          .text(article.title),
      $('<br>'),
      $('<a class="btn btn-info comments">Comments</a>'),
      $('<a class="btn btn-danger delete-article">Delete Article</a>'),
  );
  card.data('_id', article._id);
  card.append(cardHeader, cardBody);
  return card;
};

// Scrape articles
function handleScrapeNew() {
  $.get('/api/scrape').then(function(data) {
    loadSavedArticles();
  });
}

// Clear all articles
function handleClearAll() {
  if (confirm('This will clear all articles. Are you sure?')) {
    $.ajax({
      type: 'DELETE',
      url: '/api/clear',
      success: function() {
        articleContainer.empty();
        alert('Successfully cleared articles.');
      },
      error: function() {
        alert('Articles could not be cleared.');
      },
    });
  }
}

// Display comment box
function handleCommentsBox() {
  articleCardID = $(this).parents('.card').data()._id;
  const commentBox = $('<div class=\'container-fluid text-center comment-box\'>').append(
      $('<h4>').text('Article Comments'),
      $('<hr>'),
      $('<ul class=\'list-group comment-list\'>'),
      $('<textarea placeholder=\'New Comment\' rows=\'4\' cols=\'60\'>'),
      $('<button class=\'btn btn-success comment-save\'>Save Note</button>'),
  );
  bootbox.dialog({
    message: commentBox,
    closeButton: true,
  });
  $('.comment-save').data('articleID', articleCardID);
  loadArticleComments(articleCardID);
}

// Find comments for an article, then display
function loadArticleComments(articleID) {
  $('.comment-list').empty();
  let articleComments = [];
  $.get('/api/comments/' + articleID).then(function(data) {
    articleComments = data;
  });
  for (let i = 0; i < articleComments.length; i++) {
    currentComment = $('<li class=\'list-group-item comment\'>')
        .text(articleComments[i].body)
        .append($('<button class=\'btn btn-danger comment-delete\'>x</button>'));
    currentComment.children('button').data('_id', articleComments[i]._id);
    $('.comment-list').append(currentComment);
  }
}

// Save comment
// x

// Delete comment
// x

// Delete one article
function handleDeleteArticle() {
  if (confirm('Delete this article?')) {
    const articleCard = $(this).parents('.card');
    const articleCardID = articleCard.data()._id;
    $.ajax({
      type: 'DELETE',
      url: '/api/delete/' + articleCardID,
      success: function() {
        articleCard.remove();
        alert('Article deleted.');
      },
      error: function() {
        alert('Article could not be deleted');
      },
    });
  }
}
