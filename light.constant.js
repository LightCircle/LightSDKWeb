/**
 * @module Constant
 */

'use strict';

/**
 * constant
 * @type {{TYPE_AUDIO: string, TYPE_IMAGE: string, TYPE_VIDEO: string, TYPE_PDF: string, TYPE_CSV: string, TYPE_TEXT: string, TYPE_EXCEL: string, MAX_ROW: number}}
 */
module.exports = {
  TYPE_AUDIO: "audio/*",
  TYPE_IMAGE: "image/*",
  TYPE_VIDEO: "video/*",
  TYPE_PDF: "application/pdf",
  TYPE_CSV: "text/csv",
  TYPE_TEXT: "text/plain",
  TYPE_EXCEL: "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  MAX_ROW: 9223372036854775807
};
