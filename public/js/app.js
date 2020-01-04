/* Dependencies */

// [none]


/* Global variables and instances */

let articleContainer;


/* MAIN */

// Start the fun once the DOM is ready
$(document).ready(function() {
  articleContainer = $('.article-container');
  $('.scrape-new-articles').on('click', handleScrapeNew);
  $('.clear-all-articles').on('click', handleClearAll);
  //   $(document).on('click', 'COMMENTS-BUTTONS', someFunction);
  //   $(document).on('click', 'DELTE-BUTTONS', someFunction);
  //   <div class="bootbox-body">
  //   <div class="container-fluid text-center">
  //       <h4>Notes For Article: 5e0d1a3c2c553e001536b4d4</h4>
  //       <hr>
  //       <ul class="list-group note-container">
  //           <li class="list-group-item note">Here's a note<button
  //                   class="btn btn-danger note-delete">x</button></li>
  //       </ul><textarea placeholder="New Note" rows="4" cols="60"></textarea><button
  //           class="btn btn-success save">Save Note</button>
  //   </div>
  // </div>
  loadSavedArticles();
});

// Find data in database, then display
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
  card.append(cardHeader, cardBody);
  // card.data('_id', article._id);
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
