// test/game/game.routes.spec.js
var request  = require("supertest"),
    mongoose = require("mongoose"),
    Game     = require("../../../models/game"),
    express  = require("express"),
    chai     = require("chai"),
    expect   = chai.expect,
    configDB = require("../../../config/database"),
    app      = express(),
    bodyParser = require("body-parser"),
    tools = require("../../../lib/utils"),
    util = require("util");

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

// Load up our routes
require("../../../routes/game")(app);

describe("Server-side routes", function(){
  var currentgame = null;
  var game_name = "Umbrella";
  var new_game_name = "Ostrich";

  before(function(done){ 
    mongoose.connect(configDB.test);
      var new_game = new Game({ 
        name: "Game Number 1" 
      });

      new_game.save(function(err, game) {
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

  describe("POST /api/game/new", function(){
    it("respond with json", function(done){
      request(app)
        .post("/api/game/new")
        .send({ name: game_name })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Game
            .findOne({ slug: tools.slugify(game_name) })
            .exec( function (err, game) {
              if (err) { throw new Error("Error: " + err); }
              expect(res.body.name).to.equal(game.name);
          });
        })
        .end(done);
    });
  });

  describe("GET /api/games", function(){

    it("respond with json", function(done){
      request(app)
        .get("/api/games")
        .expect("Content-Type", /json/)
        .expect(200, done);
    });

  });

  describe("GET /api/game/:slug", function(){

    it("respond with json", function(done){
      request(app)
        .get("/api/game/"+currentgame.slug)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          expect(res.body.name).to.equal(currentgame.name);
        })
        .end(done);
    });

  });

  describe("POST /api/game/:slug/edit", function(){
    it("respond with json", function(done){
      request(app)
        .post("/api/game/"+currentgame.slug+"/edit")
        .send({ name: new_game_name })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Game
            .findOne({ slug: tools.slugify(new_game_name) })
            .exec( function (err, game) {
              if (err) { throw new Error("Error: " + err); }
              expect(res.body.name).to.equal(game.name);
          });
        })
        .end(done);
    });
  });

  describe("DELETE /api/game/:slug/delete", function(){
    it("respond with json", function(done){
      request(app)
        .delete("/api/game/"+tools.slugify(new_game_name)+"/delete")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Game
            .findOne({ slug: tools.slugify(new_game_name) })
            .exec( function (err, game) {
              if (err) { throw new Error("Error: " + err); }
              if (game) { throw new Error("Didn't delete game: " + tools.slugify(new_game_name)); }
          });
        })
        .end(done);
    });
  });

});