// require inquirer for getting user input at command line
var inquirer = require('inquirer');
// require request package
var request = require('request');
// require fs library
var fs = require('fs');

module.exports = MovieSearch;

function MovieSearch() {
    // get movie function
    this.getMovie = function(movie) {
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
    };
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
