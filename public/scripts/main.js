// Watermark blinking
setInterval(function() {
  $('.watermark p').text('-_-');
  setTimeout(function() {
    $('.watermark p').text('●_●');
  }, 150);
}, 5000);