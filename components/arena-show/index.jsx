var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    ResponsiveMixin = require('react-responsive-mixin');

var InlineSVG = require('react-inlinesvg');

var FlickerIcon = require('../page/flickerIcon.jsx');

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

var News = React.createClass({
  componentDidMount: function () {},

  render: function(){
    var self = this;
    var divStyles = {
      background: 'url(' + self.props.image + ') no-repeat center',
    };
    return (

      <li className="news__list-item" style={divStyles}>
        <a target="_blank" href={self.props.link}>
          <h4 className="news__title"><span className="news__title__inner">{self.props.title}<em className="news__byline">by {self.props.credit}</em></span></h4>
        </a>
      </li>



      )
  }
});

var my_image, bkd_image;

var AssetList = React.createClass({
  getInitialState: function() {
    return { photos: [], news: [], pre_count: 0 };
  },
  componentWillMount: function(){
    var self = this;

    bkd_image = new Image();
    bkd_image.onload = self.onLoad;
    bkd_image.src = "/img/bkgrd_pattern_BLK.svg";

    request
      .get('/api/pages/our-house')
      .end(function(res) {
        console.log(res)
        if (res.text) {
          var photos = JSON.parse(res.text);
          my_image = new Image();
          my_image.onload = self.onLoad;
          my_image.src = "/img/bg--video_arena.jpg";
          self.setState(photos);
        }
      }.bind(self));

  },

  onLoad: function() {

    console.log('onLoad');
    var self = this;
    var tmp_pre_count = self.state.pre_count;
    tmp_pre_count++;
    if (tmp_pre_count == 2) {
      self.setState({loaded: true, pre_count: tmp_pre_count}); 
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


  componentDidMount: function () {
        // $('.instagram .imageloader.loaded img').velocity('transition.slideUpBigIn');
  },

  render: function() {
    var self = this;

    var news = self.state.news.map(function(object) {
      return <News link={object.link} title={object.title} image={object.image} credit={object.credit} key={object._id} />
    });

    var photos = self.state.photos.map(function(object) {
      return <Photo url={object.url} description={object.description} key={object._id} />
    });

    var bkd_video = {},
          youtube_video = {};
      bkd_video.poster="/img/bg--video_arena.jpg";
      bkd_video.src="https://s3.amazonaws.com/maverickmayhem/loop_arena.mp4"

      youtube_video.src = "https://www.youtube.com/embed/wCzTEu9tSK0?rel=0&autoplay=1";
    if (self.state.loaded == true) {
      return (
        <div>
            <div className={ self.state.playVideo ? "page-video-wrapper show" : "page-video-wrapper" }>
              <div className="video-center"  onClick={self.stopVideo}>
                <iframe className="tunnel-walk" width="853" height="480" src={ self.state.playVideo ? youtube_video.src : ''} frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
            <div className="page_container" id="main" role="main">
              <div className="hero hero-home">
                <div className="hero__inner">
                  <div className="hero__content-wrap hero__content-home">
                    <div className="hero__content">
                      <img src="/img/every-moment2.svg" alt="Where every moment is the main event." />
                      <p>Opening Fall 2015, construction on the new UNO arena on Center St. near Aksarben Village is well underway. Not only will the arena be home to Mavericks hockey and basketball, it will also play host to a wide range of community events. </p>
                    </div>
                  </div>
                </div>

                <div className="play_button" onClick={self.playVideo}>
                  <InlineSVG src="/img/icon--play_button.svg" uniquifyIDs={false} ></InlineSVG>

                  { self.state.name } Tunnel Walk Video
                </div>

                <div className="hero__overlay"></div>

                <div className="hero__media">
                  <video id="video-background" className="video-wrap" poster={bkd_video.poster} autoPlay muted="muted" loop>
                    <source src={bkd_video.src} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          <div className="container">
            <div className="news arena">
              <ul className="news__list">
                {news}
              </ul>
            </div>
          </div>
          <div className="matchup_photos">
            {photos}
          </div>
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




React.renderComponent(
  AssetList(),
  document.getElementById('content')
)
