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

var NewTag = React.createClass({ 
  mixins: [ Router.State, Navigation ],
  getInitialState: function() {
    return { name: '' };
  },
  handleNameChange: function(event) {
    this.setState({name: event.target.value});
  },

  submitContent: function(){
    var self = this;
    self.setState({submitted: true});
    request
      .post('/api/tag/new')
      .send(self.state)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          console.log('new: '+res.text);

          self.transitionTo('/tag/'+ JSON.parse(res.text).slug, { slug: JSON.parse(res.text).slug } );
        }
      }.bind(self));
  },

  render: function() {
    var self = this;
    var name = self.state.name;
    return (
      <div className="col-md-8 col-md-offset-2">
        <h2>New Tag</h2>
        <h3 className="subtitle"><input type="text" value={name} onChange={this.handleNameChange} placeholder="Name" /></h3>

        {this.state.submitted ? <a className='submit'><span>submitted</span></a> : <a className='submit' onClick={this.submitContent}>submit</a> }
      </div>
    )
  }
});


module.exports = NewTag;