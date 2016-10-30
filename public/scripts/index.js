






$('.grid > div > div').click(function() {
  console.log($('.grid > div > div').index(event.target) + 1);
  var gridId = $('.grid > div > div').index(event.target) + 1;

  if (gridId >= 1 && gridId <= 9) {
    $('.grid').addClass('anima' + gridId + ' anima' );

    setTimeout(function() {
      window.location = "/" + gridId;
    }, 1800);
  }
});

// console.log('hi world');