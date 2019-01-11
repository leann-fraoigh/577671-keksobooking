'use strict';

(function () {
  // Удаление элеемента
  var cleanNode = function (parentElement, targetEleme) {
    var elementsToRemove = parentElement.querySelectorAll(targetEleme);
    if (elementsToRemove) {
      elementsToRemove.forEach(function (item) {
        item.remove();
      });
    }
  };

  window.utils = {
    cleanNode: cleanNode,
  };
})();
