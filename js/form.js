'use strict';
(function () {
  var AD_FORM = document.querySelector('.ad-form');
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

  // Ограничения для формы
  var ROOM_NUMBER_NO_GUESTS = '100';

  // Валидация формы
  var typeChangeHandler = function (evt) {
    var i = evt.target.value;
    i = PROPERTY_TYPES[i];

    AD_FORM.querySelector('#price').min = i.minPrice;
    AD_FORM.querySelector('#price').placeholder = i.minPrice;
  };

  AD_FORM.querySelector('select#type').addEventListener('change', function (evt) {
    typeChangeHandler(evt);
  });

  var roomNumberChangeHandler = function (evt) {
    var roomNumber = evt.target.value;
    for (var j = 0; j < AD_FORM.querySelector('#capacity').length; j++) {
      var capacityOption = AD_FORM.querySelector('#capacity')[j];
      if (roomNumber === ROOM_NUMBER_NO_GUESTS && capacityOption.value !== '0') {
        capacityOption.disabled = true;
      } else if (roomNumber === ROOM_NUMBER_NO_GUESTS && capacityOption.value === '0') {
        capacityOption.disabled = false;
      } else if (capacityOption.value > roomNumber || capacityOption.value === '0') {
        capacityOption.disabled = true;
      } else if (capacityOption.value <= roomNumber) {
        capacityOption.disabled = false;
      }
    }
    checkCapacityValidity();
  };

  var capacityChangeHandler = function () {
    checkCapacityValidity();
  };

  var checkCapacityValidity = function () {
    for (var i = 0; i < AD_FORM.querySelector('#capacity').length; i++) {
      var j = AD_FORM.querySelector('#capacity')[i];
      if (j.selected === true) {
        if (j.disabled === true) {
          AD_FORM.querySelector('#capacity').valid = false;
          AD_FORM.querySelector('#capacity').setCustomValidity('Данное число мест не доступно при выбранном количестве комнат');
        } else {
          AD_FORM.querySelector('#capacity').valid = true;
          AD_FORM.querySelector('#capacity').setCustomValidity('');
        }
      }
    }
  };

  var timeinChangeHandler = function (evt) {
    var sourceValue = evt.target.value;
    var targetSelectOptions = '';
    if (evt.target.id === 'timein') {
      targetSelectOptions = AD_FORM.querySelectorAll('select#timeout option');
    } else if (evt.target.id === 'timeout') {
      targetSelectOptions = AD_FORM.querySelectorAll('select#timein option');
    }

    targetSelectOptions.forEach(function (element) {
      if (element.value === sourceValue) {
        element.selected = true;
      }
    });
  };


  AD_FORM.querySelector('select#room_number').addEventListener('change', roomNumberChangeHandler);

  AD_FORM.querySelector('select#capacity').addEventListener('change', capacityChangeHandler);

  AD_FORM.querySelector('select#timein').addEventListener('change', timeinChangeHandler);

  AD_FORM.querySelector('select#timeout').addEventListener('change', timeinChangeHandler);

  var setAddress = function (x, y) {
    // Вариант кода, если данные берутся в этом модуле, а не передаются как аргументы при вызове из map
    // var x = PIN_MAIN.offsetLeft + PIN_MAIN_WIDTH / 2;
    // var y = PIN_MAIN.offsetTop + PIN_MAIN_HEIGTH;
    AD_FORM.querySelector('#address').value = x + ', ' + y;
  };

  var setDefaulfAddress = function (x, y) {
    // var x = PIN_MAIN.offsetLeft + PIN_MAIN_WIDTH / 2;
    // var y = PIN_MAIN.offsetTop + PIN_MAIN_WIDTH / 2;
    AD_FORM.querySelector('#address').value = x + ', ' + y;
  };

  // setDefaulfAddress();

  window.form = {
    setAddress: setAddress,
    setDefaultAddress: setDefaulfAddress,
  };

})();
