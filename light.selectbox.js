/**
 * Select Box.
 *
 * Depend:
 *  react
 *  bootstrap
 *  fontawesome
 *
 * React Element Structure:
 *   modal
 *    modal-dialog
 *      modal-content
 *        modal-header
 *          title & search
 *        modal-body
 *          grid
 *        modal-footer
 *          pagination
 *
 * @param id
 * @param option
 *   type       [string]  预设类型: user group category authority role tag route function board structure
 *   api        [string]  检索数据用API
 *   condition  [object]  检索条件
 *   value      [array]   选中的项目, 如果指定了uk, 那么value应该是uk值列表
 *   uk         [string]  识别选中用的字段名称 default: _id
 *   name       [string]  确定按钮时, 可以返回选中项目的name
 *   field      [array]   显示的列名称 default: ['_id']
 *   single     [boolean] 只允许选择一个
 *   icon       [string]  显示的图标
 *   search     [boolean] 是否显示检索按钮 default: true
 *   pagination [boolean] 是否显示翻页按钮 default: true
 *   show       [int]     一页显示的行数 default: 10
 *   data       [array]   允许不使用api, 直接提供数据显示选择框 - TODO
 *
 * @returns {*}
 */

'use strict';

var React = require('react')
  , ReactDOM = require('react-dom')
  , net = require('./light.net');

module.exports = function (id, option) {

  option = option || {};

  if (option.type && CONST.RESERVE[option.type]) {
    var reserve = CONST.RESERVE[option.type];
    option.api = reserve.api;
    option.uk = reserve.uk;
    option.name = reserve.name;
    option.icon = reserve.icon;
    option.field = reserve.field;
    option.title = reserve.title;
  }

  option.value = option.value || [];
  option.uk = option.uk || '_id';
  option.field = option.field || ['_id', 'name'];
  option.title = option.title || 'Select';
  option.show = option.show || 10;
  option.emitter = $({});
  option.search = option.search == undefined ? true : option.search;
  option.pagination = option.pagination == undefined ? true : option.pagination;
  option.condition = option.condition || {condition: {}};

  return ReactDOM.render(
    React.createElement(SelectBox, option),
    document.getElementById(id)
  );
};

var style = {
  search: {
    position: 'relative',
    fontSize: '18px'
  },
  searchinput: {
    paddingLeft: '20px',
    paddingRight: '20px',
    borderRadius: '20px',
    visibility: 'hidden'
  },
  searchbutton: {
    position: 'absolute',
    right: '10px',
    top: '5px',
    fontSize: '15px',
    cursor: 'pointer'
  },
  title: {position: 'absolute', top: '5px'}
};

