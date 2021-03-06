window.onload = function(){
	var albums;

	$.getJSON("http://localhost:3000/api/albums?artist=iron+maiden&callback=?",
		function(data){
			albums = data;
			console.log(albums);
		}
	).fail(function(err){
		console.log("Req failed: ", err.responseJSON);
	}).done(function(){
		new Vue({
			el: '#app',
			data: {
				albums: albums,
				searchTerm: ""
			},
			methods: {
				artwork: function(images){
					if(images.length===0){
						return "noart.png";
					} else {
						return images[1].url;
					}
				},
			},
			computed: {
				filteredAlbums: function(){
					var searchTerm = this.searchTerm.toLowerCase();
					return this.albums.filter(function (album) {
						var res = album.name.toLowerCase().search(searchTerm);
						return res != -1;
					})
				}
			},
		});
	});


}
