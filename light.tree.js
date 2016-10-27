/**
 * Tree.
 *
 * can be used functions
 *   open             : Open the node and the parent node.
 *   search           : Retrieves the node.
 *   select           : Select a node.
 *   reload           : Reload all tree.
 *   getValue         : Gets the selected node.
 *
 * @param id
 * @param option
 *   width            [number]
 *   wholerow         [boolean]
 *   checkbox         [boolean]
 *   icon             [string | object]
 *                      exp. icon: 'glyphicon glyphicon-folder-open'
 *                      exp. icon: 'fa fa-folder-o'
 *                      exp. icon: './static/images/tree_icon.png'
 *   data             [array]   data json format.
 *     id             [string]  required
 *     parent         [string]  required
 *     text           [string]  node text
 *     icon           [string]  string for custom icon.
 *     state.opened   [boolean]
 *     state.disabled [boolean]
 *     state.selected [boolean]
 *   onChange         [function]
 *
 *   api              [string] TODO:
 *   condition        [object] TODO:
 *   id               [string] TODO:
 *   text             [string] TODO:
 *
 * @returns {*}
 */

'use strict';

var React = require('react')
  , ReactDOM = require('react-dom');

module.exports = function (id, option) {

  option = option || {};

  option.wholerow = (option.wholerow == undefined) ? false : option.wholerow;
  option.checkbox = (option.checkbox == undefined) ? false : option.checkbox;
  option.onChange = option.onChange || function () {
    };
  option.onLoaded = option.onLoaded || function () {
    };

  return ReactDOM.render(
    React.createElement(Tree, option),
    document.getElementById(id)
  );
};

var Tree = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data
    }
  },

  render: function () {
    return React.DOM.div({style: {width: this.props.width}});
  },

  componentDidMount: function () {

    // set tree options
    var plugins = ['types', 'changed', 'search'];
    if (this.props.wholerow) {
      plugins.push('wholerow');
    }
    if (this.props.checkbox) {
      plugins.push('checkbox');
    }

    // set icons
    var icons = {default: {icon: 'fa fa-folder-o'}};
    if (typeof this.props.icon == 'string') {
      icons.default.icon = this.props.icon;
    }

    // init tree
    var node = $(ReactDOM.findDOMNode(this));
    this.node = node.jstree({
      core: {
        data: this.props.data,
        themes: {name: 'proton', responsive: true}
      },
      types: icons,
      plugins: plugins
    });

    // tree node selection state changes
    this.node.on('changed.jstree', function (e, data) {
      if (data.action == 'select_node') {
        var selection = this.node.jstree('get_selected')
          , node = data.node.id;
        this.props.onChange(node, selection);
      }
    }.bind(this));

    // tree loaded
    this.node.on('loaded.jstree', function (e, a) {
      this.props.onLoaded();
    }.bind(this));
  },

  /**
   * Reload tree data
   * @param data
   */
  reload: function (data) {
    this.node.jstree(true).settings.core.data = data;
    this.node.jstree(true).refresh();
  },

  /**
   * Select a specified node
   * @param id
   * @param keep {boolean} Whether to clear the previous selected state
   */
  select: function (id, keep) {

    // clears the previously selected node
    if (!keep) {
      this.node.jstree('get_selected').forEach(function (id) {
        this.node.jstree('deselect_node', this.node.jstree('get_node', id));
      }.bind(this));
    }

    // select node
    this.node.jstree('select_node', this.node.jstree('get_node', id));
  },

  /**
   * Open the node and all the parent nodes of the node
   * @param id
   */
  open: function (id) {
    var current = this.node.jstree("get_node", id);
    this.node.jstree('open_node', current);

    var parent = this.node.jstree("get_parent", current);
    while (parent) {
      this.node.jstree('open_node', parent);
      parent = this.node.jstree("get_parent", parent);
    }
  },

  /**
   * Search the tree node.
   * @param keyword
   */
  search: function (keyword) {

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(function () {
      this.node.jstree(true).search(keyword);
    }.bind(this), 250);
  },

  /**
   * Gets the selected node.
   * @returns {*}
   */
  getValue: function () {
    return this.node.jstree('get_selected');
  }
});