var SelectBox = React.createClass({

  getInitialState: function () {

    this.props.emitter.on(CONST.EVENT.CHANGE, this.change);
    this.props.emitter.on(CONST.EVENT.SEARCH, this.search);
    this.props.emitter.on(CONST.EVENT.PREV, this.prev);
    this.props.emitter.on(CONST.EVENT.NEXT, this.next);
    this.props.emitter.on(CONST.EVENT.OK, this.ok);
    this.props.emitter.on(CONST.EVENT.CANCEL, this.cancel);

    return {
      data: this.props.data,
      value: this.props.value,
      uk: this.props.uk,
      field: this.props.field,
      title: this.props.title,
      show: this.props.show,
      single: this.props.single,
      search: this.props.search,
      pagination: this.props.pagination,
      icon: this.props.icon,
      emit: this.emit,
      total: 0,
      page: 0,
      condition: this.props.condition
    }
  },

  render: function () {
    return React.DOM.div({className: 'modal fade'},
      React.DOM.div({className: 'modal-dialog'},
        React.DOM.div({className: 'modal-content'},
          React.createElement(Header, this.state),
          React.createElement(Body, this.state),
          React.createElement(Footer, this.state)
        )
      )
    );
  },

  emit: function (type, data, node) {
    this.props.emitter.trigger(type, [data, node]);
  },

  /**
   * selection change event
   * @param event
   * @param value
   */
  change: function (event, value) {

    if (this.state.value.indexOf(value) < 0) {
      this.state.value.push(value);
    } else {
      this.state.value = this.state.value.filter(function (val) {
        return val != value;
      });
    }

    this.setState({value: this.state.value});
  },

  /**
   * search event
   * @param event
   * @param keyword
   */
  search: function (event, keyword) {
    this.state.condition.condition['keyword'] = keyword;
    this.show();
  },

  /**
   * go to the next page
   */
  next: function () {
    this.state.page = this.state.page + 1;
    this.setState({page: this.state.page});
    this.show();
  },

  /**
   * go to the previous page
   */
  prev: function () {
    this.state.page = this.state.page - 1;
    this.setState({page: this.state.page});
    this.show();
  },

  /**
   * done event
   */
  ok: function () {
    $(ReactDOM.findDOMNode(this)).modal('hide');
    if (this.props.ok) {
      this.props.ok(this);
    }
  },

  /**
   * cancel event
   */
  cancel: function () {
    $(ReactDOM.findDOMNode(this)).modal('hide');
    if (this.props.cancel) {
      this.props.cancel(this);
    }
  },

  show: function () {
    var condition = {
      skip: this.state.page * this.state.show,
      limit: this.state.show,
      condition: this.state.condition.condition
    };

    net.get(this.props.api, condition, function (err, data) {
      this.setState({data: data.items, total: data.totalItems});
      $(ReactDOM.findDOMNode(this)).modal('show');
    }.bind(this));

    return this;
  },

  getValue: function () {
    return this.state.value;
  },

  getName: function () {

    if (!this.props.name) {
      return this.state.value;
    }

    var result = [];
    this.state.data.forEach(function (item) {
      if (this.state.value.indexOf(item[this.state.uk]) >= 0) {
        result.push(item[this.props.name]);
      }
    }.bind(this));

    return result;
  },

  getData: function () {
    var result = [];
    this.state.data.forEach(function (item) {
      if (this.state.value.indexOf(item[this.state.uk]) >= 0) {
        result.push(item);
      }
    }.bind(this));

    return result;
  }

});

var Header = React.createClass({
  getInitialState: function () {
    return {
      searching: false, keyword: '',
      searchinput: style.searchinput,
      title: style.title
    };
  },
  render: function () {

    return React.DOM.div({className: 'modal-header'},
      React.DOM.section({style: style.search},
        React.DOM.input({
          className: 'form-control', ref: 'input',
          onChange: this.change,
          onKeyDown: this.keyDown,
          style: this.state.searchinput,
          value: this.state.keyword
        }),
        this.search(),
        React.DOM.h4({className: 'modal-title', style: this.state.title}, this.props.title)
      )
    );
  },

  search: function () {
    if (!this.props.search) {
      return undefined;
    }

    return React.DOM.a({style: style.searchbutton, onClick: this.click},
      React.DOM.i({className: this.icon()})
    );
  },

  icon: function () {
    return this.state.searching ? 'fa fa-close' : 'fa fa-search';
  },

  change: function (event) {
    this.setState({keyword: event.target.value});
  },

  keyDown: function (event) {
    if (event.keyCode == CONST.KEY.ENTER) {
      event.preventDefault();
      this.props.emit(CONST.EVENT.SEARCH, this.state.keyword);
    }
  },

  click: function () {
    if (this.state.searching) {
      this.props.emit(CONST.EVENT.SEARCH);
      return this.setState({
        searching: false,
        keyword: '',
        searchinput: style.searchinput,
        title: style.title
      });
    }

    this.setState({
      searching: true,
      searchinput: {visibility: 'visible'},
      title: {visibility: 'hidden'}
    });
  }
});

var Body = React.createClass({
  render: function () {
    return React.DOM.div({className: 'modal-body'},
      React.DOM.table({className: 'table table-hover table-striped'},
        React.DOM.tbody({}, this.row())
      )
    );
  },

  row: function () {
    if (!this.props.data) {
      return undefined;
    }

    return this.props.data.map(function (row, i) {
      return React.DOM.tr({key: i}, this.icon(row), this.col(row), this.check(row));
    }.bind(this))
  },

  icon: function (row) {
    if (!this.props.icon) {
      return undefined;
    }

    var uk = row[this.props.uk];
    return React.DOM.td({style: {width: '5%', border: '0'}, value: uk, onClick: this.click},
      React.DOM.i({className: 'fa fa-' + this.props.icon, value: uk})
    );
  },

  col: function (row) {
    return this.props.field.map(function (col, i) {
      return React.DOM.td({style: {border: '0'}, value: row[this.props.uk], onClick: this.click, key: i}, row[col])
    }.bind(this));
  },

  check: function (row) {

    var uk = row[this.props.uk]
      , checked = this.props.value.indexOf(uk) >= 0;

    return React.DOM.td({style: {width: '6%', border: '0'}, value: uk, onClick: this.click},
      React.DOM.i({className: checked ? 'fa fa-check-square-o' : 'fa fa fa-square-o', value: uk})
    );
  },

  click: function (event) {
    this.props.emit(CONST.EVENT.CHANGE, event.target.getAttribute('value'));
  }
});

