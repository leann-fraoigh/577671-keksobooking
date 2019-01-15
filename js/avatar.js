'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var FILE_CHOOSER = document.querySelector('.ad-form__field input#avatar');
  var PREVIEW = document.querySelector('.ad-form-header__preview img');

  FILE_CHOOSER.addEventListener('change', function () {
    var file = FILE_CHOOSER.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        PREVIEW.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();
