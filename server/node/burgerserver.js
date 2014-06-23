var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.get('/scrape', function(req, res){
	url = 'http://www.styleweekly.com/richmond/2014RVABurgerWeek/Page';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var restaurants = [];

			$('#storyBody table').eq(1).find('.contentImageCenter').each(function(i, element){
		        var data = $(this);
		        var restaurant = {};
		        restaurant.logo = "http://www.styleweekly.com" + data.children().first().attr("src");
		        restaurant.name = data.parent().children().next().eq(1).text();
		        restaurant.burger = data.parent().children().next().eq(2).text(); 
		        restaurant.hours = data.parent().children().next().eq(3).text(); 
		        restaurant.contact = data.parent().children().next().eq(4).text();          

                restaurants.push(restaurant);
	        });
		}
        // send to browser
        res.send(restaurants);
	})
})

var server = app.listen('8081');
console.log('Listening on port %d', server.address().port);
exports = module.exports = app;