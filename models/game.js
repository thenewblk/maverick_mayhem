var mongoose = require( 'mongoose' ),
    moment = require( 'moment' ),
    tools = require( '../lib/utils' ),
    Schema = mongoose.Schema;

var gameSchema = mongoose.Schema({
  updated_date  : String,
  updated_at    : String,
	name    		  : String,
	slug    		  : String,
  opponent      : String,
  ticket    	  : String,
  location      : String,
  home    		  : Boolean,
  date          : String,
  time          : String,

  scores:   [
    {
         us      : Number,
         them    : Number
    }
  ],

  photos        : [{ type: Schema.ObjectId, ref: 'Photo' }],

  series: [{
      date          : String,
      time          : String,
      scores:   [
        {
             us      : Number,
             them    : Number
        }
      ]}]
});

gameSchema.pre('save', function (next) {
  this.updated_at = moment().format("M.D.YYYY");
  this.updated_date = moment().format();

  this.slug = tools.slugify(this.name);
  next();
});

gameSchema.virtual('total_us').get(function () {
  var total = this.scores.reduce(function(a, b) {
    return a + b.us;
  }, 0);
  return total;
});

gameSchema.virtual('total_them').get(function () {
  var total = this.scores.reduce(function(a, b) {
    return a + b.them;
  }, 0);
  return total;
});

gameSchema.virtual('formatted_date').get(function () {
  return moment(this.date).format('MMMM Do, YYYY');
});
gameSchema.methods.getPeriod = function (i) {
  return tools.ordinal(i);
};

module.exports = mongoose.model('Game', gameSchema);