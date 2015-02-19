var mongoose = require( 'mongoose' ),
    moment = require( 'moment' ),
	tools = require('../lib/utils');

var photoSchema = mongoose.Schema({
  	updated_date    : String,
	url    			: String,
	description		: String,
	featured		: Boolean
});

photoSchema.pre('save', function (next) {
  this.updated_date = moment().format();
  next();
});
 
module.exports = mongoose.model('Photo', photoSchema);