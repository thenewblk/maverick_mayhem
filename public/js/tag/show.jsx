var React = require('react'),
    Router = require('react-router'),
    request = require('superagent'),
    util = require('util'),
    TransitionGroup = require('react/lib/ReactCSSTransitionGroup');
    Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    RouteHandler = Router.RouteHandler,
    Link = Router.Link,
    Navigation = Router.Navigation;

var Tag = React.createClass({
  mixins: [ Router.State ],
  getInitialState: function() {
    return { name: '', slug: '', editting: false, user: {} };
  },
  componentWillMount: function(){
    var self = this;

    if (self.getParams().slug){
      request
        .get('/api/tag/'+this.getParams().slug)
        .end(function(res) {
          console.log(res)
          if (res.text) {
            var tags = JSON.parse(res.text);
            self.setState({name: tags.name, slug: tags.slug});
            console.log(tags)
          }
        }.bind(self));
      } else {
        self.setState(this.props);
      }
  },

  handleNameChange: function(event) {
    this.setState({name: event.target.value});
  },

  tagEdit: function(){
    var self = this;
    if (self.state.user.local){
      self.setState({editting: true});
    } else {
      request
        .get('/api/me')
        .end(function(res) {
          console.log(res)
          if (res.text) {
            self.setState({user: JSON.parse(res.text)}); 
            self.setState({editting: true});
          }
        }.bind(self));
    }
  },

  tagEditSubmit: function(){ 
    var self = this;
    request
      .post('/api/tag/'+this.state.slug+'/edit')
      .send(self.state)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          self.setState(JSON.parse(res.text));
          self.setState({editting: false});
          console.log(tags)
        }
      }.bind(self));
  },

  render: function () {
    var name = this.state.name;
    return (
      <div className="Tag">
        { this.state.editting ?
          <p>
            <input type="text" value={name} onChange={this.handleNameChange} placeholder="Name"/>
            <a className='submit' onClick={this.tagEditSubmit}>submit</a>
          </p>
          :
          <p onClick={this.tagEdit}>{this.state.name}</p>
        }
      </div>
    );
  }
});

module.exports = Tag;