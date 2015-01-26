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

var Tag = require('./show.jsx');

var Tags = React.createClass({
  mixins: [ Router.State ],
  getInitialState: function() {
    return { tags: [] };
  },
  componentWillMount: function(){
    var self = this;
    request
      .get('/api/tag/')
      .end(function(res) {
        console.log(res)
        if (res.text) {
          var tags = JSON.parse(res.text);
          self.setState({tags: tags});
          console.log(tags)
        }
      }.bind(self));

  },

  render: function () {
    var self = this;
    var tmp = [{'name':'fuck you'}, {'name':'fuck you'}];
    var tags = self.state.tags.map(function(object) {
      return <Tag name={object.name} slug={object.slug} id={object._id} />
    });
    return (
      <div className="Tags">
        <h1>All Tags</h1>
        {tags}
      </div>
    );
  }
});


module.exports = Tags;