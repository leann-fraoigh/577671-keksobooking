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

  var getFeatuteTitle = function (element) {
    var title = element.id.split('-')[1];
    return title;
  };

  var checkIfChecked = function (item, filter) {
    var i = filter;
    if (i.checked) {
      var feature = getFeatuteTitle(i);
      return item.offer.features.includes(feature);
    } return true;
  };

  var filter = function (data) {
    var relevantData = data.
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
    });

    // // Фильтр по удобствам
    // filter(function (item) {
    //   return checkIfChecked(item, Filter.FEATURES.WIFI);
    // }).
    // filter(function (item) {
    //   return checkIfChecked(item, Filter.FEATURES.DISHWASHER);
    // }).
    // filter(function (item) {
    //   return checkIfChecked(item, Filter.FEATURES.PARKING);
    // }).
    // filter(function (item) {
    //   return checkIfChecked(item, Filter.FEATURES.WASHER);
    // }).
    // filter(function (item) {
    //   return checkIfChecked(item, Filter.FEATURES.ELEVATOR);
    // }).
    // filter(function (item) {
    //   return checkIfChecked(item, Filter.FEATURES.CONDITIONER);
    // });
    // return relevantData;

    // Новый фильтр по удобствам
    var newData = relevantData;
    var getEvenMmoreRelevantData = function (currentData) {
      var initialArray = currentData;
      for (var i = 0; i < Object.keys(Filter.FEATURES).length; i++) {
        initialArray = initialArray.filter(function (item) {
          var feature = Object.keys(Filter.FEATURES)[i];
          return checkIfChecked(item, Filter.FEATURES[feature]);
        });
      }
      return initialArray;
    };
    var EvenMmoreRelevantData = getEvenMmoreRelevantData(newData);
    return (EvenMmoreRelevantData);
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
