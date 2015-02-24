var $video = $('#video-background'),
  hero = $('.hero'),
  videoWrapper = $('.hero__media'),
  videoElement = $video[0];


var navigation = document.querySelector("header");

var headroom = new Headroom(navigation, {
  "offset": 500,
  "tolerance": 20,
});

headroom.init();

$(function () {

  $('.marquee__list').liScroll();

  $('.btn--menu, .btn--menu-close').on('click', function () {
    $('body').toggleClass('nav-show');
  });

  $('.btn--play').on('click', function () {
    $(this).parent().parent().remove();
    $('#video-background').remove();
    hero.css('background-image', 'none');

    // Reload Youtube
    $('#sport-video').attr('src', $('#sport-video').attr('src') + '&autoplay=1').addClass('video-loaded');
  });

  $('.play_button').on('click', function () {
    $('.page-video-wrapper').addClass('show');

    // Reload Youtube
    $('.tunnel-walk').attr('src', $('.tunnel-walk').data('video') + '&autoplay=1');
  });


 $('.video-center').on('click', function () {
    $('.page-video-wrapper').removeClass('show');

    // Reload Youtube
    $('.tunnel-walk').attr('src', '');
  });


  $('.arena-btn--play').on('click', function () {
    $(this).parent().parent().remove();
    $('.video-container').css('background-image', 'none');

    // Reload Youtube
    $('#sport-video').attr('src', $('#sport-video').attr('src') + '&autoplay=1').addClass('video-loaded');
  });

  // $('.nav-container').headroom();

  function showVideo() {
    videoWrapper.addClass('video-loaded');
  }

  function checkReadyState() {
    4 === videoElement.readyState ? (videoWrapper.addClass('video-loaded'), videoElement.play()) : setTimeout(checkReadyState, 100)
  }

  // My understanding if the 'canplaythrough' checks if video
  // is cached and can play to the end
  // $video.on('canplaythrough', showVideo);
  checkReadyState();


  $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').stop().animate({
            scrollTop: target.offset().top
          }, 1000);
          $('.navigation').removeClass('active');
          $('.navigation-items').removeClass('active');
          return false;
        }
      }
  });

});


/*!
 * liScroll 1.0
 * Examples and documentation at:
 * http://www.gcmingati.net/wordpress/wp-content/lab/jquery/newsticker/jq-liscroll/scrollanimate.html
 * 2007-2010 Gian Carlo Mingati
 * Version: 1.0.2.1 (22-APRIL-2011)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires:
 * jQuery v1.2.x or later
 *
 */


jQuery.fn.liScroll = function(settings) {
  settings = jQuery.extend({
  travelocity: 0.07
  }, settings);

  return this.each(function(){
      var $strip = jQuery(this);
      $strip.addClass("newsticker");
      var stripWidth = 1;
      $strip.find("li").each(function(i){
      stripWidth += jQuery(this, i).outerWidth(true); // thanks to Michael Haszprunar and Fabien Volpi
      });
      var $mask = $strip.wrap("<div class='mask'></div>");
      var $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");
      var containerWidth = $strip.parent().parent().width();  //a.k.a. 'mask' width
      $strip.width(stripWidth);
      var totalTravel = stripWidth+containerWidth;
      var defTiming = totalTravel/settings.travelocity; // thanks to Scott Waye
      function scrollnews(spazio, tempo){
      $strip.animate({left: '-='+ spazio}, tempo, "linear", function(){$strip.css("left", containerWidth); scrollnews(totalTravel, defTiming);});
      }
      scrollnews(totalTravel, defTiming);
      $strip.hover(function(){
      jQuery(this).stop();
      },
      function(){
      var offset = jQuery(this).offset();
      var residualSpace = offset.left + stripWidth;
      var residualTime = residualSpace/settings.travelocity;
      scrollnews(residualSpace, residualTime);
      });
  });
};
