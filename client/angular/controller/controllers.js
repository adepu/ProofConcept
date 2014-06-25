app.controller('scraperController', function($scope, Restangular, $filter, $q){
	function success(position) { 
		var from = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var image = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
		var mapOptions = {zoom: 12, center: from}
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		var marker = new google.maps.Marker({
			position: from,
			map: map,
			title: "My location",
			icon: image
		});
		var deferred = $q.defer();
		var promise = deferred.promise;
		promise.then(function(restaurants){
			$scope.restaurants = restaurants;
		})
					Restangular.all('/localhost:8081/scrape').getList().then(function(result) {
						var restaurants = result;
						var ret = [];
						var log = [];
						deferred.resolve(angular.forEach(restaurants, function(restaurant, key){
							setTimeout(function() {
								// var hours = restaurant.hours.split('\n');
								var address = restaurant.contact.split('\u2022')[0];
								var phone = restaurant.contact.split('\u2022')[1];
								var burgerName = restaurant.burger.split(":")[0];
								var burgerDescription = restaurant.burger.split(":")[1];
								Restangular.oneUrl('maps', 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+',+Richmond,+VA').get().then(function(result){
										console.log(result);
										var lat = result.results[0].geometry.location.lat;
										var lng = result.results[0].geometry.location.lng;
										var to   = new google.maps.LatLng(lat,lng);
										var dist = google.maps.geometry.spherical.computeDistanceBetween(from, to) * 0.000621371;
										restaurant.distance = Math.round(dist * 100) / 100;
										restaurant.lat = lat;
										restaurant.lng = lng;
										var marker = new google.maps.Marker({
											position: new google.maps.LatLng(restaurant.lat,restaurant.lng),
											map: map,
											title: restaurant.name
										});
										google.maps.event.addListener(marker, 'click', function() {
								            infowindow.setContent("<h4>" + this.title + "</h4><p>"+ burgerName +"<br><small>"+ burgerDescription +"</small></p>" );
								            infowindow.open(map, this);
								        });
						});
								restaurant.address = address;
								restaurant.phone = phone;
								restaurant.burgerName = burgerName;
								restaurant.burgerDescription = burgerDescription;
					}, 100);

			}));
		});
	}
	function error(msg) {
		console.log(msg);
	}
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error);
	} else {
		error('not supported');
	}
})
