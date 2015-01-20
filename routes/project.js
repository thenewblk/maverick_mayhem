var Project = require('../models/project');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send(false);
}

module.exports = function(app) {
	// Add New project
	app.post('/api/project/new', isLoggedIn, function(req, res) {
		var name = req.body.name;

		Project.create({ name: name}, function (err, project) {
		  if (err) return console.log(err);
		  	res.send(project);
		});
	});

	// Display projects
	app.get('/api/project/', function(req, res) {
		Project
			.find({})
			.exec( function (err, projects) {
			  	if (err) return console.log(err);
				res.send(projects);
		});
	});

	// Display project
	app.get('/api/project/:slug', function(req, res) {
		Project
			.findOne({ slug: req.params.slug })
			.exec( function (err, project) {
			  	if (err) return console.log(err);
				res.send(project);
		});
	});

	// Delete project
	app.delete('/api/project/:slug/delete', isLoggedIn, function(req, res) {
		Project
			.findOne({ slug: req.params.slug })
			.remove( function (err, project) {
			  	if (err) return console.log(err);
				res.send(true);
		});
	});

	// Display Edit project Form
	app.get('/api/project/:slug/edit', function(req, res) {
			Project
				.findOne({ slug: req.params.slug })
				.exec( function (err, project) {
				  	if (err) { console.log(err); }
					res.send(project);
			});
	});

	// Edit project
	app.post('/api/project/:slug/edit', isLoggedIn, function(req, res) {
		tmp_project = {};
		tmp_project.name = req.body.name;

		Project
			.findOne({ slug: req.params.slug })
			.exec(function (err, project) {
			  	if (err) return console.log(err);

				project.name = tmp_project.name;

				project.save(function (err) {
					if (err) return console.log(err);
					res.send(project);
				});
			});
	});
};