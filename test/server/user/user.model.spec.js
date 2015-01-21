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

    var user = new User({
      name: 'John Smith'
    });

    user.local.email    = 'john@example.com';
    user.local.password = user.generateHash('123456');

    user.save(function(err, user) {
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
      expect(1).to.equal(c);
      done();
    })
  });

  it("can be found by name", function(done){ 
    User.findOne({name: currentuser.name}, function(err, user) {
      if (err) return console.error(err); 
      expect(user.name).to.equal(currentuser.name);
      done();
    });
  }); 

  it("can be found by email", function(done){ 
    User.findOne({name: currentuser.name}, function(err, user) {
      if (err) return console.error(err); 
      expect(user.local.email).to.equal(currentuser.local.email);
      done();
    });
  }); 

  it("can be found by password", function(done){ 
    User.findOne({name: currentuser.name}, function(err, user) {
      if (err) return console.error(err); 
      expect(user.local.password).to.equal(currentuser.local.password);
      done();
    });
  }); 

});