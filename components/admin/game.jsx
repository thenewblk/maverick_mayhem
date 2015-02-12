var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    moment = require('moment'),
    Dropzone = require('../dropzone.js'),
    Photo = require('./photo.jsx'),
    PhotosUploader = require('./photos_uploader.jsx');

var DatePicker = require('react-date-picker');

var Score = React.createClass({
  getInitialState: function() {
    return { us: Number, them: Number };
  },

  componentWillMount: function(){
    var self = this;
    var tmp_score = {};
    tmp_score.identifier = self.props.identifier,
    tmp_score.us = self.props.us,
    tmp_score.them = self.props.them,
    tmp_score.status = self.props.status;

    self.setState(tmp_score);
  },

  handleUsChange: function(event) {
    this.setState({us: event.target.value});
  },

  handleThemChange: function(event) {
    this.setState({them: event.target.value});
  },

  handleEdit: function() {
    this.setState({status: 'edit'});
  },

  submitContent: function(){
    var self = this;
    var tmp_score = {};
        tmp_score = self.state,
        tmp_score.status = 'show';

    self.props.submit(tmp_score);

    // self.setState({status: 'show'})
  },

  render: function () {
    var self = this;

    var us = self.state.us,
        them = self.state.them,
        status = self.state.status;
        
    if ( status == 'new' ) {
      return (
        <div className="score">
          <input type="number" value={us} onChange={this.handleUsChange} placeholder="Us" />
          <input type="number" value={them} onChange={this.handleThemChange} placeholder="Them" />
          <a className='submit' onClick={this.submitContent}>save</a>
        </div>
      )
    } else if ( status == 'edit' ) {
      return (
        <div className="score">
          <input type="number" value={us} onChange={this.handleUsChange} placeholder="Us" />
          <input type="number" value={them} onChange={this.handleThemChange} placeholder="Them" />
          <a className='submit' onClick={this.submitContent}>save</a>
        </div>
      )
    } else {
      return (
        <div className="score">
          {us}, {them}
          <span onClick={this.handleEdit}>Edit</span>
        </div>
      )
    }
  }
});

