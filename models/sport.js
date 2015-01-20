var mongoose = require( 'mongoose' );
var moment = require('moment');
var tools = require('../lib/utils');

var sportSchema = mongoose.Schema({
    updated_date  : String,
    updated_at    : String,
    name          : String,
    slug          : String,
    games         : [{ type: String, ref: 'Game' }] ,
    photos        : [{ type: String, ref: 'Photo' }] ,
    news          : [{ type: String, ref: 'News' }] ,
});

sportSchema.pre('save', function (next) {
  this.updated_at = moment().format("M.D.YYYY");
  this.updated_date = moment().format();

  this.slug = tools.slugify(this.name);
  
  next();
});
 
module.exports = mongoose.model('Sport', sportSchema);