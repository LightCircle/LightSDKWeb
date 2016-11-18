/**
 * @module MultiSelect
 * @desc depend.
 * <ul>
 *   <li>react</li>
 *   <li>bootstrap</li>
 *   <li>bootstrap-multiselect</li>
 * </ul>
 * @param id
 * @param option
 * @param {string} option.api - Provide data interface
 * @param {string} option.id - correspond to value
 * @param {string} option.name - correspond to label
 * @param {object} option.data - Provide data
 * @param {string} option.nonSelectedText - The text displayed when no option is selected
 * @param {int} option.numberDisplayed - too much options would be displayed.
 * @param {string} option.multiple - When the multiple attribute of the select is present, the plugin uses checkboxes
 *                   to allow multiple selections.If it is not present, the plugin uses radio buttons
 *                   to allow single selections
 * @param {string} option.selectAllText - The text displayed for the select all option.
 * @param {boolean} option.enableFiltering - Set to true or false to enable or disable the filter.
 * @param {boolean} option.includeSelectAllOption - Set to true or false to enable or disable the select all option.
 * @param {boolean} option.selectAllJustVisible - If true, the select all option does always select only the visible option
 * @param {number} option.maxHeight - The maximum height of the dropdown. This is useful when using the plugin with plenty of options.
 * @param {object} option.condition - search condition
 * @param {boolean} option.enableClickableOptGroups - If set to true, optgroup's will be clickable,
 *                                     allowing to easily select multiple options belonging to the same group.
 * @param {function} option.change - change event
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
  option.change = option.change || function () {
    };
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
      enableClickableOptGroups: this.props.enableClickableOptGroups,
      onChange: function (element) {
        if (element) {
          this.props.change(element.val());
        }
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
      if (props.data) {
        node.multiselect('dataprovider', props.data);
      }
    }
  }
});
