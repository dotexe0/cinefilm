require("babel-core/register");
require("babel-polyfill");

$(document).ready(function() {

  // let OMDB_BASE_URL = "https://www.omdbapi.com/?t=";
  let THE_MOVIE_DB_API_KEY = '074c1de1f173b40ae75cddd1cebe2527';
  // let THE_MOVIE_DB_BASE_URL = `https://api.themoviedb.org/3/search/movie?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`;  // let GUIDE_BOX_API_KEY = 'rKqSP9tWheryWwVDGrdBaAZemausGy95';
  // let GUIDE_BOX_BASE_URL = 'https://api-public.guidebox.com/v2/search?api_key=' + GUIDE_BOX_API_KEY + '&type=movie&limit=10&field=title&precision=fuzzy&query=';
  // let quota = $.getJSON('https://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY + '/quota', function(data){
  // });
  let IMDB_URL = "https://www.imdb.com/title/";
  let ROTTEN_URL = "https://www.rottentomatoes.com/m/";

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
        console.log('movie data by ID: ', movieData);
        TRAILER_API_ENDPOINT = `https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=074c1de1f173b40ae75cddd1cebe2527&language=en-US`;
      })
      .then(function() {
        $.getJSON(TRAILER_API_ENDPOINT, function(data) {
          trailerData = data;
          console.log('trailer', data);
        })
      }),
      
    ).then(function() {
      if(movieData) {
        console.log('first api called');        
        var title = movieData.original_title;
        var image = `https://image.tmdb.org/t/p/w185${movieData.poster_path}`;
        
        var rated = movieData.vote_average;
        var genre = movieData.genres[0] ? movieData.genres[0].name : 'N/A';
        var imdbLink = `${IMDB_URL}${movieData.imdb_id}`;
        var movieDescription = movieData.overview;
        // var trailerVideo = getTrailerVideo(TRAILER_API_ENDPOINT);
                      // , , , imdbLink, rottenTomatoes, metaCritic, description, watchLinks, 
        var movieCard = '';
        // var rottenTomatoes = ROTTEN_URL + movieData.rottentomatoes;
        // var commonSenseMedia = movieData.common_sense_media;
        // var metaCritic = movieData.metacritic;
        // var trailerVideo = movieData.trailers.web[0].embed;
        if (!movieData.homepage) {
          var watchLinks = '#';
        } else {
          var watchLinks = movieData.homepage;
        }
      }
      else {
        //errror on first api call
        console.log('API 1 didnt worked');        
        
      }
      if (trailerData) {
        console.log('API 2 worked');        
        let id = trailerData.results[0].key || 'dQw4w9WgXcQ';
        var trailerVideo = `https://www.youtube.com/embed/${id}`;
        var description =
        "<div class='cardDescription hidden'>" +
          "<h1 class='movie-title'>" + movieData.original_title + "</h1>" +
          "<h3 class='mpaa-rating'> Avg. Rating: " + rated +
          // "<a class='commonsense' target='_blank' title='Common Sense Media' href=" + commonSenseMedia + " ><i class='fa fa-check-circle-o' aria-hidden='true'></i></a><br>" +"</h3>" +
          "<h5 class='genre'> Genre: " + genre + "</h5>" +
          "<div class='movieLinks'>" +
          "<a href=" + trailerVideo + " rel='trailervideo' autoplay title='Trailer' data-featherlight='iframe'>"+
            "<i class='fa fa-youtube-play fa-2x' aria-hidden='true'></i>" +
            "</a>" +
            "<a target='_blank' title='IMDB' href=" + imdbLink + "><i class='fa fa-imdb fa-2x' aria-hidden='true'></i></a>" +
            // "<a target='_blank' title='Rotten Tomatoes' href=" + rottenTomatoes +"><i class='fa fa-circle fa-2x' aria-hidden='true'></i></a>" +
            // "<a target='_blank'  title='Metacritic' href=" + metaCritic +"><i class='fa fa-meetup fa-2x' aria-hidden='true'></i></a>" +
          "</div>" +
          "<span class='movieText'>" + movieDescription + "</span><br>" +
          "<h5 class='watch'> Rent or Buy </h5>" + "<a target='_blank'  title='Rent/Buy' href=" + watchLinks +"><i class='fa fa-film fa-2x' aria-hidden='true'></i></a>" +
        "</div>";
        movieCard = "<div class='movieContainer'><img class='movieCard' src=" + image + ">" + description + "</div>";
        $('.js-search-results').append(movieCard);  
      } else {
        let id = 'dQw4w9WgXcQ';
        var trailerVideo = `https://www.youtube.com/embed/${id}`;
        console.log('did not work api2');
      }
      });     
  };


  //get trailers
  function getTrailerVideo(url) {
    $.getJSON(url, function(data) {
      // console.log('video url: ', data)
      if (data.results.length === 0 ) {
        let id = 'dQw4w9WgXcQ';
        let trailerVideo = `https://www.youtube.com/embed/${id}`;
        return trailerVideo;
      } else {
        let id = data.results[0].key;
        let trailerVideo = `https://www.youtube.com/embed/${id}`;
        return trailerVideo;
      }

    })
    .done( data => console.log('data'))
    .fail(function() { let trailerVideo = 'https://www.youtube.com/embed/dQw4w9WgXcQ' });
  }

  function displaySearchData(data){
    console.log('initial data', data);
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

