	app.controller('scraperController', function($scope, Restangular, $filter, $q){
		function success(position) { 
				// stackoverflow: distance between 2 geo locations
				var from = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				var mapOptions = {zoom: 11, center: from}
				var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
				var deferred = $q.defer();
				var promise = deferred.promise;
				var orderBy = $filter('orderBy');
				promise.then(function(restaurants){
					/**
					angular.forEach(restaurants, function(restaurant, key){
						console.log(restaurants[key].distance);
					})
					restaurants = orderBy(restaurants, 'distance', false)
					console.log(restaurants);
					*/
					$scope.restaurants = restaurants;
				})
				/*
				.then(function($scope.restaurants){
					console.log($scope.restaurants)
					var topRestaurants = orderBy($scope.restaurants, 'distance', false);
					angular.forEach(topRestaurants, function(restaurant, key){
						if(key < 5){
							var marker = new google.maps.Marker({
									position: new google.maps.LatLng(restaurant.lat,restaurant.lng),
									map: map,
									title: 'restaurant.name'
							});
						}
					})

				})
				*/

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
									var lat = result.results[0].geometry.location.lat;
									var lng = result.results[0].geometry.location.lng;
									var to   = new google.maps.LatLng(lat,lng);
									var dist = google.maps.geometry.spherical.computeDistanceBetween(from, to) * 0.000621371;			
									restaurant.distance = Math.round(dist * 100) / 100;
									restaurant.distance = dist;
									restaurant.lat = lat;
									restaurant.lng = lng;
									var marker = new google.maps.Marker({
									position: new google.maps.LatLng(restaurant.lat,restaurant.lng),
									map: map,
									title: 'restaurant.name'
							});
					setTimeout(function() {
						// var hours = restaurant.hours.split('\n');
						var address = restaurant.contact.split('\u2022')[0];
						var phone = restaurant.contact.split('\u2022')[1];
						var burgerName = restaurant.burger.split(":")[0];
						var burgerDescription = restaurant.burger.split(":")[1];
						Restangular.oneUrl('maps', 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+',+Richmond,+VA').get().then(function(result){
								var lat = result.results[0].geometry.location.lat;
								var lng = result.results[0].geometry.location.lng;
								var to   = new google.maps.LatLng(lat,lng);
								var dist = google.maps.geometry.spherical.computeDistanceBetween(from, to) * 0.000621371;
										console.log(dist);
								restaurant.distance = Math.round(dist * 100) / 100;
								//console.log(dist);
								restaurant.distance = Math.round(dist * 100) / 100;
								restaurant.distance = dist;
								restaurant.lat = lat;
								restaurant.lng = lng;
 
						});
						// restaurant.hours = hours;
						restaurant.address = address;
						restaurant.phone = phone;
						restaurant.burgerName = burgerName;
						restaurant.burgerDescription = burgerDescription;
					}, 100);
				}))

																});
						}, 100);
					}))

					//$scope.restaurants = restaurants;
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
