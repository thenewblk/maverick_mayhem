var React = require('react');
var Router = require('react-router');

var Route = Router.Route,
	DefaultRoute = Router.DefaultRoute,
  	NotFoundRoute = Router.NotFoundRoute,
  	RouteHandler = Router.RouteHandler,
  	Link = Router.Link;


var Home = require('../index/index.jsx');
var Page = require('../page/index.jsx');
var Arena = require('../arena-show/index.jsx');
var InlineSVG = require('react-inlinesvg');

var $ = require('jquery');
require('../../public/js/vendors/headroom.js');

var App = React.createClass({
	mixins: [Router.State], 
  getHandlerKey: function () {
    var childDepth = 1; // assuming App is top-level route
    var key = this.getRoutes()[childDepth].name;
    var id = this.getParams().id;
    if (id) { key += id; }
    return key;
  },
  getInitialState: function () { 
  	return {  };
	},
	openNav: function(){
		this.setState({nav_show: true});
	},

	closeNav: function(){
		this.setState({nav_show: false});
	},

	componentDidMount: function(){
	    if(!('backgroundBlendMode' in document.body.style)) {
	        // No support for background-blend-mode
	      var html = document.getElementsByTagName("html")[0];
	      html.className = html.className + " no-background-blend-mode";
	    }

	    // HEADROOM.JS 
			var navigation = document.querySelector("header");

			var headroom = new Headroom(navigation, {
			  "offset": 500,
			  "tolerance": 20,
			});

			headroom.init();
	},

	render: function () {
		var self = this;

		var nav;
		if (self.state.nav_show) {
			nav = "App nav-show";
		} else {
			nav = "App"
		}
		
		return (
		  <div className={nav}>
		    <header id="header">
		    	<Link to="/" className="logo">
		          <img src="/img/icon--bull.svg" alt="UNO Maverics bull icon" />
		        </Link>

		        <nav className="nav--secondary" role="navigation">
		          <div className="menu">
		            <ul className="menu--secondary menu__list">
		              <li className="menu__list--item"><Link to="our-house" onClick={self.closeNav}>Our House</Link></li>
		            </ul>
		          </div>
		        </nav>


		        <nav className="nav--primary " role="navigation">
		          <span key="menu" className="btn--menu icon--menu" onClick={self.openNav}>
		            {self.getParams().slug ? self.getParams().slug : 'Sports' } 
		            <InlineSVG src="/img/icon--menu.svg" uniquifyIDs={false}></InlineSVG>

		          </span>
		          <span key="close" className="btn--menu-close icon--close"  onClick={self.closeNav}>
		            <InlineSVG src="/img/icon--close.svg" uniquifyIDs={false}></InlineSVG>

		          </span>
		          <div className="menu menu--main-menu">
		            <ul className="menu__list">
		              <li className="menu__list--item"><Link to="page" params={{slug: "hockey"}} onClick={self.closeNav}>Hockey</Link></li>
		              <li className="menu__list--item"><Link to="page" params={{slug: "basketball"}} onClick={self.closeNav}>Mens Basketball</Link></li>
		            </ul>
		          </div>
		          <div className="menu menu--mobile-menu">
		            <ul className="menu__list">
		              <li className="menu__list--item"><Link to="page" params={{slug: "hockey"}} onClick={self.closeNav}>Hockey</Link></li>
		              <li className="menu__list--item"><Link to="page" params={{slug: "basketball"}} onClick={self.closeNav}>Mens Basketball</Link></li>
		              <li className="menu__list--item"><Link to="our-house" onClick={self.closeNav}>Our House</Link></li>
		            </ul>
		          </div>
		        </nav>
		    </header>
		    <div className="main_content">
		      <RouteHandler key={this.getHandlerKey()} />
		    </div>


		    <footer>
		        <div className="stripe">
		          <img className="icon--mav-mayhem" src="/img/icon--maverick-mayhem.svg" alt="#maverickmayhem" />
		          <img className="icon--bull" src="/img/bg--bull_footer.svg" alt="UNO Maverick's bull icon" />
		        </div>
		        <div className="contact-info">
		          <p className="copyright">&copy;  2015, University of Nebraska Omaha. All rights reserved.</p>
		        </div>

		    </footer>
		  </div>
		);
	}
});

var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Home} open_social={App.openSocial} />
    <Route name="our-house" path="/our-house" handler={Arena} />
	<Route name="page" path="/:slug" handler={Page} />
  </Route>
);


Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});