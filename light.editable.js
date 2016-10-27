/**
 * Created by lwx on 16/10/24.
 */
/**
 *   editable.
 *
 * can be used functions
 *   toggle:          Toggles enabled / disabled state of editable element.
 *   getSingleValue:  Returns current values of editable elements.
 *                    When param isSingle is set to true -
 *                    it is supposed you have single element and will return value of editable instead of object.
 *   getValue:        Returns current values of editable elements.
 *
 * @param id
 * @param option
 * pk        [string|object|function]   Primary key of editable object.
 * clear     [boolean]                  Whether to show clear button
 * disabled  [boolean]                  Sets disabled state of editable
 * combodate [object]                   Combodate input - dropdown date and time picker.
 * source    [string|array|object|function]       Source data for list.
 * type      [string]                   type of input
 * name      [string]                   name of field
 * title     [string]
 * url       [string|function]          Url for submit
 * params    [object|function]           Additional params for submit
 * emptytext [string]                  Text shown when element is empty.
 * ajaxOptions[object]                  Additional options for submit ajax request
 * value     [string]                  initial value
 * placement [string]                  Placement of container relative to element. Can be top|right|bottom|left. Not used for inline container.
 * rows     [integer]                   Number of rows in textarea
 * success  [function]                 Success callback
 * error    [function]                 callback applied with parameter containing field names and errors
 * validate [function]                 Function for client-side validation
 * display  [function|boolean]         Callback to perform custom displaying of value in element's text.
 * tpl      [string]                    HTML template of input. Normally you should not change it.
 * format   [string]                  Format used for sending value to server. Also applied when converting date from data-value attribute.
 * viewformat [string]                 Format used for displaying date
 * template   [string]                 Template used for displaying dropdowns.
 * @returns {*}
 */
'use strict';

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