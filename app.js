require("babel-core/register");
require("babel-polyfill");

$(document).ready(function() {
  const THE_MOVIE_DB_API_KEY = '074c1de1f173b40ae75cddd1cebe2527';
  const IMDB_URL = "https://www.imdb.com/title/";
  const ROTTEN_URL = "https://www.rottentomatoes.com/m/";

  //display popular movies by default on main page
  function defaultDisplayData() {
    let latestMovies = `https://api.themoviedb.org/3/movie/popular?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US`;
    $.getJSON(latestMovies, displaySearchData);
  }

  //search any movie title
  async function getSearchDataFromApi(searchTerm, callback) {
  let query = `https://api.themoviedb.org/3/search/movie?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&query=${searchTerm}&page=1&include_adult=false`
      $.getJSON(query, callback);
  };

  //grab more data by movie id api call
  async function getMovieInfoByID(ID) {
    let search = `https://api.themoviedb.org/3/movie/${ID}?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US`;
    var movieData, trailerData, TRAILER_API_ENDPOINT ;
    $.when(
      //first API  call to movieDB for data by ID
      $.getJSON(search, function(data) {
        movieData = data;
        TRAILER_API_ENDPOINT = `https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=074c1de1f173b40ae75cddd1cebe2527&language=en-US`;
      })
      .then(function() {
        $.getJSON(TRAILER_API_ENDPOINT, function(data) {
          trailerData = data;
        })
      }),
      
    ).then(function() {
      if(movieData) {
        var title = movieData.original_title;
        var image = movieData.poster_path ? `https://image.tmdb.org/t/p/w185${movieData.poster_path}`: 'https://static-api.guidebox.com/misc/default_movie_240x342.jpg' 
        var rated = movieData.vote_average;
        var genre = movieData.genres[0] ? movieData.genres[0].name : 'N/A';
        var imdbLink = `${IMDB_URL}${movieData.imdb_id}`;
        var movieDescription = movieData.overview;
        var movieCard = '';
        var homepage = movieData.homepage ? movieData.homepage : '#';
      }
      else {
        //errror on first api call
        console.log('API 1 didnt worked');
      }
      if (trailerData) {
        let id = trailerData.results[0] ? trailerData.results[0].key : 'dQw4w9WgXcQ';
        var trailerVideo = `https://www.youtube.com/embed/${id}`;
        var description =
        "<div class='cardDescription hidden'>" +
          "<h1 class='movie-title'>" + movieData.original_title + "</h1>" +
          "<h3 class='mpaa-rating'> Average Rating: " + rated +
          "<h5 class='genre'> Genre: " + genre + "</h5>" +
          "<div class='movieLinks'>" +
          "<a href=" + trailerVideo + " rel='trailervideo' autoplay title='Trailer' data-featherlight='iframe'>"+
            "<i class='fa fa-youtube-play fa-3x' aria-hidden='true'></i>" +
            "</a>" +
            "<a target='_blank' title='IMDB' href=" + imdbLink + "><i class='fa fa-imdb fa-3x' aria-hidden='true'></i></a>" +
          "</div>" +
          "<span class='movieText'>" + movieDescription + "</span><br>" +
          "<h5 class='watch'> Movie Homepage </h5>" + "<a target='_blank'  title='Homepage' href=" + homepage +"><i class='fa fa-film fa-2x' aria-hidden='true'></i></a>" +
        "</div>";
        movieCard = "<div class='movieContainer'><img class='movieCard' src=" + image + ">" + description + "</div>";
        $('.js-search-results').append(movieCard);  
      } else {
        let id = 'dQw4w9WgXcQ';
        var trailerVideo = `https://www.youtube.com/embed/${id}`;
        console.log('trailerAPICall error');
      }
      });     
  };

  function displaySearchData(data){
    $('.loading').removeClass('hidden');

    let emptyImage = 'https://static-api.guidebox.com/misc/default_movie_240x342.jpg';
    if (data.results.length > 0) {
      data.results.forEach(function(movie) {
        var movieData = getMovieInfoByID(movie.id);
        });
      } else {
        let resultElement = '<p> no results <p>';
        $('.js-search-results').append(resultElement);
      } 
    $('.loading').addClass('hidden');
  };

  $(document).on('click','.movieCard', function(){
    $(this).addClass("active");
    $(this).parent().find('.cardDescription').removeClass('hidden');
    $(this).parent().find('.cardDescription').hide();
    $('.movieCard').hide();
    $('.active').show();

    $(this).parent().find('.cardDescription').show();    

      setTimeout(function() {
        $('html,body').animate({
        scrollTop: $(".cardDescription").offset().bottom },
        1000);
    }, 500);

    $(document).on('click', '.active', function(){
      $(this).removeClass('active');
      $('.movieCard').show();
      $('.cardDescription').addClass('hidden');
    });
  });

  //wait for a submit click
  function watchSubmit(){
    $('.js-search-form').submit(function(event){
      $('.js-search-results').empty();
      $('.loading').removeClass('hidden');
      event.preventDefault();
      let query = $(this).find('.js-query').val();
      getSearchDataFromApi(query, displaySearchData);
    });
  }

  //show footer when scrolling to end of page
  $(window).scroll(function(){
      if ($(window).scrollTop() == $(document).height() - $(window).height()) {
          $('footer').show()
      } else {
        $('footer').hide();
      }
  });

  $(function(){
    $('.description').hide();
    $('footer').hide();
    defaultDisplayData();
    watchSubmit();
  });
});

