var React = require('react'),
    request = require('superagent'),
    util = require('util');

var Content = window.slug || {};

var Game = require('game.jsx');

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

React.renderComponent(
 Page(Content),
  document.getElementById('new_page')
)