'use strict';
(function () {
  var MAP_HEIGTH_MIN = 130;
  var MAP_HEIGTH_MAX = 630;


  // Элементы
  var MAP_ELEMENT = document.querySelector('.map');
  var MAP_PINS_ELEMENT = MAP_ELEMENT.querySelector('.map__pins');
  var MAP_FILTERS_ELEMENT = MAP_ELEMENT.querySelector('.map__filters-container');
  var PIN_MAIN = document.querySelector('.map__pin--main');
  var PIN_MAIN_WIDTH = 66;
  var PIN_MAIN_HEIGTH = 88;
  var ALL_SELECTS = document.querySelectorAll('select');
  var ALL_INPUTS = document.querySelectorAll('input');

  // Шаблоны

  var popup;
  var popupClose;

  // Выключалка и включалка полей форм
  var disable = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = true;
    }
  };

  var enable = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].disabled === true) {
        arr[i].disabled = false;
      }
    }
  };

  var enablePage = function () {
    enable(ALL_SELECTS);
    enable(ALL_INPUTS);
    MAP_ELEMENT.classList.remove('map--faded');
    window.form.adFormElement.classList.remove('ad-form--disabled');
  };


  // Обработчик закрывающих действий на карточке

  var removeCard = function () {
    if (popup) {
      MAP_ELEMENT.removeChild(popup);
      popup = undefined;
    }
  };

  var popupCloseClickHandler = function (evt) {
    evt.preventDefault();
    removeCard();
  };

  var popupKeydownHandler = function (evt) {
    if (evt.keyCode === window.keyCode.ESC) {
      evt.preventDefault();
      removeCard();
    }
  };

  var popupCloseKeydownHandler = function (evt) {
    if (evt.keyCode === window.keyCode.ENTER) {
      evt.preventDefault();
      removeCard();
    }
  };

  // Обработчик нажатия на пин

  var pinClickHandler = function (evt) {
    var target = evt.target;
    var targetButton = target.closest('button');
    if (targetButton && targetButton.classList.contains('map__pin') && !targetButton.classList.contains('map__pin--main')) {
      removeCard();
      var i = targetButton.id.substring(2);
      MAP_ELEMENT.insertBefore(window.card.renderCard(window.data[i]), MAP_FILTERS_ELEMENT);
      popup = MAP_ELEMENT.querySelector('.map__card.popup');
      popup.style.zIndex = 2000;
      popupClose = popup.querySelector('.popup__close');
      popupClose.addEventListener('click', popupCloseClickHandler);
      popupClose.addEventListener('keydown', popupCloseKeydownHandler);
      document.addEventListener('keydown', popupKeydownHandler);
    }
  };

  var startCoords = {
    x: undefined,
    y: undefined,
  };


  var pinMainMouseDownHandler = function (evt) {
    enablePage();

    startCoords.x = evt.clientX;
    startCoords.y = evt.clientY;
    PIN_MAIN.style.zIndex = 1000;

  };

  var pinMainMouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();
    removeCard();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var newTop = PIN_MAIN.offsetTop - shift.y;
    var newLeft = PIN_MAIN.offsetLeft - shift.x;


    if (newTop <= (MAP_HEIGTH_MIN)) {
      PIN_MAIN.style.top = MAP_HEIGTH_MIN + 'px';
    } else if (newTop >= MAP_HEIGTH_MAX) {
      PIN_MAIN.style.top = MAP_HEIGTH_MAX + 'px';
    } else {
      PIN_MAIN.style.top = newTop + 'px';
    }

    if (newLeft <= 0) {
      PIN_MAIN.style.left = 0 + 'px';
    } else if (newLeft >= (MAP_ELEMENT.clientWidth - PIN_MAIN_WIDTH)) {
      PIN_MAIN.style.left = (MAP_ELEMENT.clientWidth - PIN_MAIN_WIDTH) + 'px';
    } else {
      PIN_MAIN.style.left = newLeft + 'px';
    }

    window.form.setAddress(getAddress().x, getAddress().y);
  };

  var pinMainMouseUpHandler = function () {
    document.removeEventListener('mousemove', pinMainMouseMoveHandler);
    document.removeEventListener('mouseup', pinMainMouseUpHandler);
    window.form.setAddress(getAddress().x, getAddress().y);
    MAP_PINS_ELEMENT.appendChild(window.pin.renderPins(window.data));
  };

  // Получить адрес. Вспомогательные функции, чтобы вызывать установку адреса в форму отсюда, т.к. тут сейчас лежат данные, в зависимости от котороых он вычисляется.
  var getAddress = function () {
    var address = {
      x: PIN_MAIN.offsetLeft + PIN_MAIN_WIDTH / 2,
      y: PIN_MAIN.offsetTop + PIN_MAIN_HEIGTH,
    };
    return address;
  };

  var getDefaultAddress = function () {
    var defaultAddress = {
      x: PIN_MAIN.offsetLeft + PIN_MAIN_WIDTH / 2,
      y: PIN_MAIN.offsetTop + PIN_MAIN_WIDTH / 2,
    };
    return defaultAddress;
  };

  // Запуск всего

  window.form.setDefaultAddress(getDefaultAddress().x, getDefaultAddress().y);

  disable(ALL_SELECTS);

  disable(ALL_INPUTS);

  PIN_MAIN.addEventListener('mousedown', function (evt) {
    pinMainMouseDownHandler(evt);
    document.addEventListener('mousemove', pinMainMouseMoveHandler); /* Или это логичнее внутрь pinMainMouseDownHandler положить? */
    document.addEventListener('mouseup', pinMainMouseUpHandler);
  });

  MAP_ELEMENT.addEventListener('click', function (evt) {
    evt.preventDefault();
    pinClickHandler(evt);
  });

  MAP_ELEMENT.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.keyCode.ENTER) {
      evt.preventDefault();
      pinClickHandler(evt);
    }
  });
})();
