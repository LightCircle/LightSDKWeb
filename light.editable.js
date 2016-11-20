/**
 * @module Editable
 * @desc editable.
 * @param id
 * @param option
 * @param {string|object|function} option.pk - Primary key of editable object.
 * @param {boolean} option.clear - Whether to show clear button
 * @param {boolean} option.disabled - Sets disabled state of editable
 * @param {object} option.combodate - Combodate input - dropdown date and time picker.
 * @param {string|array|object|function} option.source - Source data for list.
 * @param {string} option.type - type of input
 * @param {string} option.name - name of field
 * @param {string} option.title
 * @param {string|function} option.url - Url for submit
 * @param {object|function} option.params - Additional params for submit
 * @param {string} option.emptytext - Text shown when element is empty.
 * @param {object} option.ajaxOptions - Additional options for submit ajax request
 * @param {string} option.value - initial value
 * @param {string} option.placement - Placement of container relative to element. Can be top|right|bottom|left.
 * Not used for inline container.
 * @param {integer} option.rows - Number of rows in textarea
 * @param {function} option.success - Success callback
 * @param {function} option.error - callback applied with parameter containing field names and errors
 * @param {function} option.validate - Function for client-side validation
 * @param {function|boolean} option.display - Callback to perform custom displaying of value in element's text.
 * @param {string} option.tpl - HTML template of input. Normally you should not change it.
 * @param {string} option.format - Format used for sending value to server.
 * Also applied when converting date from data-value attribute.
 * @param {string} option.viewformat - Format used for displaying date
 * @param {string} option.template - Template used for displaying dropdowns.
 * @returns {*}
 */
'use strict';

var React = require('react')
  , ReactDOM = require('react-dom');

module.exports = function (id, option) {
  option = option || {};

  return ReactDOM.render(
    React.createElement(Editable, option),
    document.getElementById(id)
  );
};

var Editable = React.createClass({

  render: function () {
    return React.DOM.a();
  },

  /**
   * Toggles enabled / disabled state of editable element.
   */
  toggle: function () {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(function () {
      this.node.editable('toggleDisabled');
    }.bind(this), 250);
  },

  componentDidMount: function () {
    var node = $(ReactDOM.findDOMNode(this));
    this.node = node.editable({
      disabled: this.props.disabled,
      type: this.props.type,
      pk: this.props.pk,
      name: this.props.name,
      title: this.props.title,
      source: this.props.source,
      url: this.props.url,
      ajaxOptions: this.props.ajaxOptions,
      emptytext: this.props.emptytext,
      value: this.props.value,
      clear: this.props.clear,
      rows: this.props.rows,
      params: this.props.params,
      success: this.props.success,
      error: this.props.error,
      validate: this.props.validate,
      placement: this.props.placement,
      display: this.props.display,
      combodate: this.props.combodate,
      tpl: this.props.tpl,
      format: this.props.format,
      viewformat: this.props.viewformat,
      template: this.props.template
    });

    /**
     * Fired when new value was submitted
     */
    this.node.on('save', function (e, params) {
      node.editable('toggleDisabled');
    });
  },

  /**
   * Returns current values of editable elements.
   *  When param isSingle is set to true
   * it is supposed you have single element and will return value of editable instead of object.
   */
  getSingleValue: function () {
    return this.node.editable('getValue', true);
  },

  /**
   *Returns current values of editable elements.  return object
   */
  getValue: function () {
    return this.node.editable('getValue');
  }
});