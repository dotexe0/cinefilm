var TASTE_KID_API_KEY = '246618-movieagg-S4Y1KTWA';
var TASTE_KID_BASE_URL = 'https://www.tastekid.com/api/similar';
var GUIDE_BOX_API_KEY = 'rKGb7Oh50TpEuVG55ENiKRKUxCBmrYVd';
var GUIDE_BOX_BASE_URL = 'http://api-public.guidebox.com/v1.43/us/' + GUIDE_BOX_API_KEY;

function getDataFromApi(searchTerm, callback) {
    var query = {
      part: 'snippet',
      key: API_KEY,
      q: searchTerm
    };
    $.getJSON(YT_BASE_URL, query, callback)
};

function displayYTSearchData(data){
  var resultElement = '';
  console.log(data);
  if (data.items) {
    data.items.forEach(function(item) {
      if(item.id.kind === 'youtube#video'){
        resultElement += '<p><a target="_blank" href="https://www.youtube.com/embed/' + item.id.videoId + '">' +
        "<img src=" + item.snippet.thumbnails.medium.url + ">"+ '<p>';
      }
    });

  }else{
    resultElement += '<p> no results <p>';
  }
  $('.js-search-results').append(resultElement)
}

function watchSubmit(){
  $('.js-search-form').submit(function(event){
    event.preventDefault();
    var query = $(this).find('.js-query').val();
    getDataFromApi(query, displayYTSearchData);
  });
}

$(function(){watchSubmit();});
