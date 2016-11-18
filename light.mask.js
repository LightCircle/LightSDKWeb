/**
 * @module Mask
 * @param id
 * @param option
 * @param {number} option.timeout - Mask The maximum time to display (second). default: 60 sec.
 * @returns {*}
 */

'use strict';

var React = require('react')
  , ReactDOM = require('react-dom');

module.exports = function (id, option) {

  option = option || {};
  option.timeout = (option.timeout || 60) * 1000;

  return ReactDOM.render(
    React.createElement(Mask, option),
    document.getElementById(id)
  );
};

var style = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  zIndex: '10000',
  backgroundColor: '#000000',
  opacity: '0.2',
  filter: 'alpha(opacity=20)'
};

var Mask = React.createClass({
  getInitialState: function () {
    return {
      counter: 0
    }
  },

  render: function () {
    return React.DOM.div({
      className: 'loading-mask collapse', style: this.style()
    });
  },

  style: function () {
    style.display = this.state.counter > 0 ? 'block' : 'none';
    return style;
  },

  /**
   * show mask
   */
  show: function () {
    this.state.counter = this.state.counter + 1;
    this.setState({counter: this.state.counter});

    clearTimeout(this.timer);
    this.timer = setTimeout(function () {
      this.hide();
    }.bind(this), this.props.timeout);
  },

  /**
   * hide mask
   */
  hide: function () {
    if (this.state.counter < 1) {
      clearTimeout(this.timer);
    }

    this.setState({counter: this.state.counter - 1});
  }
});
