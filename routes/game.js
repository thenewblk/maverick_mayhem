var Game = require('../models/game');

module.exports = function(app) {
	// Add New game
	app.post('/api/games/new', function(req, res) {
		var new_game = {};
		new_game.name 			= req.body.name;
		new_game.opponent 	= req.body.opponent;
		new_game.date     	= req.body.date;
		new_game.time     	= req.body.time;
		new_game.ticket   	= req.body.ticket;
		new_game.location 	= req.body.location;
		new_game.scores   	= req.body.scores;

		Game.create(new_game, function (err, game) {
		  if (err) return console.log(err);
		  res.send(game);
		});
	});

	// Display games
	app.get('/games/', function(req, res) {
		Game
			.find({})
			.exec( function (err, games) {
			  	if (err) return console.log(err);

			    res.render('games/index', {
			    	games: games
			    });
		});
	});

	app.get('/api/games/', function(req, res) {
		Game
			.find({})
			.exec( function (err, games) {
			  	if (err) return console.log(err);
				res.format({
				  // 'text/plain': function(){
				  //   res.send('hey');
				  // },

				  'html': function(){
				    res.render('games/index', {
				    	games: games
				    });
				  },

				  'json': function(){
				    res.json(games);
				  },

				  'default': function() {
				    // log the request and respond with 406
				    res.status(406).send('Not Acceptable');
				  }
				});
		});
	});

	// Display game
	app.get('/api/games/:slug', function(req, res) {
		Game
			.findOne({ slug: req.params.slug })
			.exec( function (err, game) {
			  	if (err) return console.log(err);
				res.send(game);
		});
	});

	// Display Edit game Form
	app.get('/api/games/:slug/edit', function(req, res) {
		Game
			.findOne({ slug: req.params.slug })
			.exec( function (err, game) {
			  if (err) { console.log(err); }
				res.send(game);
		});
	});

	// Edit game
	app.post('/api/games/:slug/edit', function(req, res) {
		var edit_game = {};
		edit_game.name 			= req.body.name;
		edit_game.opponent 	= req.body.opponent;
		edit_game.date     	= req.body.date;
		edit_game.time     	= req.body.time;
		edit_game.ticket   	= req.body.ticket;
		edit_game.location 	= req.body.location;
		edit_game.scores   	= req.body.scores;

		Game
			.findOne({ slug: req.params.slug })
			.exec(function (err, game) {
			  if (err) return console.log(err);

				game.name 			= edit_game.name;
				game.opponent 	= edit_game.opponent;
				game.date     	= edit_game.date;
				game.time     	= edit_game.time;
				game.ticket   	= edit_game.ticket;
				game.location 	= edit_game.location;
				game.scores   	= edit_game.scores;

				game.save(function (err) {
					if (err) return console.log(err);
					res.send(game);
				});
			});
	});
	
	// Delete game
	app.delete('/api/games/:slug/delete', function(req, res) {
		Game
			.findOne({ slug: req.params.slug })
			.remove( function (err, game) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});
};