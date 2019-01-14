'use strict';
(function () {
  var AD_FORM = document.querySelector('.ad-form');
  var ALL_SELECTS = document.querySelectorAll('select');
  var ALL_INPUTS = document.querySelectorAll('input');
  var RESET_FORM_BUTTON = document.querySelector('.ad-form__reset');

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

  var deactivateForm = function () {
    AD_FORM.reset();
    AD_FORM.classList.add('ad-form--disabled');
    updateAddress(false);
    disableForm();
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

  var capacityOptions = AD_FORM.querySelector('#capacity');

  var roomNumberChangeHandler = function (evt) {
    var roomNumber = evt.target.value;
    for (var j = 0; j < capacityOptions.length; j++) {
      var capacityOption = capacityOptions[j];
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
    for (var i = 0; i < capacityOptions.length; i++) {
      var option = capacityOptions[i];
      if (option.selected === true) {
        if (option.disabled === true) {
          capacityOptions.valid = false;
          capacityOptions.setCustomValidity('Данное число мест не доступно при выбранном количестве комнат');
        } else {
          capacityOptions.valid = true;
          capacityOptions.setCustomValidity('');
        }
      }
    }
  };

  var timeinChangeHandler = function (evt) {
    var sourceValue = evt.target.value;
    var targetSelectOptions = '';
    var select = evt.target.id;
    switch (select) {
      case 'timein':
        targetSelectOptions = AD_FORM.querySelectorAll('select#timeout option');
        break;
      case 'timeout':
        targetSelectOptions = AD_FORM.querySelectorAll('select#timein option');
        break;
      default:
        break;
    }

    targetSelectOptions.forEach(function (element) {
      if (element.value === sourceValue) {
        element.selected = true;
      }
    });
  };

  var loadHandler = function () {
    deactivateForm();
    window.map.mapReset();
    updateAddress(false);
    window.messages.renderSuccessMessage();
  };

  AD_FORM.querySelector('select#type').addEventListener('change', typeChangeHandler);

  AD_FORM.querySelector('select#room_number').addEventListener('change', roomNumberChangeHandler);

  AD_FORM.querySelector('select#capacity').addEventListener('change', capacityChangeHandler);

  AD_FORM.querySelector('select#timein').addEventListener('change', timeinChangeHandler);

  AD_FORM.querySelector('select#timeout').addEventListener('change', timeinChangeHandler);

  var errorHandler = function (errorMessage) {
    window.messages.renderErrorMessage(errorMessage);
  };

  AD_FORM.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(AD_FORM), loadHandler, errorHandler);
  });

  RESET_FORM_BUTTON.addEventListener('click', function (evt) {
    evt.preventDefault();
    deactivateForm();
    window.map.mapReset();
    updateAddress(false);
  });

  disableForm();

  updateAddress(false);

  window.form = {
    activateForm: activateForm,
    updateAddress: updateAddress
  };

})();
