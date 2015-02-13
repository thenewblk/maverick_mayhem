var Matchup = require('../models/matchup'),
	util = require('util');
module.exports = function(app, passport) {
	// Add New matchup
	app.post('/api/matchups/new', isLoggedIn, function(req, res) {
		var new_matchup = {};
		new_matchup.name 		= req.body.name;
		new_matchup.opponent 	= req.body.opponent;
		new_matchup.date     	= req.body.date;
		new_matchup.time     	= req.body.time;
		new_matchup.ticket   	= req.body.ticket;
		new_matchup.location 	= req.body.location;
		new_matchup.scores   	= req.body.scores;
		new_matchup.games   	= req.body.games;
		
		if ( req.body.photos ) {
			var tmp_photos = [];
			for ( i in req.body.photos ) {
				tmp_photos.push(req.body.photos[i]._id);
			}	
			new_matchup.photos   	= tmp_photos;
		}

		Matchup.create(new_matchup, function (err, matchup) {
		  if (err) return console.log(err);
		  res.send(matchup);
		});
	});

	// Display matchups
	app.get('/matchups/', function(req, res) {
		Matchup
			.find({})
			.exec( function (err, matchups) {
			  	if (err) return console.log(err);

			    res.render('matchups/index', {
			    	matchups: matchups
			    });
		});
	});

	app.get('/api/matchups/', isLoggedIn, function(req, res) {
		Matchup
			.find({})
			.exec( function (err, matchups) {
			  	if (err) return console.log(err);
				res.format({
				  // 'text/plain': function(){
				  //   res.send('hey');
				  // },

				  'html': function(){
				    res.render('matchups/index', {
				    	matchups: matchups
				    });
				  },

				  'json': function(){
				    res.json(matchups);
				  },

				  'default': function() {
				    // log the request and respond with 406
				    res.status(406).send('Not Acceptable');
				  }
				});
		});
	});

	// Display matchup
	app.get('/api/matchups/:slug', isLoggedIn, function(req, res) {
		Matchup
			.findOne({ slug: req.params.slug })
			.populate('photos')
			.exec( function (err, matchup) {
			  	if (err) return console.log(err);
				res.send(matchup);
		});
	});

	// Display Edit matchup Form
	app.get('/api/matchups/:slug/edit', isLoggedIn, function(req, res) {
		Matchup
			.findOne({ slug: req.params.slug })
			.exec( function (err, matchup) {
			  if (err) { console.log(err); }
				res.send(matchup);
		});
	});

	// Edit matchup
	app.post('/api/matchups/:slug/edit', isLoggedIn, function(req, res) {
		var edit_matchup = {};
		edit_matchup.name 		= req.body.name;
		edit_matchup.opponent 	= req.body.opponent;
		edit_matchup.date     	= req.body.date;
		edit_matchup.time     	= req.body.time;
		edit_matchup.ticket   	= req.body.ticket;
		edit_matchup.home   	= req.body.home;
		edit_matchup.location 	= req.body.location;
		edit_matchup.scores   	= req.body.scores;
		edit_matchup.games   	= req.body.games;

		if ( req.body.photos ) {
			var tmp_photos = [];
			for ( i in req.body.photos ) {
				tmp_photos.push(req.body.photos[i]._id);
			}	
			edit_matchup.photos   	= tmp_photos;
		}

		Matchup
			.findOne({ slug: req.params.slug })
			.exec(function (err, matchup) {
			  if (err) return console.log(err);

				matchup.name 		= edit_matchup.name;
				matchup.opponent 	= edit_matchup.opponent;
				matchup.date     	= edit_matchup.date;
				matchup.time     	= edit_matchup.time;
				matchup.home     	= edit_matchup.home;
				matchup.ticket   	= edit_matchup.ticket;
				matchup.location 	= edit_matchup.location;
				matchup.games   	= edit_matchup.games;
				matchup.scores   	= edit_matchup.scores;
				matchup.photos   	= edit_matchup.photos;

				matchup.save(function (err) {
					if (err) return console.log(err);
					Matchup
						.findOne({ slug: matchup.slug })
						.populate('photos')
						.exec( function (err, new_matchup) {
							res.send(new_matchup);
						});
				});
			});
	});
	
	// Delete matchup
	app.delete('/api/matchups/:slug/delete', isLoggedIn, function(req, res) {
		Matchup
			.findOne({ slug: req.params.slug })
			.remove( function (err, matchup) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send(false);
}