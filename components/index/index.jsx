var React = require('react'),
    request = require('superagent'),
    util = require('util');
var Velocity = require('velocity-animate/velocity');
var InlineSVG = require('react-inlinesvg');
var Router = require('react-router');
var $ = require('jquery');

$.fn.liScroll = function(settings) {
  settings = $.extend({
  travelocity: 0.07
  }, settings);

  return this.each(function(){
      var $strip = $(this);
      $strip.addClass("newsticker");
      var stripWidth = 1;
      $strip.find("li").each(function(i){
      stripWidth += $(this, i).outerWidth(true); // thanks to Michael Haszprunar and Fabien Volpi
      });
      var $mask = $strip.wrap("<div class='mask'></div>");
      var $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");
      var containerWidth = $strip.parent().parent().width();  //a.k.a. 'mask' width
      $strip.width(stripWidth);
      var totalTravel = stripWidth+containerWidth;
      var defTiming = totalTravel/settings.travelocity; // thanks to Scott Waye
      function scrollnews(spazio, tempo){
      $strip.animate({left: '-='+ spazio}, tempo, "linear", function(){$strip.css("left", containerWidth); scrollnews(totalTravel, defTiming);});
      }
      scrollnews(totalTravel, defTiming);
      $strip.hover(function(){
      $(this).stop();
      },
      function(){
      var offset = $(this).offset();
      var residualSpace = offset.left + stripWidth;
      var residualTime = residualSpace/settings.travelocity;
      scrollnews(residualSpace, residualTime);
      });
  });
};

require('velocity-animate/velocity.ui');

require('../../public/js/vendors/matchmedia.js');
require('../../public/js/vendors/matchMedia.addListener.js');

var ResponsiveMixin = require('react-responsive-mixin');
var FlickerIcon = require('../page/flickerIcon.jsx');

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
        <InlineSVG src="/img/icon--instagram.svg" uniquifyIDs={false}></InlineSVG>
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
    return { photos: [], instagrams: [], combined: [], two_column: [], four_column: [], render: '' };
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


                self.setState({combined: combined, two_column: two_column, four_column: four_column, photos: photos, instagrams: instagrams, loaded: true});


              }
            }.bind(self));
        }
      }.bind(self));
  },

  componentDidMount: function () {
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


    if (self.state.loaded == true) {
      return (
        <div className="matchup_photos" id="instagrams">
          {render_grid}
        </div>
      )
    } else {
      return (
        <div className="preloader">
          <FlickerIcon loop={true}/>
        </div>
      )
    }
  }
});

var my_image, bkd_image;
var Main = React.createClass({
  mixins: [ Router.State ],
  getInitialState: function() {
    return { photos: [], news: [], pre_count: 0 };
  },
  componentWillMount: function(){
    var self = this;

    bkd_image = new Image();
    bkd_image.onload = self.onLoad;
    bkd_image.src = "/img/bkgrd_pattern_BLK.svg";

    my_image = new Image();
    my_image.onload = self.onLoad;
    my_image.src = "/img/SportsCombineStill.jpg";

  },

  onLoad: function() {

    console.log('onLoad');
    var self = this;
    var tmp_pre_count = self.state.pre_count;
    tmp_pre_count++;
    if (tmp_pre_count == 2) {
      self.setState({loaded: true, pre_count: tmp_pre_count}); 

      $('.marquee__list').liScroll();


    } else {
      self.setState({pre_count: tmp_pre_count}); 
    }
  },

  playVideo: function (){
    this.setState({playVideo: true});
  },

  stopVideo: function (){
    this.setState({playVideo: false});
  },

  scrollToPhotos: function() {
    this.props.open_social();
    Velocity(document.getElementById('instagrams'), 
        "scroll", {
          duration: 1000,
          easing: "ease-in-out"
        });
  },

  alertTest: function(){
    this.props.send_message("fuck off");
  },

  componentDidMount: function () {
        // $('.instagram .imageloader.loaded img').velocity('transition.slideUpBigIn');
  },

  render: function() {
    var self = this;

    var bkd_video = {};
      bkd_video.poster="/img/SportsCombineStill.jpg";
      bkd_video.src="https://s3.amazonaws.com/maverickmayhem/loop_all-sports.mp4"

    if (self.state.loaded == true) {
      return (
        <div>
            <div className="page_container" id="main" role="main">
              <div className="hero hero-home">
                <div className="hero__inner">
                  <div className="hero__content-wrap hero__content-home">
                    <div className="hero__content">
                      <img src="img/hashtag_MM_HOME.svg" alt="" />
                      <p>This site belongs to all Mavericks – fans, players, campus, and community. Tag your photos and posts and join the conversation.</p>
                      <a className="btn--show-pride" onClick={self.scrollToPhotos} >Make Some Noise</a>
                    </div>
                  </div>
                </div>

                <div className="hero__overlay"></div>

                <div className="hero__media">
                  <video id="video-background" className="video-wrap" poster={bkd_video.poster} autoPlay muted="muted" loop>
                    <source src={bkd_video.src} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
            <div className="marquee">
              <ul className="marquee__list" id="marquee__list">
                <li className="marquee__list-item marquee__list-graphic">&nbsp;</li>
                <li className="marquee__list-item">2/26 Women`s B-ball v. Ft. Wayne</li>
                <li className="marquee__list-item">2/28 Women`s B-ball v. Denver</li>
                <li className="marquee__list-item marquee__list-graphic">&nbsp;</li>
                <li className="marquee__list-item">3/6 Hockey v. Colorado College</li>
                <li className="marquee__list-item">3/7 Hockey v. Colorado College</li>
              </ul>
            </div>

            <CombinedList />
        </div>
      )
    } else {
      return (
        <div className="preloader">
          <FlickerIcon loop={true}/>
        </div>
      )
    }
  }
});

module.exports = Main;
