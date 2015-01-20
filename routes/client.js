var Client = require('../models/client');

module.exports = function(app) {
	// Add New client
	app.post('/api/client/new', function(req, res) {
		var name = req.body.name;

		Client.create({ name: name}, function (err, client) {
		  if (err) return console.log(err);
		  	res.send(client);
		});
	});

	// Display clients
	app.get('/api/client/', function(req, res) {
		Client
			.find({})
			.exec( function (err, clients) {
			  	if (err) return console.log(err);
				res.send(clients);
		});
	});

	// Display client
	app.get('/api/client/:slug', function(req, res) {
		Client
			.findOne({ slug: req.params.slug })
			.exec( function (err, client) {
			  	if (err) return console.log(err);
				res.send(client);
		});
	});

	// Delete client
	app.delete('/api/client/:slug/delete', function(req, res) {
		Client
			.findOne({ slug: req.params.slug })
			.remove( function (err, client) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});

	// Display Edit client Form
	app.get('/api/client/:slug/edit', function(req, res) {
			client
				.findOne({ slug: req.params.slug })
				.exec( function (err, client) {
				  	if (err) { console.log(err); }
					res.send(client);
			});
	});

	// Edit client
	app.post('/api/client/:slug/edit', function(req, res) {
		tmp_client = {};
		tmp_client.name = req.body.name;

		Client
			.findOne({ slug: req.params.slug })
			.exec(function (err, client) {
			  	if (err) return console.log(err);

				client.name = tmp_client.name;

				client.save(function (err) {
					if (err) return console.log(err);
					res.send(client);
				});
			});
	});
};