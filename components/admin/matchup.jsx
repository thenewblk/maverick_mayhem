var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    moment = require('moment'),
    Dropzone = require('../dropzone.js'),
    Photo = require('./photo.jsx'),
    PhotosUploader = require('./photos_uploader.jsx'),
    DatePicker = require('react-date-picker'),
    tools = require('../../lib/utils');

var Isvg = require('react-inlinesvg');

function getPeriod(i) {
  if (this.slug == "hockey"){ 
    if (i < 4 ) {
      return tools.ordinal(i);
    } else {
      return "OT";
    }
  } else {
    return tools.ordinal(i);
  }
}

function getUsTotal(game) {
  var total = game.scores.reduce(function(a, b) {
    return a + b.us;
  }, 0);
  return total;
};

function getThemTotal(game) {
  var total = game.scores.reduce(function(a, b) {
    return a + b.them;
  }, 0);
  return total;
};

function getSmallDate(i) {
  return moment(i).format('MMM. D');
};



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
    tmp_score.status = self.props.status,
    tmp_score.game_status = self.props.game_status;

    self.setState(tmp_score);
  },

  handleUsChange: function(event) {
    var self = this;
    if ( (event.target.value % 1) == 0 ) {
      self.setState({us: event.target.value});
    } 
  },

  handleThemChange: function(event) {
    var self = this;
    if ( (event.target.value % 1) == 0 ) {
      self.setState({them: event.target.value});
    } 
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
        status = self.state.status,
        game_status = self.state.game_status;
        
    if ((game_status == 'edit') &( status == 'new' ) || ( status == 'edit' )) {
      return (
        <div className="score  edit_view">
          <input className="us_input" type="text" value={us} onChange={this.handleUsChange} placeholder="Us" />
          <input className="them_input" type="text" value={them} onChange={this.handleThemChange} placeholder="Them" />
          <a className='score_submit' onClick={this.submitContent}>save</a>
        </div>
      )
    } else if (game_status == 'edit') {
      return (
        <div className="score edit_click" onClick={this.handleEdit}>
          <span className="us">{us}</span>
          <span className="them">{them}</span>
        </div>
      )
    } else  {
      return (
        <div className="score">
          {us}, {them}
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
    tmp_game._id = self.props._id,
    tmp_game.identifier = self.props.identifier,
    tmp_game.date = self.props.date,
    tmp_game.time = self.props.time,
    tmp_game.scores = self.props.scores,
    tmp_game.matchup_status = self.props.matchup_status,
    tmp_game.status = self.props.status;

    console.log('game: ' + util.inspect(tmp_game));
    self.setState(tmp_game);
  },

  dateChange: function(moment, dateText) {
    console.log('moment: ' + moment);
    console.log('dateText: ' + dateText);
    this.setState({date: dateText}); 
  },

  handleEdit: function() {
    this.setState({status: 'edit'});
  },

  handleRemove: function(){
    console.log('handleRemoveGame:');
    console.log(' this.state._id:'+this.state._id);
    console.log(' this.state.identifier:'+this.state.identifier);


    if (this.state._id) {
      this.props.remove_game({_id: this.state._id});
    } else if ( this.state.identifier ) {
      this.props.remove_game({_id: this.state.identifier});
    }
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
    var date = self.state.date,
        time = self.state.time,
        matchup_status = 'edit',
        status = self.state.status,
        scores = self.state.scores,
        identifier = self.state.identifier;

    var the_scores = scores.map(function(object) {
      var identifier = object.identifier || object._id;
      var object_status = object.status || "show";
      return <Score
        us={object.us} 
        them={object.them} 
        status={object_status}
        game_status={status}
        identifier={identifier}
        key={identifier}
        submit={self.handleScoreChange} />
    });

    console.log('game status: ' + status);
    console.log('game matchup_status: ' + matchup_status);

        var periods = scores.map(function(object, index) {
          return <th>{ getPeriod(index +1) }</th>
        });

        var us_scores = scores.map(function(score) {
          return <td className="score">{ score.us }</td>
        });

        var them_scores = scores.map(function(score) {
          return <td className="score">{ score.them }</td>
        });


        
    // if (((matchup_status == 'edit') || (matchup_status == 'new')  ) & ( status == 'new' )) {
    //   return (
    //     <div className="game">
    //       <h5>Date: </h5>
    //       <DatePicker
    //               hideFooter={true}
    //               date={date} 
    //               onChange={self.dateChange}  />
          
    //       <h5><input type="text" value={time} onChange={this.handleTimeChange} placeholder="Time" /></h5>

    //       <div className="edit_buttons">
    //         <a className='edit_button border' onClick={this.submitContent}>save</a>
    //       </div>
    //     </div>
    //   )
    // } else 
    if (((matchup_status == 'edit') || (matchup_status == 'new')  ) & (( status == 'edit' ) || ( status == 'new' ))) {
      return (
        <div className="game">
          <h5>Date: </h5>
          <DatePicker
                  hideFooter={true}
                  date={date} 
                  onChange={self.dateChange}  />
          
          <h5><input type="text" value={time} onChange={this.handleTimeChange} placeholder="Time" /></h5>
          
          <h5>Scores: </h5>
          { the_scores ?
            <div className="Scores">

              <div className="team_labels">
                <div className="uno_label">UNO</div>
                <div className="uno_label">Opponent</div>
              </div>
              {the_scores}
              <span className="new_score_button" onClick={this.newScore}><Isvg className="plus-icon" src="/img/icon--plus.svg"></Isvg></span>
            </div> 
          : '' }

          <div className="edit_buttons">
            <a className='edit_button border' onClick={this.submitContent}>save</a>
          </div>
        </div>
      )
    } else if (matchup_status == 'edit') {
      return (
        <div className="game">
          <p className="game_title">Game {this.props.index + 1}</p>
          <p>{moment(date).format("MMMM Do, YYYY")}</p>
          <p>{time}</p>
          <p className="game_title">Score</p>
          <table className="last_matchup_table sport__scoreboard sport__scoreboard-hockey active">
            <thead>
              <tr className="scoreboard__header">
                <th className="team-name">&nbsp;</th>
                {periods}
              </tr>
            </thead>
            <tbody>
              <tr className="team visitor">
                <td className="team-name">Omaha</td>
                {us_scores}
              </tr>
              <tr className="team away">
                <td className="team-name">Opponent</td>
                {them_scores}
              </tr>
            </tbody>
          </table>
          <div className='edit_buttons'>
            <a className='edit_button border' onClick={self.handleEdit}>Edit</a> 
            <a className='edit_button' onClick={self.handleRemove}>Remove</a> 
          </div>
        </div>
      )
    } else {
      return (
        <div className="game">
          <p className="game_title">Game {this.props.index + 1}</p>
          <p>{moment(date).format("MMMM Do, YYYY")}</p>
          <p>{time}</p>
          <p className="game_title">Score</p>
          <table className="last_matchup_table sport__scoreboard sport__scoreboard-hockey active">
            <thead>
              <tr className="scoreboard__header">
                <th className="team-name">&nbsp;</th>
                {periods}
              </tr>
            </thead>
            <tbody>
              <tr className="team visitor">
                <td className="team-name">Omaha</td>
                {us_scores}
              </tr>
              <tr className="team away">
                <td className="team-name">Opponent</td>
                {them_scores}
              </tr>
            </tbody>
          </table>
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
    console.log('matchup handleRemove: ' + util.inspect(this.state));
    if (this.state.identifier){
      this.props.remove_matchup({identifier: this.state.identifier});
    } else {
      this.props.remove_matchup({_id: this.state._id});
    }
  },

  handleRemoveNew: function(){
    this.props.remove_new_matchup({identifier: this.state.identifier});
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
    var new_games = current_games.concat({status: 'new', identifier: Math.random(), scores: [], date: moment()});

    console.log(' '+util.inspect(new_games));
    this.setState({games: new_games});
  },

  handleGameChange: function(content) {
    var current_games = this.state.games;
    console.log('content: ' + util.inspect(content));
    console.log('current_games: ' + util.inspect(current_games));
    for(var i in current_games) {
      if ((current_games[i].identifier == content.identifier) || (current_games[i]._id == content._id)){
        current_games[i].date = content.date;
        current_games[i].time = content.time;
        current_games[i].scores = content.scores;
      }
    }
    this.setState({ games: current_games});
  },


  handleRemoveGame: function(content) {

    console.log('Matchup - handleRemoveGame:');
    console.log(' content:'+util.inspect(content));



    var current_games = this.state.games;
    var found_game;
    for(var i in current_games) {
      if ((current_games[i].identifier == content._id) || (current_games[i]._id == content._id)){
        found_game = i;
      }
    }
    if (found_game) {
      current_games.splice(found_game, 1);
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

    var games = self.state.games.map(function(object, index) {
      return <Game 
        status={object.status}
        date={object.date} 
        time={object.time}
        scores={object.scores}
        matchup_status={status}
        remove_game={self.handleRemoveGame}
        _id = {object._id}
        identifier={object.identifier || object._id}

        key={object.identifier || object._id} 

        index={index}

        submit={self.handleGameChange} />
    });

    var photos = self.state.photos.map(function(object) {
      return <Photo 
        url={object.url} 
        _id={object._id || Math.random()}
        matchup_status={status}
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
              <p className="page_edit_title_small">Photos</p>
              {photos}
            </div> 
            : ''
          }

          <PhotosUploader photos={this.handleNewPhoto} />
          
          <div className='edit_buttons'>
            
            { status == 'new' ? 
              <span>
                <a className='edit_button border' onClick={self.submitContent}>save</a> 
                <a className='edit_button' onClick={self.handleRemoveNew}>Cancel</a>
              </span> 
            : 
              <span>
                <a className='edit_button border' onClick={self.editContent}>save</a> 
                <a className='edit_button' onClick={self.cancelEdit}>Cancel</a> 
              </span>
            }
            
            
          </div>
        </div>
      )
    } else {

      return (
        <div className="matchup show">
          <h3>{name}</h3>

          <div className='edit_buttons'>
            <a className='edit_button border' onClick={self.handleEdit}>edit</a> 
            <a className='edit_button' onClick={self.handleRemove}>remove</a> 
          </div>
        </div>
      )
    }
  }
});

module.exports = Matchup;