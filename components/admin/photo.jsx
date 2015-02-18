/**
 * @jsx React.DOM
 */

var React = require('react'),
    util = require('util'),
    request = require('superagent');

var Dropzone = require('../dropzone.js');

var Photo = React.createClass({

  getInitialState: function() {
    return { url: '', description: '', featured: false, _id: '', status: 'show'};
  },

  componentWillMount: function() {
    var self = this;
    var tmp_photo = {};
    tmp_photo.identifier = self.props.identifier,
    tmp_photo.url = self.props.url,
    tmp_photo.featured = self.props.featured,
    tmp_photo._id = self.props._id,
    tmp_photo.matchup_status = self.props.matchup_status,
    tmp_photo.description = self.props.description;
    
    self.setState(tmp_photo);
  },

  handleDescriptionChange: function(event) {
    this.setState({description: event.target.value });
  },

  handleFeaturedChange: function(event) {
    this.setState({featured: !this.state.featured });
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
    var self = this,
        image = this.state.url,
        identifier = this.state.identifier,
        _id = this.state._id;

    if (!image) {
      console.log('componentDidMount: '+ _id);
      Dropzone.autoDiscover = false;
      var myDropzone = new Dropzone(".uploader-"+_id, {
        init: function() {
          var self = this;
          self.on("addedfile", function(file) {
            console.log('new file added ', file);
          });
        },
        maxFiles: 1,
        url: "/upload"
      });

      myDropzone.on("success", function(response) {
        console.log('success: ' + util.inspect(response.xhr.response));
        self.setState({url: response.xhr.response});
      });
    }
  },

  componentDidUpdate: function() {
    var self = this,
        image = this.state.url,
        identifier = this.state.identifier,
        _id = this.state._id;

    if (!image) {
      console.log('componentDidMount: '+  _id);
      Dropzone.autoDiscover = false;
      var myDropzone = new Dropzone(".uploader-"+ _id, {
        init: function() {
          var self = this;
          self.on("addedfile", function(file) {
            console.log('new file added ', file);
          });
        },
        maxFiles: 1,
        url: "/upload"
      });

      myDropzone.on("success", function(response) {
        console.log('success: ' + util.inspect(response.xhr.response));
        self.setState({url: response.xhr.response});
      });
    }
  },

  handleEdit: function() {
    this.setState({status: 'edit'});
  },

  cancelEdit: function() {
    this.setState({status: 'show'});
  },

  removeUrl: function(){
    this.setState({url: ''});
  },

  handleRemove: function(){
    this.props.remove_photo({_id: this.state._id});
  },

  submitContent: function(){
    var self = this;
    console.log('self.state._id: '+self.state._id);
    request
      .post('/api/photos/'+self.state._id+'/edit')
      .send(self.state)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          var new_photo = JSON.parse(res.text);
          new_photo.status = 'show';
          self.setState(new_photo);
        }
      }.bind(self));
  },

  render: function() {
    var self = this,
        url = self.state.url,
        description = self.state.description,
        featured = self.state.featured,
        identifier = this.state.identifier,
        _id = this.state._id,
        status = this.state.status,
        matchup_status = this.state.matchup_status;

    var className = 'content-container';
    if (status == 'show') {
      return ( 
        <div className='photo' ref='contentwrapper'>
              {url ? <img src={"https://s3.amazonaws.com/maverickmayhem-dev"+url} />  : '' }
              {description ? <p>{description}</p> : '' }
              {featured ? <p>Featured</p>  : '' }
              { (matchup_status == 'edit') ?
                <div className='half_buttons'>
                  <a className='submit' onClick={self.handleEdit}>Edit</a> 
                  <a className='submit' onClick={self.handleRemove}>delete</a> 
                </div>
              : ''}
        </div> )
    } else if (status == 'edit'){
      return ( 
        <div className='photo image-container'>
          {url ? 
            <div className="photo_edit">
              <img src={"https://s3.amazonaws.com/maverickmayhem-dev"+url} />
              <span className="close_it"  onClick={self.removeUrl}>×</span>
            </div>
              :
            <div>
              <div className={"image-uploader dropzone uploader-"+_id}>
                <div className="dz-default dz-message"><span className="fa fa-image upload-icon"></span><span>Drop files here to upload</span></div>
              </div>
            </div>
          }
          <input className='description_input' type="text" placeholder="Description" value={description} onChange={self.handleDescriptionChange} />
          <p>Featured: <input type="checkbox" checked={featured} onChange={this.handleFeaturedChange} /></p>
          <div className='half_buttons'>
            <a className='submit' onClick={self.submitContent}>save</a> 
            <a className='submit' onClick={self.cancelEdit}>cancel</a> 
          </div>
        </div>
      )
    }
  }
});

module.exports = Photo;