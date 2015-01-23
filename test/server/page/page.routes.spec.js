// test/game/game.routes.spec.js
var request  = require("supertest"),
    mongoose = require("mongoose"),
    News     = require("../../../models/news"),
    Photo     = require("../../../models/photo"),
    Game     = require("../../../models/game"),
    Page     = require("../../../models/page"),
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
require("../../../routes/page")(app);

describe("Server-side routes", function(){
  var currentpage, example_game, example_game_2;
  var page_name = "Umbrella";
  var new_page_name = "Ostrich";


  before(function(done){ 
    mongoose.connect(configDB.test);
    Game.create({ name: "Opponent"  }, function (err, game) {
      if (err) return handleError(err);
      example_game = game;

      Game.create({ name: "Friend"  }, function (err, game) {
        if (err) return handleError(err);
        example_game_2 = game;

        var tmp_page = new Page({ 
          name          : 'Hockey',
          video         : 'http://dfcb.github.io/BigVideo.js/vids/dock.mp4',
          icon          : 'http://dfcb.github.io/BigVideo.js/vids/dock.mp4',
          headline      : 'Super Headline',
          banner        : 'Some sort of Banner Image',
          description   : 'Some sort of Description',
          games         : [ example_game._id, example_game_2._id ]
        });

        tmp_page.save(function(err, page) {
          if (err) return console.error(err);

          page.save(function(err, new_page) {
            currentpage = new_page;
            if (err) return console.error(err);
            done(); 
          });
        });
      });
    });

  });

  after(function(done){ 
    Page.remove({}, function() { 
      Game.remove({}, function() { 
        mongoose.disconnect();
        done(); 
      });
    }); 
  });

  describe("POST /api/pages/new", function(){
    it("respond with json", function(done){
      var new_page = new Page({ 
        name          : 'Basketball',
        video         : 'basketball video',
        icon          : 'basketball icon',
        headline      : 'Basketball Super Headline',
        banner        : 'Some sort of Basketball Banner Image',
        description   : 'Some sort of Basketball Description',
        games         : [ example_game._id, example_game_2._id ]
      });
      request(app)
        .post("/api/pages/new")
        .send(new_page)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Page
            .findOne({ slug: tools.slugify(new_page.name) })
            .exec( function (err, page) {
              if (err) { throw new Error("Error: " + err); }
              expect(res.body.name).to.equal(page.name);
          });
        })
        .end(done);
    });
  });

  describe("GET /api/pages", function(){

    it("respond with json", function(done){
      request(app)
        .get("/api/pages")
        .expect("Content-Type", /json/)
        .expect(200, done);
    });

  });

  describe("GET /api/pages/:slug", function(){

    it("respond with json", function(done){
      request(app)
        .get("/api/pages/"+currentpage.slug)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          expect(res.body.name).to.equal(currentpage.name);
        })
        .end(done);
    });

  });

  describe("POST /api/pages/:slug/edit", function(){
    it("respond with json", function(done){
      request(app)
        .post("/api/pages/"+currentpage.slug+"/edit")
        .send({ name: new_page_name })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Page
            .findOne({ slug: tools.slugify(new_page_name) })
            .exec( function (err, page) {
              if (err) { throw new Error("Error: " + err); }
              expect(res.body.name).to.equal(page.name);
          });
        })
        .end(done);
    });
  });

  describe("DELETE /api/pages/:slug/delete", function(){
    it("respond with json", function(done){
      request(app)
        .delete("/api/pages/"+tools.slugify(new_page_name)+"/delete")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Page
            .findOne({ slug: tools.slugify(new_page_name) })
            .exec( function (err, page) {
              if (err) { throw new Error("Error: " + err); }
              if (page) { throw new Error("Didn't delete page: " + tools.slugify(new_page_name)); }
          });
        })
        .end(done);
    });
  });

});