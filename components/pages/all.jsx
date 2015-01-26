var React = require('react'),
    request = require('superagent'),
    util = require('util');

var Content = window.slug || {};

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


    // if(this.props.identifier) {
    //   this.setState({identifier: this.props.identifier});
    // }
    // if(this.props.name) {
    //   this.setState({name: this.props.name});
    // }

    // if(this.props.name) {
    //   this.setState({name: this.props.name});
    // }

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

        // var new_scores = current_scores.splice(i,1);
        // break;
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

    // var the_scores = [];

    // for( var i in scores.us ) {
    //   <Score
    //     us={scores.us[i]} 
    //     them={scores.them[i]} 
    //     type={object.type}

    //     identifier={object.identifier}
    //     submit={self.handleScoreChange} />
    // } 

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

var Page = React.createClass({
  getInitialState: function() {
    return { name: '', status: 'new', headline: '', banner: '', description: '', video: {}, icon: {}, games: [], tmp_games: [], photos: [], news: [], submitted: false };
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
            // console.log(tmp_games);
            Page.tmp_games = tmp_games;
            Page.games = [];
            for ( i in  Page.tmp_games) {
              Page.games[i] = Page.tmp_games[i]._id;
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

  // removeGame: function(content) {
  //   console.log('removeGame');
  //   var current_games = this.state.games;
  //   console.log(' '+util.inspect(current_games));

  //   for(var i in current_games) {
  //      if (current_games[i].identifier == content.identifier){
  //       var new_games = current_games.splice(i,1);
  //       break;
  //     }
  //   }

  //   this.setState({games: new_games});
  // },

  handleGameChange: function(content) {
    console.log('handleGameChange');
    var current_games = this.state.tmp_games;
    console.log(' '+util.inspect(current_games));
    for(var i in current_games) {
      if (current_games[i].identifier == content.identifier){
        var new_games = current_games.splice(i,1);
        break;
      }
    }

    new_games = current_games.concat(content);

    var actual_games = [];

    for (i in new_games) {
      actual_games.push(new_games[i]._id);
    }

    console.log(' '+util.inspect(new_games));
    this.setState({tmp_games: new_games, games: actual_games});
  },

  newGame: function() {
    console.log('newGame');
    var current_games = this.state.tmp_games;
    console.log(' '+util.inspect(current_games));
    var new_games = current_games.concat({type: 'new', identifier: Math.random()});
    console.log(' '+util.inspect(new_games));
    this.setState({tmp_games: new_games});

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
            window.location = '/'+res.text.slug;
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
        description = self.state.description,
        games = self.state.games;  

    var games = self.state.tmp_games.map(function(object) {
      // console.log("Game: "+util.inspect(thing));
      // var object = util.inspect(thing)
      return <Game 
        name={object.name} 
        type={object.type}
        opponent={object.opponent}
        date={object.date}
        time={object.time}
        ticket={object.ticket}
        location={object.location}
        home={object.home}
        scores={object.scores}

        identifier={object.identifier}
        thing={self.handleGameChange} />
    });

    return (
      <div className="page">
        <h3><input type="text" value={name} onChange={this.handleNameChange} placeholder="Name" /></h3>
        <h5><input type="text" value={headline} onChange={this.handleHeadlineChange} placeholder="Headline" /></h5>
        <h5><input type="text" value={banner} onChange={this.handleBannerChange} placeholder="Banner" /></h5>
        <h5><input type="text" value={description} onChange={this.handleDescriptionChange} placeholder="Description" /></h5>
        { games ?
          <div className="Games">
            {games}
          </div> 
        : '' }
        <h6 onClick={this.newGame}>New Game</h6>

        {this.state.submitted ? <a className='submit'><span>submitted</span></a> : <a className='submit' onClick={this.submitContent}>submit</a> }
      </div>
    );
  }
});


// module.exports = Page; 

React.renderComponent(
 Page(Content),
  document.getElementById('new_page')
)