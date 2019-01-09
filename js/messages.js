'use strict';

(function () {
  var ERROR_MESSAGE_TEMPLATE = document.querySelector('#error').content.querySelector('.error');
  var ERROR_MESSAGE_ZINDEX = 1500;


  var renderErrorMessage = function (message) {
    var node = ERROR_MESSAGE_TEMPLATE.cloneNode(true);
    node.querySelector('.error__message').textContent = message;
    document.querySelector('main').appendChild(node);
    var errorElement = document.querySelector('main .error');
    errorElement.style.zIndex = ERROR_MESSAGE_ZINDEX;
    // Добавление обработчиков, закрывающийх объявление
    var errorButton = errorElement.querySelector('.error__button');
    errorButton.addEventListener('click', function () {
      errorElement.remove();
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.keyCode.ESC) {
        errorElement.remove();
      }
    });
  };

  window.messages = {
    renderErrorMessage: renderErrorMessage,
    // showSuccessMessage: showSuccessMessage,
  };
})();
