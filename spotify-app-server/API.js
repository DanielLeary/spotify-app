const express = require('express');
var request = require('request-promise');

const router = express.Router();

// Get all of an artist's albums
router.get('/albums', function(req,res,next){
	//first search spotify for artist ID
	searchArtist(req.query.artist)
		.then(function(foundArtist){
			//now that we have artist id, get albums by artist
			var artistId = foundArtist.id;
			return request({
			    uri: 'https://api.spotify.com/v1/artists/'+artistId+'/albums',
			    qs: {
					limit: 50,
					type: 'artist'
			    },
				json: true,
				resolveWithFullResponse: true
			})
		})
		.then(function(albums){
			// and finally process and return the albums
			var dedupedAlbums = dedup(albums.body.items);
			logAlbNames(dedupedAlbums);
			//console.log(JSON.stringify(dedupedAlbums, null, 4));
			res.json(dedupedAlbums);
		})
		.catch(function(error){
			//request() defaults to catch for non 200 status codes
			if(error.response) {
				console.log(error.response.body);
				res.status(error.statusCode).json(error.response.body);
			} else {
				console.log(error);
				res.status(500).json(error);
			}
		});
});

function searchArtist(artist){
	return request({
			uri: 'https://api.spotify.com/v1/search',
			qs: {
				limit: 1,
				type: 'artist',
				query: artist
			},
			json: true,
			resolveWithFullResponse: true
		})
		.then(function(foundArtist){
			// return first result
			if (foundArtist.body.artists.total == 0){
				throw "Error: can't find artist";
			} else {
			return foundArtist.body.artists.items[0];
			}
		})
		.catch(function(error){
			throw error;
		});
}

// To lower case and removes brackets
function normaliseName(string){
	var str = string.toLowerCase().split(" (");
	return str[0];
}

// returns the first element in array with name (normalized)
function findFirstElemWithName(name, arr){
	for (i=0; i<arr.length; ++i){
		if (normaliseName(arr[i].name) == normaliseName(name)){
			return arr[i];
		}
	}
}

// Finds first element in arr with name, and deletes all elements after with same name
function dedup(arr){
	return deduped = arr.filter(function (element, i, arr) {
		var elem1 = findFirstElemWithName(element.name, arr);
		return arr.indexOf(elem1) === i;
	});
}

function logAlbNames(albums){
	for (i=0;i<albums.length;++i){
		console.log(albums[i].name);
	}
}


/*
// Get an artist via a search querystring in URL
router.get('/search/artist', function(req,res,next){
	searchArtist(req.query.query)
		.then(function(artist){
			res.json(artist);
		})
		.catch(function(error){
			res.status(500).json(error.body)
		});
});
*/


module.exports = router;
