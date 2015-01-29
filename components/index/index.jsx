var React = require('react'),
    request = require('superagent'),
    util = require('util');

var ImageLoader = require('react-imageloader');

var Instagram = React.createClass({
  getInitialState: function() {
    return {  };
  },

  componentDidMount: function () {},
  render: function() {
    var self = this;
    
    return (
      <div className="instagram">
        <ImageLoader src={self.props.images.low_resolution.url} >
          Image load failed!
        </ImageLoader>
        <div className="user-wrapper">
          <p className="user">
            <span className="fa fa-instagram"></span>
            <span className="username">{self.props.user.username}</span> 
          </p>
        </div>
      </div>
    )
  }
});

var InstagramList = React.createClass({
  getInitialState: function() {
    return { instagrams: [] };
  },
  componentWillMount: function(){
    var self = this;

    request
      .get('/api/instagrams/')
      .end(function(res) {
        console.log(res)
        if (res.text) {
          var instagrams = JSON.parse(res.text);
          self.setState({instagrams: instagrams});
        }
      }.bind(self));
    
  },

  componentDidMount: function () {
        // $('.instagram .imageloader.loaded img').velocity('transition.slideUpBigIn');
  },

  render: function() {
    var self = this;

    var instagrams = self.state.instagrams.map(function(object) {
      return <Instagram images={object.images} user={object.user} />
    });

    return (
      <div className="instagrams">
        {instagrams}
      </div>
    )
  }
});

React.renderComponent(
  InstagramList(),
  document.getElementById('instagrams')
)