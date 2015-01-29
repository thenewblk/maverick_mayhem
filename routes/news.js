var News = require('../models/news');

module.exports = function(app, passport) {
	// Add New news
	app.post('/api/news/new', function(req, res) {
		var new_news = {};
		new_news.title 		= req.body.title;
		new_news.link 		= req.body.link;
		new_news.image 		= req.body.image;
		new_news.credit 	= req.body.credit;

		News.create(new_news, function (err, news) {
		  if (err) return console.log(err);
		  res.send(news);
		});
	});

	// Display news
	app.get('/api/news/', function(req, res) {
		News
			.find({})
			.exec( function (err, news) {
			  	if (err) return console.log(err);
				res.send(news);
		});
	});

	// Display news
	app.get('/api/news/:id', function(req, res) {
		News
			.findOne({ _id: req.params.id })
			.exec( function (err, news) {
			  	if (err) return console.log(err);
				res.send(news);
		});
	});

	// Display Edit news Form
	app.get('/api/news/:id/edit', isLoggedIn, function(req, res) {
		News
			.findOne({ _id: req.params.id })
			.exec( function (err, news) {
			  if (err) { console.log(err); }
				res.send(news);
		});
	});

	// Edit news
	app.post('/api/news/:id/edit', isLoggedIn, function(req, res) {
		var edit_news = {};
		edit_news.title 	= req.body.title;
		edit_news.link 		= req.body.link;
		edit_news.image 	= req.body.image;
		edit_news.credit 	= req.body.credit;

		News
			.findOne({ _id: req.params.id })
			.exec(function (err, news) {
			  if (err) return console.log(err);

				news.title 		= edit_news.title;
				news.link 		= edit_news.link;
				news.image 		= edit_news.image;
				news.credit 	= edit_news.credit;

				news.save(function (err) {
					if (err) return console.log(err);
					res.send(news);
				});
			});
	});

	
	// Delete news
	app.delete('/api/news/:id/delete', isLoggedIn, function(req, res) {
		News
			.findOne({ _id: req.params.id })
			.remove( function (err, news) {
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