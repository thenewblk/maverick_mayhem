// test/photos/photo.routes.spec.js
var request       = require("supertest"),
    mongoose      = require("mongoose"),
    Photo          = require("../../../models/photo"),
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
require("../../../routes/photo")(app);

describe("Server-side routes", function(){
  var currentphoto, new_photo;

  before(function(done){ 
    mongoose.connect(configDB.test);

    var tmp_photo = new Photo({ 
      url             : "http://www.google.com",
      description     : "It's a picture from google."
    });


    tmp_photo.save(function(err, photo) {
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

  describe("POST /api/photos/new", function(){
    it("respond with json", function(done){

      new_photo = new Photo({ 
        url            : "http://www.instagram.com",
        description    : "It's a picture from instagram.",
      });

      request(app)
        .post("/api/photos/new")
        .send(new_photo)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Photo
            .findOne({ _id: res.body._id })
            .exec( function (err, photo) {
              if (err) { throw new Error("Error: " + err); }
              expect(res.body.url).to.equal(new_photo.url);
          });
        })
        .end(done);
    });
  });

  describe("GET /api/photos", function(){

    it("respond with json", function(done){
      request(app)
        .get("/api/photos")
        .expect("Content-Type", /json/)
        .expect(200, done);
    });

  });

  describe("GET /api/photos/:id", function(){

    it("respond with json", function(done){
      request(app)
        .get("/api/photos/"+currentphoto._id)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          expect(res.body.url).to.equal(currentphoto.url);
        })
        .end(done);
    });

  });

  describe("POST /api/photos/:id/edit", function(){
    it("respond with json", function(done){
      request(app)
        .post("/api/photos/"+currentphoto._id+"/edit")
        .send({ url: new_photo.url })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Photo
            .findOne({ _id: res.body._id })
            .exec( function (err, photo) {
              if (err) { throw new Error("Error: " + err); }
              expect(res.body.url).to.equal(photo.url);
          });
        })
        .end(done);
    });
  });

  describe("DELETE /api/photos/:id/delete", function(){
    it("respond with json", function(done){
      request(app)
        .delete("/api/photos/"+currentphoto._id+"/delete")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          Photo
            .findOne({ _id: currentphoto._id })
            .exec( function (err, photo) {
              if (err) { throw new Error("Error: " + err); }
              if (photo) { throw new Error("Didn't delete photo: " + currentphoto._id); }
          });
        })
        .end(done);
    });
  });

});