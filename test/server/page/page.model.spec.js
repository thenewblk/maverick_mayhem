// test/page/page.model.spec.js
var mongoose = require("mongoose"),
    Page    = require("../../../models/page"),
    Game    = require("../../../models/game"),
    Photo    = require("../../../models/photo"),
    News    = require("../../../models/news"),
    chai     = require("chai"),
    expect   = chai.expect,
    configDB = require('../../../config/database'),
    tools = require('../../../lib/utils'),
    util = require("util");
//tell Mongoose to use our test DB


describe("Page", function(){ 
  var currentpage, 
      example_game, 
      example_game_2,
      example_news,
      example_photo;

  before(function(done){ 
    mongoose.connect(configDB.test);

    var new_photo = new Photo({ 
      url             : "http://www.google.com",
      description     : "It's a picture of stuff."
    });

    var new_news = new News({ 
      title   : "Super Duper Title",
      link    : "http://www.google.com",
      image   : "http://www.instagram.com",
      credit  : "OWH"
    });

    var new_game = new Game({ 
      name        : 'Us vs Them',
      opponent    : 'Other Team',
      date        : 'today',
      time        : '3:00pm',
      ticket      : 'http://www.google.com',
      location    : 'not here',
      scores      : { us: [1,1,2], them: [1,0,1] }
    });

    var new_game_2 = new Game({ 
      name        : 'Omaha vs Lincoln',
      opponent    : 'Lincoln',
      date        : 'Tomorrow',
      time        : '7:07pm',
      ticket      : 'http://www.instagram.com',
      location    : 'lincoln',
      scores      : { us: [10,1,3], them: [1,3,4] }
    });



    Game.create(new_game, function (err, game) {
      if (err) return handleError(err);
      example_game = game;

      Game.create(new_game_2, function (err, game) {
        if (err) return handleError(err);
        example_game_2 = game;

        Photo.create(new_photo, function (err, photo) {
          if (err) return handleError(err);
          example_photo = photo;

          News.create(new_news, function (err, news) {
            if (err) return handleError(err);
            example_news = news;
            var tmp_page = new Page({ 
              name          : 'Hockey',
              video         : 'http://dfcb.github.io/BigVideo.js/vids/dock.mp4',
              icon          : 'http://dfcb.github.io/BigVideo.js/vids/dock.mp4',
              headline      : 'Super Headline',
              banner        : 'Some sort of Banner Image',
              description   : 'Some sort of Description',
              games         : [ example_game._id, example_game_2._id ],
              news          : [ example_news._id ],
              photos        : [ example_photo._id ]
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
    });
  });


  after(function(done){ 
    Page.remove({}, function() { 
      Game.remove({}, function() { 
        Photo.remove({}, function() { 
          News.remove({}, function() { 
            mongoose.disconnect();
            done(); 
          }); 
        }); 
      }); 
    }); 
   });


  it("count is equal to one", function(done){ 
    Page.count({}, function(err, c) {
      if (err) return console.error(err);
      expect(1).to.equal(c);
      done();
    })
  });

  it("can be found by name and created attributes", function(done){ 
    Page.findOne({name: currentpage.name}, function(err, page) {
      if (err) return console.error(err); 
      expect(page.name).to.equal(currentpage.name);
      expect(page.video).to.equal(currentpage.video);
      expect(page.icon).to.equal(currentpage.icon);
      expect(page.headline).to.equal(currentpage.headline);
      expect(page.banner).to.equal(currentpage.banner);
      expect(page.description).to.equal(currentpage.description);
      done();
    });
  }); 


  it("creates correct slug", function(done){ 
    Page.findOne({ name: currentpage.name }, function(err, page) {
      if (err) return console.error(err); 
      expect(page.slug).to.equal(tools.slugify(currentpage.name));
      done();
    });
  }); 

  it("Page has 2 games", function(done){ 
    Page.findOne({name: currentpage.name}, function(err, page) {
      if (err) return console.error(err); 
      expect(2).to.equal(page.games.length);
      done();
    });
  });

  it("creates a game", function(done){ 
    Page
      .findOne({ name: currentpage.name })
      .populate('games')
      .exec(function(err, page) {
        if (err) return console.error(err); 
        expect(page.games[0].name).to.equal(example_game.name);
        done();
    });
  }); 

  it("Page has 1 photos", function(done){ 
    Page.findOne({name: currentpage.name}, function(err, page) {
      if (err) return console.error(err); 
      expect(1).to.equal(page.photos.length);
      done();
    });
  });

  it("creates a photo[url]", function(done){ 
    Page
      .findOne({ name: currentpage.name })
      .populate('photos')
      .exec(function(err, page) {
        if (err) return console.error(err); 
        expect(page.photos[0].url).to.equal(example_photo.url);
        done();
    });
  }); 

  it("creates a photo[description]", function(done){ 
    Page
      .findOne({ name: currentpage.name })
      .populate('photos')
      .exec(function(err, page) {
        if (err) return console.error(err); 
        expect(page.photos[0].description).to.equal(example_photo.description);
        done();
    });
  }); 

  it("Page has 1 news", function(done){ 
    Page.findOne({name: currentpage.name}, function(err, page) {
      if (err) return console.error(err); 
      expect(1).to.equal(page.news.length);
      done();
    });
  });

  it("creates a news[title]", function(done){ 
    Page
      .findOne({ name: currentpage.name })
      .populate('news')
      .exec(function(err, page) {
        if (err) return console.error(err); 
        expect(page.news[0].title).to.equal(example_news.title);
        done();
    });
  }); 

  it("creates a news[link]", function(done){ 
    Page
      .findOne({ name: currentpage.name })
      .populate('news')
      .exec(function(err, page) {
        if (err) return console.error(err); 
        expect(page.news[0].link).to.equal(example_news.link);
        done();
    });
  }); 

  it("creates a news[image]", function(done){ 
    Page
      .findOne({ name: currentpage.name })
      .populate('news')
      .exec(function(err, page) {
        if (err) return console.error(err); 
        expect(page.news[0].image).to.equal(example_news.image);
        done();
    });
  }); 

  it("creates a news[credit]", function(done){ 
    Page
      .findOne({ name: currentpage.name })
      .populate('news')
      .exec(function(err, page) {
        if (err) return console.error(err); 
        expect(page.news[0].credit).to.equal(example_news.credit);
        done();
    });
  }); 


  it("updates game", function(done){ 
    Page
      .findOne({ name: currentpage.name })
      .populate('games')
      .exec(function(err, page) {
        if (err) return console.error(err); 
        Game
          .findOne({ _id: page.games[0]._id })
          .exec(function(err, game){
            game.name = "Ostrich";
            game.save(function(err){
              if (err) return console.error(err); 
              Page
                .findOne({ name: currentpage.name })
                .populate('games')
                .exec(function(err, page) {
                  if (err) return console.error(err); 
                  expect("Ostrich").to.equal(page.games[0].name);
                  done();
              });
            });
          });
      });
  }); 
});