var mongoose = require( 'mongoose' ),
    moment = require( 'moment' ),
    tools = require( '../lib/utils' ),
    Schema = mongoose.Schema;

var matchupSchema = mongoose.Schema({
  updated_date  : String,
  updated_at    : String,
	name    		  : String,
	slug    		  : String,
  opponent      : String,
  ticket    	  : String,
  location      : String,
  home    		  : Boolean,

  photos        : [{ type: Schema.ObjectId, ref: 'Photo' }],

  games: [{
      date          : String,
      time          : String,
      scores:   [
        {
             us      : Number,
             them    : Number
        }
      ]}]
});

matchupSchema.pre('save', function (next) {
  this.updated_at = moment().format("M.D.YYYY");
  this.updated_date = moment().format();

  this.slug = tools.slugify(this.name);
  next();
});

matchupSchema.virtual('total_us').get(function () {
  var total = this.scores.reduce(function(a, b) {
    return a + b.us;
  }, 0);
  return total;
});

matchupSchema.virtual('total_them').get(function () {
  var total = this.scores.reduce(function(a, b) {
    return a + b.them;
  }, 0);
  return total;
});

matchupSchema.virtual('formatted_date').get(function () {
  return moment(this.date).format('MMMM Do, YYYY');
});

matchupSchema.methods.getPeriod = function (i) {
  return tools.ordinal(i);
};

module.exports = mongoose.model('Matchup', matchupSchema);