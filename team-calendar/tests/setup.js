/* istanbul ignore next */
var localStorageMock = (function () {
    var store = {};
    return {
      getItem: function (key) {
        let result = store[key];
        return result || null;
      },
      setItem: function (key, value) {
        store[key] = value.toString();
      },
      clear: function () {
        store = {};
      },
      removeItem: function (key) {
        delete store[key];
      }
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  Object.defineProperty(window, 'sessionStorage', { value: localStorageMock });