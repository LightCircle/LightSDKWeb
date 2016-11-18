/**
 * @module Init
 */

'use strict';

/**
 * init
 */
exports.init = function () {
  _.templateSettings = {
    interpolate: /\{\{-(.+?)\}\}/gim,
    evaluate: /\<\$(.+?)\$\>/gim,
    escape: /\{\{([^-]+?)\}\}/gim
  };
}();

