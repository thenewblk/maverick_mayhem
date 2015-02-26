var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    moment = require('moment'),
    tools = require('../../lib/utils');

var InlineSVG = require('react-inlinesvg');

function getPeriod(i) {
  if (this.slug == "hockey"){ 
    if (i < 4 ) {
      return tools.ordinal(i);
    } else {
      return "OT";
    }
  } else {
    return tools.ordinal(i);
  }
}

function getUsTotal(game) {
  var total = game.scores.reduce(function(a, b) {
    return a + b.us;
  }, 0);
  return total;
};

function getThemTotal(game) {
  var total = game.scores.reduce(function(a, b) {
    return a + b.them;
  }, 0);
  return total;
};

function getSmallDate(i) {
  return moment(i).format('MMM. D');
};


var Content = window.slug || {};

var FlickerIcon = require('./flickerIcon.jsx');


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

var MatchupScores = React.createClass({
  getInitialState: function() {
    return { 
      games: [],
      current_game: '',
      opponent: ''
    }
  },

  componentWillMount: function(){
    var self = this;
    console.log('componentWillMount: ' + util.inspect(self.props));

    self.setState(self.props);
  },

  changeGame: function(game) {
    var self = this;
    console.log('game_label clicked: ' + util.inspect(game));
    self.setState({current_game: game._id});
  },

  render: function() {
    console.log('MatchupScores: ' + util.inspect(this.state));
      var self = this;
          games = self.state.games;
      var game_toggle = games.map(function(game, index) {
        var active = false;
        if(game._id == self.state.current_game){ 
           active = true;
         }
        return (
          <div onClick={self.changeGame.bind(null, game)} key={game._id} className={active ? "game_label active" : "game_label"}>Game { index +1 } | {getSmallDate(game.date)} </div>
        )
      });

      var game_table = games.map(function(game, index) {
        var active = false;
        if(game._id == self.state.current_game){ 
           active = true;
        }
        var periods = game.scores.map(function(object, index) {
          return <th>{ getPeriod(index +1) }</th>
        });

        var us_scores = game.scores.map(function(score) {
          return <td className="score">{ score.us }</td>
        });

        var them_scores = game.scores.map(function(score) {
          return <td className="score">{ score.them }</td>
        });

        return (
          <table className={active ? "last_matchup_table sport__scoreboard sport__scoreboard-hockey active" : "last_matchup_table sport__scoreboard sport__scoreboard-hockey"}>
            <thead>
              <tr className="scoreboard__header">
                <th className="team-name">&nbsp;</th>
                {periods}
                <th className="score-total">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="team visitor">
                <td className="team-name">Omaha</td>
                {us_scores}
                <td className="score">{getUsTotal(game)}</td>
              </tr>
              <tr className="team away">
                <td className="team-name">{self.state.opponent}</td>
                {them_scores}
                <td className="score">{ getThemTotal(game) }</td>
              </tr>
            </tbody>
          </table>
          )
      });

      return (
        <div className="last_matchup">
          <p className="content_title">Last Matchup:</p>
          <div className="game_toggle">
            {game_toggle}
          </div>
          {game_table}

        </div>
      )
  }
});

var PhotoGallery = React.createClass({
  getInitialState: function() {
    return { 
      current_matchup: {},
      last_matchup: {},
      next_matchup: {},
      matchups: [], 
    };
  },
  componentWillMount: function(){
    var self = this;
    var photo_gallery = {};


    photo_gallery.matchups = self.props.matchups;
    photo_gallery.current_matchup = self.props.last_matchup;

    self.setState(photo_gallery);

  },

  previousMatchup: function(){
    var self = this;
    var current_matchup = self.state.current_matchup._id;
    var tmp_previous_matchup;

    for (i=0; i < self.state.matchups.length; i++){
      if (self.state.matchups[i]._id == current_matchup){
        tmp_previous_matchup = i-1;
      }
    }
    if (tmp_previous_matchup >= 0) {
      self.setState({current_matchup: self.state.matchups[tmp_previous_matchup]});
    }

  },

  nextMatchup: function(){
    var self = this;
    var current_matchup = self.state.current_matchup._id;
    var tmp_next_matchup;

    for (i=0; i < self.state.matchups.length; i++){
      if (self.state.matchups[i]._id == current_matchup){
        tmp_next_matchup = i+1;
      }
    }
    if (tmp_next_matchup < self.state.matchups.length) {
      self.setState({current_matchup: self.state.matchups[tmp_next_matchup]});
    }
    

  },

  render: function() {
    var self = this; 

    var last_matchup = self.state.last_matchup;
    var current_matchup = self.state.current_matchup;

    console.log('Page.render current_matchup: ' + util.inspect(current_matchup));

    if (current_matchup.photos){
      var photos = current_matchup.photos.map(function(object) {
        return <Photo url={object.url} description={object.description} key={object._id} />
      });
    }
    return (
      <div className="photo-gallery">
        <div className="sport-recap">
          <span onClick={self.previousMatchup} className="previous_matchup"><img src="../img/arrow_left.svg" /><span className="label">Previous</span></span>
          <div className="sport__headline matchup_headline">
            <h2>{ current_matchup.name ? current_matchup.name : ''}</h2>
          </div>
          { current_matchup.games ? <MatchupScores key={current_matchup._id} games={current_matchup.games} current_game={current_matchup.games[0]._id} opponent={current_matchup.opponent}/> : ''}
          <span onClick={self.nextMatchup} className="next_matchup"><img src="../img/arrow_right.svg" /><span className="label">Next</span></span>
        </div>
        
        <div className="matchup_photos">
          {photos}
        </div>
      </div>
    )
  }
});

