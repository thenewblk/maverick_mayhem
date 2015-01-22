
$(function() {
  $('.btn--play').on('click', function(){
    console.log('play');
    $(this).toggle();
    $('#video-background').toggle();
    $('#sport-video').attr('src', $('#sport-video').attr('src') + '&autoplay=1').toggle();
  })
});
