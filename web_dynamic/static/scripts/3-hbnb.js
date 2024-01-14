$(document).ready(function () {
  const amenities = {};
  $('input[type=checkbox]').change(
    function () {
      if ($(this).is(':checked')) {
        amenities[$(this).attr('data-id')] = $(this).attr('data-name');
      } else {
        delete amenities[$(this).attr('data-id')];
      }
      $('.amenities h4').text(Object.values(amenities));
    });
  $.get('http://localhost:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      if (data.status === 'OK') {
        $('DIV#api_status').addClass('available');
      } else {
        $('DIV#api_status').removeClass('available');
      }
    }
  });

  $.ajax({
    url: `http://${HOST}:5001/api/v1/places_search/`,
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({}),
    success: function (response) {
      for (const place of response) {
        const article = ['<article>',
          '<div class="title_box">',
                    `<h2>${place.name}</h2>`,
                    `<div class="price_by_night">$${place.price_by_night}</div>`,
                    '</div>',
                    '<div class="information">',
                    `<div class="max_guest">${place.max_guest} Guest(s)</div>`,
                    `<div class="number_rooms">${place.number_rooms} Bedroom(s)</div>`,
                    `<div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>`,
                    '</div>',
                    '<div class="description">',
                    `${[place].description}`,
                    '</div>',
                    '</article>'];
        $('SECTION.places').append(article.join(''));
      }
    }
  });
});
