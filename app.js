$(document).ready(function() {

  let OMDB_BASE_URL = "https://www.omdbapi.com/?t=";
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
  function getSearchDataFromApi(searchTerm, callback) {
  let query = `https://api.themoviedb.org/3/search/movie?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&query=${searchTerm}&page=1&include_adult=false`
      $.getJSON(query, callback);
  };

  //grab ratings from OMDB api call
  function getMovieInfoByID(ID) {
    let search = `https://api.themoviedb.org/3/movie/${ID}?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US`;
    $.getJSON(search, function(omdb){
      imdb_rating = omdb.imdbRating;
      let meta_rating = omdb.Metascore;
    });
  };


  //get trailers
  function getTrailerVideo(url) {
    $.getJSON(url, function(data) {
      if (data.results.length  === 0 ) {
        let id = 'dQw4w9WgXcQ';
      } else {
        let id = data.results[0].key;
      }
       trailerVideo = 'https://www.youtube.com/embed/'+ id;
    })    
    .fail(function() { trailerVideo = 'https://www.youtube.com/embed/dQw4w9WgXcQ' });
  }

  function displaySearchData(data){
    console.log('initial data', data);
    $('.loading').removeClass('hidden');
    // $.ajaxSetup({
    // // async: false
    // });
  let emptyImage = 'https://static-api.guidebox.com/misc/default_movie_240x342.jpg';
  if (data.results) {
    data.results.forEach(function(movie) {
      // console.log('data for search results', movie)
      let trailerBaseURL = 'https://api.themoviedb.org/3/movie/' + movie.themoviedb +'/videos?api_key=074c1de1f173b40ae75cddd1cebe2527&language=en-US';
      let image = `http://image.tmdb.org/t/p/w200${movie.poster_path}`;
      image = image.replace('http', 'https');
      if (image != emptyImage) {
        //get movie details if image exists from api
        let movieID = movie.id;
        //grab individual elements from movies to display in dom
 
        $.getJSON(movieID, function(data){
          getTrailerVideo(trailerBaseURL);

          let movieCard = '';
          let rated = data.rating;
          if (data.genres.length === 0) {
            let genre = 'N/A';
          } else {
            let genre = data.genres[0].title
          }
          let movieDescription = data.overview;
          let imdbLink = IMDB_URL + data.imdb_id;
          getMovieInfoByID(data.imdb);

          let rottenTomatoes = ROTTEN_URL + data.rottentomatoes;
          let commonSenseMedia = data.common_sense_media;
          let metaCritic = data.metacritic;
          // let trailerVideo = data.trailers.web[0].embed;

          if (data.purchase_web_sources.length === 0) {
            let watchLinks = '#';
          } else {
            let watchLinks = data.purchase_web_sources[0].link;
          }
          let description =
            "<div class='cardDescription hidden'>" +
              "<h1 class='movie-title'>" + data.title + "</h1>" +
              "<h3 class='mpaa-rating'> Rated: " + rated +
              "<a class='commonsense' target='_blank' title='Common Sense Media' href=" + commonSenseMedia + " ><i class='fa fa-check-circle-o' aria-hidden='true'></i></a><br>" +"</h3>" +
              "<h5 class='genre'> Genre: " + genre + "</h5>" +
              "<div class='movieLinks'>" +
              "<a href=" + trailerVideo + " rel='trailervideo' autoplay title='Trailer' data-featherlight='iframe'>"+
                "<i class='fa fa-youtube-play fa-2x' aria-hidden='true'></i>" +
                "</a>" +
                "<a target='_blank' title='IMDB' href=" + imdbLink + "><i class='fa fa-imdb fa-2x' aria-hidden='true'></i></a>" +
                "<a target='_blank' title='Rotten Tomatoes' href=" + rottenTomatoes +"><i class='fa fa-circle fa-2x' aria-hidden='true'></i></a>" +
                "<a target='_blank'  title='Metacritic' href=" + metaCritic +"><i class='fa fa-meetup fa-2x' aria-hidden='true'></i></a>" +
              "</div>" +
              "<span class='movieText'>" + movieDescription + "</span><br>" +
              "<h5 class='watch'> Rent or Buy </h5>" + "<a target='_blank'  title='Rent/Buy' href=" + watchLinks +"><i class='fa fa-film fa-2x' aria-hidden='true'></i></a>" +
            "</div>";
            movieCard = "<div class='movieContainer'><img class='movieCard' src=" + image + ">" + description + "</div>";
          $('.js-search-results').append(movieCard);
        });
      }
    });
//     $.ajaxSetup({
//     async: true
// });
  } else {
    let resultElement = resultElement + '<p> no results <p>';
    ('.js-search-results').append(resultElement);
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

