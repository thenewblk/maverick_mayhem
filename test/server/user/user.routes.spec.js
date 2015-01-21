// test/user/user.routes.spec.js
var request  = require("supertest"),
    mongoose = require("mongoose"),
    User     = require("../../../models/user"),
    express  = require("express"),
    chai     = require("chai"),
    expect   = chai.expect,
    configDB = require("../../../config/database"),
    app      = express(),
    passport  = require("passport"),
    bodyParser = require("body-parser"),
    tools = require("../../../lib/utils"),
    util = require("util");

    require('../../../config/passport')(passport); 

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(passport.initialize());
    app.use(passport.session()); 

// Load up our routes
require("../../../routes/index")(app, passport);

describe("Server-side routes", function(){
  var currentuser = null;
  var user_name = "Umbrella";
  var new_user_name = "Ostrich";

  before(function(done){ 
    mongoose.connect(configDB.test);

    currentuser = new User({ 
      name: "John Smith" 
    });

    currentuser.local.email    = 'john@example.com';
    currentuser.local.password = currentuser.generateHash('123456');

    currentuser.save(function(err, user) {
      if (err) return console.error(err);
      done();
    });

  });

  after(function(done){ 
    User.remove({}, function() { 
      mongoose.disconnect();
      done(); 
    }); 
  });


  describe("POST /signup-js", function(){
    it("respond with json", function(done){
      request(app)
        .post("/signup-js")
        .send({ email: 'alex@awesome.com', password: '123456' })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          User
            .findOne({ 'local.email': 'alex@awesome.com' })
            .exec( function (err, user) {
              if (err) { throw new Error("Error: " + err); }
              expect(res.body.local.email).to.equal(user.local.email);
          });
        })
        .end(done);
    });
  });

  describe("POST /login-js [RIGHT PASSWORD]", function(){
    it("respond with json", function(done){
      request(app)
        .post("/login-js")
        .send({ email: 'alex@awesome.com', password: '123456' })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          expect('alex@awesome.com').to.equal(res.body.local.email);
        })
        .end(done);
    });
  });

  describe("POST /login-js [WRONG PASSWORD]", function(){
    it("respond with json", function(done){
      request(app)
        .post("/login-js")
        .send({ email: 'alex@awesome.com', password: '654321' })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          expect('Incorrect password.').to.equal(res.body.message);
        })
        .end(done);
    });
  });


  describe("POST /login-js [USER NOT FOUND]", function(){
    it("respond with json", function(done){
      request(app)
        .post("/login-js")
        .send({ email: 'alex@notawesome.com', password: '654321' })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function(res) {
          // console.log('res.body.message: '+res.body.message);
          expect('No user found.').to.equal(res.body.message);
        })
        .end(done);
    });
  });

  // describe("GET /api/users", function(){

  //   it("respond with json", function(done){
  //     request(app)
  //       .get("/api/users")
  //       .expect("Content-Type", /json/)
  //       .expect(200, done);
  //   });

  // });

  // describe("GET /api/user/:slug", function(){

  //   it("respond with json", function(done){
  //     request(app)
  //       .get("/api/user/"+currentuser.slug)
  //       .expect("Content-Type", /json/)
  //       .expect(200)
  //       .expect(function(res) {
  //         expect(res.body.name).to.equal(currentuser.name);
  //       })
  //       .end(done);
  //   });

  // });

  // describe("POST /api/user/:slug/edit", function(){
  //   it("respond with json", function(done){
  //     request(app)
  //       .post("/api/user/"+currentuser.slug+"/edit")
  //       .send({ name: new_user_name })
  //       .expect("Content-Type", /json/)
  //       .expect(200)
  //       .expect(function(res) {
  //         User
  //           .findOne({ slug: tools.slugify(new_user_name) })
  //           .exec( function (err, user) {
  //             if (err) { throw new Error("Error: " + err); }
  //             expect(res.body.name).to.equal(user.name);
  //         });
  //       })
  //       .end(done);
  //   });
  // });

  // describe("DELETE /api/user/:slug/delete", function(){
  //   it("respond with json", function(done){
  //     request(app)
  //       .delete("/api/user/"+tools.slugify(new_user_name)+"/delete")
  //       .expect("Content-Type", /json/)
  //       .expect(200)
  //       .expect(function(res) {
  //         User
  //           .findOne({ slug: tools.slugify(new_user_name) })
  //           .exec( function (err, user) {
  //             if (err) { throw new Error("Error: " + err); }
  //             if (user) { throw new Error("Didn't delete user: " + tools.slugify(new_user_name)); }
  //         });
  //       })
  //       .end(done);
  //   });
  // });

});