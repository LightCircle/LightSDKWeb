/**
 * Tags.
 *
 * @param id
 * @param option
 * @returns {*}
 */

'use strict';

module.exports = function (id, option) {
  option = option || {};
  option.data = option.data || [];

  return ReactDOM.render(
    React.createElement(Tags, {data: option.data, value: option.value, disabled: option.disabled}),
    document.getElementById(id)
  );
};


var style = {
  ul: {
    listStyle: 'none'
  },
  li: {
    display: 'inline-block'
  },
  a: {
    color: '#555',
    background: '#f7f7f7',
    fontSize: '13px',
    padding: '2px 7px',
    margin: '0 3px 6px 0',
    display: 'inline-block',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  a_active: {
    color: '#fff',
    background: '#5bc0de',
    fontSize: '13px',
    padding: '2px 7px',
    margin: '0 3px 6px 0',
    display: 'inline-block',
    textDecoration: 'none',
    cursor: 'pointer'
  }
};


var Tags = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data,
      value: this.props.value || [],
      disabled: this.props.disabled,
      hover: false
    }
  },

  render: function () {

    return React.DOM.ul({className: 'list-unstyled blog-tags', style: style.ul},
      this.props.data.map(function (item) {
        return React.DOM.li({style: style.li},
          React.DOM.a({
              style: this.state.value.indexOf(item.value) < 0 ? style.a : style.a_active,
              onClick: this.click,
              onMouseOver: this.mouseOver,
              onMouseOut: this.mouseOut,
              value: item.value
            },
            React.DOM.i({className: 'fa fa-tags'}),
            item.title
          )
        )
      }.bind(this))
    );
  },

  click: function () {
    var current = event.target.getAttribute('value');

    if (this.state.value.indexOf(current) < 0) {
      this.state.value.push(current);
    } else {
      this.state.value = this.state.value.filter(function (val) {
        return val != current;
      });
    }

    this.setState({value: this.state.value});
    this.onClick(current);
  },

  getValue: function () {
    return this.state.value;
  },

  onClick: function (value) {
  }

});