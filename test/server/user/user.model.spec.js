// test/user/user.model.spec.js
var mongoose = require("mongoose"),
    User    = require("../../../models/user"),
    chai     = require("chai"),
    expect   = chai.expect,
    configDB = require('../../../config/database');


describe("User", function(){ 
  var currentuser = null;

  before(function(done){ 
    mongoose.connect(configDB.test);
    var newUser = new User();

    newUser.local.email    = 'John Smith';
    newUser.local.password = newUser.generateHash('123456');

    newUser.save(function(err, user) {
      if (err) { throw err; }

      currentuser = user; 
      done(); 
    });
  });

  after(function(done){ 
    User.remove({}, function() { 
      mongoose.disconnect();
      done();  
    }); 
  });


  it("count is equal to one", function(done){ 
    User.count({}, function(err, c) {
      if (err) return console.error(err);
      expect(c).to.equal(1);
      done();
    })
  });

});