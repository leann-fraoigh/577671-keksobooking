'use strict';

(function () {
  var FILTERS_FORM = document.querySelector('.map__filters');

  var Filter = {
    TYPE: FILTERS_FORM.querySelector('#housing-type'),
    PRICE: FILTERS_FORM.querySelector('#housing-price'),
    ROOMS: FILTERS_FORM.querySelector('#housing-rooms'),
    GUESTS: FILTERS_FORM.querySelector('#housing-guests'),
    FEATURES: {
      WIFI: FILTERS_FORM.querySelector('#filter-wifi'),
      DISHWASHER: FILTERS_FORM.querySelector('#filter-dishwasher'),
      PARKING: FILTERS_FORM.querySelector('#filter-parking'),
      WASHER: FILTERS_FORM.querySelector('#filter-washer'),
      ELEVATOR: FILTERS_FORM.querySelector('#filter-elevator'),
      CONDITIONER: FILTERS_FORM.querySelector('#filter-conditioner'),

    }
  };

  var Price = {
    low: 10000,
    middle: 50000,
  };

  var filter = function (data) {
    console.log(data);
    var correctType = data.
    // Фильр по типу жилья
    filter(function (item) {
      if (Filter.TYPE.value === 'any') {
        return true;
      } else {
        return item.offer.type === Filter.TYPE.value;
      }
    }).
    // Фильр по цене
    filter(function (item) {
      var i = Filter.PRICE.value;
      switch (i) {
        case 'any':
          return true;
        case 'low':
          return item.offer.price < Price.low;
        case 'middle':
          return item.offer.price >= Price.low && item.offer.price <= Price.middle;
        case 'high':
          return item.offer.price > Price.middle;
        default:
          return false;
      }
    }).
    // Фильр по комнатам
    filter(function (item) {
      if (Filter.ROOMS.value === 'any') {
        return true;
      } else {
        return item.offer.rooms.toString() === Filter.ROOMS.value;
      }
    }).
    // Фильр по гостям
    filter(function (item) {
      if (Filter.GUESTS.value === 'any') {
        return true;
      } else {
        return item.offer.guests.toString() === Filter.GUESTS.value;
      }
    // Фильр по удобствам
    })/*.
    filter(function (item) {
      // for (var key in Filter.FEATURES) {
      //   if (Filter.FEATURES.hasOwnProperty(key)) {
      //     if (Filter.FEATURES[key].checked) {
      //       var featureId = Filter.FEATURES[key].id;
      //       var feature = featureId.split('-')[1];
      //       console.log(feature);
      //       return item.offer.features.hasOwnProperty(feature);
      //     } else {
      //       return true;
      //     }
      //   }
      // }
      for (var i = 0; i < Object.keys(Filter.FEATURES).length - 1; i++) {
        var k = Object.keys(Filter.FEATURES)[i];
        var feature = Filter.FEATURES[k];
        var featureTitle = feature.id.split('-')[1];
        if ()
        feature.addEventListener('change', handler);
    })*/;

    return correctType;
  };

  var setChangeFilterHandler = function (handler) {
    for (var i = 0; i < (Object.keys(Filter).length - 1); i++) {
      var k = Object.keys(Filter)[i];
      var elem = Filter[k];
      elem.addEventListener('change', handler);
    }
    for (var key in Filter.FEATURES) {
      if (Filter.FEATURES.hasOwnProperty(key)) {
        Filter.FEATURES[key].addEventListener('change', handler);
      }
    }
  };

  window.filter = {
    filter: filter,
    setChangeFilterHandler: setChangeFilterHandler,
  };
})();
