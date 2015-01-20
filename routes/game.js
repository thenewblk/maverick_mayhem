var Game = require('../models/game');

module.exports = function(app) {
	// Add New game
	app.post('/api/game/new', function(req, res) {
		var name = req.body.name;

		Game.create({ name: name }, function (err, game) {
		  if (err) return console.log(err);
		  res.send(game);
		});
	});

	// Display games
	app.get('/api/games/', function(req, res) {
		Game
			.find({})
			.exec( function (err, games) {
			  	if (err) return console.log(err);
				res.send(games);
		});
	});

	// Display game
	app.get('/api/game/:slug', function(req, res) {
		Game
			.findOne({ slug: req.params.slug })
			.exec( function (err, game) {
			  	if (err) return console.log(err);
				res.send(game);
		});
	});

	// Display Edit game Form
	app.get('/api/game/:slug/edit', function(req, res) {
		Game
			.findOne({ slug: req.params.slug })
			.exec( function (err, game) {
			  	if (err) { console.log(err); }
				res.send(game);
		});
	});

	// Edit game
	app.post('/api/game/:slug/edit', function(req, res) {
		tmp_game = {};
		tmp_game.name = req.body.name;

		Game
			.findOne({ slug: req.params.slug })
			.exec(function (err, game) {
			  	if (err) return console.log(err);

				game.name = tmp_game.name;

				game.save(function (err) {
					if (err) return console.log(err);
					res.send(game);
				});
			});
	});
	
	// Delete game
	app.delete('/api/game/:slug/delete', function(req, res) {
		Game
			.findOne({ slug: req.params.slug })
			.remove( function (err, game) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});
};