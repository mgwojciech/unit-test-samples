let spCoreLibrary
global['define'] = (id, dependencies, registerCallback) => {
    if (id.indexOf("7263c7d0-1d6a-45ec-8d85-d4d1d234171b") >= 0) {
        spCoreLibrary = registerCallback();
    }
};
require("../node_modules/@microsoft/sp-core-library/dist/sp-core-library_en-us");
jest.mock("@microsoft/sp-core-library", () => {
  return spCoreLibrary
});