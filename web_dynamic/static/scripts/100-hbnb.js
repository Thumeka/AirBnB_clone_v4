$(document).ready(function () {
  const HOST = '0.0.0.0';
  const amenities = {};
  const states = {};
  const cities = {};
  let obj = {};

  $('.amenities .popover input').change(function () { obj = amenities; checkedObjs.call(this, 1); });
  $('.state_input').change(function () { obj = states; checkedObjs.call(this, 2); });
  $('.city_input').change(function () { obj = cities; checkedObjs.call(this, 3); });
  apiStatus();
  searchPlaces();

  function checkedObjs (nObject) {
    if ($(this).is(':checked')) {
      obj[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete obj[$(this).attr('data-name')];
    }
    const names = Object.keys(obj);
    if (nObject === 1) {
      $('.amenities h4').text(names.sort().join(', '));
    } else if (nObject === 2) {
      $('.locations h4').text(names.sort().join(', '));
    }
  }

  function apiStatus () {
    $.get(`http://${HOST}:5001/api/v1/status/`, function (data, textStatus) {
      if (textStatus === 'success') {
        if (data.status === 'OK') {
          $('DIV#api_status').addClass('available');
        } else {
          $('DIV#api_status').removeClass('available');
        }
      }
    });
  }

  function searchPlaces () {
    $.ajax({
      url: `http://${HOST}:5001/api/v1/places_search/`,
      type: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        amenities: Object.values(amenities),
        states: Object.values(states),
        cities: Object.values(cities)
      }),
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
                        `${place.description}`,
                        '</div>',
                        '</article>'];
          $('SECTION.places').append(article.join(''));
        }
      }
    });
  }
  $('.filters button').bind('click', searchPlaces);
});
