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
    var userCaption = (self.props.caption.length > 160 ? self.props.caption.slice(0, 160) + ' ...' : self.props.caption);

    // var truncate = function(str,num){
    //   var words = str.split(' ');
    //   words = words.splice(0,num);
    //   return words.join(' ');
    // }
    return (
      <div className="instagram">
        <ImageLoader src={self.props.images.standard_resolution.url} >
          Image load failed!
        </ImageLoader>
        <div className="user-wrapper">
        <div className="user__profile-picture"><img src={self.props.user.profile_picture} /></div>
        <p className="photo__description">{userCaption}</p>
        <p className="instagram__user">
          <a href={self.props.link} target="_blank">
             &#64;{self.props.user.username}
          </a>
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
      return <Instagram images={object.images} user={object.user} link={object.link} caption={object.caption.text} />
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
