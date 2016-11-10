/**
 * init
 */

'use strict';

exports.init = function () {
  _.templateSettings = {
    interpolate: /\{\{-(.+?)\}\}/gim,
    evaluate: /\<\$(.+?)\$\>/gim,
    escape: /\{\{([^-]+?)\}\}/gim
  };
}();

