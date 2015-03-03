var mongoose = require( 'mongoose' ),
    moment = require( 'moment' ),
    tools = require( '../lib/utils' ),
    util = require( 'util' ),
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

  photos        : [{ type: Schema.Types.ObjectId, ref: 'Photo' }],

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

  var tmp_dates = this.games.sort(function(a,b){
    return new Date(a.date) - new Date(b.date);
  });

  this.games = tmp_dates;

  this.slug = tools.slugify(this.name);
  next();
});

matchupSchema.virtual('date').get(function () {
  var self = this;
  var days = [],
    months = [],
    years = [];

  var games_length = self.games.length; 
  if ( this.games.length > 1 ) {

    for (i=0; i < this.games.length; i++) {
      months.push(moment(self.games[i].date).format('MMM'));
      days.push(moment(self.games[i].date).format('D'));
      years.push(moment(self.games[i].date).format('YYYY'));
    }

    var de_months = tools.uniq(months),
        de_days = tools.uniq(days),
        de_years = tools.uniq(years);

    if (de_months.length == 1) {

      if (de_days.length > 1) {
        return de_months[0] + ' ' + de_days[0] + '-' + de_days[games_length-1] + ', ' + de_years[0];
      } else {
        return de_months[0] + ' ' + de_days[0] + ', ' + de_years[0];
      }
    } else {
      return de_months[0] + ' ' + de_days[0] + '-' + de_days[games_length-1] + ', ' + de_years[0];
    }


  } else {
    return moment(self.games[0].date).format('MMM D, YYYY');
  }

});

matchupSchema.virtual('formatted_date').get(function () {
  return moment(this.date).format('MMMM Do, YYYY');
});

matchupSchema.methods.getUsTotal = function (game) {
  var total = game.scores.reduce(function(a, b) {
    return a + b.us;
  }, 0);
  return total;
};

matchupSchema.methods.getThemTotal = function (game) {
  var total = game.scores.reduce(function(a, b) {
    return a + b.them;
  }, 0);
  return total;
};


matchupSchema.methods.getSmallDate = function (i) {
  return moment(i).format('MMM. D');
};

matchupSchema.methods.getPeriod = function (i) {
  return tools.ordinal(i);
};

module.exports = mongoose.model('Matchup', matchupSchema);