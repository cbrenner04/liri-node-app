// require keys document for twitter api use
var keys = require('./keys.js');
// require twitter package
var Twitter = require('twitter');
// set up twitter
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});
// require fs library
var fs = require('fs');

module.exports = TwitterVerse;

function TwitterVerse() {
    // tweets function
    this.getTweets = function() {
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
    };
}
