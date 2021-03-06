/**
 * @module ButtonGroup
 * @desc Depend.
 * <ul>
 *   <li>react</li>
 *   <li>bootstrap</li>
 *   <li>fontawesome</li>
 * </ul>
 * @param id
 * @param option
 * @param {array} option.data array
 * @param {string} option.value
 * @param {boolean} option.disabled
 * @returns {*}
 */

'use strict';

var React = require('react')
  , ReactDOM = require('react-dom');

module.exports = function (id, option) {
  option = option || {};
  option.data = option.data || [];

  return ReactDOM.render(
    React.createElement(ButtonGroup, {data: option.data, value: option.value, disabled: option.disabled}),
    document.getElementById(id)
  );
};

var ButtonGroup = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data, value: this.props.value, disabled: this.props.disabled
    }
  },

  render: function () {

    return React.DOM.div({className: 'btn-group'},
      this.state.data.map(function (item, i) {
        return React.DOM.button({
          className: this.className(item),
          disabled: this.disabled(),
          onClick: this.click,
          value: item.value,
          key: i
        }, item.title)
      }.bind(this))
    );
  },

  className: function (item) {
    return 'btn btn-sm' + (this.state.value == item.value ? ' btn-info' : ' btn-default');
  },

  disabled: function () {
    return this.state.disabled;
  },

  click: function (event) {
    var current = event.target.getAttribute('value');
    this.setState({value: current});
    this.onClick(current);
  },

  /**
   * getValue - Gets the currently selected item value
   * @returns {*}
   */
  getValue: function () {
    return this.state.value;
  },

  /**
   * setValue - Sets the value
   * @param value
   */
  setValue: function (value) {
    this.setState({value: value});
  },

  /**
   * disable - Disable the button, true: disable false: enable
   * @param disabled
   */
  setDisable: function (disabled) {
    this.setState({disabled: disabled});
  },

  /**
   * onClick - Click event
   * @param value
   */
  onClick: function (value) {
  }

});