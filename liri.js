// spotify api logic
//movie api logic
// Bands api logic
var fs = require('fs');

var dotenv = require("dotenv").config();
var keys = require('./keys.js');
var request = require('request');
var Spotify = require('node-spotify-api');




//determines terminal commands
var command = process.argv[2];
var searchKeyword = '';


for (var i =3; i < process.argv.length; i++){
  searchKeyword += process.argv[i] + '';
};


function errorCheck(responseErr){
 if(responseErr) {
 return console.log("error occured: ", responseErr)
 }
};

function startErrorFunc(responseErr){
    errorCheck();
    console.log("\nxx Log Started xx")
};

function errorFuncEnd(responseErr){
 errorCheck();
 console.log("xx Log Ended xx");
};

function findConcert(searchKeyword){
    if (searchKeyword == "") {
        searchKeyword= "drake";
        request(
            `https://rest.bandsintown.com/artists/${searchKeyword}/events?app_id=codingbootcamp`,
            (err, res, body)=>{
              
                console.log(JSON.parse(body))
                console.log(err)
            })


    }else{
        request(
            `https://rest.bandsintown.com/artists/${searchKeyword}/events?app_id=codingbootcamp`,
            (err, res, body)=>{
              let  array =[] 
              array = JSON.parse(body);
              array.forEach(element=>{
                  console.log(`
                  ---------venue name----------
                  ${element.venue.name}
                  -----------------------------
                  `)
              })

                console.log(err)
            })
    }
}



function findSong (searchKeyword) {


    if (searchKeyword == "") {
searchKeyword == "This Is America";
    }



    var spotify = new Spotify(keys.spotify);

   var searchLimit = "";


   if (isNaN(parseInt(process.argv[3])) == false){
       searchLimit = process.argv[3]
   
   
console.log("\nYou requested to return: " + searchLimit + " songs");

   



searchKeyword = '';

for (var i = 4; i < process.argv.length; i++){
searchKeyword += process.argv[i] + ' ';
};

}else{
    console.log("\nFor more than 1 result, add the number of results you would like to be returned after spotify-this-song.\n\nExample: if you would like 3 results returned enter:\n     node.js spotify-this-song 3 Kissed by a Rose")
    searchLimit = 1;
}

spotify.search({ type: 'track', query: searchKeyword, limit: searchLimit }, function(respError, response) {

    fs.appendFile("log.txt", "-----Spotify Log Entry Start-----\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n", startErrorFunc());

    errorCheck();

    var songResp = response.tracks.items;

    for (var i = 0; i < songResp.length; i++) {
        console.log("\n=============== Spotify Search Result "+ (i+1) +" ===============\n");
        console.log(("Artist: " + songResp[i].artists[0].name));
        console.log(("Song title: " + songResp[i].name));
        console.log(("Album name: " + songResp[i].album.name));
        console.log(("URL Preview: " + songResp[i].preview_url));
        console.log("\n=========================================================\n");

        fs.appendFile("log.txt", "\n========= Result "+ (i+1) +" =========\nArtist: " + songResp[i].artists[0].name + "\nSong title: " + songResp[i].name + "\nAlbum name: " + songResp[i].album.name + "\nURL Preview: " + songResp[i].preview_url + "\n=============================\n", errorFunction());
    }

    fs.appendFile("log.txt","-----Spotify Log Entry End-----\n\n", errorFuncEnd());
})
};

// ++++++++++++++++++++ OMDB movie-this +++++++++++++++++++++++++
function findMovie(searchKeyword) {

// Default search value if no movie is given
if (searchKeyword == "") {
    searchKeyword = "Mr. Nobody";
}

var queryUrl = "http://www.omdbapi.com/?t=" + searchKeyword.trim() + "&y=&plot=short&apikey=trilogy";

request(queryUrl, function(respError, response, body) {

    fs.appendFile("log.txt", "-----OMDB Log Entry Start-----\n\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n\n", startErrorFunc());

    errorCheck();

    if (JSON.parse(body).Error == 'Movie not found!' ) {

        console.log("\nI'm sorry, I could not find any movies that matched the title " + searchKeyword + ". Please check your spelling and try again.\n")

        fs.appendFile("log.txt", "I'm sorry, I could not find any movies that matched the title " + searchKeyword + ". Please check your spelling and try again.\n\n-----OMDB Log Entry End-----\n\n", errorFuncEnd());
    
    } else {

        movieBody = JSON.parse(body);

        console.log("\n++++++++++++++++ OMDB Search Results ++++++++++++++++\n");
        console.log("Movie Title: " + movieBody.Title);
        console.log("Year: " + movieBody.Year);
        console.log("IMDB rating: " + movieBody.imdbRating);

        // If there is no Rotten Tomatoes Rating
        if (movieBody.Ratings.length < 2) {

            console.log("There is no Rotten Tomatoes Rating for this movie.")

            fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: There is no Rotten Tomatoes Rating for this movie \nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n", errorCheck());
            
        } else {

            console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);

            fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value + "\nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n", errorCheck());
        }
        
        console.log("Country: " + movieBody.Country);
        console.log("Language: " + movieBody.Language);
        console.log("Plot: " + movieBody.Plot);
        console.log("Actors: " + movieBody.Actors);
        console.log("\n+++++++++++++++++++++++++++++++++++++++++++++++++\n");
        console.log("xxxx Log Ended xxxx");
    };      
});
};

// xxxxxxxxxxxxxxxxxx Random do-what-it-says xxxxxxxxxxxxxxxxxxxxxx
function randomSearch() {

fs.readFile("random.txt", "utf8", function(respError, data) {

    var randomArray = data.split(", ");

    errorCheck();

    if (randomArray[0] == "spotify-this") {
        findSong(randomArray[1]);
    } else if (randomArray[0] == "movie-this") {
        findMovie(randomArray[1]);
    } else if(randomArray[0] == "concert-this") {
        findConcert(randomArray[1]);
    }
});
};

// <<<<<<<<<<<<<<<<< Main Switch Case >>>>>>>>>>>>>>>>>>>>

// Runs corresponding function based on user command
switch (command) {

case "spotify-this":
    findSong(searchKeyword);
    break;
case "movie-this":
    findMovie(searchKeyword);
    break;
case "concert-this":
    findConcert(searchKeyword);
    break;
default:
    console.log("\nI'm sorry, " + command + " is not a command that I recognize. Please try one of the following commands: \n\n  1. For a random search: node liri.js do-what-it-says \n\n  2. To search a movie title: node liri.js movie-this (with a movie title following) \n\n  3. To search Spotify for a song: node liri.js spotify-this-song (*optional number for amount of returned results) (specify song title)\n     Example: node liri.js spotify-this-song 15 Candle in the Wind\n\n \n");
};




// function fetchMovie (){
//  var queryURL = "http://www.omdbapi.com/?t=";
//  request(queryUrl, function(error, response, body) {


// };


// function fetchSong(){



// };


// function ConcertTimes(){



// };