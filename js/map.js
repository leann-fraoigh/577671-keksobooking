'use strict';
(function () {
  var MAP_HEIGTH_MIN = 130;
  var MAP_HEIGTH_MAX = 704;

  // Элементы
  var MAP = document.querySelector('.map');
  var MAP_PINS = MAP.querySelector('.map__pins');
  var MAP_FILTERS = MAP.querySelector('.map__filters-container');
  var PIN_MAIN = document.querySelector('.map__pin--main');
  var PIN_MAIN_RADIUS = 33;
  var PIN_MAIN_CORRECTION = 47;
  var PIN_MAIN_ZINDEX = 1000;

  var startMainPinCoords = {
    x: PIN_MAIN.offsetLeft,
    y: PIN_MAIN.offsetTop,
  };

  // Активация страницы
  var enablePage = function () {
    window.form.activateForm();
    MAP.classList.remove('map--faded');
  };

  // Перезагрузка карты

  var mapReset = function () {
    window.utils.cleanNode(MAP, '.map__card');
    window.utils.cleanNode(MAP_PINS, '.map__pin:not(.map__pin--main)');
    MAP.classList.add('map--faded');
    setPinMainDefaultCoords();
  };

  // Коллбэк ошибки загурзки
  var errorHandler = function (errorMessage) {
    window.messages.renderErrorMessage(errorMessage);
  };

  // Отрисовка новой карточки
  var showRelatedCard = function (pin) {
    window.card.removeCard();
    MAP.insertBefore(window.card.createCard(pin), MAP_FILTERS);
  };

  // Коллбэки загрузки пинов
  var pinsLoadHandler = function (data) {
    updatePins(data);
    window.filter.setChangeFilterHandler(window.utils.debounce((function () {
      updatePins(data);
    })));
  };

  var updatePins = function (data) {
    window.card.removeCard();
    window.utils.cleanNode(MAP_PINS, '.map__pin:not(.map__pin--main)');
    MAP_PINS.appendChild(window.pin.renderPins(window.filter.filter(data)));
  };

  // Обработка событий на главном пине

  var setPinMainDefaultCoords = function () {
    PIN_MAIN.style.top = startMainPinCoords.y + 'px';
    PIN_MAIN.style.left = startMainPinCoords.x + 'px';
  };

  var startCoords = {
    x: undefined,
    y: undefined,
  };

  var pinMainMouseDownHandler = function (evt) {
    document.addEventListener('mousemove', pinMainMouseMoveHandler);
    document.addEventListener('mouseup', pinMainMouseUpHandler);

    enablePage();

    startCoords.x = evt.clientX;
    startCoords.y = evt.clientY;
    PIN_MAIN.style.zIndex = PIN_MAIN_ZINDEX;

  };

  var pinMainMouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();
    window.card.removeCard();

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
    } else if (newTop >= MAP_HEIGTH_MAX - (PIN_MAIN_RADIUS * 2 + PIN_MAIN_CORRECTION)) {
      PIN_MAIN.style.top = MAP_HEIGTH_MAX - (PIN_MAIN_RADIUS * 2 + PIN_MAIN_CORRECTION) + 'px';
    } else {
      PIN_MAIN.style.top = newTop + 'px';
    }

    if (newLeft <= 0) {
      PIN_MAIN.style.left = 0 + 'px';
    } else if (newLeft >= (MAP.clientWidth - PIN_MAIN_RADIUS * 2)) {
      PIN_MAIN.style.left = (MAP.clientWidth - PIN_MAIN_RADIUS * 2) + 'px';
    } else {
      PIN_MAIN.style.left = newLeft + 'px';
    }
    window.form.updateAddress(true);
  };


  var pinMainMouseUpHandler = function () {
    document.removeEventListener('mousemove', pinMainMouseMoveHandler);
    document.removeEventListener('mouseup', pinMainMouseUpHandler);
    window.form.updateAddress(true);
    window.backend.load(pinsLoadHandler, errorHandler);
  };

  // Получить адрес главного пина.
  var getMainPinLocation = function (isActive) {
    var pinCorrection = isActive ? PIN_MAIN_CORRECTION : 0;

    var locationX = PIN_MAIN.offsetLeft + PIN_MAIN_RADIUS;
    var locationY = PIN_MAIN.offsetTop + PIN_MAIN_RADIUS + pinCorrection;

    return (locationX + ', ' + locationY);
  };

  PIN_MAIN.addEventListener('mousedown', pinMainMouseDownHandler);

  window.map = {
    mapReset: mapReset,
    getMainPinLocation: getMainPinLocation,
    showRelatedCard: showRelatedCard,
  };
})();
