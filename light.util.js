/**
 * Util.
 */

'use strict';

exports.csrf = function () {
  return encodeURIComponent(document.getElementById('_csrf').value);
};

exports.uid = function () {
  return document.getElementById('userid').value
};

exports.param = function (url, key, val) {
  var separator = (url.indexOf('?') === -1) ? '?' : '&';
  return url + separator + key + '=' + val;
};

exports.guid4 = function () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

exports.cookie = function (key) {
  return decodeURIComponent(
    document.cookie.replace(new RegExp("(?:^|.*;\\s*)"
      + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1")
  );
};

exports.shiftLang = function (lang) {
  document.cookie = "light.lang=" + encodeURIComponent(lang) + ";path=/";
};

exports.save = function (scope, key, val) {
  if (!window.localStorage) {
    return;
  }

  var storage = window.localStorage.getItem(scope);
  storage = storage ? JSON.parse(storage) : {};

  storage[key] = val;
  window.localStorage.setItem(scope, JSON.stringify(storage));
};

exports.load = function (scope, key) {
  if (!window.localStorage) {
    return undefined;
  }

  var storage = window.localStorage.getItem(scope);
  if (storage) {
    return JSON.parse(storage)[key];
  }

  return undefined;
};
