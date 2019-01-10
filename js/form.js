'use strict';
(function () {
  var AD_FORM = document.querySelector('.ad-form');
  var ALL_SELECTS = document.querySelectorAll('select');
  var ALL_INPUTS = document.querySelectorAll('input');

  // Ограничения для формы
  var ROOM_NUMBER_NO_GUESTS = '100';

  // Активация и деактивация отдельных элементов и формы в целом
  var disableElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = true;
    }
  };

  var enableElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].disabled === true) {
        arr[i].disabled = false;
      }
    }
  };

  var activateForm = function () {
    enableElements(ALL_INPUTS);
    enableElements(ALL_SELECTS);
    AD_FORM.classList.remove('ad-form--disabled');

  };

  var disableForm = function () {
    disableElements(ALL_INPUTS);
    disableElements(ALL_SELECTS);
  };

  disableForm();

  var deactivateForm = function () {
    AD_FORM.reset();
    AD_FORM.classList.add('notice__form--disabled');

    window.map.deactivateMap();

    updateAddress(false);
  };

  var updateAddress = function (isActiveMap) {
    var addressInput = AD_FORM.querySelector('[name="address"]');
    addressInput.value = window.map.getMainPinLocation(isActiveMap);
  };

  // Валидация формы
  var typeChangeHandler = function (evt) {
    var price = window.data.getMinprice(evt.target.value);
    AD_FORM.querySelector('#price').min = price;
    AD_FORM.querySelector('#price').placeholder = price;
  };

  AD_FORM.querySelector('select#type').addEventListener('change', typeChangeHandler);

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

  var errorHandler = function (errorMessage) {
    window.messages.renderErrorMessage(errorMessage);
  };

  var loadHandler = function () {
    AD_FORM.reset();
    window.map.mapReset();
    window.messages.renderSuccessMessage();
  };

  AD_FORM.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(AD_FORM), loadHandler, errorHandler);
  });

  window.form = {
    activateForm: activateForm,
    updateAddress: updateAddress
  };

})();
