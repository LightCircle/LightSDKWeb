/**
 * Created by lwx on 16/10/19.
 */
/**
 * MultiSelect
 * depend:
 * react
 * bootstrap
 * bootstrap-multiselect
 *
 * @param id
 * @param option
 * nonSelectedText [string] The text displayed when no option is selected
 * limit    [int] too much options would be displayed.
 * multiple [string] When the multiple attribute of the select is present, the plugin uses checkboxes
 *                   to allow multiple selections.If it is not present, the plugin uses radio buttons
 *                   to allow single selections
 * selectAllText   [string] The text displayed for the select all option.
 * enableFiltering [boolean] Set to true or false to enable or disable the filter.
 * includeSelectAllOption [boolean] Set to true or false to enable or disable the select all option.
 * selectAllJustVisible   [boolean] if true, the select all option does always select only the visible option
 * maxHeight [number]   The maximum height of the dropdown. This is useful when using the plugin with plenty of options.
 * condition  [object]  search condition
 * @returns {*}
 */
'use strict';

var React = require('react')
  , ReactDOM = require('react-dom')
  , net = require('./light.net');

module.exports = function (id, option) {
  option = option || {};
  option.condition = option.condition || {};
  option.nonSelectedText = '请选择' + option.nonSelectedText || '';
  option.numberDisplayed = option.numberDisplayed || 3;
  option.multiple = option.multiple || '';
  return ReactDOM.render(
    React.createElement(MultiSelect, option),
    document.getElementById(id)
  );
};

var MultiSelect = React.createClass({
  render: function () {
    return React.DOM.select({multiple: this.props.multiple, size: '2'})
  },

  componentDidMount: function () {
    var node = $(ReactDOM.findDOMNode(this));
    node.multiselect({
      enableFiltering: this.props.enableFilter,
      includeSelectAllOption: this.props.includeSelectAllOption,
      selectAllJustVisible: false,
      nonSelectedText: this.props.nonSelectedText,
      selectAllText: this.props.selectAllText,
      numberDisplayed: this.props.numberDisplayed,
      maxHeight: this.props.maxHeight,
      onChange: function (element) {
        this.props.change(element.val());
      }.bind(this)
    });
    this.redraw(this.props);
  },

  redraw: function (props) {
    var node = $(ReactDOM.findDOMNode(this));
    if (props.api) {
      net.get(props.api, props.condition, function (err, data) {
        for (var i = 0; i < data.totalItems; i++) {
          data.items[i].value = data.items[i][props.id];
          data.items[i].label = data.items[i][props.name];
        }
        node.multiselect('dataprovider', data.items);
      }.bind(this));
    } else {
      node.multiselect('dataprovider', props.data);
    }
  }
});
