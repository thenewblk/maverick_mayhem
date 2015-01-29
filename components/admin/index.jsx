var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    Dropzone = require('../dropzone.js');

var Content = window.slug || {};

var Game = require('./game.jsx'),
    News = require('./news.jsx'),
    Photo = require('./photo.jsx'),
    PhotosUploader = require('./photos_uploader.jsx');

var Page = React.createClass({
  getInitialState: function() {
    return { 
      name: '', 
      status: 'new', 
      headline: '', 
      banner: '', 
      description: '', 
      video: {}, 
      icon: {}, 
      games: [], 
      tmp_games: [], 
      photos: [], 
      tmp_photos: [], 
      news: [], 
      tmp_news: [],
      submitted: false };
  },
  componentWillMount: function(){
    var self = this;

    if (Content) {

      request
        .get('/api/pages/'+Content)
        .end(function(res) {
          console.log(res)
          if (res.text) {
            var Page = JSON.parse(res.text);
            Page.status = "edit";
            var tmp_games = Page.games;
            Page.tmp_games = tmp_games;
            Page.games = [];
            for ( i in  Page.tmp_games) {
              Page.games[i] = Page.tmp_games[i]._id;
            }

            var tmp_photos = Page.photos;
            Page.tmp_photos = tmp_photos;
            Page.photos = [];
            for ( i in  Page.tmp_photos) {
              Page.photos[i] = Page.tmp_photos[i]._id;
            }

            var tmp_news = Page.news;
            Page.tmp_news = tmp_news;
            Page.news = [];
            for ( i in  Page.tmp_news) {
              Page.news[i] = Page.tmp_news[i]._id;
            }

            self.setState(Page);
            console.log(Page)
          }
        }.bind(self));
    }
  },
  handleNameChange: function(event) {
    this.setState({name: event.target.value});
  },

  handleHeadlineChange: function(event) {
    this.setState({headline: event.target.value});
  },

  handleBannerChange: function(event) {
    this.setState({banner: event.target.value});
  },

  handleDescriptionChange: function(event) {
    this.setState({description: event.target.value});
  },


  handleNewPhoto: function(photo) {
    var self = this,
        current_tmp_photos = self.state.tmp_photos,
        current_photos = self.state.photos;

    request
      .post('/api/photos/new')
      .send(photo)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          var new_photo = JSON.parse(res.text);
          var new_tmp_photos = current_tmp_photos.concat(new_photo);
          var new_photos = current_photos.concat(new_photo._id);
          self.setState({tmp_photos: new_tmp_photos, photos: new_photos });
        }
      }.bind(self));
  },

  handleRemovePhoto: function(photo) {

    var self = this,
        current_tmp_photos = self.state.tmp_photos,
        current_photos = self.state.photos;

    var found_tmp_photo, found_photo;

    for ( i in  current_tmp_photos) {
      if ( current_tmp_photos[i]._id == photo._id ){
        found_tmp_photo = i;
      }
    }

    current_tmp_photos.splice(found_tmp_photo, 1);

    for ( i in  current_photos) {
      if ( current_photos[i] == photo._id ){
        found_photo = i;
      }
    }
    current_photos.splice(found_photo, 1);

    self.setState({tmp_photos: current_tmp_photos, photos: current_photos });
  },


  handleRemoveGame: function(game) {

    var self = this,
        current_tmp_games = self.state.tmp_games,
        current_games = self.state.games;

    var found_tmp_game, found_game;
    if (game._id) {
      for ( i in  current_tmp_games) {
        if ( current_tmp_games[i]._id == game._id ){
          found_tmp_game = i;
        }
      }

      current_tmp_games.splice(found_tmp_game, 1);

      for ( i in  current_games) {
        if ( current_games[i] == game._id ){
          found_game = i;
        }
      }
      current_games.splice(found_game, 1);

      self.setState({tmp_games: current_tmp_games, games: current_games });      
    } else {
      for ( i in  current_tmp_games) {
        if ( current_tmp_games[i].identifier == game.identifier ){
          found_tmp_game = i;
        }
      }

      current_tmp_games.splice(found_tmp_game, 1);

      self.setState({tmp_games: current_tmp_games });
    }

  },

  newGameSaved: function(content) {
    console.log('newGameSaved');
    var current_games = this.state.games;

    var new_games = current_games.concat(content._id);

    this.setState({games: new_games});
  },

  newGame: function() {
    console.log('newGame');
    var current_games = this.state.tmp_games;
    var new_games = current_games.concat({status: 'new', identifier: Math.random()});
    this.setState({tmp_games: new_games});
  },

  newNews: function() {
    console.log('newNews');
    var current_news = this.state.tmp_news;
    var new_news = current_news.concat({status: 'new', identifier: Math.random()});
    this.setState({tmp_news: new_news});
  },

  newNewsSaved: function(content) {
    console.log('newNewsSaved');
    var current_news = this.state.news;

    var new_news = current_news.concat(content._id);

    this.setState({news: new_news});
  },


  handleRemoveNews: function(object) {

    var self = this,
        current_tmp_news = self.state.tmp_news,
        current_news = self.state.news;

    var found_tmp_new, found_new;

    if (object._id) {
      for ( i in  current_tmp_news) {
        if ( current_tmp_news[i]._id == object._id ){
          found_tmp_new = i;
        }
      }

      current_tmp_news.splice(found_tmp_new, 1);

      for ( i in  current_news) {
        if ( current_news[i] == object._id ){
          found_new = i;
        }
      }
      current_news.splice(found_new, 1);

      self.setState({tmp_news: current_tmp_news, news: current_news });      
    } else {
      for ( i in  current_tmp_news) {
        if ( current_tmp_news[i].identifier == object.identifier ){
          found_tmp_new = i;
        }
      }

      current_tmp_news.splice(found_tmp_new, 1);
      self.setState({tmp_news: current_tmp_news });
    }
  },

  submitContent: function(){
    var self = this;
    self.setState({submitted: true});
    if (self.state.status == "new") {
      request
        .post('/api/pages/new')
        .send(self.state)
        .end(function(res) {
          console.log(res)
          if (res.text) {
            var response = JSON.parse(res.text);
            window.location = '/'+response.slug;
          }
        }.bind(self));
    } else if (self.state.status == "edit") {
      request
        .post('/api/pages/'+self.state.slug+'/edit')
        .send(self.state)
        .end(function(res) {
          if (res.text) {
            window.location = '/'+self.state.slug;
          }
        }.bind(self));
    }
  },

  render: function () {
    var self = this;

    var name = self.state.name,
        headline = self.state.headline,
        banner = self.state.banner,
        description = self.state.description;  

    var games = self.state.tmp_games.map(function(object) {
      return <Game 
        name={object.name}
        slug={object.slug} 
        opponent={object.opponent}
        date={object.date}
        time={object.time}
        ticket={object.ticket}
        location={object.location}
        home={object.home}
        scores={object.scores}
        status={object.status}

        remove_game={self.handleRemoveGame}

        identifier={object.identifier}
        new_game={self.newGameSaved} />
    }); 

    var photos = self.state.tmp_photos.map(function(object) {
      return <Photo 
        url={object.url} 
        _id={object._id}

        key={object._id}

        description={object.description} 
        remove_photo={self.handleRemovePhoto}

        identifier={Math.random()} />
    });

    var news = self.state.tmp_news.map(function(object) {
      console.log('news: '+util.inspect(object));
      return <News 
        title={object.title} 
        link={object.link} 
        image={object.image} 
        credit={object.credit} 
        status={object.status} 

        _id={object._id}

        key={object._id}

        remove_news={self.handleRemoveNews}
        new_news={self.newNewsSaved}

        identifier={Math.random()} />
    });

    return (
      <div className="page">
        <h2 className="page_edit_title">Edit Page</h2>
        <h3><input type="text" value={name} onChange={this.handleNameChange} placeholder="Name" /></h3>
        <h5><input type="text" value={headline} onChange={this.handleHeadlineChange} placeholder="Headline" /></h5>
        <h5><input type="text" value={banner} onChange={this.handleBannerChange} placeholder="Banner" /></h5>
        <h5><input type="text" value={description} onChange={this.handleDescriptionChange} placeholder="Description" /></h5>
 
        { games ?
          <div className="games">
            <h2 className="page_edit_title">Games</h2>
            {games}
          </div> 
        : '' }
        <h6 className="new_game" onClick={this.newGame}><span className="fa fa-plus"></span>New Game</h6>


        { news ?
          <div className="games">
            <h2 className="page_edit_title">News</h2>
            {news}
          </div> 
        : '' }
        <h6 className="new_game" onClick={this.newNews}><span className="fa fa-plus"></span>New News</h6>
        
        { photos ?
          <div className="photos">
            <h2 className="page_edit_title">Photos</h2>
            {photos}
          </div> 
          : ''
        }

        <PhotosUploader photos={this.handleNewPhoto} />

        <a className='submit' onClick={this.submitContent}>save page</a>
      </div>
    );
  }
});


// module.exports = Page; 

React.renderComponent(
 Page(Content),
  document.getElementById('new_page')
)