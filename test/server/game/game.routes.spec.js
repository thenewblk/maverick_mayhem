// test/games/game.routes.spec.js
var request       = require("supertest"),
    mongoose      = require("mongoose"),
    Game          = require("../../../models/game"),
    express       = require("express"),
    chai          = require("chai"),
    expect        = chai.expect,
    configDB      = require("../../../config/database"),
    app           = express(),
    bodyParser    = require("body-parser"),
    tools         = require("../../../lib/utils"),
    util          = require("util");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Load up our routes
require("../../../routes/game")(app);

describe("Server-side routes", function(){
  var currentgame, new_game;

  before(function(done){ 
    mongoose.connect(configDB.test);

    var tmp_game = new Game({ 
      name        : 'Us vs Them',
      opponent    : 'Other Team',
      date        : 'today',
      time        : '3:00pm',
      ticket      : 'http://www.google.com',
      location    : 'not here',
      scores      : { us: [1,1,2], them: [1,0,1] }
    });


    tmp_game.save(function(err, game) {
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

  describe("POST /api/games/new", function(){
    it("respond with json", function(done){

      new_game = new Game({ 
        name        : 'Omaha vs Lincoln',
        opponent    : 'Lincoln',
        date        : 'Tomorrow',
        time        : '7:07pm',
        ticket      : 'http://www.instagram.com',
        location    : 'lincoln',
        scores      : { us: [10,1,3], them: [1,3,4] }
      });

      request(app)
        .post("/api/games/new")
        .send(new_game)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Game
            .findOne({ slug: tools.slugify(new_game.name) })
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

  describe("GET /api/games/:slug", function(){

    it("respond with json", function(done){
      request(app)
        .get("/api/games/"+currentgame.slug)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          expect(res.body.name).to.equal(currentgame.name);
        })
        .end(done);
    });

  });

  describe("POST /api/games/:slug/edit", function(){
    it("respond with json", function(done){
      request(app)
        .post("/api/games/"+currentgame.slug+"/edit")
        .send({ name: new_game.name })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Game
            .findOne({ slug: tools.slugify(new_game.name) })
            .exec( function (err, game) {
              if (err) { throw new Error("Error: " + err); }
              expect(res.body.name).to.equal(game.name);
          });
        })
        .end(done);
    });
  });

  describe("DELETE /api/games/:slug/delete", function(){
    it("respond with json", function(done){
      request(app)
        .delete("/api/games/"+tools.slugify(new_game.name)+"/delete")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Game
            .findOne({ slug: tools.slugify(new_game.name) })
            .exec( function (err, game) {
              if (err) { throw new Error("Error: " + err); }
              if (game) { throw new Error("Didn't delete game: " + tools.slugify(new_game.name)); }
          });
        })
        .end(done);
    });
  });

});