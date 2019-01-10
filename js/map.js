'use strict';
(function () {
  var MAP_HEIGTH_MIN = 130;
  var MAP_HEIGTH_MAX = 704;

  // Элементы
  var MAP_ELEMENT = document.querySelector('.map');
  var MAP_PINS_ELEMENT = MAP_ELEMENT.querySelector('.map__pins');
  var MAP_FILTERS_ELEMENT = MAP_ELEMENT.querySelector('.map__filters-container');
  var PIN_MAIN = document.querySelector('.map__pin--main');
  var PIN_MAIN_DIAMETER = 66;
  var PIN_MAIN_CORRECTION = 14;
  var PIN_MAIN_ZINDEX = 1000;
  var CARD_TEMPLATE = document.querySelector('#card').content.querySelector('.map__card');
  var PIN = {
    PIN_TEMPLATE: document.querySelector('#pin').content.querySelector('.map__pin'),
    PIN_WIDTH: 50,
    PIN_HEIGTH: 70,
  };
  var PINS_AMOUNT = 5;
  var startMainPinCoords = {
    x: PIN_MAIN.offsetLeft,
    y: PIN_MAIN.offsetTop,
  };

  // Активация страницы
  var enablePage = function () {
    window.form.activateForm();
    MAP_ELEMENT.classList.remove('map--faded');
  };

  // Перезагрузка карты

  var mapReset = function () {
    window.utils.cleanNode(MAP_ELEMENT, '.map__card');
    window.utils.cleanNode(MAP_PINS_ELEMENT, '.map__pin:not(.map__pin--main)');
    MAP_ELEMENT.classList.add('map--faded');
    setPinMainDefaultCoords();
    window.form.updateAddress(false);
  };

  // Коллбэк ошибки загурзки
  var errorHandler = function (errorMessage) {
    window.messages.renderErrorMessage(errorMessage);
  };

  // Удаление карточки
  var removeCard = function () {
    var card = document.querySelector('.popup');
    if (card) {
      card.remove();
    }
  };

  var cardCloseClickHandler = function (evt) {
    evt.preventDefault();
    removeCard(evt);
  };

  var cardKeydownHandler = function (evt) {
    if (evt.keyCode === window.keyCode.ESC) {
      evt.preventDefault();
      removeCard(evt);
    }
  };

  // Создание элемента карточки
  var createCard = function (card) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.card.renderCard(card, CARD_TEMPLATE));
    return fragment;
  };

  // Коллбэк загрузки карточки
  var cardLoadHandler = function (data) {
    var index = i;
    MAP_ELEMENT.insertBefore(createCard(data[i]), MAP_FILTERS_ELEMENT);
  };

  // Отрисовка новой карточки
  var showRelatedCard = function (pin) {
    removeCard();
    var i = pin.id;
    window.backend.load(cardLoadHandler, errorHandler, i);
    // MAP_ELEMENT.insertBefore(createCard(window.data.cardsData[i]), MAP_FILTERS_ELEMENT);
    // Добавление обработчиков событий на кнопку закрытия
    var cardClose = document.querySelector('.popup__close');
    cardClose.addEventListener('click', cardCloseClickHandler);
    document.addEventListener('keydown', cardKeydownHandler);
  };

  // Обработка нажатия на обычный пин

  var checkIfPin = function (evt) {
    var target = evt.target;
    var targetButton = target.closest('button');
    if (targetButton && targetButton.classList.contains('map__pin') && !targetButton.classList.contains('map__pin--main')) {
      return true;
    } else {
      return false;
    }
  };

  var pinClickHandler = function (evt) {
    evt.preventDefault();
    showRelatedCard(evt.target.closest('button'));
  };

  var pinKeydownHandler = function (evt) {
    evt.preventDefault();
    showRelatedCard(evt.target.closest('button'));
  };

  // Коллбэки загрузки пинов
  var pinsLoadHandler = function (data) {
    window.utils.cleanNode(MAP_PINS_ELEMENT, '.map__pin:not(.map__pin--main)');
    MAP_PINS_ELEMENT.appendChild(renderPins(data));
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
    } else if (newTop >= MAP_HEIGTH_MAX - (PIN_MAIN_DIAMETER + PIN_MAIN_CORRECTION)) {
      PIN_MAIN.style.top = MAP_HEIGTH_MAX - (PIN_MAIN_DIAMETER + PIN_MAIN_CORRECTION) + 'px';
    } else {
      PIN_MAIN.style.top = newTop + 'px';
    }

    if (newLeft <= 0) {
      PIN_MAIN.style.left = 0 + 'px';
    } else if (newLeft >= (MAP_ELEMENT.clientWidth - PIN_MAIN_DIAMETER)) {
      PIN_MAIN.style.left = (MAP_ELEMENT.clientWidth - PIN_MAIN_DIAMETER) + 'px';
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

    var locationX = PIN_MAIN.offsetLeft + PIN_MAIN_DIAMETER / 2;
    var locationY = PIN_MAIN.offsetTop + PIN_MAIN_DIAMETER + pinCorrection;

    return (locationX + ', ' + locationY);
  };

  // Создание элемента со всеми пинами
  var renderPins = function (sourceArr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < PINS_AMOUNT; i++) {
      fragment.appendChild(window.pin.renderPin(i, sourceArr[i], PIN));
    }
    return fragment;
  };

  // Запуск всего

  // window.form.updateAddress(false);

  PIN_MAIN.addEventListener('mousedown', pinMainMouseDownHandler);

  MAP_ELEMENT.addEventListener('click', function (evt) {
    if (checkIfPin(evt)) {
      pinClickHandler(evt);
    }
  });

  MAP_ELEMENT.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.keyCode.ENTER) {
      if (checkIfPin(evt)) {
        pinKeydownHandler(evt);
      }
    }
  });

  window.map = {
    mapReset: mapReset,
    getMainPinLocation: getMainPinLocation,
  };
})();
