'use strict';
(function () {
  var CARD_TEMPLATE = document.querySelector('#card').content.querySelector('.map__card');
  var PROPERTY_TYPES = {
    palace: {
      type: 'Дворец',
      minPrice: 10000,
    },
    flat: {
      type: 'Квартира',
      minPrice: 1000,
    },
    house: {
      type: 'Дом',
      minPrice: 5000,
    },
    bungalo: {
      type: 'Бунгало',
      minPrice: 0,
    }
  };

  // Шаблоны
  var cardElement;
  var cardClose;

  // Удаление карточки

  var removeCard = function () {

    if (cardElement) {
      cardElement.remove();
      // debugger;
      // document.removeChild(cardElement);
      cardElement = undefined;
    }
  };

  var cardCloseClickHandler = function (evt) {
    evt.preventDefault();
    removeCard();
  };

  var cardKeydownHandler = function (evt) {
    if (evt.keyCode === window.keyCode.ESC) {
      evt.preventDefault();
      removeCard();
    }
  };

  var cardCloseKeydownHandler = function (evt) {
    if (evt.keyCode === window.keyCode.ENTER) {
      evt.preventDefault();
      removeCard();
    }
  };

  // Отрисовка элемента с карточкой
  var renderCard = function (card) {
    var fragment = document.createDocumentFragment();

    cardElement = CARD_TEMPLATE.cloneNode(true);
    cardElement.querySelector('.popup__avatar').src = card.author.avatar;
    cardElement.querySelector('.popup__title').textContent = card.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = PROPERTY_TYPES[card.offer.type].type;

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

    // Добавление иконок удобств
    var featuresArray = cardElement.querySelectorAll('.popup__feature');

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

    cardElement.querySelector('.popup__description').textContent = card.offer.description;

    // Вставка фото
    cardElement.querySelector('.popup__photo').src = card.offer.photos[0];
    if (card.offer.photos.length > 1) {
      for (var i = 1; i < card.offer.photos.length; i++) {
        var photosBlock = cardElement.querySelector('.popup__photos');
        var photoElement = cardElement.querySelector('.popup__photo').cloneNode(true);
        photoElement.src = card.offer.photos[i];
        photosBlock.appendChild(photoElement);
      }
    }

    cardElement.style.zIndex = 2000;
    cardClose = cardElement.querySelector('.popup__close');

    fragment.appendChild(cardElement);

    cardClose.addEventListener('click', cardCloseClickHandler);
    cardClose.addEventListener('keydown', cardCloseKeydownHandler);
    document.addEventListener('keydown', cardKeydownHandler);

    return fragment;
  };

  window.card = {
    renderCard: renderCard,
    removeCard: removeCard,
  };
})();
