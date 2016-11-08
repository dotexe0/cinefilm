// var TASTE_KID_API_KEY = '246618-movieagg-S4Y1KTWA';
// var TASTE_KID_BASE_URL = 'https://www.tastekid.com/api/similar';

var GUIDE_BOX_API_KEY = 'rKGb7Oh50TpEuVG55ENiKRKUxCBmrYVd';
var GUIDE_BOX_BASE_URL = 'http://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY + '/search/movie/title/';
var quota = $.getJSON('http://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY + '/quota', function(data){
  console.log(data);
});

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
      var image = item.poster_240x342;
      if (image != emptyImage) {
        //get movie details if image exists from api
        var trailerLinksURL = 'https://api-public.guidebox.com/v1.43/US/' + GUIDE_BOX_API_KEY + '/movie/' + item.id;
        //grab individual elements from movies to display in dom
        $.getJSON(trailerLinksURL, function(data){
          var resultElement = '';
          var movieDescription = data.overview;
          var trailerVideo = data.trailers.web[0].embed;
          // resultElement = "<div class='imgWrap'>" +
          // "<a href=" + trailerVideo + " data-featherlight='iframe'>" +
          // "<img src=" + image + "><p class='movieDescription'>" + movieDescription + "</p></a>" + "</div>";
          resultElement = "<img class='movieCard' src=" + image + ">";
          $("<p>"+movieDescription+"</p>").appendTo('.description');
          $('.js-search-results').append(resultElement);
        });
      }
    });
  } else {
    resultElement += '<p> no results <p>';
  }
};

$(document).on('click','.movieCard', function(){
  console.log('card clicked');
  $(this).addClass("active");
  $('.movieCard').hide();
  $('.active').show();
  $(this).animate({
        left: '0px'
    }, 1000);
  $('.description').show(1000);
  // $("<p>" + movieDescription + "</p>").appendTo(".description");
});

$(document).on('click', '.active', function(){
  $(this).removeClass('active');
  $('.movieCard').show();
  $('.description').hide();

});

function watchSubmit(){
  $('.js-search-form').submit(function(event){
    $('.js-search-results').empty();
    event.preventDefault();
    var query = $(this).find('.js-query').val();
    getSearchDataFromApi(query, displaySearchData);
  });
}

$(function(){
  $('.description').hide();
  defaultDisplayData();
  watchSubmit();
});
