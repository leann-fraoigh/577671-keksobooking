'use strict';

(function () {
  var FILTERS_FORM = document.querySelector('.map__filters');
  // var FILTER_TYPE = FILTERS_FORM.querySelector('#housing-type');
  // var FILTER_PRICE = FILTERS_FORM.querySelector('#housing-price');
  // var FILTER_ROOMS = FILTERS_FORM.querySelector('#housing-rooms');
  // var FILTER_GUESTS = FILTERS_FORM.querySelector('#housing-guests');
  // var FILTER_FEATURES = FILTERS_FORM.querySelector('#housing-features');

  var Filter = {
    TYPE: FILTERS_FORM.querySelector('#housing-type'),
    PRICE: FILTERS_FORM.querySelector('#housing-price'),
    ROOMS: FILTERS_FORM.querySelector('#housing-rooms'),
    GUESTS: FILTERS_FORM.querySelector('#housing-guests'),
    FEATURES: FILTERS_FORM.querySelector('#housing-features'),
  };

  var Price = {
    low: 10000,
    middle: 50000,
  };

  var filter = function (data) {
    console.log(data);
    var correctType = data.
    filter(function (item) {
      if (Filter.TYPE.value === 'any') {
        return true;
      } else {
        return item.offer.type === Filter.TYPE.value;
      }
    }).
    filter(function (item) {
      if (Filter.PRICE.value === 'any') {
        return true;
      } else if (Filter.PRICE.value === 'low') {
        return item.offer.price < Price.low;
      } else if (Filter.PRICE.value === 'middle') {
        return item.offer.price >= Price.low || item.offer.price <= Price.middle;
      } else if (Filter.PRICE.value === 'middle') {
        return item.offer.price > Price.middle;
      }
    });

    return correctType;
  };

  var setChangeFilterHandler = function (handler) {
    Filter.TYPE.addEventListener('change', handler);
    Filter.PRICE.addEventListener('change', handler);
  };

  window.filter = {
    filter: filter,
    setChangeFilterHandler: setChangeFilterHandler,
  }
})();
