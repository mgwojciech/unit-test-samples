'use strict';

const build = require('@microsoft/sp-build-web');

build.configureWebpack.mergeConfig({
  build:{
    //add anything here if needed
  }
});
build.initialize(require('gulp'));


