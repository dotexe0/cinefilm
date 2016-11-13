# cinefilm
A movie aggregator website that runs off Guidebox's API. This project uses HTML, CSS, JavaScript, and JQuery.
<h2>Live Page</h2>
[Cinefilm](http://dotexe0.github.io/cinefilm)
<h2>Use Case</h2>
This app is for those who are interested in watching a movie, but don't know which to pick. Cinefilm is a one-stop shop to decide what to watch. The app allows you to read a short movie description, watch the movie trailer, and rent or buy the movie if you so choose. 

<h2>UX</h2>
The user experience begins with this landing page. The user is presented with default (most popular) movie cards which they can click on to expand. They are also given the option to search for any movie using the search field at the top. Search results are "fuzzy" which will return any matching value (i.e. "star" will return Star Wars, Star Trek, Stardust, etc.).
![Landing Page](http://imgur.com/xaYTvP1.png "Landing Page")

When a movie card is selected, the end user is presented with basic movie info:
Title, MPAA Rating, Genre, Trailer, Common Sense Media / IMDB / Rotten Tomatoes / Metacritic Links, Movie Description, and Buy/Rent option.
![X](http://imgur.com/reEp78x.png "When clicking on movie card")

All links have a unique hover effect color to match their respective style. 
![X](http://imgur.com/5rQRoYZ.png "Hover")

The Trailer play button will lead to a light-box video.
![X](http://imgur.com/QzRcSz6.png "Trailer")

The Buy/ Rent option will lead to iTunes or Amazon Prime when links are available.
![X](http://imgur.com/FxFHP9P.png "Buy").

<h2>Responsive Design</h2>
Cinefilm is *fully* responsive and can be viewed from all media devices.

Phone View                         | iPad View
:---------------------------------:|:-------------------------------:
![](http://imgur.com/Sp7LquI.png)  |  ![](http://imgur.com/W6Zlzdf.png)

<h2>Technical</h2>
* Cinefilm uses the [GuideBox API](https://api.guidebox.com/) to make requests for any movie. The API requires a Key which you will need to register to obtain. 
* The front-end is done with HTML/CSS, JavaScript, and JQuery.
* The HTML is a bare-bones file with the basic overall structure. 
* Styling is done through vanilla CSS with the exception of the light-box which uses [Featherlight](https://github.com/noelboss/featherlight/). 
* Link buttons are FontAwesome icons.
* All movie cards, descriptions, and links are created in real-time through JQuery. An API call is made to Guidebox's API which will return an array of objects containing (Title, Description, Poster, Links, etc.)
* Animations are created with JavaScript using .hide(), .show(), .animate(), etc.
* Initially, there was the functionality to load more content as the user scrolls to the end of the page, but this feature has been disabled due to an API request quota limit.

