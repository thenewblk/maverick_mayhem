var mongoose = require( 'mongoose' );
var tools = require('../lib/utils');

var photoSchema = mongoose.Schema({
	url    				: String,
	description		: String
});

photoSchema.pre('save', function (next) {
  next();
});
 
module.exports = mongoose.model('Photo', photoSchema);