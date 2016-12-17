// require fs library
var fs = require('fs');

// require TwitterVerse
var TwitterVerse = require('./the_tweets.js');
var searchForTweets = new TwitterVerse();

// require SongSearch
var SongSearch = require('./song_search.js');
var searchForSong = new SongSearch();

// require MovieSearch
var MovieSearch = require('./movie_search.js');
var searchForMovie = new MovieSearch();

module.exports = RandomSearch;

function RandomSearch() {
    // read random.txt and do as it says
    this.searchWithRandomFile = function() {
        // read the random.txt file for the command/parameters
        fs.readFile('./random.txt', 'utf8', function(error, data) {
            if (error) {
                console.log('Error occurred: ' + error);
            }

            // initialize variables at this level to use later
            var command;
            var parameter;

            // if there are more than one argument in the random.txt file
            if (data.includes(',')) {
                // split into array
                var array = data.split(',');
                // the command is the first argument
                command = array[0];
                // the parameter for the command is the second argument
                parameter = array[1].replace('\n', '');
            // otherwise its a single argument command
            } else {
                command = data.replace('\n', '');
                // set the parameter to an unlikely string
                parameter = '987654321abcdefghijklmnopqrstuvwxyz';
            }

            // get tweets if 'my-tweets' is in the file
            if (command === 'my-tweets') {
                searchForTweets.getTweets();
            // get song if 'spotify-this-song'
            } else if (command === 'spotify-this-song') {
                searchForSong.getSong(parameter);
            // get movie if the command in the file is 'movie-this'
            } else if (command === 'movie-this') {
                searchForMovie.getMovie(parameter);
            } else {
                console.log('Not a valid command.');
            }
        });
    };
}
