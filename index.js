/**
 *
 */

'use strict';

var net = require('./light.net')
  , util = require('./light.util')
  , tags = require('./light.tags')
  , mask = require('./light.mask')
  , buttongroup = require('./light.buttongroup')
  , selectbox = require('./light.selectbox')
  , cascade = require('./light.cascade')
  , fileselect = require('./light.fileselect')
  , datetimepicker = require('./light.datetimepicker')
  , constant = require('./light.constant')
  , multiselect = require('./light.multiselect')
  , alertify = require('./light.alertify')
  , tree = require('./light.tree')
  , placeselect = require('./light.placeselect')
  , editable = require('./light.editable')
  ;

module.exports = {
  buttongroup: buttongroup,
  tags: tags,
  mask: mask,
  selectbox: selectbox,
  cascade: cascade,
  fileselect: fileselect,
  datetimepicker: datetimepicker,
  multiselect: multiselect,
  alertify: alertify,
  tree: tree,
  placeselect: placeselect,
  editable: editable,

  const: constant,
  net: net,
  util: util,

  get: net.get,
  post: net.post,
  put: net.put,
  delete: net.delete,
  postData: net.postData,
  multipart: net.postData,

  doget: net.get,
  dopost: net.post,
  doput: net.put,
  dodelete: net.delete,
  dopostData: net.postData

};