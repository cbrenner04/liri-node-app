// require keys document for twitter api use
var keys = require('./keys.js');
// require inquirer for getting user input at command line
var inquirer = require('inquirer');
// require twitter package
var Twitter = require('twitter');
// set up twitter
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});
// require spotify package
var spotify = require('spotify');
// require request package
var request = require('request');
// require fs library
var fs = require('fs');

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
        getTweets();
    // get songs if 'spotify-this-song' is selected
    } else if (answer.command === 'spotify-this-song') {
        getSong();
    // get movie if 'movie-this' is selected
    } else if (answer.command === 'movie-this') {
        getMovie();
    // if 'do-what-it-says' is selected
    } else if (answer.command === 'do-what-it-says') {
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
            }

            // get tweets if 'my-tweets' is in the file
            if (command === 'my-tweets') {
                getTweets();
            // if 'spotify-this-song'
            } else if (command === 'spotify-this-song') {
                // if a paramater is included in the file
                if (parameter) {
                    getSong(parameter);
                // otherwise this command is invalid
                } else {
                    console.log('Not a valid command.');
                }
            // if the command in the file is 'movie-this'
            } else if (command === 'movie-this') {
                // if a parameter was given
                if (parameter) {
                    getMovie(parameter);
                // otherwise set the argument to an unlikely string so default is searched
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

// tweets function
function getTweets() {
    // get most recent tweets for my username, up to 20 tweets
    client.get('statuses/user_timeline', {
        screen_name: 'cbrenner265',
        count: 20
    }, function(error, tweets, response) {
        // if there was an error log it
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }

        var output = '';

        // append each tweet to the output string
        tweets.forEach(function(tweet) {
            output += 'text: ' + tweet.text + '\ncreated: ' + tweet.created_at + '\n';
        });

        // console log the output
        console.log(output);

        // append the command and the output to the log.txt file
        fs.appendFile('log.txt', 'my-tweets ' + '\n' + output + '\n', 'utf8', function(error) {
            if (error) {
                console.log('Error occurred: ' + error);
            }
        });
    });
}

// get song function
function getSong(song) {
    // if a song was passed as an argument
    if (song) {
        searchSpotify(song);
    // otherwise get the song from the user
    } else {
        inquirer.prompt([{
            name: 'song',
            message: 'What song would you like to see details about?'
        }]).then(function(answer) {
            searchSpotify(answer.song);
        });
    }
}

// search spotify function
function searchSpotify(input) {
    // make search of the track, limit it to the first since thats all we'll use anyway
    spotify.search({
        type: 'track',
        query: input + '&limit=1'
    }, function(error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }

        var track = data.tracks.items[0];

        // set output string
        output = 'Artist: ' + track.artists[0].name + '\nName: ' + track.name +
            '\nPreview URL: ' + track.preview_url + '\nAlbum: ' + track.album.name;

        // console log output
        console.log(output);

        // append command and output to log.txt file
        fs.appendFile('log.txt', 'spotify-this-song ' + '"' + input + '"' + '\n' + output + '\n\n', 'utf8', function(error) {
            if (error) {
                console.log('Error occurred: ' + error);
            }
        });
    });
}

// get movie function
function getMovie(movie) {
    // if movie is passed as an argument
    if (movie) {
        // if it is the unlikely string, search default
        if (movie === '987654321abcdefghijklmnopqrstuvwxyz') {
            searchOmdb('mr nobody');
        // otherwise search for the movie given as argument
        } else {
            searchOmdb(movie);
        }
    // otherwise get movie input from the user
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

// search omdb
function searchOmdb(input) {
    // hit the omdb api, input is title, type is movie, and we want rotten tomatoes info
    request('http://www.omdbapi.com/?' + 't=' + input.replace(' ', '+') + '&type=movie&tomatoes=true', function(error, response, data) {
        // if error occurs, log it
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }

        // if there is no error and we get a good status code back
        if (!error && response.statusCode == 200) {
            // parse the movie data so we can easily deal with it
            var movie = JSON.parse(data);
            // set output string
            output = 'Title: ' + movie.Title + '\nYear: ' + movie.Year +
                '\nIMDB Rating: ' + movie.imdbRating + '\nCountry: ' + movie.Country +
                '\nLanguage: ' + movie.Language + '\nPlot: ' + movie.Plot + '\nActors: ' +
                movie.Actors + '\nRotten Tomatoes Rating: ' + movie.tomatoRating +
                '\nRotten Tomatoes URL: ' + movie.tomatoURL;

            // console log output
            console.log(output);

            // append command and output to log.txt
            fs.appendFile('log.txt', 'movie-this ' + '"' + input + '"' + '\n' + output + '\n\n', 'utf8', function(error) {
                if (error) {
                    console.log('Error occurred: ' + error);
                }
            });
        }
    });
}
