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
      name        : 'Us vs Them',
      opponent    : 'Other Team',
      date        : 'today',
      time        : '3:00pm',
      ticket      : 'http://www.google.com',
      location    : 'not here',
      scores      : { us: [1,1,2], them: [1,0,1] }
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
      expect(1).to.equal(c);
      done();
    })
  });

  it("can be found by name", function(done){ 
    Game.findOne({name: currentgame.name}, function(err, game) {
      if (err) return console.error(err); 
      expect('Us vs Them').to.equal(game.name);
      expect('3:00pm').to.equal(game.time);
      expect('today').to.equal(game.date);
      expect('http://www.google.com').to.equal(game.ticket);
      expect('not here').to.equal(game.location);
      expect(1).to.equal(game.scores.us[0]);
      expect(1).to.equal(game.scores.them[2]);
      expect(3).to.equal(game.scores.us.length);
      expect(4).to.equal(game.scores.total.us);
      expect(2).to.equal(game.scores.total.them);
      done();
    });
  }); 

  it("saves correct opponent", function(done){ 
    Game.findOne({name: currentgame.name}, function(err, game) {
      if (err) return console.error(err); 
      expect('Other Team').to.equal(game.opponent);
      done();
    });
  }); 

  it("saves correct date", function(done){ 
    Game.findOne({name: currentgame.name}, function(err, game) {
      if (err) return console.error(err); 
      expect('today').to.equal(game.date);
      done();
    });
  }); 

  it("saves correct time", function(done){ 
    Game.findOne({name: currentgame.name}, function(err, game) {
      if (err) return console.error(err); 
      expect('3:00pm').to.equal(game.time);
      done();
    });
  }); 

  it("saves correct ticket", function(done){ 
    Game.findOne({name: currentgame.name}, function(err, game) {
      if (err) return console.error(err); 
      expect('http://www.google.com').to.equal(game.ticket);
      done();
    });
  }); 

  it("saves correct location", function(done){ 
    Game.findOne({name: currentgame.name}, function(err, game) {
      if (err) return console.error(err); 
      expect('not here').to.equal(game.location);
      done();
    });
  }); 

  it("saves correct scores.us", function(done){ 
    Game.findOne({name: currentgame.name}, function(err, game) {
      if (err) return console.error(err); 
      expect(1).to.equal(game.scores.us[0]);
      expect(3).to.equal(game.scores.us.length);
      expect(4).to.equal(game.scores.total.us);
      done();
    });
  }); 

  it("saves correct scores.them", function(done){ 
    Game.findOne({name: currentgame.name}, function(err, game) {
      if (err) return console.error(err); 
      expect(1).to.equal(game.scores.them[2]);
      expect(3).to.equal(game.scores.them.length);
      expect(2).to.equal(game.scores.total.them);
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