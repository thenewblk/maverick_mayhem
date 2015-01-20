var Tag = require('../models/tag');
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send(false);
}

module.exports = function(app, passport) {

	// Add New Tag
	app.post('/api/tag/new', isLoggedIn, function(req, res) {
		var name = req.body.name;

		Tag.create({ name: name}, function (err, tag) {
		  if (err) return console.log(err);
		  	res.send(tag);
		});
	});

	// Display Tags
	app.get('/api/tag/', function(req, res) {
		Tag
			.find({})
			.exec( function (err, tags) {
			  	if (err) return console.log(err);
				res.send(tags);
		});
	});

	// Display Tag
	app.get('/api/tag/:slug', function(req, res) {
		Tag
			.findOne({ slug: req.params.slug })
			.exec( function (err, tag) {
			  	if (err) return console.log(err);
				res.send(tag);
		});
	});

	// Delete Tag
	app.delete('/api/tag/:slug/delete', isLoggedIn, function(req, res) {
		Tag
			.findOne({ slug: req.params.slug })
			.remove( function (err, tag) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});

	// Display Edit Tag Form
	app.get('/api/tag/:slug/edit', isLoggedIn, function(req, res) {
			Tag
				.findOne({ slug: req.params.slug })
				.exec( function (err, tag) {
				  	if (err) { console.log(err); }
					res.send(tag);
			});
	});

	// Edit Tag
	app.post('/api/tag/:slug/edit', isLoggedIn, function(req, res) {
		tmp_tag = {};
		tmp_tag.name = req.body.name;

		Tag
			.findOne({ slug: req.params.slug })
			.exec(function (err, tag) {
			  	if (err) return console.log(err);

				tag.name = tmp_tag.name;

				tag.save(function (err) {
					if (err) return console.log(err);
					res.send(tag);
				});
			});
	});
};