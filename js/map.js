'use strict';

var OBJECTS_AMOUNT = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TYPES_EXPLAINED = {'palace': 'Дворец', 'flat': 'Квартира', 'house': 'Дом', 'bungalo': 'Бунгало'};
var ROOMS_MAX = 5;
var CHECKIN_HOURS = ['12:00', '13:00', '14:00'];
var CHECKOUT_HOURS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MAP_HEIGTH_MIN = 130;
var MAP_HEIGTH_MAX = 630;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var GUESTS_MAX = 1000;

var arraysToShuffle = {
  'titlesShuffled': TITLES.slice(),
  'featuresShuffled': FEATURES.slice(),
  'photosShuffled': PHOTOS.slice()
};

var map = document.querySelector('.map');

var mapUnfade = function () {
  map.classList.remove('map--faded');
};

// Создтание раномных чисел.
// [min, max) inclding min, excluding max
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Перетасовка данных массива
var shuffle = function (arr) {
  var j;
  var temp;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
};

// Генерация одной карточки
// Не уверена, что это нужно выделять в отдельную функцию
var getCard = function (j) {
  var object = {};

  object.author = {};
  object.author.avatar = 'img/avatars/user0' + (j + 1) + '.png';

  object.location = {};
  // Как тут сделать резиновость, чтобы они оставались привязанными к точкам на карте при изменении размера окна браузера?..
  // object.location.x = getRandomInt(0, 1200);
  object.location.x = getRandomInt(0, (map.clientWidth + 1));
  object.location.y = getRandomInt(MAP_HEIGTH_MIN, (MAP_HEIGTH_MAX + 1));

  object.offer = {};
  object.offer.title = arraysToShuffle.titlesShuffled[j];
  // Свойства генерируются по порядку? Отсюда в принципе нельзя сослаться на какое-то из свойств, созданных ниже в коде?
  object.offer.address = object.location.x + ', ' + object.location.y;
  object.offer.price = getRandomInt(PRICE_MIN, (PRICE_MAX + 1));
  object.offer.type = TYPES[getRandomInt(0, 4)];
  object.offer.rooms = getRandomInt(1, (ROOMS_MAX + 1));
  object.offer.guests = getRandomInt(1, (GUESTS_MAX + 1));
  object.offer.checkin = CHECKIN_HOURS[getRandomInt(0, CHECKIN_HOURS.length)];
  object.offer.checkout = CHECKOUT_HOURS[getRandomInt(0, CHECKOUT_HOURS.length)];
  object.offer.features = arraysToShuffle.featuresShuffled.slice(getRandomInt(0, arraysToShuffle.featuresShuffled.length));
  object.offer.description = '';
  object.offer.photos = arraysToShuffle.photosShuffled;

  return object;
};

// Генерация списка карточек
var getCards = function (toShuffle, cardsAmount) {

  for (var key in toShuffle) {
    // Не очень поняла, зачем тут if и что он проверяет, но иначе проверка ругается
    if (toShuffle.hasOwnProperty(key)) {
      shuffle(toShuffle[key]);
    }
  }

  var cards = [];

  for (var i = 0; i < cardsAmount; i++) {
    var card = getCard(i);
    cards.push(card);
  }

  return cards;
};

// Создание элемента со всеми пинами
var renderPins = function () {
  var fragment = document.createDocumentFragment();

  // Отрисовка одного пина
  var renderPin = function (card) {
    var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

    var pinElement = pinTemplate.cloneNode(true);
    // поправить с учетом высоты метки!
    pinElement.style.left = card.location.x + 'px';
    pinElement.style.top = card.location.y + 'px';
    pinElement.firstElementChild.src = card.author.avatar;
    pinElement.firstElementChild.alt = card.offer.title;
    return pinElement;
  };

  // Запись всех пинов
  // Кажется, что получилось слишком запутанно, но как распутать, и нужно ли, -- не знаю.
  for (var i = 0; i < OBJECTS_AMOUNT; i++) {
    fragment.appendChild(renderPin(cardsData[i]));
  }

  return fragment;
};

// Создание элемента с карточкой
var renderCards = function () {
  var fragment = document.createDocumentFragment();

  var renderCard = function (card) {
    var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

    var cardElement = cardTemplate.cloneNode(true);
    cardElement.querySelector('.popup__avatar').src = card.author.avatar;
    cardElement.querySelector('.popup__title').textContent = card.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = TYPES_EXPLAINED[card.offer.type];
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
    cardElement.querySelector('.popup__features').textContent = card.offer.features.join(', ');
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
    // Конец вставки фото
    return cardElement;
  };

  fragment.appendChild(renderCard(cardsData[0]));

  return fragment;
};

// Генерирует массив случайных объектов
var cardsData = getCards(arraysToShuffle, OBJECTS_AMOUNT);

// Запускает создание и запись меток
map.querySelector('.map__pins').appendChild(renderPins());

// Запускает создание и запись карточки
map.insertBefore(renderCards(), map.querySelector('.map__filters-container'));

// Показывает карту
mapUnfade();
