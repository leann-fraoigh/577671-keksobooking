'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  // Удаление элеемента
  var cleanNode = function (parentElement, targetEleme) {
    var elementsToRemove = parentElement.querySelectorAll(targetEleme);
    if (elementsToRemove) {
      elementsToRemove.forEach(function (item) {
        item.remove();
      });
    }
  };

  var hideNode = function (node) {
    node.style = 'display: none';
  };

  // Дебаунс
  var debounce = function (cb) {
    var lastTimeout = null;
    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.utils = {
    cleanNode: cleanNode,
    hideNode: hideNode,
    debounce: debounce,
  };
})();
