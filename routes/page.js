var Page = require('../models/page');
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send(false);
}

module.exports = function(app, passport) {

	// Add New page
	app.post('/api/pages/new', function(req, res) {
		var new_page = {};
		new_page.name = req.body.name;
		new_page.video = req.body.video;
		new_page.icon = req.body.icon;
		new_page.headline = req.body.headline;
		new_page.banner = req.body.banner;
		new_page.description = req.body.description;
		new_page.games = req.body.games;
		new_page.photos = req.body.photos;
		new_page.news = req.body.news;

		Page.create(new_page, function (err, page) {
		  if (err) return console.log(err);
		  	res.send(page);
		});
	});

	// Display pages
	app.get('/api/pages/', function(req, res) {
		Page
			.find({})
			.exec( function (err, pages) {
			  	if (err) return console.log(err);
				res.send(pages);
		});
	});

	// Display page
	app.get('/api/pages/:slug', function(req, res) {
		Page
			.findOne({ slug: req.params.slug })
			.exec( function (err, page) {
			  	if (err) return console.log(err);
				res.send(page);
		});
	});

	// Delete page
	app.delete('/api/pages/:slug/delete', function(req, res) {
		Page
			.findOne({ slug: req.params.slug })
			.remove( function (err, page) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});

	// Display Edit page Form
	app.get('/api/pages/:slug/edit', function(req, res) {
			Page
				.findOne({ slug: req.params.slug })
				.exec( function (err, page) {
				  	if (err) { console.log(err); }
					res.send(page);
			});
	});

	// Edit page
	app.post('/api/pages/:slug/edit', function(req, res) {
		var tmp_page = {};
		tmp_page.name = req.body.name;
		tmp_page.video = req.body.video;
		tmp_page.icon = req.body.icon;
		tmp_page.headline = req.body.headline;
		tmp_page.banner = req.body.banner;
		tmp_page.description = req.body.description;
		tmp_page.games = req.body.games;
		tmp_page.photos = req.body.photos;
		tmp_page.news = req.body.news;

		Page
			.findOne({ slug: req.params.slug })
			.exec(function (err, page) {
			  if (err) return console.log(err);

				page.name = tmp_page.name;
				page.video = tmp_page.video;
				page.icon = tmp_page.icon;
				page.headline = tmp_page.headline;
				page.banner = tmp_page.banner;
				page.description = tmp_page.description;
				page.games = tmp_page.games;
				page.photos = tmp_page.photos;
				page.news = tmp_page.news;


				page.save(function (err) {
					if (err) return console.log(err);
					res.send(page);
				});
			});
	});
};