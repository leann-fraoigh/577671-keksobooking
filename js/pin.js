'use strict';

(function () {
  var PIN = {
    PIN_TEMPLATE: document.querySelector('#pin').content.querySelector('.map__pin'),
    PIN_WIDTH: 50,
    PIN_HEIGTH: 70,
  };
  var PINS_AMOUNT = 5;

  // Отрисовка одного пина. Data -- новые данные для этого пина. Pin -- объект с характеристиками стандартного пина.
  var renderPin = function (id, data, pin) {
    var pinElement = pin.PIN_TEMPLATE.cloneNode(true);
    pinElement.style.left = data.location.x - pin.PIN_WIDTH / 2 + 'px';
    pinElement.style.top = data.location.y - pin.PIN_HEIGTH + 'px';
    pinElement.firstElementChild.src = data.author.avatar;
    pinElement.firstElementChild.alt = data.offer.title;
    pinElement.id = id;
    pinElement.addEventListener('click', function (evt) {
      pinClickHandler(evt, data);
    });
    pinElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.keyCode.ENTER) {
        pinKeydownHandler(evt, data);
      }
    });
    return pinElement;
  };

  // Создание элемента со всеми пинами
  var renderPins = function (sourceArr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < PINS_AMOUNT; i++) {
      fragment.appendChild(renderPin(i, sourceArr[i], PIN));
    }
    return fragment;
  };

  var pinClickHandler = function (evt, data) {
    evt.preventDefault();
    if (data.offer) {
      window.map.showRelatedCard(data);
    }
  };

  var pinKeydownHandler = function (evt, data) {
    evt.preventDefault();
    if (data.offer) {
      window.map.showRelatedCard(data);
    }
  };

  window.pin = {
    renderPins: renderPins,
  };

})();


