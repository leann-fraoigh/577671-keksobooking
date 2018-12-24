'use strict';

(function () {
  // Тут повторяются переменные, но так как этот модуль все равно удалять, я на это закрыла глаза.
  // Элементы
  var MAP_ELEMENT = document.querySelector('.map');
  var MAP_HEIGTH_MIN = 130;
  var MAP_HEIGTH_MAX = 630;

  var OBJECTS_AMOUNT = 8;
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

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

  var ROOMS_MAX = 5;
  var CHECKIN_HOURS = ['12:00', '13:00', '14:00'];
  var CHECKOUT_HOURS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var GUESTS_MAX = 1000;

  // Создание раномных чисел.
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

  var arraysToShuffle = {
    titlesShuffled: TITLES.slice(),
    featuresShuffled: FEATURES.slice(),
  };

  // Генерация одной карточки
  var getCard = function (j) {
    var location = {
      x: getRandomInt(0, (MAP_ELEMENT.clientWidth + 1)),
      y: getRandomInt(MAP_HEIGTH_MIN, (MAP_HEIGTH_MAX + 1))
    };

    var photos = PHOTOS.slice();
    shuffle(photos);

    var ret = {
      cardID: 'AD' + j,
      author: {
        avatar: 'img/avatars/user0' + (j + 1) + '.png'
      },
      location: {
        x: location.x,
        y: location.y
      },
      offer: {
        title: arraysToShuffle.titlesShuffled[j],
        address: location.x + ', ' + location.y,
        price: getRandomInt(PRICE_MIN, (PRICE_MAX + 1)),
        type: Object.keys(PROPERTY_TYPES)[getRandomInt(0, 4)],
        rooms: getRandomInt(1, (ROOMS_MAX + 1)),
        guests: getRandomInt(1, (GUESTS_MAX + 1)),
        checkin: CHECKIN_HOURS[getRandomInt(0, CHECKIN_HOURS.length)],
        checkout: CHECKOUT_HOURS[getRandomInt(0, CHECKOUT_HOURS.length)],
        features: arraysToShuffle.featuresShuffled.slice(getRandomInt(0, 6)),
        description: '',
        photos: photos,
      }
    };

    return ret;
  };

  // Генерация списка карточек
  var getCards = function (toShuffle, cardsAmount) {

    for (var key in toShuffle) {
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

  var cardsData = getCards(arraysToShuffle, OBJECTS_AMOUNT);

  window.data = cardsData;
})();

