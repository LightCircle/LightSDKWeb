(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["light"] = factory();
	else
		root["light"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 *
	 */

	'use strict';

	var net = __webpack_require__(1)
	  , util = __webpack_require__(2)
	  , tags = __webpack_require__(3)
	  , mask = __webpack_require__(4)
	  , buttongroup = __webpack_require__(5)
	  , selectbox = __webpack_require__(6)
	  , cascade = __webpack_require__(7)
	  , fileselect = __webpack_require__(8)
	  , datetimepicker = __webpack_require__(10)
	  , constant = __webpack_require__(11)
	  , multiselect = __webpack_require__(12)
	  , alertify = __webpack_require__(9)
	  , tree = __webpack_require__(13)
	  , placeselect = __webpack_require__(14)
	  , editable = __webpack_require__(15)
	  ;

	module.exports = {
	  buttongroup: buttongroup,
	  tags: tags,
	  mask: mask,
	  selectbox: selectbox,
	  cascade: cascade,
	  fileselect: fileselect,
	  datetimepicker: datetimepicker,
	  multiselect: multiselect,
	  alertify: alertify,
	  tree: tree,
	  placeselect: placeselect,
	  editable: editable,

	  const: constant,
	  net: net,
	  util: util,

	  get: net.get,
	  post: net.post,
	  put: net.put,
	  delete: net.delete,
	  postData: net.postData,
	  multipart: net.postData,

	  doget: net.get,
	  dopost: net.post,
	  doput: net.put,
	  dodelete: net.delete,
	  dopostData: net.postData

	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 *
	 */

	'use strict';

	var util = __webpack_require__(2)
	  , DATA_TYPE = 'json'
	  , CONTENT_TYPE = 'application/json'
	  , CSRF_KEY = '_csrf';

	/**
	 * GET Method.
	 * @param url
	 * @param data
	 * @param callback
	 */
	exports.get = function (url, data, callback) {

	  if (typeof data == 'function') {
	    callback = data;
	    data = undefined;
	  }

	  $.ajax({
	    type: 'GET',
	    url: url,
	    data: data,
	    dataType: DATA_TYPE,
	    success: function (result) {
	      callback(result.error, result.data);
	    },
	    error: function (err) {
	      console.error('do ajax ' + url + '   error');
	      callback(err);
	    }
	  });
	};

	/**
	 * POST Method.
	 * @param url
	 * @param data
	 * @param callback
	 */
	exports.post = function (url, data, callback) {

	  data.uid = util.uid();

	  $.ajax({
	    url: util.param(url, CSRF_KEY, util.csrf()),
	    type: 'POST',
	    async: true,
	    data: JSON.stringify(data),
	    dataType: DATA_TYPE,
	    contentType: CONTENT_TYPE,
	    processData: false,
	    success: function (result) {
	      callback(result.error, result.data);
	    },
	    error: function (err) {
	      console.error('do ajax ' + url + '   error');
	      callback(err);
	    }
	  });
	};

	/**
	 * PUT Method.
	 * @param url
	 * @param data
	 * @param callback
	 */
	exports.put = function (url, data, callback) {
	  $.ajax({
	    url: util.param(url, CSRF_KEY, util.csrf()),
	    type: 'PUT',
	    async: true,
	    data: JSON.stringify(data),
	    dataType: DATA_TYPE,
	    contentType: CONTENT_TYPE,
	    success: function (result) {
	      callback(result.error, result.data);
	    }, error: function (err) {
	      console.error('do ajax ' + url + '   error');
	      callback(err);
	    }
	  });
	};

	/**
	 * DELETE Method.
	 * @param url
	 * @param data
	 * @param callback
	 */
	exports.delete = function (url, data, callback) {
	  $.ajax({
	    url: util.param(url, CSRF_KEY, util.csrf()),
	    type: 'DELETE',
	    async: true,
	    data: JSON.stringify(data),
	    dataType: DATA_TYPE,
	    contentType: CONTENT_TYPE,
	    processData: false,
	    success: function (result) {
	      callback(result.error, result.data);
	    },
	    error: function (err) {
	      console.error('do ajax ' + url + '   error');
	      callback(err);
	    }
	  });
	};

	/**
	 * POST FormData.
	 * @param url
	 * @param params QueryParams
	 * @param data FormData
	 * @param callback
	 * @param progress
	 */
	exports.postData = function (url, params, data, callback, progress) {

	  data.append("uid", util.uid());

	  params._csrf = decodeURIComponent(util.csrf());
	  url += '?' + $.param(params);

	  $.ajax({
	    url: url,
	    type: "POST",
	    async: true,
	    data: data,
	    dataType: DATA_TYPE,
	    contentType: false,
	    processData: false,
	    xhr: function () {
	      var XHR = $.ajaxSettings.xhr();
	      if (XHR.upload) {
	        XHR.upload.addEventListener('progress', function (event) {
	          if (progress) {
	            progress(parseInt(event.loaded / event.total * 10000) / 100);
	          }
	        }, false);
	      }
	      return XHR;
	    },
	    success: function (result) {
	      callback(result.error, result.data);
	    },
	    error: function (err) {
	      console.error('do ajax ' + url + '   error');
	      callback(err);
	    }
	  });
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Util.
	 */

	'use strict';

	exports.csrf = function () {
	  return encodeURIComponent(document.getElementById('_csrf').value);
	};

	exports.uid = function () {
	  return document.getElementById('userid').value
	};

	exports.param = function (url, key, val) {
	  var separator = (url.indexOf('?') === -1) ? '?' : '&';
	  return url + separator + key + '=' + val;
	};

	exports.guid4 = function () {
	  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};

	exports.cookie = function (key) {
	  return decodeURIComponent(
	    document.cookie.replace(new RegExp("(?:^|.*;\\s*)"
	      + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1")
	  );
	};

	exports.shiftLang = function (lang) {
	  document.cookie = "light.lang=" + encodeURIComponent(lang) + ";path=/";
	};

	exports.save = function (scope, key, val) {
	  if (!window.localStorage) {
	    return;
	  }

	  var storage = window.localStorage.getItem(scope);
	  storage = storage ? JSON.parse(storage) : {};

	  storage[key] = val;
	  window.localStorage.setItem(scope, JSON.stringify(storage));
	};

	exports.load = function (scope, key) {
	  if (!window.localStorage) {
	    return undefined;
	  }

	  var storage = window.localStorage.getItem(scope);
	  if (storage) {
	    return JSON.parse(storage)[key];
	  }

	  return undefined;
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Mask.
	 *
	 * @param id
	 * @param option
	 *   timeout  [number] Mask The maximum time to display (second). default: 60 sec.
	 * @returns {*}
	 */

	'use strict';

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

	  show: function () {
	    this.state.counter = this.state.counter + 1;
	    this.setState({counter: this.state.counter});

	    clearTimeout(this.timer);
	    this.timer = setTimeout(function () {
	      this.hide();
	    }.bind(this), this.props.timeout);
	  },

	  hide: function () {
	    if (this.state.counter < 1) {
	      clearTimeout(this.timer);
	    }

	    this.setState({counter: this.state.counter - 1});
	  }
	});


/***/ },
/* 5 */
/***/ function(module, exports) {

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

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

	var net = __webpack_require__(1);

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
	      page: 0
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
	    this.props.condition = this.props.condition || {};
	    this.props.condition.condition = this.props.condition.condition || {};
	    this.props.condition.condition['keyword'] = keyword;
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

	    this.props.condition = this.props.condition || {};
	    var condition = {
	      skip: this.state.page * this.state.show,
	      limit: this.state.show,
	      condition: this.props.condition.condition
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
	      searching: false, keyword: ''
	    };
	  },
	  render: function () {

	    style.searchinput.visibility = this.state.searching ? 'visible' : 'hidden';
	    style.title.visibility = this.state.searching ? 'hidden' : 'visible';

	    return React.DOM.div({className: 'modal-header'},
	      React.DOM.section({style: style.search},
	        React.DOM.input({
	          className: 'form-control', ref: 'input',
	          onChange: this.change,
	          onKeyDown: this.keyDown,
	          style: style.searchinput,
	          value: this.state.keyword
	        }),
	        this.search(),
	        React.DOM.h4({className: 'modal-title', style: style.title}, this.props.title)
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
	      return this.setState({searching: false, keyword: ''});
	    }

	    this.setState({searching: true});
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

	    return this.props.data.map(function (row) {
	      return React.DOM.tr({}, this.icon(row), this.col(row), this.check(row));
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
	    return this.props.field.map(function (col) {
	      return React.DOM.td({style: {border: '0'}, value: row[this.props.uk], onClick: this.click}, row[col])
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

/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 *
	 */

	'use strict';

	module.exports = function (id, option) {

	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * FileSelect.
	 *
	 * @param id
	 * @param option
	 *   accept   [string]   Allowed file types (.gif, .jpg, .png). default: *
	 *   multiple [boolean]  Allows to select multiple files at once. default: false
	 *   size     [number]   Allowed file size. default: 5M
	 *   url      [string]   Upload URL
	 *   nometa   [boolean]  Whether to create META information, the default is to create
	 *   check    [function] Custom validation function,
	 *                       if you need to upload files to do a special check, you can expand the method
	 *   error    [function] When a file upload exception occurs, the function is called
	 *   success  [function] When the upload file is success, call the function
	 *   progress [function] Upload progress
	 *   data     [object]   The custom information that is saved with the file
	 *     extend      [object] extra information
	 *     type        [string] custom file type
	 *     description [string] file description
	 *     path        [string] file logical path
	 *
	 * @returns {*}
	 */

	'use strict';

	var net = __webpack_require__(1)
	  , alertify = __webpack_require__(9);

	module.exports = function (id, option) {

	  option = option || {};
	  option.accept = option.accept || '*';
	  option.button = option.button || 'right';
	  option.size = option.size || '5242880';
	  option.url = option.url || (option.nometa ? '/api/file/upload' : '/api/file/add');

	  option.check = function () {
	  };
	  option.success = function () {
	  };
	  option.progress = function (val) {
	    console.log(val);
	  };
	  option.error = function (error) {
	    alertify.error(error);
	  };

	  return ReactDOM.render(
	    React.createElement(FileSelect, option),
	    document.getElementById(id)
	  );
	};

	var FileSelect = React.createClass({
	  getInitialState: function () {
	    return {}
	  },

	  render: function () {
	    return React.DOM.div({className: 'input-group'},
	      this.button('left'),
	      React.DOM.input({
	        type: 'text',
	        className: 'form-control',
	        readOnly: true,
	        style: {backgroundColor: '#fff'},
	        onClick: this.click
	      }),
	      this.input(),
	      this.button('right')
	    );
	  },

	  button: function (side) {
	    if (side == this.props.button) {
	      return React.DOM.span({className: 'input-group-btn', style: {backgroundColor: '#fff'}},
	        React.DOM.button({className: 'btn btn-default', type: 'button', onClick: this.click},
	          React.DOM.i({className: 'fa fa-folder-open'}),
	          React.DOM.span({}, 'Choose file')
	        )
	      );
	    }

	    return undefined;
	  },

	  input: function () {

	    return React.DOM.input({
	      style: {display: 'none'},
	      accept: this.props.accept,
	      multiple: this.props.multiple,
	      onChange: this.change,
	      type: 'file',
	      ref: 'file'
	    });
	  },

	  change: function (event) {
	    var files = event.target.files;

	    // No files selected
	    if (!files || files.length <= 0) {
	      return false;
	    }

	    // Create form data
	    var fd = new FormData(), size = 0;
	    for (var i = 0; i < files.length; i++) {
	      var file = files[i];

	      size += file.size;
	      fd.append('files', file);
	    }

	    // Check file size
	    if (size > this.props.size) {
	      return this.props.error('The file is too large');
	    }

	    // Upload file
	    net.postData(this.props.url, {data: this.props.data}, fd, function (err, result) {
	      if (err) {
	        return this.props.error('error');
	      }

	      this.props.success(result);
	    }.bind(this), this.props.progress);
	  },

	  click: function () {
	    $(ReactDOM.findDOMNode(this.refs.file)).trigger('click');
	  }

	});


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Alertify.
	 *
	 * Depend:
	 *   alertify
	 *
	 * @returns {object}
	 */

	'use strict';

	module.exports = {
	  info: function (message) {
	    alertify.success(message);
	    console.info(message);
	  },

	  error: function (message) {
	    alertify.error(message);
	    console.error(message);
	  },

	  warn: function (message) {
	    alertify.log(message);
	    console.warn(message);
	  },

	  confirm: function (message, fn) {
	    alertify.confirm(message, fn);
	  }
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

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


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Constant.
	 */

	'use strict';

	module.exports = {
	  TYPE_AUDIO: "audio/*",
	  TYPE_IMAGE: "image/*",
	  TYPE_VIDEO: "video/*",
	  TYPE_PDF: "application/pdf",
	  TYPE_CSV: "text/csv",
	  TYPE_TEXT: "text/plain",
	  TYPE_EXCEL: "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

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
	var net = __webpack_require__(1);

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


/***/ },
/* 13 */
/***/ function(module, exports) {

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


/***/ },
/* 14 */
/***/ function(module, exports) {

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
	      condition: {condition: {parent: 'root'}},
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


/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * Created by lwx on 16/10/24.
	 */
	/**
	 *   editable.
	 *
	 * can be used functions
	 *   toggle:          Toggles enabled / disabled state of editable element.
	 *   getSingleValue:  Returns current values of editable elements.
	 *                    When param isSingle is set to true -
	 *                    it is supposed you have single element and will return value of editable instead of object.
	 *   getValue:        Returns current values of editable elements.
	 *
	 * @param id
	 * @param option
	 * pk        [string|object|function]   Primary key of editable object.
	 * clear     [boolean]                  Whether to show clear button
	 * disabled  [boolean]                  Sets disabled state of editable
	 * combodate [object]                   Combodate input - dropdown date and time picker.
	 * source    [string|array|object|function]       Source data for list.
	 * type      [string]                   type of input
	 * name      [string]                   name of field
	 * title     [string]
	 * url       [string|function]          Url for submit
	 * params    [object|function]           Additional params for submit
	 * emptytext [string]                  Text shown when element is empty.
	 * ajaxOptions[object]                  Additional options for submit ajax request
	 * value     [string]                  initial value
	 * placement [string]                  Placement of container relative to element. Can be top|right|bottom|left. Not used for inline container.
	 * rows     [integer]                   Number of rows in textarea
	 * success  [function]                 Success callback
	 * error    [function]                 callback applied with parameter containing field names and errors
	 * validate [function]                 Function for client-side validation
	 * display  [function|boolean]         Callback to perform custom displaying of value in element's text.
	 * tpl      [string]                    HTML template of input. Normally you should not change it.
	 * format   [string]                  Format used for sending value to server. Also applied when converting date from data-value attribute.
	 * viewformat [string]                 Format used for displaying date
	 * template   [string]                 Template used for displaying dropdowns.
	 * @returns {*}
	 */
	'use strict';

	module.exports = function (id, option) {
	  option = option || {};

	  return ReactDOM.render(
	    React.createElement(Editable, option),
	    document.getElementById(id)
	  );
	};

	var Editable = React.createClass({

	  render: function () {
	    return React.DOM.a();
	  },

	  /**
	   * Toggles enabled / disabled state of editable element.
	   */
	  toggle: function () {
	    if (this.timeout) {
	      clearTimeout(this.timeout);
	    }

	    this.timeout = setTimeout(function () {
	      this.node.editable('toggleDisabled');
	    }.bind(this), 250);
	  },

	  componentDidMount: function () {
	    var node = $(ReactDOM.findDOMNode(this));
	    this.node = node.editable({
	      disabled: this.props.disabled,
	      type: this.props.type,
	      pk: this.props.pk,
	      name: this.props.name,
	      title: this.props.title,
	      source: this.props.source,
	      url: this.props.url,
	      ajaxOptions: this.props.ajaxOptions,
	      emptytext: this.props.emptytext,
	      value: this.props.value,
	      clear: this.props.clear,
	      rows: this.props.rows,
	      params: this.props.params,
	      success: this.props.success,
	      error: this.props.error,
	      validate: this.props.validate,
	      placement: this.props.placement,
	      display: this.props.display,
	      combodate: this.props.combodate,
	      tpl: this.props.tpl,
	      format: this.props.format,
	      viewformat: this.props.viewformat,
	      template: this.props.template
	    });

	    /**
	     * Fired when new value was submitted
	     */
	    this.node.on('save', function (e, params) {
	      node.editable('toggleDisabled');
	    });
	  },

	  /**
	   * Returns current values of editable elements.
	   *  When param isSingle is set to true
	   * it is supposed you have single element and will return value of editable instead of object.
	   */
	  getSingleValue: function () {
	    return this.node.editable('getValue', true);
	  },

	  /**
	   *Returns current values of editable elements.  return object
	   */
	  getValue: function () {
	    return this.node.editable('getValue');
	  }
	});

/***/ }
/******/ ])
});
;