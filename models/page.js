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
  games         : [{ type: Schema.Types.ObjectId, ref: 'Game' }],
  photos        : [{ type: Schema.Types.ObjectId, ref: 'Photo' }] ,
  news          : [{ type: Schema.Types.ObjectId, ref: 'News' }] ,
});



pageSchema.pre('save', function (next) {
  this.updated_at = moment().format("M.D.YYYY");
  this.updated_date = moment().format();

  this.slug = tools.slugify(this.name);
  
  next();
});

pageSchema.plugin( deepPopulate );
 
module.exports = mongoose.model('Page', pageSchema);