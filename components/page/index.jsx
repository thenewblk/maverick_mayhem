var React = require('react'),
    request = require('superagent'),
    util = require('util');

var ImageLoader = require('react-imageloader');
 
var InfiniteScroll = require('react-infinite-scroll')(React);

var Content = window.slug || {};

var Photo = React.createClass({
  getInitialState: function() {
    return {  };
  },

  componentDidMount: function () {},
  render: function() {
    var self = this;
    
    return (
      <div className="infinite-photo">
        <ImageLoader src={'https://s3.amazonaws.com/maverickmayhem-dev'+self.props.url} >
          Image load failed!
        </ImageLoader>
      </div>
    )
  }
});

var Page = React.createClass({
  getInitialState: function() {
    return { 
      name: '', 
      headline: '', 
      banner: '', 
      description: '', 
      video: {}, 
      icon: {}, 
      games: [], 
      photos: [], 
      tmp_photos: [], 
      news: [],
      has_more: true
    };
  },
  componentWillMount: function(){
    var self = this;

    if (Content) {

      request
        .get('/api/pages/'+Content)
        .end(function(res) {
          console.log(res)
          if (res.text) {
            var Page = JSON.parse(res.text);
            Page.tmp_photos = Page.photos.slice(0,10);
            self.setState(Page);
          }
        }.bind(self));
    }
  },

  loadPhotos: function(){
    console.log('loadPhotos');
    var self = this;
    var total_photos = self.state.photos;
    var total_tmp = self.state.tmp_photos;

    var new_tmp_photos, 
        new_photos, 
        has_more;

    var diff = total_photos.length - total_tmp.length;

    if (diff > 0) {
      has_more = true;
      if ( diff < 10) {
        new_tmp_photos = total_tmp.concat(total_photos.splice(total_tmp.length, diff));
      } else {
        new_tmp_photos = total_tmp.concat(total_photos.splice(total_tmp.length, 10));
      }
      self.setState({tmp_photos: new_tmp_photos, has_more: has_more})
    } else {
      has_more = false;
      self.setState({has_more: has_more});
    }

  },
  render: function() {
    var self = this; 
    console.log('has_more: '+self.state.has_more);
    var photos = self.state.tmp_photos.map(function(object) {
      return <Photo url={object.url} description={object.description} />
    });

    var featured = self.state.photos.filter(function(photo){
      return photo.featured;
    });

    var featured_photos = featured.map(function(object) {
      return <Photo url={object.url} description={object.description} />
    });

    return (
      <div className="all_photos">
        <div className="featured_photos">
          {featured_photos}
        </div>
        <div className="infinite-photo-list">
          <InfiniteScroll 
            hasMore={self.state.has_more} 
            loadMore={self.loadPhotos} 
            loader={<div className="fa fa-circle-o-notch fa-spin loader"></div>}
            threshold={0}>
            {photos} 
          </InfiniteScroll>
        </div>
      </div>
    )
  }
});




React.renderComponent(
  Page(),
  document.getElementById('photo-gallery')
)