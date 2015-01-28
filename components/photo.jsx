/**
 * @jsx React.DOM
 */

var React = require('react'),
    util = require('util'),
    request = require('superagent');

var Dropzone = require('./dropzone.js');

var Photo = React.createClass({

  getInitialState: function() {
    return { url: '', description: ''};
  },

  handleDescriptionChange: function(event) {
    this.setState({description: event.target.value });
  },

  handleClose: function() {
    var self = this;
    self.props.removed({id: self.props.identifier});
  },

  handleSwapPrevious: function() {
    this.props.swap_previous({id: this.props.identifier});
  },

  handleSwapNext: function() {
    this.props.swap_next({id: this.props.identifier});
  },

  componentDidMount: function() {
    var self = this;
    var image = this.state.url;
    if (!image) {
      console.log('componentDidMount: '+ self.props.identifier);

      // or if you need to access a Dropzone somewhere else:
      Dropzone.autoDiscover = false;
      var myDropzone = new Dropzone(".uploader", {
        // autoProcessQueue: false,
        init: function() {
          var self = this;
          self.on("addedfile", function(file) {
            console.log('new file added ', file);
          });
        },
        url: "/upload"
      });

      // myDropzone.on("addedfile", function(file) {
      //   /* Maybe display some more file information on your page */
      //   request
      //     .post('/upload')
      //     .send(file)
      //     .end(function(res) {
      //       console.log(res.text);
      //     }.bind(self));
      // });

      // Dropzone.options.uploader({
      //   init: function() {
      //     this.on("error", function(file, message) { alert(message); });
      //   },
      //   url: "/upload", 
      //   paramName: "file", 
      //   maxFiles: 1
      // });
      myDropzone.on("success", function(response) {
        /* Maybe display some more file information on your page */
        // var thing = JSON.parse(file.xhr.response);
        // console.log('success: ' + thing.saved);
        console.log('success: ' + util.inspect(response.xhr.response));


        self.setState({url: response.xhr.response});
        // self.setState({ active: true });
      });

      // myDropzone.on("error", function(err) {
        /* Maybe display some more file information on your page */
        // console.log('error: ' + err);



        // self.props.content({id: self.props.identifier, url: thing.saved  });
        // self.setState({ active: true });
      // });
    }
  },

  // componentDidUpdate: function() {
  //   var self = this;
  //   var image = this.state.url;
  //   if (!image) {
  //     console.log('onScriptLoaded: '+ self.props.identifier);

  //     Dropzone.autoDiscover = false;

  //     var myDropzone = new Dropzone(".uploader-"+self.props.identifier, { url: "/upload", paramName: "file", maxFiles: 1, autoDiscover: false});

  //     myDropzone.on("success", function(file) {
  //       /* Maybe display some more file information on your page */
  //       var thing = JSON.parse(file.xhr.response);
  //       console.log('success: ' + thing.saved);

        

  //       // self.props.content({id: self.props.identifier, url: thing.saved  });
  //       // self.setState({ active: true });
  //     });
  //   }
  // },

  render: function() {
    var self = this,
        url = self.state.url,
        description = self.state.description;

    var className = 'content-container';

    return ( 
      <div className={className} ref='contentwrapper'>
        <div className="position-control">
          <span className="move up" onClick={this.handleSwapPrevious}></span>
          <span className="move down" onClick={this.handleSwapNext}></span>
        </div>
        {url ?  
          <div className='uploaded-image'>
            <img src={"https://s3.amazonaws.com/maverickmayhem-dev"+url} />
          </div> 
        : 
          <div className='image-container'>
            <div className={"image-uploader-label image-uploader uploader"} id="uploader">
              <p className="fa fa-image upload-icon label-copy"></p>
              <br />
              <p className="label-copy">Upload Image</p>
            </div>
          </div>
        // <form action="/upload" className="dropzone" method="post" enctype="multipart/form-data">
        //   <div className="fallback">
        //     <input name="file" type="file" />
        //   </div>
        // </form>
        }
        <input className='caption-input' type="text" placeholder="Description" value={description} onChange={self.handleDescriptionChange} />

        <a className="close-link" onClick={self.handleClose}>×</a>
      </div> )
  }
});

module.exports = Photo;