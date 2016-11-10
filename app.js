// var TASTE_KID_API_KEY = '246618-movieagg-S4Y1KTWA';
// var TASTE_KID_BASE_URL = 'https://www.tastekid.com/api/similar';

var GUIDE_BOX_API_KEY = 'rKGb7Oh50TpEuVG55ENiKRKUxCBmrYVd';
var GUIDE_BOX_BASE_URL = 'http://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY + '/search/movie/title/';
var quota = $.getJSON('http://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY + '/quota', function(data){
  console.log(data);
});
var IMDB_URL = "http://www.imdb.com/title/";
var ROTTEN_URL = "https://www.rottentomatoes.com/m/";
//display popular movies by default on main page
var start = 0;
var end = 10;
function defaultDisplayData(start=0, end=10){
  var movieSearchURL = 'http://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY + '/movies/all/' + start +'/' + end;
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
          console.log(data);
          var movieCard = '';
          var movieDescription = data.overview;
          var imdbLink = IMDB_URL + data.imdb;
          var rottenTomatoes = ROTTEN_URL + data.rottentomatoes;
          var commonSenseMedia = data.common_sense_media;
          var metaCritic = data.metacritic;
          var trailerVideo = data.trailers.web[0].embed;


          var description =
            "<div class='cardDescription hidden'>" +
              "<h1>" + data.title + "</h1>" +
              "<div class='movieLinks'>" +
                "<a target='_blank' href=" + imdbLink + "><i class='fa fa-imdb fa-2x' aria-hidden='true'></i></a>" +
                "<a target='_blank' href=" + rottenTomatoes +"><img class='rottentomatoes' src='images/rottentomatoes_icon.png'></a>" +
                "<a target='_blank' href=" + metaCritic +"><img class='metacritic' src='images/metacritic_icon.png'></a>" +
                "<a target='_blank' href=" + commonSenseMedia + "<i class='fa fa-check-circle-o fa-2x' aria-hidden='true'></i></a><br>" +
                "<a href=" + trailerVideo + " rel='trailervideo' title='Trailer' target='iframe_a'>"+
                  "<i class='fa fa-youtube-play fa-3x' aria-hidden='true'></i>" +
                  "<iframe height='300px' width='100%' src='' name='iframe_a'></iframe></a>" +
              "</div>"+ "<span>" + movieDescription + "</span>" + "</div>";

          movieCard = "<div class=''><img class='movieCard' src=" + image + ">" + description + "</div>";
          $('.js-search-results').append(movieCard);
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
  $(this).parent().find('.cardDescription').removeClass('hidden')
  $('.movieCard').hide();
  $('.active').show();
  $(this).animate({
        left: '0px'
    }, 1000);
  $('.description').show(1000);
});

$(document).on('click', '.active', function(){
  $(this).removeClass('active');
  $('.movieCard').show();
  $('.description').hide();

});

//wait for a submit click
function watchSubmit(){
  $('.js-search-form').submit(function(event){
    $('.js-search-results').empty();
    event.preventDefault();
    var query = $(this).find('.js-query').val();
    getSearchDataFromApi(query, displaySearchData);
  });
}

//load more content once you reach bottom of page
// $(window).scroll(function() {
//    if($(window).scrollTop() + $(window).height() == $(document).height()) {
//       start = end + 1;
//       end = start + 1;
//       defaultDisplayData(start, end);
//       displaySearchData();
//    }
// });

$(function(){
  $('.description').hide();
  defaultDisplayData();
  watchSubmit();
});
