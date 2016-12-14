# liri-node-app

NU BootCamp Homework 8

This a command line app.

You will need node installed and the node packages specified in `package.json`.
Once node is install, just run:

```
npm install
```

To run the app:

```
node liri.js
```

You will be asked to choose from 4 commands. These are:

  * `my-tweets`
  * `spotify-this-song`
  * `movie-this`
  * `do-what-it-says`

## my-tweets

This will give you the most recent tweets for my username `cbrenner265`, up to
20 tweets.

## spotify-this-song

This will prompt you for a song and then return the following information:

  * Artist(s)
  * The song's name
  * A preview link of the song from Spotify
  * The album that the song is from

## movie-this

This will prompt you for a movie. You can also choose to just see the default
movie's information. The information it will return is:

  * Title of the movie.
  * Year the movie came out.
  * IMDB Rating of the movie.
  * Country where the movie was produced.
  * Language of the movie.
  * Plot of the movie.
  * Actors in the movie.
  * Rotten Tomatoes Rating.
  * Rotten Tomatoes URL.

## do-what-it-says

This will run the command (and parameter if there are any) in `random.txt`. This
will only work for up to 2 arguments (command, parameter) as long as they are
comma separated and follow the logic of the above three commands.

### Output

All output will be printed to the command line and appended to `log.txt`.
