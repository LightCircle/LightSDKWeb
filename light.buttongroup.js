/**
 * Button Group.
 *   getValue - Gets the currently selected item value
 *   setValue - Sets the value
 *   disable  - Disable the button, true: disable false: enable
 *   onClick  - Click event

 * Depend.
 *   react
 *   bootstrap
 *   fontawesome
 *
 * @param id
 * @param option
 * @param option.data array
 * @param option.value string
 * @param option.disabled boolean
 * @returns {*}
 */

'use strict';

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
      this.state.data.map(function (item) {
        return React.DOM.button({
          className: this.className(item),
          disabled: this.disabled(),
          onClick: this.click,
          value: item.value
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

  getValue: function () {
    return this.state.value;
  },

  setValue: function (value) {
    this.setState({value: value});
  },

  setDisable: function (disabled) {
    this.setState({disabled: disabled});
  },

  onClick: function (value) {
  }

});