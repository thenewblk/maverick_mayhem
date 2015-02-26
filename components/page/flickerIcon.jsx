/** @jsx React.DOM */

var React = require('react/addons');

var Velocity = require('velocity-animate/velocity');

require('velocity-animate/velocity.ui');

var InlineSVG = require('react-inlinesvg'),
    util = require('util');

Velocity.RegisterEffect("bull_flicker", {
    defaultDuration: 500,
    calls: [
        [ { scaleX: 0.9, scaleY: 0.9, rotateZ: -3 * Math.random() }, 0.10 ],
        [ { scaleX: 1.1, scaleY: 1.1, rotateZ: 3 * Math.random()}, 0.10 ],
        [ { scaleX: 1.1, scaleY: 1.1, rotateZ: -3 * Math.random() }, 0.10, ],

        [ "reverse", { duration: Math.random() } ],
        [ "reverse", { duration: Math.random() } ],
        [ "reverse", { duration: Math.random() } ],

        [ { blur: 5 }, .2 ],
        [ "reverse", { duration: Math.random() } ],


        [ { scaleX: 0.9, scaleY: 0.9, rotateZ: -3 * Math.random() }, 0.10 ],
        [ { scaleX: 1.1, scaleY: 1.1, rotateZ: 3 * Math.random()}, 0.10 ],
        [ { scaleX: 1.1, scaleY: 1.1, rotateZ: -3 * Math.random() }, 0.10, ],


        [ "reverse", { duration: Math.random() } ],
        [ "reverse", { duration: Math.random() } ],
        [ "reverse", { duration: Math.random() } ],
        [ "reverse", { duration: Math.random() } ],
        [ "reverse", { duration: Math.random() } ],

        [ { scaleX: 0.9, scaleY: 0.9, rotateZ: -3 * Math.random() }, 0.10 ],
        [ { scaleX: 1.1, scaleY: 1.1, rotateZ: 3 * Math.random()}, 0.10 ],
        [ { scaleX: 1.1, scaleY: 1.1, rotateZ: -3 * Math.random() }, 0.10, ],

        [ "reverse", { duration: Math.random() } ],
        [ "reverse", { duration: Math.random() } ],


        [ { scaleX: 1, scaleY: 1, rotateZ: 0 }, 0.20 ]
    ],
});

var FlickerIcon = React.createClass({
  getInitialState: function() {
    return { hover: '' } 
  },
  loaded: function () {
    var self = this;
    var component = self.getDOMNode();
    var svg = component.querySelectorAll('svg');
    var cattlebrand = component.querySelectorAll('#cattlebrand');
    var sport_logo = component.querySelectorAll('#sport_logo');

    Velocity(cattlebrand,
      { opacity: [0,1],
        duration: .3},
      { delay: 300 }
    );

    Velocity(sport_logo,
      { opacity: [1,0],
        duration: .5},
      { 
        delay: 300 }
    );  

    if ( self.props.loop ) {
      function animateItems() {
        Velocity(svg,
          'bull_flicker',
          { 
            complete: function() { 
              animateItems();
            }
          }
        );
      }
      animateItems();
    } else {
      Velocity(svg, 'bull_flicker');
    }
  },

  componentDidUpdate: function() {
    var self = this;
    var component = self.getDOMNode();
    var svg = component.querySelectorAll('svg');
    var cattlebrand = component.querySelectorAll('#cattlebrand');
    var sport_logo = component.querySelectorAll('#sport_logo');


    if ( self.state.hover || self.props.loop ) {
      Velocity(cattlebrand,
        { opacity: [0,1],
          duration: .3},
        { delay: 300,
          loop: true }
      );

      Velocity(sport_logo,
        { opacity: [1,0],
          duration: .5},
        { 
          delay: 300,
          loop: true }
      );  

      function animateItems() {
        if(self.state.hover){
          Velocity(svg,
            'bull_flicker',
            { 
              stagger: 500,
              complete: function() { 
                animateItems();
              }
            }
          );
        }
      }

      animateItems();
    } else {

      Velocity(cattlebrand, "stop" );
      Velocity(cattlebrand, "reverse" );
      Velocity(sport_logo, "stop" );
      Velocity(sport_logo, "reverse" );
      Velocity(svg, "stop", true );

    }


  },



  onEnter: function() {
    console.log('onEnter');
    this.setState({hover: true});
  },

  onLeave: function(){
    console.log('onLeave');
    this.setState({hover: false});
  },

  render: function() {
    var self = this;
    var cattlebrand = {
      opacity: 0
    }
    if (this.props.icon_url) {
      return (
        <span onMouseEnter={self.onEnter} onMouseLeave={self.onLeave}>
          <InlineSVG onLoad={self.loaded} src={self.props.icon_url} uniquifyIDs={false} ></InlineSVG>
        </span>
      )
    } else {
      return (
        <span onMouseEnter={self.onEnter} onMouseLeave={self.onLeave}>
          <InlineSVG onLoad={self.loaded} src="/img/icon--flicker.svg" uniquifyIDs={false} ></InlineSVG>
        </span>
      )
    }
  }
});

module.exports = FlickerIcon;