var React = require('react'),
    request = require('superagent'),
    util = require('util');

var Score = React.createClass({
  getInitialState: function() {
    return { us: Number, them: Number };
  },
  componentWillMount: function(){
    if(this.props.identifier) {
      this.setState({ identifier: this.props.identifier });
    }
  },
  handleUsChange: function(event) {
    this.setState({us: event.target.value});
  },
  handleThemChange: function(event) {
    this.setState({them: event.target.value});
  },
  submitContent: function(){
    var self = this;
    self.props.submit(self.state);
  },
  render: function () {
    var self = this;

    var us = self.state.us,
        them = self.state.them;

    return (
      <div className="scores">
        { self.props.type == 'new' ?
          <div className="score">
            <input type="number" value={us} onChange={this.handleUsChange} placeholder="Us" />
            <input type="number" value={them} onChange={this.handleThemChange} placeholder="Them" />
            {this.state.submitted ? <a className='submit'><span>submitted</span></a> : <a className='submit' onClick={this.submitContent}>submit</a> }
          </div>
          : 
          <div className="score">
            {us}, {them}
          </div>
        }
      </div>
    );
  }
});

var Game = React.createClass({
  getInitialState: function() {
    return { name: '', type: '', opponent: '', date: '', time: '', ticket: '', location: '', home: false, scores: {}, tmp_scores: [], submitted: false };
  },
  componentWillMount: function(){
    var self = this;
    var tmp_game = {};
    tmp_game.identifier = self.props.identifier,
    tmp_game.name = self.props.name,
    tmp_game.opponent = self.props.opponent,
    tmp_game.date = self.props.date,
    tmp_game.time = self.props.time,
    tmp_game.ticket = self.props.ticket,
    tmp_game.location = self.props.location,
    tmp_game.home = self.props.home,
    tmp_game.scores = self.props.scores;
    
    self.setState(tmp_game);

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
    this.setState({home: event.target.value});
  },

  handleScoreChange: function(content) {
    console.log('handleGameChange');
    var current_scores = this.state.tmp_scores;
    console.log(' '+util.inspect(current_scores));

    for(var i in current_scores) {
      if (current_scores[i].identifier == content.identifier){
        current_scores[i].us = content.us;
        current_scores[i].them = content.them;
        current_scores[i].type = '';
      }
    }

    // new_scores = current_scores.concat(content);
    new_scores = current_scores;
    console.log(' '+util.inspect(new_scores));

    var actual_scores = {
      us : [],
      them : []
    };

    for (i in new_scores) {
      actual_scores.us.push(new_scores[i].us);
      actual_scores.them.push(new_scores[i].them);
    }

    this.setState({tmp_scores: new_scores, scores: actual_scores});

  },

  newScore: function() {
    console.log('newGame');
    var current_scores = this.state.tmp_scores;
    console.log(' '+util.inspect(current_scores));
    var new_scores = current_scores.concat({type: 'new', identifier: Math.random()});
    console.log(' '+util.inspect(new_scores));
    this.setState({tmp_scores: new_scores});

  },
  submitContent: function(){
    var self = this;
    self.setState({submitted: true});
    request
      .post('/api/games/new')
      .send(self.state)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          console.log('new game: '+res.text);
          var new_game = JSON.parse(res.text);
          new_game.identifier = self.state.identifier;
          self.props.thing(new_game);
        }
      }.bind(self));
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
        scores = self.state.tmp_scores,
        actual_scores = self.state.scores;

    var the_scores = scores.map(function(object) {
      return <Score
        us={object.us} 
        them={object.them} 
        type={object.type}

        identifier={object.identifier}
        key={object.identifier}
        submit={self.handleScoreChange} />
    });

    return (
      <div>
        { self.props.type == 'new' ?
          <div className="game">
            <h2>New Game</h2>
            <h3><input type="text" value={name} onChange={this.handleNameChange} placeholder="Name" /></h3>
            <h5><input type="text" value={opponent} onChange={this.handleOpponentChange} placeholder="Oopponent" /></h5>
            <h5><input type="text" value={date} onChange={this.handleDateChange} placeholder="Date" /></h5>
            <h5><input type="text" value={time} onChange={this.handleTimeChange} placeholder="Time" /></h5>
            <h5><input type="text" value={ticket} onChange={this.handleTicketChange} placeholder="Ticket" /></h5>
            <h5><input type="text" value={location} onChange={this.handleLocationChange} placeholder="Location" /></h5>
            <h5><input type="text" value={home} onChange={this.handleHomeChange} placeholder="Home" /></h5>

            { the_scores ?
              <div className="Scores">
                {the_scores}
              </div> 
            : '' }
            <h6 onClick={this.newScore}>New Score</h6>

            {this.state.submitted ? <a className='submit'><span>submitted</span></a> : <a className='submit' onClick={this.submitContent}>submit</a> }
          </div>
          : 
          <div className="game">
            <h2>Existing Game</h2>
            <p>{name}</p>
            <p>{opponent}</p>
            <p>{date}</p>
            <p>{time}</p>
            <p>{ticket}</p>
            <p>{location}</p>
            <p>{home}</p>
            <p>Us: {actual_scores.us}</p>
            <p>Them: {actual_scores.them}</p>
          </div>
        }
      </div>
    );
  }
});

module.exports = Game;