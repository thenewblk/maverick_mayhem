var mongoose = require( 'mongoose' ),
    moment = require('moment'),
    tools = require('../lib/utils'),
    Schema = mongoose.Schema,
    deepPopulate = require('mongoose-deep-populate');

var pageSchema = mongoose.Schema({
  updated_date  : String,
  updated_at    : String,
  name          : {type: String, index: {unique: true, dropDups: true}},
  slug          : {type: String, index: {unique: true, dropDups: true}},
  video         : {},
  icon          : {},
  headline      : String,
  banner        : String,
  description   : String,
  matchups      : [{ type: Schema.Types.ObjectId, ref: 'Matchup' }],
  photos        : [{ type: Schema.Types.ObjectId, ref: 'Photo' }] ,
  news          : [{ type: Schema.Types.ObjectId, ref: 'News' }] ,
});



pageSchema.pre('save', function (next) {
  this.updated_at = moment().format("M.D.YYYY");
  this.updated_date = moment().format();

  this.slug = tools.slugify(this.name);
  
  next();
});

pageSchema.virtual('last_matchup').get(function () {
  var today = moment();
  var tmp_last_matchup;
  for (i=0; i < this.matchups.length; i++ ) {

    if (moment(this.matchups[i].games[this.matchups[i].games.length - 1].date).isBefore(today)) {
        tmp_last_matchup = this.matchups[i];
    }
  }
  return tmp_last_matchup
});

pageSchema.methods.getPeriod = function (i) {
  if (this.slug == "hockey"){ 
    if (i < 4 ) {
      return tools.ordinal(i);
    } else {
      return "OT";
    }
  } else {
    return tools.ordinal(i);
  }
};

pageSchema.virtual('next_matchup').get(function () {
  var today = moment();
  var tmp_last_matchup;
  for (i=this.matchups.length -1; i > -1; i-- ) {

    if (moment(this.matchups[i].games[0].date).isAfter(today)) {
        tmp_last_matchup = this.matchups[i];
    }
  }
  return tmp_last_matchup
});



pageSchema.plugin( deepPopulate );
 
module.exports = mongoose.model('Page', pageSchema);