var mongoose = require( 'mongoose' );
var tools = require('../lib/utils');

var gameSchema = mongoose.Schema({
	name    		: String,
	slug    		: String,
  opponent    : String,
  date    		: String,
  time    		: String,
  ticket    	: String,
  location    : String,
  home    		: Boolean,
  scores			: {
  				us 			: [Number],
  				them 		: [Number]
  }
});

gameSchema.pre('save', function (next) {
  this.slug = tools.slugify(this.name);
  next();
});

gameSchema.virtual('scores.total.us').get(function () {
  var total = this.scores.us.reduce(function(a, b) {
	  return a + b;
	});
  return total;
});

gameSchema.virtual('scores.total.them').get(function () {
  var total = this.scores.them.reduce(function(a, b) {
	  return a + b;
	});
  return total;
});
 
module.exports = mongoose.model('Game', gameSchema);