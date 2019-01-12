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

  var hideNode = function (node) {
    node.style = 'display: none';
  };

  window.utils = {
    cleanNode: cleanNode,
    hideNode: hideNode,
  };
})();
