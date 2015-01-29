// config/auth.js

	module.exports = {

		'amazon': {
 			'key': process.env.S3_KEY,
			'secret': process.env.S3_SECRET,
			'bucket': process.env.S3_BUCKET
		},
		
		'instagram': {
			'client_id': process.env.INSTAGRAM_CLIENT_ID,
			'client_secret': process.env.INSTAGRAM_CLIENT_SECRET 
		}

	};