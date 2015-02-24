var React = require('react'),
    request = require('superagent'),
    util = require('util'),
    ResponsiveMixin = require('react-responsive-mixin');

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

var AssetList = React.createClass({
  getInitialState: function() {
    return { photos: [], news: [] };
  },
  componentWillMount: function(){
    var self = this;

    request
      .get('/api/pages/our-house')
      .end(function(res) {
        console.log(res)
        if (res.text) {
          var photos = JSON.parse(res.text);
          self.setState(photos);
        }
      }.bind(self));

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

    return (
      <div>
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
  }
});




React.renderComponent(
  AssetList(),
  document.getElementById('content')
)
