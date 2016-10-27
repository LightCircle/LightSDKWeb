/**
 * DateTimePicker.
 *
 * Depend:
 *  react
 *  bootstrap
 *  fontawesome
 *  jquery
 *  moment
 *  bootstrap-datetimepicker
 *
 * @param id
 * @param option
 *   button  [string] action button ('right' 'left' 'none'). default:right
 *   format  [string] date format. default: YYYY-MM-DD
 *   maxDate [string] The minimum value that can be selected
 *   minDate [string] The maximum value that can be selected
 */

'use strict';

module.exports = function (id, option) {
  option = option || {};

  option.format = option.format || 'YYYY-MM-DD';
  option.locale = option.locale || 'zh-cn';
  option.button = option.button || 'right';

  return ReactDOM.render(
    React.createElement(DateTimePicker, option),
    document.getElementById(id)
  );
};


var DateTimePicker = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.value
    }
  },

  render: function () {
    return React.DOM.div({className: 'input-group'},
      this.button('left'),
      React.DOM.input({type: 'text', className: 'form-control', disabled: this.props.disabled, ref: 'input'}),
      this.button('right')
    );
  },

  button: function (side) {
    if (side == this.props.button) {
      return React.DOM.span({className: 'input-group-addon'},
        React.DOM.i({className: 'fa fa-calendar'})
      )
    }

    return undefined;
  },

  componentDidMount: function () {
    if (this.props.disabled) {
      return;
    }

    var node = $(ReactDOM.findDOMNode(this));
    if (this.props.button == 'none') {
      node = $(ReactDOM.findDOMNode(this.refs.input));
    }

    node.datetimepicker({
      locale: this.props.locale,
      format: this.props.format,
      minDate: this.props.minDate,
      maxDate: this.props.maxDate,
      defaultDate: this.state.value
    });

    node.on('dp.change', function (event) {
      this.setState({value: event.date.format(this.props.format)});
    }.bind(this));
  }
});
