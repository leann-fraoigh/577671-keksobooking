'use strict';
// Клавиши
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var OBJECTS_AMOUNT = 8;
// Данные о жилье
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
// Элементы
var MAP_ELEMENT = document.querySelector('.map');
var MAP_PINS_ELEMENT = MAP_ELEMENT.querySelector('.map__pins');
var MAP_FILTERS_ELEMENT = MAP_ELEMENT.querySelector('.map__filters-container');
var AD_FORM = document.querySelector('.ad-form');
var PIN_MAIN = document.querySelector('.map__pin--main');
var PIN_MAIN_WIDTH = 66;
var PIN_MAIN_HEIGTH = 88;
var ALL_SELECTS = document.querySelectorAll('select');
var ALL_INPUTS = document.querySelectorAll('input');
// Шаблоны
var PIN_TEMPLATE = document.querySelector('#pin')
.content
.querySelector('.map__pin');
var PIN_WIDTH = 50;
var PIN_HEIGTH = 70;
var CARD_TEMPLATE = document.querySelector('#card')
.content
.querySelector('.map__card');
var popup;
var popupClose;

var arraysToShuffle = {
  titlesShuffled: TITLES.slice(),
  featuresShuffled: FEATURES.slice(),
};

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

// Выключалка и включалка полей форм
var disable = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].disabled = true;
  }
};

var enable = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].disabled === true) {
      arr[i].disabled = false;
    }
  }
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
      type: TYPES[getRandomInt(0, 4)],
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
  for (var i = 0; i < OBJECTS_AMOUNT; i++) {
    fragment.appendChild(renderPin(sourceArr[i]));
  }

  return fragment;
};

// Отрисовка элемента с карточкой
var renderCard = function (card) {
  var fragment = document.createDocumentFragment();

  var cardElement = CARD_TEMPLATE.cloneNode(true);
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
  // Конец добавления иконок удобств

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

  fragment.appendChild(cardElement);
  return fragment;
};

// Удаление карточки

var removeCard = function () {
  if (popup) {
    MAP_ELEMENT.removeChild(popup);
    popup = undefined;
  }
};

// Закрытие карточки

var popupCloseClickHandler = function (evt) {
  evt.preventDefault();
  removeCard();
};

var popupKeydownHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    evt.preventDefault();
    removeCard();
  }
};

var popupCloseKeydownHandler = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    evt.preventDefault();
    removeCard();
  }
};

// Обработчик нажатия на пин

var pinClickHandler = function (evt) {
  var target = evt.target;
  var targetButton = target.closest('button');
  if (targetButton && targetButton.classList.contains('map__pin') && !targetButton.classList.contains('map__pin--main')) {
    removeCard();
    var i = targetButton.id.substring(2);
    MAP_ELEMENT.insertBefore(renderCard(cardsData[i]), MAP_FILTERS_ELEMENT);
    popup = MAP_ELEMENT.querySelector('.map__card.popup');
    popupClose = popup.querySelector('.popup__close');
    popupClose.addEventListener('click', popupCloseClickHandler);
    popupClose.addEventListener('keydown', popupCloseKeydownHandler);
    document.addEventListener('keydown', popupKeydownHandler);
  }
};

var setAddress = function () {
  var y = PIN_MAIN.offsetTop + PIN_MAIN_HEIGTH;
  var x = PIN_MAIN.offsetLeft + PIN_MAIN_WIDTH / 2;
  AD_FORM.querySelector('#address').value = x + ', ' + y;
};

var setDefaulfAddress = function () {
  var y = PIN_MAIN.offsetTop + PIN_MAIN_WIDTH / 2;
  var x = PIN_MAIN.offsetLeft + PIN_MAIN_WIDTH / 2;
  AD_FORM.querySelector('#address').value = x + ', ' + y;
};

// Запуск всего

disable(ALL_SELECTS);

disable(ALL_INPUTS);

var cardsData = getCards(arraysToShuffle, OBJECTS_AMOUNT);

setDefaulfAddress();

PIN_MAIN.addEventListener('mouseup', function () {
  enable(ALL_SELECTS);
  enable(ALL_INPUTS);
  MAP_ELEMENT.classList.remove('map--faded');
  AD_FORM.classList.remove('ad-form--disabled');
  setAddress();
  MAP_PINS_ELEMENT.appendChild(renderPins(cardsData));
});


MAP_ELEMENT.addEventListener('click', function (evt) {
  evt.preventDefault();
  pinClickHandler(evt);
});


MAP_ELEMENT.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    evt.preventDefault();
    pinClickHandler(evt);
  }
});
