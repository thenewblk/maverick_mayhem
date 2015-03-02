var React = require('react'),
    request = require('superagent'),
    util = require('util');

require('../../public/js/vendors/matchmedia.js');
require('../../public/js/vendors/matchMedia.addListener.js');

var ResponsiveMixin = require('react-responsive-mixin');

var Instagram = React.createClass({
  getInitialState: function() {
    return {
      className: 'loading',
    };
  },
  componentDidMount: function () {},

  componentWillMount: function(){
    var self = this;
    var my_image = new Image();
    my_image.onload = this.onLoad;
    my_image.src = self.props.images.standard_resolution.url;
  },



  onLoad: function() {
    var self = this;
    self.setState({className: "loaded"});

  },


  render: function() {
    var self = this;
    var userCaption = (self.props.caption.length > 160 ? self.props.caption.slice(0, 160) + ' ...' : self.props.caption);
    // var userCaption = self.props.caption;
    var divStyles = {
      backgroundImage: 'url(' + self.props.images.standard_resolution.url + '), url(../img/bkgrd_pattern_DARKBLK.svg)',
    };

    var userStyles = {
      backgroundImage: 'url(' + self.props.user.profile_picture + ')',
    };
    // var truncate = function(str,num){
    //   var words = str.split(' ');
    //   words = words.splice(0,num);
    //   return words.join(' ');
    // }
    return (
      <div className={"matchup_photo instagram "+self.state.className} style={divStyles}>
        <div className="description" style={divStyles}>
          <div className="instagram_wrapper">
            <div className="user__profile-picture" style={userStyles}></div>
            <p className="photo__description">{userCaption}</p>
            <p className="instagram__user">
              <a href={self.props.link} target="_blank">
                &#64;{self.props.user.username}
              </a>
            </p>
          </div>
          <div className="bkgd_scribble"></div>
        </div>
        <img className="instagram-icon" src="/img/icon--instagram.svg" />
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

var Photo = React.createClass({
  getInitialState: function() {
    return {
      className: 'loading',
    };
  },

  componentWillMount: function(){
    var self = this;
    var my_image = new Image();
    my_image.onload = this.onLoad;
    my_image.src = "https://s3.amazonaws.com/maverickmayhem-dev" + self.props.url;
  },



  onLoad: function() {
    var self = this;
    self.setState({className: "loaded"});

  },

  componentDidMount: function () {},

  render: function(){
    var self = this;
    var divStyles = {
      backgroundImage: 'url(https://s3.amazonaws.com/maverickmayhem-dev' + self.props.url + '), url(../img/bkgrd_pattern_RED.svg)',
    };
    return (
      <div className={"matchup_photo "+self.state.className} style={divStyles}>
        <div className="description" style={divStyles}>
          <img src="../img/expand_img.svg" />
          <p>{self.props.description}</p>
        </div>
      </div>
      )
  }
});

var PhotoList = React.createClass({
  getInitialState: function() {
    return { photos: [] };
  },
  componentWillMount: function(){
    var self = this;

    request
      .get('/api/photos/')
      .end(function(res) {
        console.log(res)
        if (res.text) {
          var photos = JSON.parse(res.text);
          self.setState({photos: photos});
        }
      }.bind(self));

  },

  componentDidMount: function () {
        // $('.instagram .imageloader.loaded img').velocity('transition.slideUpBigIn');
  },

  render: function() {
    var self = this;

    var photos = self.state.photos.map(function(object) {
      return <Photo url={object.url} description={object.description} key={object._id} />
    });

    return (
      <div className="matchup_photos">
        {photos}
      </div>
    )
  }
});

var CombinedList = React.createClass({
  mixins: [ResponsiveMixin],
  getInitialState: function() {
    return { photos: [], instagrams: [], combined: [], two_column: [], four_column: [], render: 'a' };
  },
  componentWillMount: function(){
    var self = this;

    request
      .get('/api/photos/')
      .end(function(res) {
        console.log(res)
        if (res.text) {
          var photos = JSON.parse(res.text);


          request
            .get('/api/instagrams/')
            .end(function(res) {
              console.log(res)
              if (res.text) {
                var instagrams = JSON.parse(res.text);


                var rend_photos = photos.map(function(object) {
                  return <Photo url={object.url} description={object.description} key={object._id} />
                });

                var rend_instagrams = instagrams.map(function(object) {
                  return <Instagram images={object.images} user={object.user} link={object.link} caption={object.caption.text} />
                });

                var combined = rend_photos.map(function(v,i) {
                    return [v, rend_instagrams[i]];
                  }).reduce(function(a,b) { return a.concat(b); });


                var two_column = rend_photos.map(function(v,i) {
                      if ( (i % 2) == 0 ) {
                        return [v, rend_instagrams[i]];
                      } else {
                        return [rend_instagrams[i], v];
                      }

                  }).reduce(function(a,b) { return a.concat(b); });

                  var four_column = rend_photos.map(function(v,i) {
                      if (  ((i % 4) === 0 ) || (((i-1) % 4) === 0 )   ) {
                        return [v, rend_instagrams[i]];
                      } else {
                        return [rend_instagrams[i], v];
                      }

                  }).reduce(function(a,b) { return a.concat(b); });


                self.setState({combined: combined, two_column: two_column, four_column: four_column, photos: photos, instagrams: instagrams});


              }
            }.bind(self));
        }
      }.bind(self));
  },

  componentDidMount: function () {
        // $('.instagram .imageloader.loaded img').velocity('transition.slideUpBigIn');
    this.media({maxWidth: 500}, function () {
      this.setState({render: 'combined'});
    }.bind(this));
    this.media({minWidth:501, maxWidth: 767}, function () {
      this.setState({render: 'two'});
    }.bind(this));
    this.media({minWidth:768, maxWidth: 1519}, function () {
      this.setState({render: 'combined'});
    }.bind(this));
    this.media({minWidth: 1520}, function () {
      this.setState({render: 'four'});
    }.bind(this));

  },

  render: function() {
    var self = this;

    var render_grid;

    if (self.state.render == 'two') {
      render_grid = self.state.two_column;
    } else if (self.state.render == 'four') {
      render_grid = self.state.four_column;
    } else {
      render_grid = self.state.combined;
    }



    return (
      <div className="matchup_photos">
        {render_grid}
      </div>
    )
  }
});



React.renderComponent(
  CombinedList(),
  document.getElementById('instagrams')
)
