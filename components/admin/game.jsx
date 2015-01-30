var React = require('react'),
    request = require('superagent'),
    util = require('util');

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
    return { name: '', status: 'show', opponent: '', date: '2015-01-01', time: '', ticket: '', location: '', home: false, scores: [] };
  },

  componentWillMount: function(){
    var self = this;
    console.log('self.props.slug: '+self.props.slug);
    console.log('self.props.status: '+self.props.status);


    if( self.props.slug ) {
      request
        .get('/api/games/'+self.props.slug)
        .end(function(res) {
          console.log(res)
          if (res.text) {
            var game = JSON.parse(res.text);
            self.setState(game);

          }
        }.bind(self));

    } else {
      var tmp_game = {};
          tmp_game.status = self.props.status,
          tmp_game.identifier = self.props.identifier;
      self.setState(tmp_game);
    }
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

  handleScoreChange: function(content) {
    var current_scores = this.state.scores;

    for(var i in current_scores) {
      if (current_scores[i].identifier == content.identifier || current_scores[i]._id == content.identifier){
        current_scores[i].us = content.us;
        current_scores[i].them = content.them;
        current_scores[i].status = content.status;
      }
    }

    // new_scores = current_scores.concat(content);

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
    this.setState({date: dateText})
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


    if (status == 'new') {
      return (
        <div className="game">
          <h3>New Game</h3>
          <h3><input type="text" value={name} onChange={this.handleNameChange} placeholder="Name" /></h3>
          <h5><input type="text" value={opponent} onChange={this.handleOpponentChange} placeholder="Opponent" /></h5>
          <h5><input type="text" className="game_date" value={date} onChange={this.handleDateChange} placeholder="Date" /></h5>
          <DatePicker
                  hideFooter={true}
                  date={date} 
                  onChange={self.dateChange}  />
          <h5><input type="text" value={time} onChange={this.handleTimeChange} placeholder="Time" /></h5>
          <h5><input type="text" value={ticket} onChange={this.handleTicketChange} placeholder="Ticket" /></h5>
          <h5><input type="text" value={location} onChange={this.handleLocationChange} placeholder="Location" /></h5>
          <h5 className="home">Home: <input type="checkbox" checked={home} onChange={this.handleHomeChange} /></h5>

          { the_scores ?
            <div className="Scores">
              {the_scores}
            </div> 
          : '' }
          <h6 onClick={this.newScore}>New Score</h6>
          
          <div className='half_buttons'>
            <a className='submit' onClick={self.submitContent}>save</a> 
            <a className='submit' onClick={self.handleRemove}>cancel</a> 
          </div>
         
        </div>
      )
    } else if (status == 'edit') {
      return (
        <div className="game">
          <h3>Edit Game</h3>
          <h3><input type="text" value={name} onChange={this.handleNameChange} placeholder="Name" /></h3>
          <h5><input type="text" value={opponent} onChange={this.handleOpponentChange} placeholder="Opponent" /></h5>
          <h5><input type="text" className="game_date" value={date} onChange={this.handleDateChange} placeholder="Date" /></h5>
          <DatePicker
                  hideFooter={true}
                  date={date} 
                  onChange={self.dateChange} />
          <h5><input type="text" value={time} onChange={this.handleTimeChange} placeholder="Time" /></h5>
          <h5><input type="text" value={ticket} onChange={this.handleTicketChange} placeholder="Ticket" /></h5>
          <h5><input type="text" value={location} onChange={this.handleLocationChange} placeholder="Location" /></h5>
          <h5 className="home">Home: <input type="checkbox" checked={home} onChange={this.handleHomeChange} /></h5>

          { the_scores ?
            <div className="scores">
              {the_scores}
            </div> 
          : '' }
          <h6 onClick={this.newScore}>New Score</h6>
          
          <div className='half_buttons'>
            <a className='submit' onClick={self.editContent}>save</a> 
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
            <li>Date: {date}</li>
            <li>Time: {time}</li>
            <li>Ticket Link: {ticket}</li>
            <li>Location: {location}</li>
            <li>Home?: {home ? "True" : 'False'}</li>
            <li>Us: {us_scores}</li>
            <li>Them: {them_scores}</li>
          </ul>
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