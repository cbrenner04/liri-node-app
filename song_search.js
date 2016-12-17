// require spotify package
var spotify = require('spotify');
// require inquirer for getting user input at command line
var inquirer = require('inquirer');
// require fs library
var fs = require('fs');

module.exports = SongSearch;

function SongSearch() {
    this.getSong = function(song) {
        if (song) {
            // if it is the unlikely string, search default
            if (song === '987654321abcdefghijklmnopqrstuvwxyz') {
                searchSpotify('the sign ace of base');
            // otherwise search for the song given as argument
            } else {
                searchSpotify(song);
            }
        // otherwise get the song from the user
        } else {
            inquirer.prompt([{
                name: 'song',
                message: 'What song would you like to see details about?',
                default: 'the sign ace of base'
            }]).then(function(answer) {
                searchSpotify(answer.song);
            });
        }
    };
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
