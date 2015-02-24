var React = require('react'),
    request = require('superagent'),
    util = require('util');

var News = React.createClass({
  getInitialState: function() {
    return { title: '', status: 'show', link: '', image: '', credit: '' };
  },

  componentWillMount: function(){
    var self = this;
    var tmp_news = {};
    tmp_news.identifier = self.props.identifier,
    tmp_news.title = self.props.title,
    tmp_news.credit = self.props.credit,
    tmp_news.link = self.props.link,
    tmp_news.image = self.props.image,
    tmp_news._id = self.props._id,
    tmp_news.status = self.props.status;
    
    self.setState(tmp_news);

  },

  componentDidMount: function(){

  },

  handleTitleChange: function(event) {
    this.setState({title: event.target.value});
  },

  handleLinkChange: function(event) {
    this.setState({link: event.target.value});
  },

  handleImageChange: function(event) {
    this.setState({image: event.target.value});
  },

  handleCreditChange: function(event) {
    this.setState({credit: event.target.value});
  },

  handleEdit: function(){
    this.setState({status: "edit"})
  },

  handleRemove: function(){
    this.props.remove_news({_id: this.state._id});
  },


  handleRemoveNew: function(){
    this.props.remove_new_news({_id: 4});
  },

  submitContent: function(){
    var self = this;
    request
      .post('/api/news/new')
      .send(self.state)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          console.log('new news: '+res.text);
          var new_game = JSON.parse(res.text);
          new_game.identifier = self.state.identifier;
          new_game.status = 'show';
          self.props.new_news(new_game);
          self.setState(new_game);
        }
      }.bind(self));
  },

  editContent: function(){
    var self = this;

    request
      .post('/api/news/'+self.state._id+'/edit')
      .send(self.state)
      .end(function(res) {
        console.log(res)
        if (res.text) {
          console.log('new news: '+res.text);
          var new_game = JSON.parse(res.text);
          new_game.identifier = self.state.identifier;
          new_game.status = 'show';
          self.setState(new_game);
        }
      }.bind(self));
  },

  cancelEdit: function() {
    this.setState({status: 'show'});
  },

  render: function () {
    var self = this;

    var title = self.state.title,
        link = self.state.link,
        image = self.state.image,
        credit = self.state.credit,
        status = self.state.status;


    if (status == 'new') {
      return (
        <div className="matchup">
          <h3>New News</h3>
          <h3><input type="text" value={title} onChange={this.handleTitleChange} placeholder="Title" /></h3>
          <h5><input type="text" value={link} onChange={this.handleLinkChange} placeholder="Link" /></h5>
          <h5><input type="text" value={image} onChange={this.handleImageChange} placeholder="Image" /></h5>
          <h5><input type="text" value={credit} onChange={this.handleCreditChange} placeholder="Credit" /></h5>
          
          <div className='edit_buttons'>
            <a className='edit_button red' onClick={self.submitContent}>save</a> 
            <a className='edit_button' onClick={self.handleRemoveNew}>cancel</a> 
          </div>
        </div>
      )
    } else if (status == 'edit') {
      return (
        <div className="matchup">
          <h3>Edit News</h3>
          <h3><input type="text" value={title} onChange={this.handleTitleChange} placeholder="Title" /></h3>
          <h5><input type="text" value={link} onChange={this.handleLinkChange} placeholder="Link" /></h5>
          <h5><input type="text" value={image} onChange={this.handleImageChange} placeholder="Image" /></h5>
          <h5><input type="text" value={credit} onChange={this.handleCreditChange} placeholder="Credit" /></h5>
          
          <div className='edit_buttons'>
            <a className='edit_button red' onClick={self.editContent}>save</a> 
            <a className='edit_button' onClick={self.cancelEdit}>cancel</a> 
          </div>
        </div>
      )
    } else {
      return (
        <div className="matchup">
          <h3>{name}</h3>
          <ul>
            <li>Title: {title}</li>
            <li>Link: {link}</li>
            <li>Image: {image}</li>
            <li>Credit: {credit}</li>
          </ul>
          <div className='edit_buttons'>
            <a className='edit_button border' onClick={self.handleEdit}>edit</a> 
            <a className='edit_button' onClick={self.handleRemove}>remove</a> 
          </div>
        </div>
      )
    }
  }
});

module.exports = News;