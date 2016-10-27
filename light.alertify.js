/**
 * Alertify.
 *
 * Depend:
 *   alertify
 *
 * @returns {object}
 */

'use strict';

module.exports = {
  info: function (message) {
    alertify.success(message);
    console.info(message);
  },

  error: function (message) {
    alertify.error(message);
    console.error(message);
  },

  warn: function (message) {
    alertify.log(message);
    console.warn(message);
  },

  confirm: function (message, fn) {
    alertify.confirm(message, fn);
  }
};
