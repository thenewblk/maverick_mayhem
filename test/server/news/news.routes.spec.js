// test/news/news.routes.spec.js
var request       = require("supertest"),
    mongoose      = require("mongoose"),
    News          = require("../../../models/news"),
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
require("../../../routes/news")(app);

describe("Server-side routes", function(){
  var currentnews, new_news;

  before(function(done){ 
    mongoose.connect(configDB.test);

    var tmp_news = new News({ 
      title   : "Super Duper Title",
      link    : "http://www.google.com",
      image   : "http://www.instagram.com",
      credit  : "OWH"
    });


    tmp_news.save(function(err, news) {
      if (err) return console.error(err);
      currentnews = news; 
      done();
    });

  });

  after(function(done){ 
    News.remove({}, function() { 
      mongoose.disconnect();
      done(); 
    }); 
  });

  describe("POST /api/news/new", function(){
    it("respond with json", function(done){

      new_news = new News({ 
        title   : "Other Title",
        link    : "http://www.yahoo.com",
        image   : "http://www.flickr.com",
        credit  : "O Mavs"
      });

      request(app)
        .post("/api/news/new")
        .send(new_news)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          News
            .findOne({ _id: res.body._id })
            .exec( function (err, news) {
              if (err) { throw new Error("Error: " + err); }
              expect(res.body.title).to.equal(new_news.title);
          });
        })
        .end(done);
    });
  });

  describe("GET /api/news", function(){

    it("respond with json", function(done){
      request(app)
        .get("/api/news")
        .expect("Content-Type", /json/)
        .expect(200, done);
    });

  });

  describe("GET /api/news/:id", function(){

    it("respond with json", function(done){
      request(app)
        .get("/api/news/"+currentnews._id)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          expect(res.body.title).to.equal(currentnews.title);
        })
        .end(done);
    });

  });

  describe("POST /api/news/:id/edit", function(){
    it("respond with json", function(done){
      request(app)
        .post("/api/news/"+currentnews._id+"/edit")
        .send({ title: new_news.title })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          News
            .findOne({ _id: res.body._id })
            .exec( function (err, news) {
              if (err) { throw new Error("Error: " + err); }
              expect(res.body.title).to.equal(news.title);
          });
        })
        .end(done);
    });
  });

  describe("DELETE /api/news/:id/delete", function(){
    it("respond with json", function(done){
      request(app)
        .delete("/api/news/"+currentnews._id+"/delete")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          News
            .findOne({ _id: currentnews._id })
            .exec( function (err, news) {
              if (err) { throw new Error("Error: " + err); }
              if (news) { throw new Error("Didn't delete news: " + currentnews._id); }
          });
        })
        .end(done);
    });
  });

});