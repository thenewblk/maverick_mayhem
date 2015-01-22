// test/sport/sport.model.spec.js
var mongoose = require("mongoose"),
    Sport    = require("../../../models/sport"),
    Game    = require("../../../models/game"),
    chai     = require("chai"),
    expect   = chai.expect,
    configDB = require('../../../config/database'),
    tools = require('../../../lib/utils'),
    util = require("util");
//tell Mongoose to use our test DB


describe("Sport", function(){ 
  var currentsport, example_game, example_game_2;

  before(function(done){ 
    mongoose.connect(configDB.test);
    
    var tmp_game = new Game({
      name: "Opponent" 
    });

    tmp_game.save(function(err, game){
      example_game = game;
    });

    var tmp_game_2 = new Game({
      name: "Friend" 
    });

    tmp_game_2.save(function(err, game){
      example_game_2 = game;
    });

    var tmp_sport = new Sport({ 
      name: 'Hockey'
    });

    tmp_sport.save(function(err, sport) {
      if (err) return console.error(err);

      sport.games.push(example_game, example_game_2);

      sport.save(function(err, new_sport) {
        currentsport = new_sport;
        if (err) return console.error(err);
        done(); 
      });
    });


  });


  after(function(done){ 
    Sport.remove({}, function() { 
      Game.remove({}, function() { 
        mongoose.disconnect();
        done(); 
      }); 
    }); 
   });


  it("count is equal to one", function(done){ 
    Sport.count({}, function(err, c) {
      if (err) return console.error(err);
      expect(1).to.equal(c);
      done();
    })
  });

  it("can be found by name", function(done){ 
    Sport.findOne({name: currentsport.name}, function(err, sport) {
      if (err) return console.error(err); 
      expect(sport.name).to.equal(currentsport.name);
      done();
    });
  }); 


  it("creates correct slug", function(done){ 
    Sport.findOne({ name: currentsport.name }, function(err, sport) {
      if (err) return console.error(err); 
      expect(sport.slug).to.equal(tools.slugify(currentsport.name));
      done();
    });
  }); 

  it("creates game correctly", function(done){ 
    Sport
      .findOne({ name: currentsport.name })
      .populate('games')
      .exec(function(err, sport) {
        if (err) return console.error(err); 
        expect(sport.games[0].name).to.equal(example_game.name);
        done();
    });
  }); 
});