var mongoose = require( 'mongoose' ),
    moment = require('moment'),
    tools = require('../lib/utils');

var gameSchema = mongoose.Schema({
  updated_date  : String,
  updated_at    : String,
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
  this.updated_at = moment().format("M.D.YYYY");
  this.updated_date = moment().format();

  this.slug = tools.slugify(this.name);
  next();
});

gameSchema.virtual('scores.total.us').get(function () {
  var total = this.scores.us.reduce(function(a, b) {
	  return a + b;
	});
  return total;
});

gameSchema.methods.getPeriod = function (i) {
  return tools.ordinal(i);
};



gameSchema.virtual('scores.total.them').get(function () {
  var total = this.scores.them.reduce(function(a, b) {
	  return a + b;
	});
  return total;
});
 
module.exports = mongoose.model('Game', gameSchema);