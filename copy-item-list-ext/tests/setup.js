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
  const fetch = require('node-fetch');
  global.Headers = fetch.Headers;
  
  
  global.mockTeamsContext = {
    initialize: () => {
  
    },
    executeDeepLink: (deepLink) => {
      mockTeamsContext.executeDeepLinkCallback(deepLink);
    },
    executeDeepLinkCallback: (deepLink) => {
  
    }
  }
  jest.mock("@microsoft/sp-http", () => {
    return {
      SPHttpClient: {
        configurations: {
          v1: 1
        }
      },
      HttpClient: {
        configurations: {
          v1: 1
        }
      }
    }
  });
  jest.mock("@microsoft/sp-core-library", () => {
    return {
      Log: {
        error: () => {
  
        }
      },
      Guid: {
          newGuid: () => {
              return Math.random().toString();
          }
      }
    }
  });