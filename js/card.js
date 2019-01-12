'use strict';
(function () {
  var CARD_TEMPLATE = document.querySelector('#card').content.querySelector('.map__card');

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

  // Проверяет наличие данных по ключу feature, при наличии добавляет feature в атрибут (attribute) элемента (node), при отсутствии скрывает элемент. (text -- скрока, добавляющаяся в атридут после feature (если есть).
  var setFeature = function (node, attribute, feature, text) {
    if (!feature) {
      window.utils.hideNode(node);
    } else {
      var att1 = attribute;
      if (!text) {
        node[att1] = feature;
      } else {
        node[att1] = feature + text;
      }
    }
  };

  // Генерация элемента с карточкой
  var renderCard = function (card, template) {

    var cardElement = template.cloneNode(true);
    // Добавление аватара
    setFeature(cardElement.querySelector('.popup__avatar'), 'src', card.author.avatar);

    // Добавление заголовка
    setFeature(cardElement.querySelector('.popup__title'), 'textContent', card.offer.title);

    // Добавление адреса
    setFeature(cardElement.querySelector('.popup__text--address'), 'textContent', card.offer.address);

    // Добавление типа
    setFeature(cardElement.querySelector('.popup__type'), 'textContent', card.offer.type);

    // Добавление цены
    setFeature(cardElement.querySelector('.popup__text--price'), 'textContent', card.offer.price, '₽/ночь');

    // Добавление числа комнат и гостей (склонение только для числа комнат  <= 20)
    if (card.offer.rooms === 0) {
      window.utils.hideNode(cardElement.querySelector('.popup__text--capacity'));
    } else if (card.offer.rooms === 1) {
      cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комната для ' + card.offer.guests + ' гостей';
    } else if (card.offer.rooms < 5) {
      cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    } else {
      cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнат для ' + card.offer.guests + ' гостей';
    }
    // Добавление информации о чекине и чекауте
    if (!card.offer.checkin && !card.offer.checkin) {
      window.utils.hideNode(cardElement.querySelector('.popup__text--time'));
    } else {
      cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
    }
    // Добавление списка удобств
    if (card.offer.features.length === 0) {
      window.utils.hideNode(cardElement.querySelector('.popup__features'));
    } else {
      renderCardFeatures(card, cardElement);
    }

    // Добавление описания
    setFeature(cardElement.querySelector('.popup__description'), 'textContent', card.offer.description);

    // Добавление фото
    if (card.offer.photos.length === 0) {
      window.utils.hideNode(cardElement.querySelector('.popup__photos'));
    } else {
      renderCardPictures(card, cardElement);
    }

    cardElement.style.zIndex = 2000;

    // Добавление обработчиков событий на кнопку закрытия
    var cardClose = cardElement.querySelector('.popup__close');
    cardClose.addEventListener('click', cardCloseClickHandler);
    document.addEventListener('keydown', cardKeydownHandler);

    return cardElement;
  };

  // Удаление карточки
  var removeCard = function () {
    window.utils.cleanNode(document, '.map__card.popup');
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
    fragment.appendChild(renderCard(card, CARD_TEMPLATE));
    return fragment;
  };

  window.card = {
    createCard: createCard,
    removeCard: removeCard,
  };
})();
