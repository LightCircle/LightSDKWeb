/**
 *
 */

'use strict';

var util = require('./light.util')
  , DATA_TYPE = 'json'
  , CONTENT_TYPE = 'application/json'
  , CSRF_KEY = '_csrf';

/**
 * GET Method.
 * @param url
 * @param data
 * @param callback
 */
exports.get = function (url, data, callback) {

  if (typeof data == 'function') {
    callback = data;
    data = undefined;
  }

  $.ajax({
    type: 'GET',
    url: url,
    data: data,
    dataType: DATA_TYPE,
    success: function (result) {
      callback(result.error, result.data);
    },
    error: function (err) {
      console.error('do ajax ' + url + '   error');
      callback(err);
    }
  });
};

/**
 * POST Method.
 * @param url
 * @param data
 * @param callback
 */
exports.post = function (url, data, callback) {

  data.uid = util.uid();

  $.ajax({
    url: util.param(url, CSRF_KEY, util.csrf()),
    type: 'POST',
    async: true,
    data: JSON.stringify(data),
    dataType: DATA_TYPE,
    contentType: CONTENT_TYPE,
    processData: false,
    success: function (result) {
      callback(result.error, result.data);
    },
    error: function (err) {
      console.error('do ajax ' + url + '   error');
      callback(err);
    }
  });
};

/**
 * PUT Method.
 * @param url
 * @param data
 * @param callback
 */
exports.put = function (url, data, callback) {
  $.ajax({
    url: util.param(url, CSRF_KEY, util.csrf()),
    type: 'PUT',
    async: true,
    data: JSON.stringify(data),
    dataType: DATA_TYPE,
    contentType: CONTENT_TYPE,
    success: function (result) {
      callback(result.error, result.data);
    }, error: function (err) {
      console.error('do ajax ' + url + '   error');
      callback(err);
    }
  });
};

/**
 * DELETE Method.
 * @param url
 * @param data
 * @param callback
 */
exports.delete = function (url, data, callback) {
  $.ajax({
    url: util.param(url, CSRF_KEY, util.csrf()),
    type: 'DELETE',
    async: true,
    data: JSON.stringify(data),
    dataType: DATA_TYPE,
    contentType: CONTENT_TYPE,
    processData: false,
    success: function (result) {
      callback(result.error, result.data);
    },
    error: function (err) {
      console.error('do ajax ' + url + '   error');
      callback(err);
    }
  });
};

/**
 * POST FormData.
 * @param url
 * @param params QueryParams
 * @param data FormData
 * @param callback
 * @param progress
 */
exports.postData = function (url, params, data, callback, progress) {

  data.append("uid", util.uid());

  params._csrf = decodeURIComponent(util.csrf());
  url += '?' + $.param(params);

  $.ajax({
    url: url,
    type: "POST",
    async: true,
    data: data,
    dataType: DATA_TYPE,
    contentType: false,
    processData: false,
    xhr: function () {
      var XHR = $.ajaxSettings.xhr();
      if (XHR.upload) {
        XHR.upload.addEventListener('progress', function (event) {
          if (progress) {
            progress(parseInt(event.loaded / event.total * 10000) / 100);
          }
        }, false);
      }
      return XHR;
    },
    success: function (result) {
      callback(result.error, result.data);
    },
    error: function (err) {
      console.error('do ajax ' + url + '   error');
      callback(err);
    }
  });
};