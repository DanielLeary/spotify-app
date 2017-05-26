window.onload = function(){
	var albums;

	$.get("http://localhost:3000/api/albums?artist=iron+maiden",
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
				filteredAlbums: albums,
				searchTerm: ""
			},
			methods: {
				artwork: function(images){
					if(images.length===0){
						return "noart.png";
					} else {
						return images[1].url;
					}
				}
			},
			watch: {
				searchTerm: function(){
					var searchTerm = this.searchTerm.toLowerCase();
					this.filteredAlbums = albums.filter(function (album) {
						var res = album.name.toLowerCase().search(searchTerm);
						return res != -1;
					})
				}
			}
		});
	});


}
