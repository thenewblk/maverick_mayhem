var React = require('react');
var Router = require('react-router');

var Route = Router.Route,
	DefaultRoute = Router.DefaultRoute,
  	NotFoundRoute = Router.NotFoundRoute,
  	RouteHandler = Router.RouteHandler,
  	Link = Router.Link;


var Home = require('../index/index.jsx');
var Page = require('../page/index.jsx');
var Admin = require('../admin/index.jsx');
var Arena = require('../arena-show/index.jsx');
var ArenaEdit = require('../arena-edit/index.jsx');
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
  	return {
  		nav_show: false
  	};
	},
	openNav: function(){
		console.log('openNav');
		this.setState({nav_show: true});
	},

	closeNav: function(){
		console.log('closeNav');
		this.setState({nav_show: false});
	},

	openSocial: function(){
		console.log('openSocial');
		this.setState({social_show: true});
	},

	closeSocial: function(){
		console.log('closeSocial');
		this.setState({social_show: false});
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

	    $('.btn--show-pride').on('click', function () {
	      $('.social_overlay').toggleClass('up');
	    });

	    $('.social_overlay #close-icon').on('click', function () {
	      $('.social_overlay').removeClass('up');
	    });
	},
	render: function () {
		var self = this;

		var nav;
		if (self.state.nav_show == true) {
			nav = "App nav-show";
		} else if (self.state.nav_show == false) {
			nav = "App"
		}

		var social;
	    if (self.state.social_show) {
	      social = "social_overlay up";
	    } else {
	      social = "social_overlay"
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
		              <li className="menu__list--item"><a href="javascript:void(0);" onClick={self.openSocial}>Join</a></li>
		            </ul>
		          </div>
		        </nav>


		        <nav className="nav--primary admin" role="navigation">
		          <span key="menu" className="btn--menu icon--menu" onClick={self.openNav}>
		            Admin
		            <InlineSVG src="/img/icon--menu.svg" uniquifyIDs={false}></InlineSVG>

		          </span>
		          <span key="close" className="btn--menu-close icon--close"  onClick={self.closeNav}>
		          	<a className="logout" href="/logout">Logout</a>
		            <InlineSVG src="/img/icon--close.svg" uniquifyIDs={false}></InlineSVG>

		          </span>
		          <div className="menu menu--main-menu">
		            <ul className="menu__list">
		              <li className="menu__list--item">
		              	<Link className="page_title" to="page" params={{slug: "hockey"}} onClick={self.closeNav}>Hockey</Link>
		              	<Link className="page_edit" to="admin" params={{slug: "hockey", status: "edit"}} onClick={self.closeNav}><span className="fa fa-edit"></span></Link>
		              </li>
		              <li className="menu__list--item">
		              	<Link className="page_title" to="page" params={{slug: "basketball"}} onClick={self.closeNav}>Men`s Basketball</Link>
		              	<Link className="page_edit" to="admin" params={{slug: "basketball", status: "edit"}} onClick={self.closeNav}><span className="fa fa-edit"></span></Link>
		              </li>
		              <li className="menu__list--item">
		              	<Link className="page_title" to="our-house" onClick={self.closeNav}>Our House</Link>
		              	<Link className="page_edit" to="our-house-edit" onClick={self.closeNav}><span className="fa fa-edit"></span></Link>
		              </li>
		            </ul>
		          </div>
		          <div className="menu menu--mobile-menu">
		            <ul className="menu__list">
		              <li className="menu__list--item"><Link to="page" params={{slug: "hockey"}} onClick={self.closeNav}>Hockey</Link></li>
		              <li className="menu__list--item"><Link to="page" params={{slug: "basketball"}} onClick={self.closeNav}>Men`s Basketball</Link></li>
		              <li className="menu__list--item"><Link to="our-house" onClick={self.closeNav}>Our House</Link></li>
		              <li className="menu__list--item"><a href="javascript:void(0);" onClick={self.openSocial}>Join</a></li>
		            </ul>
		          </div>
		        </nav>
		    </header>
		    <div className="main_content">
		      <RouteHandler key={this.getHandlerKey()} open_social={self.openSocial} close_social={self.closeSocial} />
		    </div>

			<div className={social}>
				<div className="social_wrapper">
					<div className="social_content">
						<div className="social_content_inner">
						  <img className="social_mayhem" src="/img/icon--maverick-mayhem.svg" />
						  <p>We'll periodically select great photos and posts to spotlight. We'll also be giving out special prize packages to fans. Stay tuned for specific promotions throughout the year.</p>
						  <p className="stayintouch">Stay in Touch with the Mavericks</p>
						  <div className="social_icons">
						    <a href="https://www.facebook.com/omavs" className="link" target="_blank">
						      <InlineSVG src="/img/icon--facebook.svg" uniquifyIDs={false}></InlineSVG>
						    </a>
						    <a href="https://twitter.com/omavs" className="link" target="_blank">
						      <InlineSVG src="/img/icon--twitter.svg" uniquifyIDs={false}></InlineSVG>
						    </a>
						    <a href="https://instagram.com/omavs/" className="link" target="_blank">
						      <InlineSVG src="/img/icon--instagram.svg" uniquifyIDs={false}></InlineSVG>

						    </a>
						    <a href="https://www.youtube.com/channel/UCgeWMNjBgNPQEqzJowm89CQ" className="link" target="_blank">
						        <InlineSVG src="/img/icon--youtube.svg" uniquifyIDs={false}></InlineSVG>
						    </a>
						  </div>
						  <form action="http://universityofnebraskaomahaathletics.createsend.com/t/t/s/krihty/" method="post">
						    <p>
						        <input id="fieldEmail" name="cm-krihty-krihty" placeholder="Join our Email List" type="email" required />
						        <button type="submit">Submit</button>
						    </p>
						  </form>
						</div>
						<img className="scribble_bkd" src="/img/scribble_bkgrd_scale.svg" />
						<span onClick={self.closeSocial}>
							<InlineSVG src="/img/icon--close.svg" uniquifyIDs={false}></InlineSVG>
						</span>
					</div>
				</div>
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
    <DefaultRoute handler={Home} />
    <Route name="our-house-edit" path="/our-house/edit" handler={ArenaEdit} />
    <Route name="our-house" path="/our-house" handler={Arena} />
    <Route name="admin" path="/:slug/edit" handler={Admin} />
	<Route name="page" path="/:slug" handler={Page} />
  </Route>
);


Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});