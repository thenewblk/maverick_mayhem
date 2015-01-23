var Photo = require('../models/photo');

module.exports = function(app) {
	// Add New photo
	app.post('/api/photos/new', function(req, res) {
		var new_photo = {};
		new_photo.url 					= req.body.url;
		new_photo.description 	= req.body.description;

		Photo.create(new_photo, function (err, photo) {
		  if (err) return console.log(err);
		  res.send(photo);
		});
	});

	// Display photos
	app.get('/api/photos/', function(req, res) {
		Photo
			.find({})
			.exec( function (err, photos) {
			  	if (err) return console.log(err);
				res.send(photos);
		});
	});

	// Display photo
	app.get('/api/photos/:id', function(req, res) {
		Photo
			.findOne({ _id: req.params.id })
			.exec( function (err, photo) {
			  	if (err) return console.log(err);
				res.send(photo);
		});
	});

	// Display Edit photo Form
	app.get('/api/photos/:id/edit', function(req, res) {
		Photo
			.findOne({ _id: req.params.id })
			.exec( function (err, photo) {
			  if (err) { console.log(err); }
				res.send(photo);
		});
	});

	// Edit photo
	app.post('/api/photos/:id/edit', function(req, res) {
		var edit_photo = {};
		edit_photo.url 					= req.body.url;
		edit_photo.description 	= req.body.description;

		Photo
			.findOne({ _id: req.params.id })
			.exec(function (err, photo) {
			  if (err) return console.log(err);

				photo.url 					= edit_photo.url;
				photo.description 	= edit_photo.description;

				photo.save(function (err) {
					if (err) return console.log(err);
					res.send(photo);
				});
			});
	});
	
	// Delete photo
	app.delete('/api/photos/:id/delete', function(req, res) {
		Photo
			.findOne({ _id: req.params.id })
			.remove( function (err, photo) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});
};