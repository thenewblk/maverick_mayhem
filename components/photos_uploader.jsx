/**
 * @jsx React.DOM
 */

var React = require('react'),
    util = require('util'),
    request = require('superagent');

var Dropzone = require('./dropzone.js');

var Photo = require('./photo.jsx');

var PhotosUploader = React.createClass({

  componentDidMount: function() {
    var self = this;
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone(".photo-uploader", {
      init: function() {
        var self = this;
        self.on("addedfile", function(file) {
          console.log('new file added ', file);
        });
      },
      url: "/upload"
    });

    myDropzone.on("success", function(response) {
      console.log('success: ' + util.inspect(response.xhr.response));
      self.props.photos({url: response.xhr.response});
    });

    myDropzone.on("complete", function(file) {
      myDropzone.removeFile(file);
    });
  },


  render: function() {
    var self = this;

    return ( 
        <div className='image-container'>
          <div className="image-uploader photo-uploader dropzone">
            <div className="dz-default dz-message"><span className="fa fa-image upload-icon"></span><span>Drop Photos Here to Upload</span></div>
          </div>
        </div> 
      )
  }
});

module.exports = PhotosUploader;