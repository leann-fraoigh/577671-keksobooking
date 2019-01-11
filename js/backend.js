'use strict';

(function () {
  var URL = {
    POST: 'https://js.dump.academy/keksobooking',
    GET: 'https://js.dump.academy/keksobooking/data',
  };

  var makeRequest = function (loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        loadHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      // errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      errorHandler('Время ожидания ответа от сервера истекло');
    });

    xhr.timeout = 5000; // 5s

    return xhr;
  };

  var load = function (loadHandler, errorHandler) {
    var xhr = makeRequest(loadHandler, errorHandler);
    xhr.open('GET', URL.GET);
    xhr.send();
  };

  var upload = function (data, loadHandler, errorHandler) {
    var xhr = makeRequest(loadHandler, errorHandler);
    xhr.open('POST', URL.POST);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload,
  };
})();
