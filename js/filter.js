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

  // var filter = function (data) {
  //   var correctType = data.filter(function (item) {
  //     if (Filter.TYPE.value === '' || Filter.TYPE.value === 'any') {
  //       return true;
  //     } else {
  //       return item.offer.type === Filter.TYPE.value;
  //     }
  //   });
  //   return correctType;
  // };

  var filter = function (data) {
    var correctType = data.filter(function (item) {
      return item.offer.type === Filter.TYPE.value;
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
