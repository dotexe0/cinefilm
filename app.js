// var TASTE_KID_API_KEY = '246618-movieagg-S4Y1KTWA';
// var TASTE_KID_BASE_URL = 'https://www.tastekid.com/api/similar';
var GUIDE_BOX_API_KEY = 'rKGb7Oh50TpEuVG55ENiKRKUxCBmrYVd';
var GUIDE_BOX_BASE_URL = 'http://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY + '/search/movie/title/';
var quota = $.getJSON('http://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY + '/quota');
console.log(quota);

//display popular movies by default on main page
function defaultDisplayData(){
  var movieSearchURL = 'http://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY + '/movies/all/0/10/';
  $.getJSON(movieSearchURL, displaySearchData)
}

//search any movie title
function getSearchDataFromApi(searchTerm, callback) {
    var query = GUIDE_BOX_BASE_URL + searchTerm + '/fuzzy';
    $.getJSON(query, callback)
};

function displaySearchData(data){
  var emptyImage = 'http://static-api.guidebox.com/misc/default_movie_240x342.jpg';
  if (data.results) {
    data.results.forEach(function(item) {
      if (item.poster_240x342 != emptyImage) {
        //get movie details if image exists
        var trailerLinksURL = 'https://api-public.guidebox.com/v1.43/US/' + GUIDE_BOX_API_KEY + '/movie/' + item.id;
        $.getJSON(trailerLinksURL, function(data){
          var resultElement = '';
          console.log(data);
          trailerVideo = data.trailers.web[0].embed;
          resultElement = "<a href=" + trailerVideo + " data-featherlight='iframe'>" +
          "<img src=" + item.poster_240x342 + "></a>";
          console.log(resultElement);
          $('.js-search-results').append(resultElement);
        });
      }
    });
  } else {
    resultElement += '<p> no results <p>';
  }
}

function watchSubmit(){
  $('.js-search-form').submit(function(event){
    $('.js-search-results').empty();
    event.preventDefault();
    var query = $(this).find('.js-query').val();
    getSearchDataFromApi(query, displaySearchData);
  });
}

$(function(){
  defaultDisplayData();
  watchSubmit();
});
