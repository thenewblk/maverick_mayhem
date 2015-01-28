var React = require('react'),
    request = require('superagent'),
    util = require('util');

var News = React.createClass({
  getInitialState: function() {
    return { title: '', status: 'show', link: '', image: '' };
  },

  componentWillMount: function(){
    var self = this;
    var tmp_game = {};
    tmp_game.identifier = self.props.identifier,
    tmp_game.title = self.props.title,
    tmp_game.slug = self.props.slug,
    tmp_game.link = self.props.link,
    tmp_game.image = self.props.image,
    
    self.setState(tmp_game);

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
    var current_scores = this.state.tmp_scores;

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

  handleEdit: function(){
    this.setState({status: "edit"})
  },

  handleRemove: function(){
    this.props.remove_game({_id: this.state._id});
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
          new_game.status = 'show';
          self.props.new_game(new_game);
          self.setState(new_game);
        }
      }.bind(self));
  },

  editContent: function(){
    var self = this;
    // self.setState({submitted: true});
    request
      .post('/api/games/'+self.state.slug+'/edit')
      .send(self.state)
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
        scores = self.state.tmp_scores,
        actual_scores = self.state.scores,
        status = self.state.status;

        console.log('gome: '+home);

    var the_scores = scores.map(function(object) {
      return <Score
        us={object.us} 
        them={object.them} 
        type={object.type}

        identifier={object.identifier}
        key={object.identifier}
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
            <div className="Scores">
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
            <li>Us: {actual_scores.us}</li>
            <li>Them: {actual_scores.them}</li>
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

module.exports = News;