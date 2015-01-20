// TODO: animations aren't happening, not sure what the problem is
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
    // var { Route, DefaultRoute, RouteHandler, Link } = Router;

// var ThisUser = window.User || {};

var Login = React.createClass({ 
  mixins: [ Navigation ],
  getInitialState: function() {
    return {email: '', password: '' };
  },
  handleEmailChange: function(event) {
    this.setState({email: event.target.value});
  },
  handlePasswordChange: function(event) {
    this.setState({password: event.target.value});
  },

  submitContent: function(){
    var self = this;
    self.setState({submitted: true});
    request
      .post('/login-js')
      .send(self.state)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          self.props.loggedIn(JSON.parse(res.text));
          self.transitionTo(window.location.pathname);
        }
      }.bind(self));
  },

  render: function() {
    var self = this;
    return (
      <div>

        <label>Email</label>
        <input type="text" name="email" onChange={this.handleEmailChange} />

        <label>Password</label>
        <input type="password" name="password" onChange={this.handlePasswordChange} />

        <button type="submit" onClick={this.submitContent}>Login</button>

      </div>
    )
  }
});

var App = React.createClass({
  mixins: [ Router.State ],
  getInitialState: function() {
    return { user: {} };
  },

  componentWillMount: function(){
    var self = this;
    request
      .get('/api/me')
      .end(function(res) {
        console.log(res)
        if (res.text) {
          self.setState({user: JSON.parse(res.text)});
        }
      }.bind(self));
  },
  
  loggedIn: function(user) {
    this.setState({user: user});
  },

  render: function () {
    var name = this.getRoutes().reverse()[0].name;

    return (
      <div>
        { this.state.user.local ?  
        <h1><a href="/logout">{this.state.user.local.email}</a></h1>
        : <Login loggedIn={this.loggedIn}/>
      }
        <ul>
          <li><Link to="alltags">All Tags</Link></li>
          <li><Link to="newTag">New Tag</Link></li>
        </ul>
        <RouteHandler />
      </div>
    );
  }
});

var Tag = require('./tag/show.jsx');
var Tags = require('./tag/all.jsx');
var NewTag = require('./tag/new.jsx');

var routes = (
  <Route path="/" handler={App}>
    <Route name="alltags" path="/tag/" handler={Tags} />
    <Route name="newTag" path="/tag/new" handler={NewTag} />
    <Route name="tag" path="/tag/:slug" handler={Tag} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('example'));
});