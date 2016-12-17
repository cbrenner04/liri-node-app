// require inquirer for getting user input at command line
var inquirer = require('inquirer');

// require TwitterVerse
var TwitterVerse = require('./the_tweets.js');
var searchForTweets = new TwitterVerse();

// require SongSearch
var SongSearch = require('./song_search.js');
var searchForSong = new SongSearch();

// require MovieSearch
var MovieSearch = require('./movie_search.js');
var searchForMovie = new MovieSearch();

// require RandomSearch
var RandomSearch = require('./random_search.js');
var randomFile = new RandomSearch();

// get user input
inquirer.prompt([{
    name: 'command',
    message: 'What would you like to do?',
    type: 'list',
    choices: [{
        name: 'my-tweets',
        short: 'display the last 20 tweets'
    }, {
        name: 'spotify-this-song',
        short: 'prompt for a song and then show the details about that song'
    }, {
        name: 'movie-this',
        short: 'prompt for a movie and then show details about that movie'
    }, {
        name: 'do-what-it-says',
        short: 'run the command in random.txt'
    }]
    // once user input is received
}]).then(function(answer) {
    // get tweets if 'my-tweets is selected'
    if (answer.command === 'my-tweets') {
        searchForTweets.getTweets();
        // get songs if 'spotify-this-song' is selected
    } else if (answer.command === 'spotify-this-song') {
        searchForSong.getSong();
        // get movie if 'movie-this' is selected
    } else if (answer.command === 'movie-this') {
        searchForMovie.getMovie();
        // if 'do-what-it-says' is selected
    } else if (answer.command === 'do-what-it-says') {
        randomFile.searchWithRandomFile();
    } else {
        console.log('Please select a valid command.');
    }
});
