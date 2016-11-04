// var TASTE_KID_API_KEY = '246618-movieagg-S4Y1KTWA';
// var TASTE_KID_BASE_URL = 'https://www.tastekid.com/api/similar';
var GUIDE_BOX_API_KEY = 'rKGb7Oh50TpEuVG55ENiKRKUxCBmrYVd';
var GUIDE_BOX_BASE_URL = 'http://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY + '/search/movie/title/';
var IMDB_URL = 'http://imdb.com/title/';
function getSearchDataFromApi(searchTerm, callback) {
    var query = GUIDE_BOX_BASE_URL + searchTerm + '/fuzzy';
    $.getJSON(query, callback)
};

function displaySearchData(data){
  var resultElement = '';
  console.log(data);
  if (data.results) {
    data.results.forEach(function(item) {
      resultElement += "<a href='#' data-featherlight='iframe'>" +
      "<img src=" + item.poster_240x342 + "></a>";
    });
  } else {
    resultElement += '<p> no results <p>';
  }
  $('.js-search-results').append(resultElement)

}

function watchSubmit(){
  $('.js-search-form').submit(function(event){
    $('.js-search-results').empty();
    event.preventDefault();
    var query = $(this).find('.js-query').val();
    getSearchDataFromApi(query, displaySearchData);
  });
}

$(function(){watchSubmit();});
