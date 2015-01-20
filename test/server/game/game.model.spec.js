// test/game/game.model.spec.js
var mongoose = require("mongoose"),
    Game    = require("../../../models/game"),
    chai     = require("chai"),
    expect   = chai.expect,
    configDB = require('../../../config/database'),
    tools = require('../../../lib/utils');
//tell Mongoose to use our test DB


describe("Game", function(){ 
  var currentgame = null;


  before(function(done){ 
    mongoose.connect(configDB.test);
    
    var game = new Game({ 
      name: 'Game Number 1' 
    });

    game.save(function(err, game) {
      if (err) return console.error(err);
      currentgame = game; 
      done(); 
    });
  });


  after(function(done){ 
    Game.remove({}, function() { 
      mongoose.disconnect();
      done(); 
    }); 
   });


  it("count is equal to one", function(done){ 
    Game.count({}, function(err, c) {
      if (err) return console.error(err);
      expect(c).to.equal(1);
      done();
    })
  });

  it("can be found by name", function(done){ 
    Game.findOne({name: currentgame.name}, function(err, game) {
      if (err) return console.error(err); 
      expect(game.name).to.equal(currentgame.name);
      done();
    });
  }); 


  it("creates correct slug", function(done){ 
    Game.findOne({name: currentgame.name}, function(err, game) {
      if (err) return console.error(err); 
      expect(game.slug).to.equal(tools.slugify(currentgame.name));
      done();
    });
  }); 
});