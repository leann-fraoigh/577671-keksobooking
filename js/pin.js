'use strict';

(function () {
  var PIN_TEMPLATE = document.querySelector('#pin').content.querySelector('.map__pin');
  var PIN_WIDTH = 50;
  var PIN_HEIGTH = 70;

  // Создание элемента со всеми пинами
  var renderPins = function (sourceArr) {
    var fragment = document.createDocumentFragment();

    // Отрисовка одного пина
    var renderPin = function (card) {

      var pinElement = PIN_TEMPLATE.cloneNode(true);
      pinElement.style.left = card.location.x - PIN_WIDTH / 2 + 'px';
      pinElement.style.top = card.location.y - PIN_HEIGTH + 'px';
      pinElement.firstElementChild.src = card.author.avatar;
      pinElement.firstElementChild.alt = card.offer.title;
      pinElement.id = card.cardID;
      return pinElement;
    };

    // Запись всех пинов
    for (var i = 0; i < window.data.length; i++) {
      fragment.appendChild(renderPin(sourceArr[i]));
    }

    return fragment;
  };

  window.pin = {
    renderPins: renderPins,
  };
})();


