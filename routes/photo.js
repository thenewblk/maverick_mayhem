var Photo = require('../models/photo'),
    auth = require('../config/auth.js'),
    tools = require('../lib/utils.js'),
    util = require('util'),
    knox = require('knox'),
    async = require('async'),
	mime = require('mime'),
    fs = require('fs');

var awsUpload = require('../lib/aws-streaming');

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

	// var s3 = knox.createClient({
	//     key: auth.amazon.key,
	//     secret: auth.amazon.secret,
	//     bucket: auth.amazon.bucket
	// });

	// app.post('/image-upload', function(req, res, next) {
	// 		console.log('req.body: ' + JSON.stringify(req.body));
	// 		console.log('req.files: ' + JSON.stringify(req.files));
	//     var photo = req.files.file;
	//     console.log('photo: ' + JSON.stringify(photo));
	//     var s3Headers = {
	//       'x-amz-acl': 'public-read'
	//     };

	//     s3.putFile(photo.path, photo.name, s3Headers, function(err, s3response){
	//       //handle, respond
	//     });
	// });


	// var credential = {
	//     key: auth.amazon.key,
	//     secret: auth.amazon.secret,
	//     bucket: auth.amazon.bucket
	//   };

	// // S3 Connector
	// var connect = function() {  
	//   return knox.createClient(credential);
	// };

	// // Remove Temp File
	// var removeTemp = function(path, callback) {  
	//   fs.unlink(path, function(err) {
	//     if (typeof callback === 'function') {
	//       process.nextTick(function() {
	//         callback(err);
	//       });
	//     }
	//   });
	// };

	// Upload when '/upload' with POST requested
	// app.post('/upload', function(req, res){ 
	// 	console.log('req.busboy: '+req.busboy);
	// 		req.pipe(req.busboy);
	// 		req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
	// 			console.log('req: '+util.inspect(filename));
	// 			var client = connect(),
	// 			  	item = file,
	// 			  // append current timestamp to prevent filename conflicts
	// 			  	filename = tools.slugify(filename) + Date.now();

	// 			console.log('item: '+util.inspect(item));
	// 			console.log('filename: '+filename);
	// 			console.log('encoding: '+encoding);
	// 			console.log('mimetype: '+mimetype);
	// 			console.log('mime.extension(mimetype): '+mime.extension(mimetype));

	// 			var localPath = '/tmp/'+filename,
	// 			  s3Path = '/files/' + filename + '.' + mime.extension(mimetype);

	// 			console.log('localPath: '+localPath);
	// 			console.log('s3Path: '+s3Path);

	// 			async.waterfall([
	// 			// Upload the file to S3
	// 				function(callback){ client.putFile(localPath, s3Path, {'x-amz-acl': 'public-read'},
	// 			    		function(err, result) {
	// 			    			console.log('result: '+result);
	// 			      			if (result.statusCode !== 200) {
	// 			        			err = new Error('Upload Failure: ' + result.statusCode);
	// 			      			}
	// 			      			result.resume();
	// 			      			callback(err);
	// 			    		})
	// 				},

	// 			// Remove the temp file on local
	// 				function(callback) {
	// 					removeTemp(localPath, function(err) {
	// 			    		callback(err);
	// 			  		});
	// 				}
	// 			], function(err) {
	// 				if (err) {
	// 			  		res.send(500, 'upload failure');
	// 				} else {
	// 				  	// { saved: 'relative path of your bucket' }
	// 				  	res.json({ saved: s3Path });
	// 				}
	// 			});
	// 	 	});
	// });
	app.post('/upload', function(req, res){ 
	   return awsUpload(req, function(err, url) {
	      res.send(url);
	    });
	});


};