var Footer = React.createClass({
  render: function () {

    return React.DOM.div({className: 'modal-footer'},
      this.pagination(),
      React.DOM.button({className: 'btn btn-default btn-sm', onClick: this.cancel}, '取消'),
      React.DOM.button({className: 'btn btn-primary btn-sm', onClick: this.ok}, '确定')
    );
  },

  pagination: function () {
    if (!this.props.pagination) {
      return undefined;
    }

    var isFirst = this.props.page == 0
      , isLast = this.props.page == Math.floor(this.props.total / this.props.show);

    return React.DOM.div({style: {float: 'left'}},
      React.DOM.button({className: 'btn btn-default btn-sm', onClick: this.prev, disabled: isFirst},
        React.DOM.i({className: 'fa fa-caret-left'})
      ),
      React.DOM.button({className: 'btn btn-default btn-sm', onClick: this.next, disabled: isLast},
        React.DOM.i({className: 'fa fa-caret-right'})
      ),
      this.number()
    );
  },

  number: function () {
    var start = this.props.page * this.props.show + 1
      , end = this.props.page * this.props.show + this.props.show;

    end = end > this.props.total ? this.props.total : end;
    return React.DOM.span({style: {color: '#ccc', fontSize: '10px'}},
      '（' + start + ' ~ ' + end + ' / ' + this.props.total + '）'
    );
  },

  prev: function () {
    this.props.emit(CONST.EVENT.PREV);
  },

  next: function () {
    this.props.emit(CONST.EVENT.NEXT);
  },

  ok: function () {
    this.props.emit(CONST.EVENT.OK);
  },

  cancel: function () {
    this.props.emit(CONST.EVENT.CANCEL);
  }
});

var CONST = {
  EVENT: {
    CHANGE: 'CHANGE',
    SEARCH: 'SEARCH',
    PREV: 'PREV',
    NEXT: 'NEXT',
    OK: 'OK',
    CANCEL: 'CANCEL'
  },
  KEY: {
    BACKSPACE: 8,
    DELETE: 46,
    ENTER: 13
  },
  RESERVE: {
    user: {
      api: '/api/user/list',
      uk: '_id',
      name: 'name',
      icon: 'user',
      field: ['id', 'name'],
      title: 'User'
    },
    group: {
      api: '/api/group/list',
      uk: '_id',
      name: 'name',
      icon: 'group',
      field: ['name'],
      title: 'Group'
    },
    category: {
      api: '/api/category/list',
      uk: '_id',
      name: 'name',
      icon: 'bookmark',
      field: ['name', 'categoryId'],
      title: 'Category'
    },
    authority: {
      api: '/api/authority/list',
      uk: '_id',
      name: 'name',
      icon: 'lock',
      field: ['name', 'description'],
      title: 'Authority'
    },
    role: {
      api: '/api/role/list',
      uk: '_id',
      name: 'name',
      icon: 'lock',
      field: ['name', 'description'],
      title: 'Role'
    },
    tag: {
      api: '/api/tag/list',
      uk: '_id',
      name: 'name',
      icon: 'tag',
      field: ['name'],
      title: 'Tag'
    },
    route: {
      api: '/api/route/list',
      uk: '_id',
      name: 'url',
      icon: 'road',
      field: ['url', 'description'],
      title: 'Route'
    },
    function: {
      api: '/api/function/list',
      uk: '_id',
      name: 'url',
      icon: 'list-ul',
      field: ['url', 'description'],
      title: 'Function'
    },
    board: {
      api: '/api/board/list',
      uk: '_id',
      name: 'api',
      icon: 'bars',
      field: ['api', 'description'],
      title: 'Board'
    },
    structure: {
      api: '/api/structure/list',
      uk: '_id',
      name: 'schema',
      icon: 'database',
      field: ['schema', 'description'],
      title: 'Structure'
    }
  }
};