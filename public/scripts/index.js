






$('.grid > div > div').click(function() {
  console.log($('.grid > div > div').index(event.target) + 1);
  var gridId = $('.grid > div > div').index(event.target) + 1;

  if (gridId >= 1 && gridId <= 9) {
    $('.grid').addClass('anima anima' + gridId );

    setTimeout(function() {
      window.location = "/" + gridId;
    }, 2000);
  }
});

// console.log('hi world');