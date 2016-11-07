/**
 * Created by lwx on 16/10/21.
 */
/**
 * Created by lwx on 16/10/19.
 */
/**
 * PlaceSelect
 * depend:
 * react
 * light.multiselect
 *
 * @param id
 * @param option
 * displayDetail  [string]  if display,the detail address input shows
 * emitter  [jquery object] use to add event listener
 * @returns {*}
 */

'use strict';

var React = require('react')
  , ReactDOM = require('react-dom');

module.exports = function (id, option) {
  option = option || {};
  option.displayDetail = option.displayDetail || 'display';
  option.emitter = $({});
  return ReactDOM.render(
    React.createElement(PlaceSelect, option),
    document.getElementById(id)
  );
};

var PlaceSelect = React.createClass({
  getInitialState: function () {
    return {}
  },

  render: function () {
    return React.DOM.div({className: 'placesel'},
      React.createElement(Province, this.props),
      React.createElement(City, this.props),
      React.createElement(District, this.props),
      React.DOM.input({
        className: 'detail',
        style: {height: '34px', display: this.props.displayDetail},
        placeholder: '详细地址'
      })
    )
  }
});

var Province = React.createClass({
  render: function () {
    return React.DOM.div({id: 'province', style: {float: 'left', marginRight: '5px'}})
  },

  componentDidMount: function () {
    light.multiselect('province', {
      change: function (selected) {
        this.props.emitter.trigger('changeProvince', selected);
      }.bind(this),
      api: this.props.api,
      id: this.props.id,
      name: this.props.name,
      nonSelectedText: '省',
      condition: {condition: {parent: 'root'}}
    });
  }
});

var City = React.createClass({
  render: function () {
    return React.DOM.div({id: 'city', style: {float: 'left', marginRight: '5px'}})
  },

  componentDidMount: function () {
    this.city = light.multiselect('city', {
      change: function (selected) {
        this.props.emitter.trigger('changeCity', selected);
      }.bind(this),
      nonSelectedText: '市'
    });
    this.props.emitter.on('changeProvince', function (event, selected) {
      this.city.redraw({
        api: this.props.api,
        id: this.props.id,
        name: this.props.name,
        condition: {condition: {parent: selected}}
      });
    }.bind(this));
  }
});

var District = React.createClass({
  render: function () {
    return React.DOM.div({id: 'district', style: {float: 'left', marginRight: '5px'}})
  },
  componentDidMount: function () {
    this.district = light.multiselect('district', {
      change: function (selected) {
      },
      nonSelectedText: '区'
    });
    this.props.emitter.on('changeCity', function (event, selected) {
      this.district.redraw({
        api: this.props.api,
        id: this.props.id,
        name: this.props.name,
        condition: {condition: {parent: selected}}
      });
    }.bind(this));
  }
});
