// config/database.js
module.exports = {
	 'url' : process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/maverick_mayhem',
	 'test' : 'mongodb://localhost/maverick_mayhem_test'
};