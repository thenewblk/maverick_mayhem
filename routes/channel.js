var Channel = require('../models/channel');

module.exports = function(app) {
	// Add New channel
	app.post('/api/channel/new', function(req, res) {
		var name = req.body.name;

		Channel.create({ name: name}, function (err, channel) {
		  if (err) return console.log(err);
		  	res.send(channel);
		});
	});

	// Display channels
	app.get('/api/channel/', function(req, res) {
		Channel
			.find({})
			.exec( function (err, channels) {
			  	if (err) return console.log(err);
				res.send(channels);
		});
	});

	// Display channel
	app.get('/api/channel/:slug', function(req, res) {
		Channel
			.findOne({ slug: req.params.slug })
			.exec( function (err, channel) {
			  	if (err) return console.log(err);
				res.send(channel);
		});
	});

	// Delete channel
	app.delete('/api/channel/:slug/delete', function(req, res) {
		Channel
			.findOne({ slug: req.params.slug })
			.remove( function (err, channel) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});

	// Display Edit channel Form
	app.get('/api/channel/:slug/edit', function(req, res) {
			Channel
				.findOne({ slug: req.params.slug })
				.exec( function (err, channel) {
				  	if (err) { console.log(err); }
					res.send(channel);
			});
	});

	// Edit channel
	app.post('/api/channel/:slug/edit', function(req, res) {
		tmp_channel = {};
		tmp_channel.name = req.body.name;

		Channel
			.findOne({ slug: req.params.slug })
			.exec(function (err, channel) {
			  	if (err) return console.log(err);

				channel.name = tmp_channel.name;

				channel.save(function (err) {
					if (err) return console.log(err);
					res.send(channel);
				});
			});
	});
};