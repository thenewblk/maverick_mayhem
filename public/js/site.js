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


var $t = $('.marquee');
var $tw = $('.marquee__list');
var $w = $(window);
var width = $tw.width();
var wwidth = $w.width();
console.log(width);

$tw.bind("transitionend", function(){
  $tw.css({'-webkit-transition':'all linear 0s',
            'transition':'all linear 0s'});
  tickerSet();
});


// while($tw.height() < $w.height()){
//   fs++;
//   // $t.css("font-size",fs+"px");
// }


function tickerSet(){
  $tw.css({'-webkit-transform':'translate3d('+wwidth+'px,0,0)','transform':'translate3d('+wwidth+'px,0,0)'});
  window.setInterval(function(){
    $tw.css({'-webkit-transition':'all linear '+(((width+wwidth)/500)*4)+'s','transition':'all linear '+(((width+wwidth)/500)*4)+'s'});
    $tw.css({'-webkit-transform':'translate3d('+(width*-1)+'px,0,0)','transform':'translate3d('+(width*-1)+'px,0,0)'});
  },1)
}

tickerSet();

$(function () {

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


  // $('.last_matchup .game_label').on('click', function () {
  //   var id = $(this).data('id');
  //   $('.last_matchup .game_label').removeClass('active');
  //   $(this).addClass('active');
  //   $(".last_matchup .last_matchup_table").removeClass('active');
  //   $(".last_matchup .last_matchup_table[data-id='"+id+"']").addClass('active');
  // });



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
