var $video = $('video'),
  videoContainer = $('.video-container'),
  videoWrapper = $('.video-wrapper'),
  videoElement = $video[0];

$(function () {
  $('.btn--play').on('click', function () {
    $(this).parent().parent().remove();
    $('#video-background').remove();
    videoContainer.css('background-image', 'none');

    // Reload Youtube
    $('#sport-video').attr('src', $('#sport-video').attr('src') + '&autoplay=1').addClass('video-loaded');
  });

  $('.arena-btn--play').on('click', function () {
    $(this).parent().parent().remove();
    videoContainer.css('background-image', 'none');

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
