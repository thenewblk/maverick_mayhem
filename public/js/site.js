var $video = $('#video-background'),
  hero = $('.hero'),
  videoWrapper = $('.video-wrapper'),
  videoElement = $video[0];

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

  $('.nav-container').headroom();

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
