'use strict';

(function () {

  var PROPERTY_TYPES = {
    palace: {
      type: 'Дворец',
      minPrice: 10000,
    },
    flat: {
      type: 'Квартира',
      minPrice: 1000,
    },
    house: {
      type: 'Дом',
      minPrice: 5000,
    },
    bungalo: {
      type: 'Бунгало',
      minPrice: 0,
    }
  };

  // Получить минимальную цену для типа жилья
  var getMinprice = function (type) {
    var price = PROPERTY_TYPES[type].minPrice;
    return price;
  };

  window.data = {
    getMinprice: getMinprice,
  };
})();

