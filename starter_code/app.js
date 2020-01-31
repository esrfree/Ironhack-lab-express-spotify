require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

//require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
app.get('/', ( req, res ) => {
  return res.render('index')  
});

app.get("/artist", ( req, res ) => {
  spotifyApi
    .searchArtists(req.query.name)
    .then(data => {
      const respFromDB = data.body.artists.items;
      res.render('./artists', {respFromDB})
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
})

app.get('/album/:id', ( req, res ) => {
  spotifyApi
  .getArtistAlbums( req.params.id.substring(1) )
  .then(data => {
    const albums = data.body.items;
    res.render('./album', {albums})
  })
  .catch( err => console.log('The error while searching albums occurred: ', err))
})

app.get('/tracks/:id', ( req, res ) => {
  spotifyApi
  .getAlbumTracks( req.params.id.substring(1) )
  .then(data => {
    const albumTracks = data.body.items;
    res.render('./tracks', {albumTracks})
  })
  .catch( err => console.log('The error while searching albums occurred: ', err))
})



app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
