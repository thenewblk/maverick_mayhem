var mongoose = require( 'mongoose' );
var tools = require('../lib/utils');

var newsSchema = mongoose.Schema({
	title    				: String,
	slug    				: String,
	link    				: String,
	image    				: String,
  credit    			: String,
});

newsSchema.pre('save', function (next) {
  this.slug = tools.slugify(this.title);
  next();
});
 
module.exports = mongoose.model('News', newsSchema);