require("dotenv").config();
var fs = require("fs");
var axios = require('axios');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var action = process.argv[2].toLowerCase();
var searchMovie = process.argv.slice(3).join("+");
var searchConcert = process.argv.slice(3).join("%20");
var display = process.argv.slice(3).join(" ");
var searchTerm = process.argv.slice(3);
var seperate = "===========================================";
var log = "";

function spotifySearch() {
    
    console.log(`\n${seperate}\nSPOTIFY RESULTS FOR: ${display}\n${seperate}\n`);
    fs.appendFile("log.txt", `\n${seperate}\n SPOTIFY RESULTS FOR: ${display}\n${seperate}\n`, function (err) {
        if (err) throw err;
      });
    if(!searchTerm){
        searchTerm = "Closer to Fine";
    }
    spotify.search({
        type: "track",
        query: searchTerm,
        limit: 3,
    }, function(err,data) {
        if(err) {
            return console.log("Error occurred: " + err);
        }
        for (var i = 0; i < data.tracks.items.length; i++) {
        
        console.log(`..........\nArtist: ${data.tracks.items[i].artists[0].name}\nSong Name: ${data.tracks.items[i].name}\nSpotify Preview Link: ${data.tracks.items[i].preview_url}\nAlbum: ${data.tracks.items[i].album.name}\n\n`);
        log = `..........\nArtist: ${data.tracks.items[i].artists[0].name}\nSong Name: ${data.tracks.items[i].name}\nSpotify Preview Link: ${data.tracks.items[i].preview_url}\nAlbum: ${data.tracks.items[i].album.name}\n\n`;
        
        fs.appendFile("log.txt", log, function (err) {
            if (err) throw err;
          });
    }
    })
 };

function omdbSearch() {
    axios.get("http://www.omdbapi.com/?apikey=1557ce71&t=" + searchMovie)
        .then(function (response) {
            console.log(`..........\nTitle: ${response.data.Title}\nYear: ${response.data.Year}\nIMDB Rating: ${response.data.imdbRating}\nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}\nCountry: ${response.data.Country}\nLanguage: ${response.dataLanguage}\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}\n..........\n`);
            log = `\n${seperate}\nOMDB RESULTS FOR: ${display}\n${seperate}\n..........\nTitle: ${response.data.Title}\nYear: ${response.data.Year}\nIMDB Rating: ${response.data.imdbRating}\nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}\nCountry: ${response.data.Country}\nLanguage: ${response.dataLanguage}\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}\n..........\n`;

            fs.appendFile("log.txt", log, function (err) {
                if (err) throw err;
              });
        })
        .catch(function (error) {
            console.log(error);
        })
    console.log(`\n${seperate}\nOMDB RESULTS FOR: ${display}\n${seperate}\n`);
 };

function concertSearch() {
   console.log(`\n${seperate}\nUPCOMING CONCERTS FOR: ${display}\n${seperate}\n`);
   axios.get("https://rest.bandsintown.com/artists/" + searchConcert + "/events?app_id=codingbootcamp").then(function (response) {
    fs.appendFile("log.txt", `\n${seperate}\nUPCOMING CONCERTS FOR: ${display}\n${seperate}\n`, function (err) {
        if (err) throw err;
      }); 
   for (var i = 0; i <response.data.length; i++) {
       var dateTimeArray = response.data[i].datetime.split("T");
       var date = moment(dateTimeArray[0], "YYYY-MM-DD").format("LL");
        console.log(`..........\nVenue: ${response.data[i].venue.name}\nLocation: ${response.data[i].venue.city}, ${response.data[i].venue.region}, ${response.data[i].venue.country}\nDate: ${date}\n\n`);
        var log = `..........\nVenue: ${response.data[i].venue.name}\nLocation: ${response.data[i].venue.city}, ${response.data[i].venue.region}, ${response.data[i].venue.country}\nDate: ${date}\n\n`;
        
        fs.appendFile("log.txt", log, function (err) {
            if (err) throw err;
          });
          
    }; 
   });
};


function doWhatItSays() {
   fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
        return console.log(err);
    }
    var dataArray = data.split(",");
    action = dataArray[0].toLowerCase();
    searchTerm = dataArray[1].replace(/"/g, '').toLowerCase();
    searchMovie = searchTerm.replace(/ /g, "+");
    searchConcert = searchTerm.replace(/ /g, "%20");
    display = dataArray[1].replace(/"/g, '');
    
    switch(action) {
        case "spotify-this-song":
            spotifySearch();
            break;
        case "movie-this":
            omdbSearch();
            break;
        case "concert-this":
            concertSearch();
            break;
        default:
            return console.log("Choose a valid action");
     };

});
};

switch(action) {
   case "spotify-this-song":
       spotifySearch();
       break;
   case "movie-this":
       omdbSearch();
       break;
   case "concert-this":
       concertSearch();
       break;
    case "do-what-it-says":
        doWhatItSays();
        break;
   default:
       return console.log("Choose a valid action");
};