var my_image;

var Page = React.createClass({
  getInitialState: function() {
    return { 
      name: '', 
      headline: '', 
      banner: '', 
      description: '', 
      video: {}, 
      icon: {}, 
      current_matchup: {},
      last_matchup: {},
      next_matchup: {},
      matchups: [], 
      photos: [], 
      featured_photos: [],
      tmp_photos: [], 
      news: [],
      loaded: false
    };
  },
  componentWillMount: function(){
    var self = this;

    if (Content) {

      request
        .get('/api/pages/'+Content)
        .end(function(res) {
          if (res.text) {
            var Page = JSON.parse(res.text);


            var tmp_matchups = Page.matchups.sort(function(a,b){
              return new Date(a.games[0].date) - new Date(b.games[0].date);
            });

            Page.matchups = tmp_matchups;
            Page.current_matchup = Page.last_matchup;

            my_image = new Image();
            my_image.onload = self.onLoad;

            if (Page.slug == 'hockey') {
              console.log('hockey');
              my_image.src = "http://www.maverick-mayhem.com/img/bg--video_hockey.jpg";

            } else if (Page.slug == 'basketball') {
              console.log('basketball');
              my_image.src = "http://www.maverick-mayhem.com/img/bg--video_bball-mens.jpg";
            } 

            self.setState(Page);
          }
        }.bind(self));
    }
  },


  componentDidMount: function(){
    var self = this;
  },


  onLoad: function() {
    console.log('onLoad');
    var self = this;
    self.setState({loaded: true});
  },

  playVideo: function (){
    this.setState({playVideo: true});
  },

  stopVideo: function (){
    this.setState({playVideo: false});
  },




  render: function() {
    var self = this; 


    if (self.state.loaded == true) {
      var matchups = self.state.matchups,
          last_matchup = self.state.last_matchup;
      var bkd_video = {},
          youtube_video = {};

      var news = self.state.news.map(function(object) {

        var news_style = {
          background: 'url('+ object.image +') no-repeat center', 
          backgroundSize: 'cover'
        }

        return (
            <li className="news__list-item" style={news_style}>
              <a target="_blank" href="{ object.link }">
                <h4 className="news__title"><span>{ object.title }<em className="news__byline">by { object.credit }</em></span></h4>
              </a>
            </li>
        )
      });

      if (self.state.slug == 'hockey') {
        bkd_video.poster="/img/bg--video_hockey.jpg";
        bkd_video.src="https://s3.amazonaws.com/maverickmayhem/loop_hockey.mp4"

        youtube_video.src = "https://www.youtube.com/embed/JNuQxxJSGZs?list=PL7tfLy4QIaez1AtYAPyv_BO5TFR1BbRT-&autoplay=1";

        ;

      } else if (self.state.slug == 'basketball') {
        bkd_video.poster="/img/bg--video_bball-mens.jpg";
        bkd_video.src="https://s3.amazonaws.com/maverickmayhem/loop_bball_mens.mp4";

        youtube_video.src = "https://www.youtube.com/embed/8RiSg3ZzSsw?list=PL7tfLy4QIaez1AtYAPyv_BO5TFR1BbRT-&autoplay=1";
      } else {
        
      }

      return (
        <div>

          <div className={ self.state.playVideo ? "page-video-wrapper show" : "page-video-wrapper" }>
            <div className="video-center"  onClick={self.stopVideo}>
              <iframe className="tunnel-walk" width="853" height="480" src={ self.state.playVideo ? youtube_video.src : ''} frameborder="0" allowFullScreen></iframe>
            </div>
          </div>



          <div className="page_container" id="main" role="main">
            <div className="hero">
              <div className="page_content">
                <div className="page_title">
                  <h3><img className="icon--mav-mayhem" src="/img/icon--maverick-mayhem.svg" alt="#maverickmayhem" /><span id="sport_icon"><FlickerIcon icon_url={"/img/icon--flicker-"+Content+".svg"} /></span></h3>
                </div>

              <div className="content_box next">
                  <p className="content_title">NEXT MATCHUP: { self.state.next_matchup.date }</p>
                  <p className="game_title">vs { self.state.next_matchup.opponent } @ { self.state.next_matchup.location }</p>
                  <div className="ticket_button">
                    <a href="{ self.state.next_matchup.ticket }">Get Tickets</a>

                    <InlineSVG src="/img/icon--button_bkgd.svg" uniquifyIDs={false}></InlineSVG>
                  </div>
              </div>

              <div className="content_box press">
                <p className="content_title">Press</p>
                <div className="news">
                  <ul className="news__list">
                    {news}
                  </ul>
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
          <PhotoGallery matchups={matchups} last_matchup={last_matchup} />


          <div className="play_button mobile">
            <InlineSVG src="/img/icon--play_button.svg" uniquifyIDs={false}></InlineSVG>
            { self.state.name } Tunnel Walk Video
          </div>


        </div>
        )

    } else{
      return (
        <div className="preloader">
          <FlickerIcon icon_url={"/img/icon--flicker-"+Content+".svg"} loop={true}/>
        </div>
      )
    }
  }
});




React.renderComponent(
  Page(),
  document.getElementById('content')
);