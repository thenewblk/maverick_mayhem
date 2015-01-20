var mongoose = require( 'mongoose' );
var tools = require('../lib/utils');

var newsSchema = mongoose.Schema({
	name    				: String,
	slug    				: String,
    description    	: String,
});

newsSchema.pre('save', function (next) {
  this.slug = tools.slugify(this.name);
  next();
});
 
module.exports = mongoose.model('News', newsSchema);