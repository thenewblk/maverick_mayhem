var Page = require('../models/page'),
	util = require('util');
// var matchup = require('../models/matchup');
// route middleware to ensure user is logged in

module.exports = function(app, passport) {

	// Display pages
	app.get('/pages/new', isLoggedIn, function(req, res) {
		Page
			.find({})
			.exec( function (err, pages) {
			  	if (err) return console.log(err);
				res.render('pages/new');
		});
	});

	// Display page
	app.get('/:slug', function(req, res) {
		Page
			.findOne({ slug: req.params.slug })
			.deepPopulate('matchups matchups.games photos news')
			.exec( function (err, page) {
			  	if (err) return console.log(err);
			  	var title;
			  	if (page) {
			  		title = " - " + page.name + ' Edit';
			  	} else {
			  		title = '';
			  	}
				res.render('pages/show', {
					page: page,
					title: title
				});
		});
	});


	app.get('/:slug/edit', isLoggedIn, function(req, res) {
		Page
			.findOne({ slug: req.params.slug })
			.exec( function (err, page) {
			  	if (err) return console.log(err);
			  	var title;
			  	if (page.name) {
			  		title = " - " + page.name + ' Edit';
			  	} else {
			  		title = '';
			  	}
			  	
				res.render('pages/edit', {
					page: page,
					title: title
				});
		});
	});

	// Add New page
	app.post('/api/pages/new', isLoggedIn, function(req, res) {
		var new_page = {};
		new_page.name = req.body.name;
		new_page.video = req.body.video;
		new_page.icon = req.body.icon;
		new_page.headline = req.body.headline;
		new_page.banner = req.body.banner;
		new_page.description = req.body.description;

		if ( req.body.photos ) {
			var tmp_photos = [];
			for ( i in req.body.photos ) {
				tmp_photos.push(req.body.photos[i]._id);
			}	
			new_page.photos = tmp_photos;
		}

		if ( req.body.matchups ) {
			var tmp_matchups = [];
			for ( i in req.body.matchups ) {
				tmp_matchups.push(req.body.matchups[i]._id);
			}	
			new_page.matchups = tmp_matchups;
		}

		if ( req.body.news ) {
			var tmp_news = [];
			for ( i in req.body.news ) {
				tmp_news.push(req.body.news[i]._id);
			}	
			new_page.news = tmp_news;
		}

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
			.deepPopulate('matchups matchups.photos matchups.games photos news')
			.exec( function (err, page) {
			  	if (err) return console.log(err);
			  	var tmp_matchups = [];

			  	res.send(page);

			  		
		});
	});

	// Delete page
	app.delete('/api/pages/:slug/delete', isLoggedIn, function(req, res) {
		Page
			.findOne({ slug: req.params.slug })
			.remove( function (err, page) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});

	// Display Edit page Form
	app.get('/api/pages/:slug/edit', isLoggedIn, function(req, res) {
			Page
				.findOne({ slug: req.params.slug })
				.exec( function (err, page) {
				  	if (err) { console.log(err); }
					res.send(page);
			});
	});

	// Edit page
	app.post('/api/pages/:slug/edit', isLoggedIn, function(req, res) {
		var tmp_page = {};
		tmp_page.name = req.body.name;
		tmp_page.video = req.body.video;
		tmp_page.icon = req.body.icon;
		tmp_page.headline = req.body.headline;
		tmp_page.banner = req.body.banner;
		tmp_page.description = req.body.description;

		console.log('req.body.photos: ' + util.inspect(req.body.photos));
		if ( req.body.photos ) {
			var tmp_photos = [];
			for ( i in req.body.photos ) {
				tmp_photos.push(req.body.photos[i]._id);
			}	
			tmp_page.photos = tmp_photos;
		}

		console.log('tmp_photos: ' + util.inspect(tmp_photos));

		console.log('req.body.matchups: ' + util.inspect(req.body.matchups));

		if ( req.body.matchups ) {

			var tmp_matchups = [];
			for ( i in req.body.matchups ) {
				tmp_matchups.push(req.body.matchups[i]._id);
			}	
			tmp_page.matchups   	= tmp_matchups;
		}
		console.log('tmp_matchups: ' + util.inspect(tmp_page.matchups));

		console.log('req.body.news: ' + util.inspect(req.body.news));
		if ( req.body.news ) {
			var tmp_news = [];
			for ( i in req.body.news ) {
				tmp_news.push(req.body.news[i]._id);
			}	
			tmp_page.news = tmp_news;
		}
		console.log('tmp_news: ' + util.inspect(tmp_news));

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
				page.matchups = tmp_page.matchups;
				page.photos = tmp_page.photos;
				page.news = tmp_page.news;


				page.save(function (err) {
					if (err) return console.log(err);
					res.send(page);
				});
			});
	});
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}