var mongoose = require( 'mongoose' );
var tools = require('../lib/utils');

var photoSchema = mongoose.Schema({
		name    				: String,
		slug    				: String
});

photoSchema.pre('save', function (next) {
  this.slug = tools.slugify(this.name);
  next();
});
 
module.exports = mongoose.model('Photo', photoSchema);