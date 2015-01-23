// test/news/news.model.spec.js
var mongoose = require("mongoose"),
    News    = require("../../../models/news"),
    chai     = require("chai"),
    expect   = chai.expect,
    configDB = require('../../../config/database'),
    tools = require('../../../lib/utils');
//tell Mongoose to use our test DB


describe("News", function(){ 
  var currentnews;


  before(function(done){ 
    mongoose.connect(configDB.test);
    
    var news = new News({ 
      title   : "Super Duper Title",
      link    : "http://www.google.com",
      image   : "http://www.instagram.com",
      credit  : "OWH"
    });

    news.save(function(err, news) {
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


  it("count is equal to one", function(done){ 
    News.count({}, function(err, c) {
      if (err) return console.error(err);
      expect(1).to.equal(c);
      done();
    })
  });

  it("can be found by _id", function(done){ 
    News.findOne({_id: currentnews._id}, function(err, news) {
      if (err) return console.error(err); 
      expect(currentnews._id.toString()).to.equal(news._id.toString());
      done();
    });
  }); 


  it("saves correct title", function(done){ 
    News.findOne({_id: currentnews._id}, function(err, news) {
      if (err) return console.error(err); 
      expect("Super Duper Title").to.equal(news.title);
      done();
    });
  }); 

  it("saves correct link", function(done){ 
    News.findOne({_id: currentnews._id}, function(err, news) {
      if (err) return console.error(err); 
      expect("http://www.google.com").to.equal(news.link);
      done();
    });
  }); 

  it("saves correct image", function(done){ 
    News.findOne({_id: currentnews._id}, function(err, news) {
      if (err) return console.error(err); 
      expect("http://www.instagram.com").to.equal(news.image);
      done();
    });
  }); 

  it("saves correct credit", function(done){ 
    News.findOne({_id: currentnews._id}, function(err, news) {
      if (err) return console.error(err); 
      expect("OWH").to.equal(news.credit);
      done();
    });
  }); 

  it("creates correct slug", function(done){ 
    News.findOne({_id: currentnews._id}, function(err, news) {
      if (err) return console.error(err); 
      expect(news.slug).to.equal(tools.slugify(currentnews.title));
      done();
    });
  }); 
});