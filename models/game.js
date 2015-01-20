var mongoose = require( 'mongoose' );
var tools = require('../lib/utils');

var gameSchema = mongoose.Schema({
	name    		: String,
	slug    		: String,
    description    	: String,
});

gameSchema.pre('save', function (next) {
  this.slug = tools.slugify(this.name);
  next();
});
 
module.exports = mongoose.model('Game', gameSchema);