var Game = React.createClass({
  getInitialState: function() {
    return { 
        name: '', 
        status: 'show', 
        opponent: '', 
        date: '2015-01-01', 
        time: '', 
        ticket: '', 
        location: '', 
        home: false, 
        scores: [],
        tmp_photos: [],
        photos: [],
        series: [] };
  },

  componentWillMount: function(){
    var self = this;
    console.log('self.props.slug: '+self.props.slug);
    console.log('self.props.photos: '+self.props.photos);

    var tmp_game = self.props;

    if (tmp_game.series.length > 0) {
      tmp_game.isSeries = true;
    } else {
      tmp_game.isSeries = false;
    }

    


    self.setState(tmp_game);

    // if( self.props.slug ) {
    //   request
    //     .get('/api/games/'+self.props.slug)
    //     .end(function(res) {
    //       console.log(res)
    //       if (res.text) {
    //         var game = JSON.parse(res.text);
    //         self.setState(game);

    //       }
    //     }.bind(self));

    // } else {
    //   var tmp_game = {};
    //       tmp_game.status = self.props.status,
    //       tmp_game.identifier = self.props.identifier;
    //   self.setState(tmp_game);
    // }
    // console.log(self.state.scores);

  },

  componentDidMount: function(){

  },


  handleNameChange: function(event) {
    this.setState({name: event.target.value});
  },
  handleOpponentChange: function(event) {
    this.setState({opponent: event.target.value});
  },
  handleDateChange: function(event) {
    this.setState({date: event.target.value});
  },
  handleTimeChange: function(event) {
    this.setState({time: event.target.value});
  },
  handleTicketChange: function(event) {
    this.setState({ticket: event.target.value});
  },
  handleLocationChange: function(event) {
    this.setState({location: event.target.value});
  },
  handleHomeChange: function(event) {
    console.log('handleHomeChange: '+event.target.value);
    this.setState({home: !this.state.home});
  },

  isSeriesChange: function(event) {
    console.log('isSeriesChange: '+event.target.value);
    this.setState({isSeries: !this.state.isSeries});
  },


  // Photo Stuff

  handleNewPhoto: function(photo) {
    var self = this,
        current_tmp_photos = self.state.tmp_photos,
        current_photos = self.state.photos;

    console.log('handleNewPhoto:' + util.inspect(photo));

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

  // Score Stuff

  handleScoreChange: function(content) {
    var current_scores = this.state.scores;

    for(var i in current_scores) {
      if (current_scores[i].identifier == content.identifier || current_scores[i]._id == content.identifier){
        current_scores[i].us = content.us;
        current_scores[i].them = content.them;
        current_scores[i].status = content.status;
      }
    }

    this.setState({ scores: current_scores});

  },

  newScore: function() {
    console.log('newGame');
    var current_scores = this.state.scores;
    console.log(' '+util.inspect(current_scores));
    var new_scores = current_scores.concat({status: 'new', identifier: Math.random()});
    console.log(' '+util.inspect(new_scores));
    this.setState({scores: new_scores});

  },

  handleEdit: function(){
    this.setState({status: "edit"})
  },

  handleRemove: function(){
    this.props.remove_game({_id: this.state._id});
  },

  submitContent: function(){
    var self = this;
    var tmp_game = self.state;
    var current_scores = tmp_game.scores;



    for(var i in current_scores) {
        delete current_scores[i].status;
        delete current_scores[i].identifier
    }

    tmp_game.scores = current_scores;

    request
      .post('/api/games/new')
      .send(tmp_game)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          console.log('new game: '+res.text);
          var new_game = JSON.parse(res.text);
          new_game.identifier = self.state.identifier;
          new_game.status = 'show';
          self.props.new_game(new_game);
          self.setState(new_game);
        }
      }.bind(self));
  },

  editContent: function(){
    var self = this;
    var tmp_game = self.state;
    var current_scores = tmp_game.scores;



    for(var i in current_scores) {
        delete current_scores[i].status;
        delete current_scores[i].identifier
    }

    tmp_game.scores = current_scores;


    console.log('editContent: '+util.inspect(self.state));
    // self.setState({submitted: true});
    request
      .post('/api/games/'+self.state.slug+'/edit')
      .send(tmp_game)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          console.log('new game: '+res.text);
          var new_game = JSON.parse(res.text);
          new_game.identifier = self.state.identifier;
          new_game.status = 'show';
          self.setState(new_game);
        }
      }.bind(self));
  },

  cancelEdit: function() {
    this.setState({status: 'show'});
  },

  dateChange: function(moment, dateText) {
    this.setState({date: moment}); 
  },


  render: function () {
    var self = this;

    var name = self.state.name,
        opponent = self.state.opponent,
        date = self.state.date,
        time = self.state.time,
        ticket = self.state.ticket,
        location = self.state.location,
        home = self.state.home,
        scores = self.state.scores,
        series = self.state.series,
        isSeries = self.state.isSeries,
        status = self.state.status;

    var the_scores = scores.map(function(object) {
      var identifier = object.identifier || object._id;
      var status = object.status || "show";
      return <Score
        us={object.us} 
        them={object.them} 
        status={status}

        identifier={identifier}
        key={identifier}

        submit={self.handleScoreChange} />
    });

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


    if ((status == 'new') || (status == 'edit')) {
      return (
        <div className="game">
          { status == 'new' ? 
            <h3>New Game</h3> 
          : 
            <h3>Edit Game</h3> 
          }
          <h3><input type="text" value={name} onChange={this.handleNameChange} placeholder="Name" /></h3>
          <h5><input type="text" value={opponent} onChange={this.handleOpponentChange} placeholder="Opponent" /></h5>
          <h5><input type="text" value={ticket} onChange={this.handleTicketChange} placeholder="Ticket Link" /></h5>
          <h5><input type="text" value={location} onChange={this.handleLocationChange} placeholder="Location" /></h5>
          <h5 className="home">Home: <input type="checkbox" checked={home} onChange={this.handleHomeChange} /></h5>

          <h5 className="home">Series?: <input type="checkbox" checked={isSeries} onChange={this.isSeriesChange} /></h5>

          <h5>Date: </h5>
          <DatePicker
                  hideFooter={true}
                  date={date} 
                  onChange={self.dateChange}  />
          <h5><input type="text" value={time} onChange={this.handleTimeChange} placeholder="Time" /></h5>

          { the_scores ?
            <div className="Scores">
              {the_scores}
            </div> 
          : '' }
          <h6 onClick={this.newScore}>New Score</h6>

          { photos ?
            <div className="photos">
              <h3 className="page_edit_title">Photos</h3>
              {photos}
            </div> 
            : ''
          }

          <PhotosUploader photos={this.handleNewPhoto} />
          
          <div className='half_buttons'>
            { status == 'new' ? 
              <a className='submit' onClick={self.submitContent}>new save</a> 
            : 
              <a className='submit' onClick={self.editContent}>edit save</a> 
            }
            <a className='submit' onClick={self.cancelEdit}>cancel</a> 
          </div>
        </div>
      )
    } else {

      var us_scores = scores.map(function(object) {
        return <span>{object.us}</span>;
      });

      var them_scores = scores.map(function(object) {
        return <span>{object.them}</span>;
      });

      return (
        <div className="game">
          <h3>{name}</h3>
          <ul>
            <li>Opponent: {opponent}</li>
            <li>Date: {moment(date).format('MMMM Do YYYY')}</li>
            <li>Time: {time}</li>
            <li>Ticket Link: {ticket}</li>
            <li>Location: {location}</li>
            <li>Home?: {home ? "True" : 'False'}</li>
            <li>Us: {us_scores}</li>
            <li>Them: {them_scores}</li>
          </ul>

          { photos ?
            <div className="photos">
              <h3 className="page_edit_title">Photos</h3>
              {photos}
            </div> 
            : ''
          }

          <div className='half_buttons'>
            <a className='submit' onClick={self.handleEdit}>edit</a> 
            <a className='submit' onClick={self.handleRemove}>remove</a> 
          </div>
        </div>
      )
    }
  }
});

module.exports = Game;