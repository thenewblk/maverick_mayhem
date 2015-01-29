var Instagram = require('../models/instagram');

module.exports = function(app) {

	// Display instagrams
	app.get('/api/instagrams/', function(req, res) {
		Instagram
			.find({})
			.where('blocked').ne('blocked')
			.where('type').equals('image')
			.limit(30)
			.exec( function (err, instagrams) {
			  	if (err) return console.log(err);
				res.send(instagrams);
		});
	});

	// Display instagrams
	app.get('/api/instagrams/:id', function(req, res) {
		Instagram
			.findOne({ _id: req.params.id })
			.exec( function (err, instagram) {
			  if (err) return console.log(err);
				res.send(instagram);
		});
	});

	// Display Edit instagrams Form
	app.get('/api/instagrams/:id/edit', function(req, res) {
		Instagram
			.findOne({ _id: req.params.id })
			.exec( function (err, instagram) {
			  if (err) { console.log(err); }
				res.send(instagram);
		});
	});

	// Edit instagrams
	app.post('/api/instagrams/:id/edit', function(req, res) {
		var blocked 	= req.body.blocked;
		Instagram
			.findOne({ _id: req.params.id })
			.exec(function (err, instagram) {
			  if (err) return console.log(err);

				instagrams.blocked 		= edit_instagrams.blocked;

				instagrams.save(function (err) {
					if (err) return console.log(err);
					res.send(instagram);
				});
			});
	});
	
	
	// Delete instagrams
	app.delete('/api/instagrams/:id/delete', function(req, res) {
		Instagram
			.findOne({ _id: req.params.id })
			.remove( function (err, instagram) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});
};