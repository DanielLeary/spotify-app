
var albums;

$.get("http://localhost:3000/api/albums?artist=iron+maiden",
	function(data){
		albums = data;
		console.log(albums);
		console.log(albums[0]);
	}
).fail(function(){
	console.log("Ajax API call failed");
}).done(function(){
	new Vue({
		el: '#app',
		data: {
			filteredAlbums: albums,
			searchTerm: ""
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
})
