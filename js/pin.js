'use strict';

(function () {
  // Отрисовка одного пина. Data -- новые данные для этого пина. Pin -- объект с характеристиками стандартного пина.
  var renderPin = function (data, pin) {

    var pinElement = pin.PIN_TEMPLATE.cloneNode(true);
    pinElement.style.left = data.location.x - pin.PIN_WIDTH / 2 + 'px';
    pinElement.style.top = data.location.y - pin.PIN_HEIGTH + 'px';
    pinElement.firstElementChild.src = data.author.avatar;
    pinElement.firstElementChild.alt = data.offer.title;
    pinElement.id = data.cardID;
    return pinElement;
  };

  window.pin = {
    renderPin: renderPin,
  };
})();


