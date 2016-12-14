var keys = require('./keys.js');
var inquirer = require('inquirer');
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

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
}]).then(function(answer) {
    if (answer.command === 'my-tweets') {
        getTweets();
    } else if (answer.command === 'spotify-this-song') {
        getSong();
    } else if (answer.command === 'movie-this') {
        getMovie();
    } else if (answer.command === 'do-what-it-says') {
        fs.readFile('./random.txt', 'utf8', function(error, data) {
            if (error) {
                console.log('Error occurred: ' + error);
            }

            var command;
            var parameter;

            if (data.includes(',')) {
                var array = data.split(',');
                command = array[0];
                parameter = array[1].replace('\n', '');
            } else {
                command = data.replace('\n', '');
            }

            if (command === 'my-tweets') {
                getTweets();
            } else if (command === 'spotify-this-song') {
                getSong(parameter);
            } else if (command === 'movie-this') {
                if (parameter) {
                    getMovie(parameter);
                } else {
                    getMovie('987654321abcdefghijklmnopqrstuvwxyz');
                }
            } else {
                console.log('Not a valid command.');
            }
        });
    } else {
        console.log('Please select a valid command.');
    }
});

function getTweets() {
    client.get('statuses/user_timeline', {
        screen_name: 'cbrenner265',
        count: 20
    }, function(error, tweets, response) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }

        tweets.forEach(function(tweet) {
            console.log('text: ' + tweet.text + '\ncreated: ' + tweet.created_at);
        });
    });
}

function getSong(song) {
    if (song) {
        searchSpotify(song);
    } else {
        inquirer.prompt([{
            name: 'song',
            message: 'What song would you like to see details about?'
        }]).then(function(answer) {
            searchSpotify(answer.song);
        });
    }
}

function searchSpotify(input) {
    spotify.search({
        type: 'track',
        query: input + '&limit=1'
    }, function(error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }

        var track = data.tracks.items[0];
        console.log('Artist: ' + track.artists[0].name);
        console.log('Name: ' + track.name);
        console.log('Preview URL: ' + track.preview_url);
        console.log('Album: ' + track.album.name);
    });
}

function getMovie(movie) {
    if (movie) {
        if (movie === '987654321abcdefghijklmnopqrstuvwxyz') {
            searchOmdb('mr nobody');
        } else {
            searchOmdb(movie);
        }
    } else {
        inquirer.prompt([{
            name: 'movie',
            message: 'What movie would you like to see details about?',
            default: 'mr nobody'
        }]).then(function(answer) {
            searchOmdb(answer.movie);
        });
    }
}

function searchOmdb(input) {
    request('http://www.omdbapi.com/?' + 't=' + input.replace(' ', '+') +
        '&type=movie&tomatoes=true',
        function(error, response, data) {
            if (error) {
                console.log('Error occurred: ' + error);
                return;
            }

            if (!error && response.statusCode == 200) {
                var movie = JSON.parse(data);
                console.log('Title: ' + movie.Title);
                console.log('Year: ' + movie.Year);
                console.log('IMDB Rating: ' + movie.imdbRating);
                console.log('Country: ' + movie.Country);
                console.log('Language: ' + movie.Language);
                console.log('Plot: ' + movie.Plot);
                console.log('Actors: ' + movie.Actors);
                console.log('Rotten Tomatoes Rating: ' + movie.tomatoRating);
                console.log('Rotten Tomatoes URL: ' + movie.tomatoURL);
            }
        });
}