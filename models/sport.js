var mongoose = require( 'mongoose' ),
    moment = require('moment'),
    tools = require('../lib/utils'),
    Schema = mongoose.Schema;

var sportSchema = mongoose.Schema({
    updated_date  : String,
    updated_at    : String,
    name          : String,
    slug          : String,
    games         : [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    photos        : [{ type: Schema.Types.ObjectId, ref: 'Photo' }] ,
    news          : [{ type: Schema.Types.ObjectId, ref: 'News' }] ,
});

sportSchema.pre('save', function (next) {
  this.updated_at = moment().format("M.D.YYYY");
  this.updated_date = moment().format();

  this.slug = tools.slugify(this.name);
  
  next();
});
 
module.exports = mongoose.model('Sport', sportSchema);