'use strict';
(function () {
  var MAP_HEIGTH_MIN = 130;
  var MAP_HEIGTH_MAX = 704;

  // Элементы
  var MAP_ELEMENT = document.querySelector('.map');
  var MAP_PINS_ELEMENT = MAP_ELEMENT.querySelector('.map__pins');
  var MAP_FILTERS_ELEMENT = MAP_ELEMENT.querySelector('.map__filters-container');
  var PIN_MAIN = document.querySelector('.map__pin--main');
  var PIN_MAIN_WIDTH = 66;
  var PIN_MAIN_HEIGTH = 80;
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
    removeCard();
    removePins();
    setPinMainDefaultCoords();
    setFormDefaultAddress();
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
  // Удаление пинов
  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pins) {
      pins.forEach(function (item) {
        item.remove();
      });
    }
  };

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
    removePins();
    MAP_PINS_ELEMENT.appendChild(renderPins(data));
  };

  // Обработка событий на главном пине

  var setPinMainDefaultCoords = function () {
    PIN_MAIN.style.top = startMainPinCoords.y;
    PIN_MAIN.style.left = startMainPinCoords.x;
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
    } else if (newTop >= MAP_HEIGTH_MAX - PIN_MAIN_HEIGTH) {
      PIN_MAIN.style.top = MAP_HEIGTH_MAX - PIN_MAIN_HEIGTH + 'px';
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
    setFormAddress();
  };


  var pinMainMouseUpHandler = function () {
    document.removeEventListener('mousemove', pinMainMouseMoveHandler);
    document.removeEventListener('mouseup', pinMainMouseUpHandler);
    setFormAddress();
    window.backend.load(pinsLoadHandler, errorHandler);
  };

  // Получить адрес главного пина. (Вспомогательные функции, чтобы вызывать установку адреса в форму отсюда, т.к. тут сейчас лежат данные, в зависимости от котороых он вычисляется.)

  var setFormAddress = function () {
    var getAddress = function () {
      var address = {
        x: PIN_MAIN.offsetLeft + PIN_MAIN_WIDTH / 2,
        y: PIN_MAIN.offsetTop + PIN_MAIN_HEIGTH,
      };
      return address;
    };
    window.form.setAddress(getAddress().x, getAddress().y);
  };

  var setFormDefaultAddress = function () {
    var getDefaultAddress = function () {
      var defaultAddress = {
        x: PIN_MAIN.offsetLeft + PIN_MAIN_WIDTH / 2,
        y: PIN_MAIN.offsetTop + PIN_MAIN_WIDTH / 2,
      };
      return defaultAddress;
    };
    window.form.setDefaultAddress(getDefaultAddress().x, getDefaultAddress().y);
  };
  setFormDefaultAddress();

  // Создание элемента со всеми пинами
  var renderPins = function (sourceArr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < PINS_AMOUNT; i++) {
      fragment.appendChild(window.pin.renderPin(i, sourceArr[i], PIN));
    }
    return fragment;
  };

  // Запуск всего

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
  };
})();
