// test/photo/photo.model.spec.js
var mongoose = require("mongoose"),
    Photo    = require("../../../models/photo"),
    chai     = require("chai"),
    expect   = chai.expect,
    configDB = require('../../../config/database'),
    tools = require('../../../lib/utils');
//tell Mongoose to use our test DB


describe("Photo", function(){ 
  var currentphoto;


  before(function(done){ 
    mongoose.connect(configDB.test);
    
    var photo = new Photo({ 
      url             : "http://www.google.com",
      description     : "It's a picture of stuff."
    });

    photo.save(function(err, photo) {
      if (err) return console.error(err);
      currentphoto = photo; 
      done(); 
    });
  });


  after(function(done){ 
    Photo.remove({}, function() { 
      mongoose.disconnect();
      done(); 
    }); 
   });


  it("count is equal to one", function(done){ 
    Photo.count({}, function(err, c) {
      if (err) return console.error(err);
      expect(1).to.equal(c);
      done();
    })
  });

  it("can be found by _id", function(done){ 
    Photo.findOne({_id: currentphoto._id}, function(err, photo) {
      if (err) return console.error(err); 
      expect(currentphoto._id.toString()).to.equal(photo._id.toString());
      done();
    });
  }); 


  it("saves correct description", function(done){ 
    Photo.findOne({_id: currentphoto._id}, function(err, photo) {
      if (err) return console.error(err); 
      expect("http://www.google.com").to.equal(photo.url);
      done();
    });
  }); 

  it("saves correct description", function(done){ 
    Photo.findOne({_id: currentphoto._id}, function(err, photo) {
      if (err) return console.error(err); 
      expect("It's a picture of stuff.").to.equal(photo.description);
      done();
    });
  }); 
});