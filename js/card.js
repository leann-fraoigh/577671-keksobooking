'use strict';
(function () {

  // Добавление иконок удобств
  var renderCardFeatures = function (card, element) {
    var featuresArray = element.querySelectorAll('.popup__feature');

    featuresArray.forEach(function (item) {
      item.style.display = 'none';
      for (var i = 0; i < card.offer.features.length; i++) {
        var j = '--' + card.offer.features[i];
        if (item.className.includes(j) === true) {
          item.style.display = '';
          return;
        }
      }
    });
  };

  // Добавление фото
  var renderCardPictures = function (card, element) {
    element.querySelector('.popup__photo').src = card.offer.photos[0];
    if (card.offer.photos.length > 1) {
      for (var i = 1; i < card.offer.photos.length; i++) {
        var photosBlock = element.querySelector('.popup__photos');
        var photoElement = element.querySelector('.popup__photo').cloneNode(true);
        photoElement.src = card.offer.photos[i];
        photosBlock.appendChild(photoElement);
      }
    }
  };

  // Генерация элемента с карточкой
  var renderCard = function (card, template) {

    var cardElement = template.cloneNode(true);
    cardElement.querySelector('.popup__avatar').src = card.author.avatar;
    cardElement.querySelector('.popup__title').textContent = card.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = window.data.getTitle(card.offer.type);

    // Добавление числа комнат и гостей (склонение только для числа комнат  <= 20)
    if (card.offer.rooms === 1) {
      cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комната для ' + card.offer.guests + ' гостей';
    } else if (card.offer.rooms < 5) {
      cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    } else {
      cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнат для ' + card.offer.guests + ' гостей';
    }
    // Конец добавления числа комнат и гостей
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;


    renderCardFeatures(card, cardElement);

    // Добавление описания
    cardElement.querySelector('.popup__description').textContent = card.offer.description;

    renderCardPictures(card, cardElement);

    cardElement.style.zIndex = 2000;

    return cardElement;
  };

  window.card = {
    renderCard: renderCard,
  };
})();
