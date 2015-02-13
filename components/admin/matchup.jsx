var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    moment = require('moment'),
    Dropzone = require('../dropzone.js'),
    Photo = require('./photo.jsx'),
    PhotosUploader = require('./photos_uploader.jsx'),
    DatePicker = require('react-date-picker');

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
        
    if (( status == 'new' ) || ( status == 'edit' )) {
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
    return { date: '', time: '', scores: [] };
  },

  componentWillMount: function(){
    var self = this;
    var tmp_game = {};
    tmp_game.identifier = self.props.identifier,
    tmp_game.date = self.props.date,
    tmp_game.time = self.props.time,
    tmp_game.scores = self.props.scores,
    tmp_game.status = self.props.status || [];
    console.log('game: ' + util.inspect(tmp_game));
    self.setState(tmp_game);
  },

  dateChange: function(moment, dateText) {
    this.setState({date: moment}); 
  },

  handleEdit: function() {
    this.setState({status: 'edit'});
  },


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

  submitContent: function(){
    var self = this;
    var tmp_game = {};
        tmp_game = self.state,
        tmp_game.status = 'show';
    console.log('tmp_game: ' + util.inspect(tmp_game));
    self.props.submit(tmp_game);
  },

  render: function () {
    var self = this;
    console.log("self: " + self );
    var date = self.state.date,
        time = self.state.time,
        status = self.state.status,
        scores = self.state.scores;

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
        
    if (( status == 'new' ) || ( status == 'edit' )) {
      return (
        <div className="game">
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
          <a className='submit' onClick={this.submitContent}>save</a>
        </div>
      )
    } else {
      return (
        <div className="score">
          <p>{date}</p>
          <p>{time}</p>
          {the_scores}
          <span onClick={this.handleEdit}>Edit</span>
        </div>
      )
    }
  }
});

var Matchup = React.createClass({
  getInitialState: function() {
    return { 
        name: '', 
        status: 'show', 
        opponent: '', 
        ticket: '', 
        location: '', 
        home: false, 
        photos: [],
        games: [] };
  },

  componentWillMount: function(){
    var self = this;
    // console.log('self: '+util.inspect(self.props));
    var tmp_matchup = {};
        tmp_matchup._id = self.props._id, 
        tmp_matchup.name = self.props.name, 
        tmp_matchup.slug = self.props.slug, 
        tmp_matchup.status = self.props.status, 
        tmp_matchup.opponent = self.props.opponent, 
        tmp_matchup.ticket = self.props.ticket, 
        tmp_matchup.location = self.props.location, 
        tmp_matchup.home = self.props.home, 
        tmp_matchup.photos = self.props.photos,
        tmp_matchup.games = self.props.games; 
        tmp_matchup.identifier = self.props.identifier; 


    self.setState(tmp_matchup);

  },

  componentDidMount: function(){},


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

  // Photo Stuff

  handleNewPhoto: function(photo) {
    var self = this,
        current_photos = self.state.photos;

    console.log('handleNewPhoto:' + util.inspect(photo));

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
        current_photos = self.state.photos;

    var found_photo;
    for ( i in  current_photos) {
      if ( current_photos[i]._id == photo._id ){
        found_photo = i;
      }
    }
    current_photos.splice(found_photo, 1);

    self.setState({photos: current_photos });
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
    console.log('newmatchup');
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
    this.props.remove_matchup({_id: this.state._id});
  },

  submitContent: function(){
    var self = this;
    var tmp_matchup = self.state;
    var current_scores = tmp_matchup.scores;



    for(var i in current_scores) {
        delete current_scores[i].status;
        delete current_scores[i].identifier
    }

    tmp_matchup.scores = current_scores;

    request
      .post('/api/matchups/new')
      .send(tmp_matchup)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          console.log('new matchup: '+res.text);
          var new_matchup = JSON.parse(res.text);
          new_matchup.identifier = self.state.identifier;
          new_matchup.status = 'show';
          self.props.new_matchup(new_matchup);
          self.setState(new_matchup);
        }
      }.bind(self));
  },

  editContent: function(){
    var self = this;
    var tmp_matchup = self.state;
    var current_scores = tmp_matchup.scores;



    for(var i in current_scores) {
        delete current_scores[i].status;
        delete current_scores[i].identifier
    }

    tmp_matchup.scores = current_scores;


    console.log('editContent: '+util.inspect(self.state));
    // self.setState({submitted: true});
    request
      .post('/api/matchups/'+self.state._id+'/edit')
      .send(tmp_matchup)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          console.log('new matchup: '+res.text);
          var new_matchup = JSON.parse(res.text);
          new_matchup.identifier = self.state.identifier;
          new_matchup.status = 'show';
          self.setState(new_matchup);
        }
      }.bind(self));
  },

  cancelEdit: function() {
    this.setState({status: 'show'});
  },

  dateChange: function(moment, dateText) {
    this.setState({date: moment}); 
  },

  printPhotos: function(){
    console.log(util.inspect(this.state.photos));
  },

  newGame: function() {
    var current_games = this.state.games;
    var new_games = current_games.concat({status: 'new', identifier: Math.random(), scores: []});
    console.log(' '+util.inspect(new_games));
    this.setState({games: new_games});
  },

  handleGameChange: function(content) {
    var current_games = this.state.games;

    for(var i in current_games) {
      if (current_games[i].identifier == content.identifier || current_games[i]._id == content.identifier){
        current_games[i].date = content.date;
        current_games[i].time = content.time;
        current_games[i].scores = content.scores;
      }
    }
    this.setState({ games: current_games});
  },


  render: function () {
    var self = this;

    var name = self.state.name,
        opponent = self.state.opponent,
        date = self.state.date,
        ticket = self.state.ticket,
        location = self.state.location,
        home = self.state.home,
        status = self.state.status;

    var games = self.state.games.map(function(object) {
      return <Game 
        status={object.status}
        date={object.date} 
        time={object.time}
        scores={object.scores}
         
        remove_game={self.handleRemoveGame}

        identifier={Math.random()} 

        submit={self.handleGameChange} />
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
        <div className="matchup">
          { status == 'new' ? 
            <h3>New matchup</h3> 
          : 
            <h3>Edit matchup</h3> 
          }
          <h3><input type="text" value={name} onChange={this.handleNameChange} placeholder="Name" /></h3>
          <h5><input type="text" value={opponent} onChange={this.handleOpponentChange} placeholder="Opponent" /></h5>
          <h5><input type="text" value={ticket} onChange={this.handleTicketChange} placeholder="Ticket Link" /></h5>
          <h5><input type="text" value={location} onChange={this.handleLocationChange} placeholder="Location" /></h5>
          <h5 className="home">Home: <input type="checkbox" checked={home} onChange={this.handleHomeChange} /></h5>

          {games}

          <a className='submit' onClick={self.newGame}>new game</a> 

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

      return (
        <div className="matchup">
          <h3>{name}</h3>
          <h3>{date}</h3>
          <ul>
            <li>Opponent: {opponent}</li>
            <li>Ticket Link: {ticket}</li>
            <li>Location: {location}</li>
            <li>Home?: {home ? "True" : 'False'}</li>
          </ul>
          {games}
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

module.exports = Matchup;