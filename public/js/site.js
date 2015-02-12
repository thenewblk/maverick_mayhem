var $video = $('#video-background'),
  hero = $('.hero'),
  videoWrapper = $('.hero__media'),
  videoElement = $video[0];


var navigation = document.querySelector("header");
var headroom  = new Headroom(navigation);
headroom.init({
   // vertical offset in px before element is first unpinned
    offset : 100,
    // scroll tolerance in px before state changes
    // tolerance : 0,
    // or you can specify tolerance individually for up/down scroll
    tolerance : {
        up : 5,
        down : 200
    },
});

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

});
