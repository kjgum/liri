var fs = require("fs");
var twitterKeys = require("./keys.js");
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var params = process.argv.slice(2);
var welcomeMsg = 
  "\r\n" +
  "Hey there! I am LIRI. I can give you song information, movie information, a person's latest tweets, or do something for you."  + "\r\n\r\n" +
  "What would you like me to do?" + "\r\n\r\n" +
  "Type one of the following: " + "\r\n\r\n" +
  "node liri.js tweets 'twitter handle'" + "\r\n\r\n" + 
  "node liri.js song 'song name'" + "\r\n\r\n" + 
  "node liri.js movie 'movie name'" + "\r\n\r\n" +
  "node liri.js do" + "\r\n";
var defaultMsg = 
  "\r\n" +
  "Invalid response. Please try again." + "\r\n\r\n" +
  "What would you like me to do?" + "\r\n\r\n" +
  "Type one of the following: " + "\r\n\r\n" +
  "node liri.js tweets 'twitter handle'" + "\r\n\r\n" + 
  "node liri.js song 'song name'" + "\r\n\r\n" + 
  "node liri.js movie 'movie name'" + "\r\n\r\n" +
  "node liri.js do" + "\r\n";

switch(params[0]) {

  case undefined: // User enters nothing after 'node liri.js'
  case "hello":
  case "hi":
  case "hey":
  case "hey liri":
    console.log(welcomeMsg);
    break;

  case "tweets":
  case "twitter":
  case "my-tweets":
    twitterCall(params[1]);
    break;

  case "song":
  case "spotify":
  case "spotify-this-song":
    if(params[1]) {
      spotifyCall(params[1]);
    } 
    else {
      spotifyCall("Blink 182 - What's My Age Again");
    }
    break;

  case "movie":
  case "movie-this":
    if(params[1]) {
      movieCall(params[1]);
    }
    else {
      if(params[1] === undefined) {
        params[1] = "Mr. Nobody";
        movieCall();
      }
    }
    break;

  case "do":
  case "do-what-it-says":
    doCall(params[1]);
    break;

  default:
    console.log(defaultMsg);

} // End Switch Statement

function twitterCall() {
  var client = new twitter({
    consumer_key: twitterKeys.twitterKeys.consumer_key,
    consumer_secret: twitterKeys.twitterKeys.consumer_secret,
    access_token_key:  twitterKeys.twitterKeys.access_token_key,
    access_token_secret: twitterKeys.twitterKeys.access_token_secret   
  });
  var twitterHandle = 'kjgum';
  twitterHandle = params[1];
  params = {screen_name: twitterHandle};
  client.get('statuses/user_timeline', params, function(error, data, response){
    if(error) {
      throw error;
    }
    for(var i = 0; i < data.length; i++) {
      var twitterResults = 
        "@" + data[i].user.screen_name + ": " + 
        data[i].text + "\r\n" + 
        data[i].created_at + "\r\n" + 
        "------- End Tweet -------" + "\r\n\r\n";
      console.log(twitterResults);
      logData(twitterResults);
    }
  })
}; // End twitterCall()

function spotifyCall(songName) {
  spotify.search({ type: 'track', query: songName }, function(error, data) {
    if(error) {
      console.log('Error occurred: ' + error);
      return;
    }
    var albumInfo = data.tracks.items[0];
    var spotifyResults = 
      "Artist: " + albumInfo.artists[0].name + "\r\n" +
      "Track Name: " + albumInfo.name + "\r\n" +
      "Album: " + albumInfo.album.name + "\r\n" +
      "Preview Link: " + albumInfo.preview_url + "\r\n\r\n";
    console.log(spotifyResults);
    logData(spotifyResults);
  })
}; // End spotifyCall()

function movieCall() {
  var omdbApi = 'http://www.omdbapi.com/?t=';
  var movie = params[1];
  var omdbParameters = '&y=&plot=short&r=json&tomatoes=true';
  var omdbUrl = omdbApi + movie + omdbParameters
  request(omdbUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movieResults = 
        "Title: " + JSON.parse(body)["Title"] + "\r\n" +
        "Year: " + JSON.parse(body)["Year"] + "\r\n" +
        "Country: " + JSON.parse(body)["Country"] + "\r\n" +
        "Language: " + JSON.parse(body)["Language"] + "\r\n" +
        "Rated: " + JSON.parse(body)["Rated"] + "\r\n" +
        "Released: " + JSON.parse(body)["Released"] + "\r\n" +
        "Genre: " + JSON.parse(body)["Genre"] + "\r\n" +
        "Director: " + JSON.parse(body)["Director"] + "\r\n" +
        "Writer: " + JSON.parse(body)["Writer"] + "\r\n" +
        "Actors: " + JSON.parse(body)["Actors"] + "\r\n" +
        "Plot: " + JSON.parse(body)["Plot"] + "\r\n" +
        "IMDB Rating: " + JSON.parse(body)["imdbRating"] + "\r\n" +
        "Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"] + "\r\n" +
        "Rotten Tomato URL: " + JSON.parse(body)["tomatoURL"] + "\r\n\r\n";
      console.log(movieResults);
      logData(movieResults);
    }
  })
}; // End movieCall()

function doCall() {
  fs.readFile("./random.txt", "utf8", function(error, data) {
    if(error) {
      console.log('Error occurred: ' + error);
      return;
    }
    data = data.split(',');
    spotifyCall(data[1]);
  })
}; // End doCall()

function logData(logEntry) {
  fs.appendFile("./log.txt", logEntry, (error) => {
    if(error) {
      throw error;
    }
  });
} // End logData()