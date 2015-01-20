var Sport = require('../models/sport');
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send(false);
}

module.exports = function(app, passport) {

	// Add New sport
	app.post('/api/sport/new', isLoggedIn, function(req, res) {
		var name = req.body.name;

		Sport.create({ name: name}, function (err, sport) {
		  if (err) return console.log(err);
		  	res.send(sport);
		});
	});

	// Display sports
	app.get('/api/sport/', function(req, res) {
		Sport
			.find({})
			.exec( function (err, sports) {
			  	if (err) return console.log(err);
				res.send(sports);
		});
	});

	// Display sport
	app.get('/api/sport/:slug', function(req, res) {
		Sport
			.findOne({ slug: req.params.slug })
			.exec( function (err, sport) {
			  	if (err) return console.log(err);
				res.send(sport);
		});
	});

	// Delete sport
	app.delete('/api/sport/:slug/delete', isLoggedIn, function(req, res) {
		Sport
			.findOne({ slug: req.params.slug })
			.remove( function (err, sport) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});

	// Display Edit sport Form
	app.get('/api/sport/:slug/edit', isLoggedIn, function(req, res) {
			Sport
				.findOne({ slug: req.params.slug })
				.exec( function (err, sport) {
				  	if (err) { console.log(err); }
					res.send(sport);
			});
	});

	// Edit sport
	app.post('/api/sport/:slug/edit', isLoggedIn, function(req, res) {
		tmp_sport = {};
		tmp_sport.name = req.body.name;

		Sport
			.findOne({ slug: req.params.slug })
			.exec(function (err, sport) {
			  	if (err) return console.log(err);

				sport.name = tmp_sport.name;

				sport.save(function (err) {
					if (err) return console.log(err);
					res.send(sport);
				});
			});
	});
};