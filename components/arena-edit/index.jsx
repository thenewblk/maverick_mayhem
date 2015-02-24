var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    Dropzone = require('../dropzone.js');

var Isvg = require('react-inlinesvg');

var News = require('./news.jsx'),
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
      photos: [], 
      news: [], 
      submitted: false };
  },
  
  componentWillMount: function(){
    var self = this;

    if (Content.length) {
      console.log('Content: '+Content);

      request
        .get('/api/pages/our-house')
        .end(function(res) {
          console.log(res)
          if (res.text) {
            var Page = JSON.parse(res.text);
            Page.status = "edit";
            self.setState(Page);
            console.log(Page)
          }
        }.bind(self));
    } else {
      console.log('No Content found.');
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
          var new_photos = current_photos.concat(new_photo);
          self.setState({photos: new_photos });
        }
      }.bind(self));
  },

  handleRemovePhoto: function(photo) {

    var self = this,
        current_photos = self.state.photos,
        found_photo;

    for ( i in  current_photos) {
      if ( current_photos[i] == photo._id ){
        found_photo = i;
      }
    }
    current_photos.splice(found_photo, 1);

    self.setState({photos: current_photos });
  },

  newNews: function() {
    console.log('newNews');
    var current_news = this.state.news;
    var new_news = current_news.concat({status: 'new', identifier: Math.random()});
    this.setState({news: new_news});
  },

  newNewsSaved: function(content) {
    console.log("new new saved: "+ util.inspect(content));
    var self = this,
        current_news = self.state.news, 
        found_new;

    if (content.identifier) {
      for ( i in  current_news) {
        if ( current_news[i].identifier == content.identifier ){
          found_new = i;
        }
      }
      current_news[found_new] = content;

      self.setState({news: current_news });      
    }
  },


  handleRemoveNews: function(object) {

    var self = this,
        current_news = self.state.news,
        found_new;

    if (object._id) {
      for ( i in  current_news) {
        if ( current_news[i] == object._id ){
          found_new = i;
        }
      }
      current_news.splice(found_new, 1);

      self.setState({news: current_news });      
    }
  },

  handleRemoveNewNews: function(object) {

    var self = this,
        current_news = self.state.news,
        found_new;

    if (object._id) {
      for ( i in  current_news) {
        if ( current_news[i].identifier == object._id ){
          found_new = i;
        }
      }
      current_news.splice(found_new, 1);

      self.setState({news: current_news });      
    }
  },

  submitContent: function(){
    var self = this;
    var tmp_matchups = self.state.matchups.sort(function(a,b){
      return new Date(a.games[0].date) - new Date(b.games[0].date);
    });
    self.setState({submitted: true, matchups: tmp_matchups});
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

  testContent: function(){
    console.log(util.inspect(this.state));
  },

  render: function () {
    var self = this;

    var name = self.state.name,
        headline = self.state.headline,
        banner = self.state.banner,
        description = self.state.description,
        status = self.state.status;

    var photos = self.state.photos.map(function(object) {
      return <Photo 
        url={object.url} 
        _id={object._id}

        key={object._id}
        featured={object.featured} 
        description={object.description} 
        remove_photo={self.handleRemovePhoto}

        identifier={Math.random()} />
    });

    var news = self.state.news.reverse().map(function(object) {
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
        remove_new_news={self.handleRemoveNewNews}

        new_news={self.newNewsSaved}

        identifier={object.identifier} />
    });

    if (status == 'new') {
      return (
        <div className="page">
          <h2 className="page_edit_title">New Page</h2>
          <h3><input type="text" value={name} onChange={this.handleNameChange} placeholder="Name" /></h3>
          <h5><input type="text" value={description} onChange={this.handleDescriptionChange} placeholder="Description" /></h5>

          <div className="games">
            <p className="page_edit_title_box">Press</p>
            <h6 className="new_game" onClick={this.newNews}><Isvg className="plus-icon" src="/img/icon--plus.svg"></Isvg></h6>
            {news}
          </div> 

          { photos ?
            <div className="photos">
              <p className="page_edit_title_small">Photos</p>
              {photos}
            </div> 
            : ''
          }

          <PhotosUploader photos={this.handleNewPhoto} />
          
          <a className='submit' onClick={this.submitContent}>save page</a>
          <a className='submit' onClick={this.testContent}>test</a>

        </div>
      );
    } else if (status == 'edit') {
      return (
        <div className="page">
          <h2 className="page_edit_title">Edit {name}</h2>

          <div className="games">
            <p className="page_edit_title_box">Press</p>
            <h6 className="new_game" onClick={this.newNews}><Isvg className="plus-icon" src="/img/icon--plus.svg"></Isvg></h6>
            {news}
          </div> 

          { photos ?
            <div className="photos">
              <p className="page_edit_title_small">Photos</p>
              {photos}
            </div> 
            : ''
          }

          <PhotosUploader photos={this.handleNewPhoto} />

          <div className='edit_buttons'>
            <a className='edit_button red' onClick={this.submitContent}>post</a>
            <a className='edit_button' href={"/"+self.state.slug}>Cancel</a>
            <a className='edit_button test' onClick={this.testContent}>Test</a>
          </div>
        </div>
      );
    }
  }
});


// module.exports = Page; 

React.renderComponent(
 Page(Content),
  document.getElementById('new_page')
)