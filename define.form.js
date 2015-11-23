/**
 * @file 表单
 * @module define.form
 * @author r2space@gmail.com
 * @version 1.0.0
 */

"use strict";

var isNode = (typeof module !== "undefined" && module.exports);
if (isNode) {
  var React   = require("react")
    , _       = light.util.underscore
    , Widget  = require('./define.widget')
}

/**
 * 放置组件的单元格, 允许拖拽添加, 拖拽移动, 允许横向扩展
 */
Widget.Section = React.createClass({
  render: function () {
    return React.DOM.section({
        className: this.className(), style: {backgroundColor: this.backgroundColor()},
        onClick: this.onClick,
        onMouseOut: this.onMouseOut,
        onMouseOver: this.onMouseOver
      },
      React.DOM.label({className: "label"}, this.props.data.title), this.widget(), this.expander()
    );
  },

  className: function () {
    var name = "col-sm-" + (3 * this.props.data.colSpan);

    if (this.props.option.draft) {
      name = name + " widget";
    }

    return name;
  },

  backgroundColor: function () {
    if (!this.props.option.draft) {
      return "#ffffff";
    }

    var isRow = this.props.data.row == this.props.option.selected[0]
      , isCol = this.props.data.col == this.props.option.selected[1];

    return isRow && isCol ? "#edf9ff" : "#fafcfd";
  },

  /**
   * 横向扩展组件, 光标移动到边缘时有右向剪头出现
   * @returns {React.DOM}
   */
  expander: function () {

    if (!this.props.option.draft) {
      return null;
    }

    if (!this.props.data.type) {
      return null;
    }

    if (!this.sibling() || this.sibling().type) {
      return null;
    }

    return React.DOM.div({className: "ui-resizable-handle ui-resizable-e", onClick: this.onExpand});
  },

  onExpand: function () {
    this.props.emit(Widget.EVENT.EXPAND, {
      col: this.props.data.col, colSpan: this.props.data.colSpan, row: this.props.data.row
    }, ReactDOM.findDOMNode(this));
  },

  componentDidMount: function () {
    this.droppable();
    this.draggable();
  },

  componentDidUpdate: function () {
    this.droppable();
    this.draggable();
  },

  droppable: function () {
    if (!this.props.option.draft) {
      return;
    }

    if (!this.props.option.accept) {
      return;
    }

    var node = $(ReactDOM.findDOMNode(this));
    if (!node.droppable("instance")) {
      node.droppable({
        accept: "#" + this.props.option.accept + " button, #" + this.props.option.node + " section",
        activeClass: "widget-active",
        hoverClass: "widget-hover",
        drop: function (event, ui) {

          var type = $(ui.draggable).attr("name");

          // 添加组件
          if (type) {
            return this.props.emit(Widget.EVENT.ADD, {
              col: this.props.data.col,
              row: this.props.data.row,
              type: type
            }, ReactDOM.findDOMNode(this));
          }

          // 移动组件
          return this.props.emit(Widget.EVENT.MOVE, {
            col: this.props.data.col,
            row: this.props.data.row,
            rowSpan: this.props.data.rowSpan,
            colSpan: this.props.data.colSpan,
            source: Widget.temporal
          }, ReactDOM.findDOMNode(this));
        }.bind(this)
      });
    }

    node.droppable(this.props.data.type ? "disable" : "enable");
  },

  draggable: function () {
    if (!this.props.option.draft) {
      return;
    }

    var node = $(ReactDOM.findDOMNode(this));

    if (!node.draggable("instance")) {
      node.draggable({
        revert: "invalid", opacity: 0.7,
        helper: function () {

          // 删除reactid, 避免reactid重复错误
          node = node.clone().css({"z-index": "10"}).removeAttr("data-reactid");
          node.find("*").each(function (index, children) {
            $(children).removeAttr("data-reactid");
          });

          return node;
        },
        start: function () {
          Widget.temporal = {
            col: this.props.data.col,
            row: this.props.data.row,
            colSpan: this.props.data.colSpan,
            rowSpan: this.props.data.rowSpan
          };
        }.bind(this)
      });
    }

    node.draggable(this.props.data.type ? "enable" : "disable");
  },

  sibling: function () {
    return _.find(this.props.option.parents, function (item) {
      return item.col > this.props.data.col;
    }.bind(this));
  },

  onClick: function () {
    if (!this.props.option.draft) {
      return;
    }

    this.props.emit(Widget.EVENT.SELECT, this.props.data, ReactDOM.findDOMNode(this));
  },

  widget: function () {
    var dom = Widget[this.props.data.type];

    if (dom) {
      return React.createElement(dom, this.props);
    }
    return null;
  }
});

Widget.Row = React.createClass({
  render: function () {

    // 一个组件可以通过parents, 查看所有兄弟组件的状态, 来控制是否可以扩展, 是否可以移动等
    this.props.option.parents = this.props.data;

    return React.DOM.div({className: "row"}, this.props.data.map(function (col) {
      return React.createElement(Widget.Section, {
        data: col,
        option: this.props.option,
        emit: this.props.emit
      });
    }.bind(this)));
  }
});

Widget.FieldSet = React.createClass({
  render: function () {

    // 获取行数, 通过查看数据中最大的row值来获取总行数
    var totalRow = _.max(this.props.data, function (item) {
        return item.row;
      }).row + 1;

    return React.DOM.fieldset({style: this.style()}, _.map(_.range(totalRow), function (row) {

      // 获取行数据, 并以col字段排序显示
      var rowData = _.sortBy(_.where(this.props.data, {row: row}), "col");

      return React.createElement(Widget.Row, {
        data: rowData,
        option: this.props.option,
        emit: this.props.emit
      });
    }.bind(this)));
  },

  style: function () {
    return {display: this.props.option.closed ? "none" : "block"};
  }
});

Widget.Header = React.createClass({

  render: function () {

    // 如果指定了closed属性的值，则右上角显示折叠按钮
    var expander = _.isUndefined(this.props.closed)
      ? null
      : React.DOM.a({style: {float: "right"}, onClick: this.onClick}, React.DOM.i({className: this.className()}));

    return React.DOM.header({onClick: this.onClickForm}, this.props.title, expander);
  },

  className: function () {
    return "fa fa-angle-" + (this.props.closed ? "up" : "down");
  },

  onClick: function (event) {
    event.preventDefault();
    if (this.props.onFold) {
      this.props.onFold();
    }
  },

  onClickForm: function (event) {
    event.preventDefault();
    if (this.props.emit) {
      this.props.emit(Widget.EVENT.SELECTFORM, {});
    }
  }
});

Widget.Footer = React.createClass({
  render: function () {
    return React.DOM.footer(null, this.button(), this.description());
  },

  button: function () {
    if (!this.props.button) {
      return null;
    }

    return this.props.button.map(function (button) {
      return React.DOM.button({
          type: "button",
          key: button.key,
          className: this.className(button),
          onClick: button.onClick,
          style: {margin: "1px"},
          disabled: button.disabled
        },
        this.icon(button.icon),
        button.name
      );
    }.bind(this));
  },

  description: function () {
    if (!this.props.description) {
      return null;
    }

    return this.props.description.map(function (description) {
      return React.DOM.div(null, description);
    });
  },

  icon: function (icon) {
    if (!icon) {
      return null;
    }

    return React.DOM.i({className: "fa fa-fw fa-" + icon});
  },

  className: function (button) {
    return "btn-u " + button.style;
  }
});

/**
 * @desc 表单, 可以指定的属性有:
 * {
 *   draft: true,               是否是编辑模式, true为编辑模式
 *   accept: "additionWidget",  接受的组件, 一个画面使用多个form并且每个form允许添加的组件不同时, 可以指定
 *   h: 4,                      默认的form行数
 *   button: [],                操作按钮
 *   node: "addition"           form的id, 多个form时用来区分每个form的事件
 * }
 */
Widget.Form = React.createClass({
  getInitialState: function () {

    if (this.props.emitter) {
      this.emitter = this.props.emitter;
      this.emitter.on(Widget.EVENT.SELECT, this.onSelect);        // 选择组件
      this.emitter.on(Widget.EVENT.EXPAND, this.onExpand);        // 扩大组件
      this.emitter.on(Widget.EVENT.ADD, this.onAdd);              // 添加组件
      this.emitter.on(Widget.EVENT.MOVE, this.onMove);            // 移动组件
      this.emitter.on(Widget.EVENT.CHANGE, this.onChange);        // 组件值发生变化
      this.emitter.on(Widget.EVENT.SELECTFORM, this.onSelectForm);// 选择表单
    }

    return {
      data: this.props.data || this.getBlankItems(),             // 保存数据
      option: {
        disabled: false,            // 表单状态, 保存取消操作按钮是否可用
        closed: undefined,          // 表单是否可折叠, undefined为不显示折叠按钮, false为关闭状态
        selected: [],               // 表单单元格选中状态, [row, col]
        draft: this.props.draft,
        accept: this.props.accept,
        button: this.props.button,
        node: this.props.node
      }
    };
  },

  render: function () {
    return React.DOM.form({className: "sky-form"},
      React.createElement(Widget.Header, {
        title: this.props.title,
        onFold: this.onFold,
        closed: this.state.option.closed,
        emit: this.emit
      }),
      React.createElement(Widget.FieldSet, {
        data: this.state.data,
        option: this.state.option,
        emit: this.emit
      }),
      React.createElement(Widget.Footer, {button: this.state.option.button}),
      React.DOM.input({type: "text", style: {display: "none"}}) // 添加一个不可见输入框, 防止只有一个输入框是敲回车提交表单
    );
  },

  emit: function (type, data, node) {
    this.emitter.trigger(type, [data, node]);
  },

  onOk: function () {
    event.preventDefault();
    if (this.ok) {
      this.ok();
    }
  },

  onCancel: function (event) {
    event.preventDefault();
    if (this.cancel) {
      this.cancel();
    }
  },

  onFold: function () {
    this.state.option.closed = !this.state.option.closed;
    this.setState({option: this.state.option});
  },

  onChange: function (event, data) {
    var node = _.find(this.state.data, function (item) {
      return item.col == data.col && item.row == data.row;
    });
    node.value = data.value;
    this.setState({data: this.state.data});
  },

  onSelect: function (event, data) {
    this.state.option.selected = [data.row, data.col];
    this.setState({option: this.state.option});
  },

  onSelectForm: function () {
    this.state.option.selected = [];
    this.setState({option: this.state.option});
  },

  onAdd: function (event, data, node) {
    var component = _.find(this.state.data, function (item) {
      return item.col == data.col && item.row == data.row;
    });

    _.extend(component, {type: data.type, title: data.type});
    component.name = light.randomGUID4();

    this.emit(Widget.EVENT.SELECT, component, node);
    this.setState({data: this.state.data});
  },

  onMove: function (event, data) {

    // 删除 组件本身，并设定新位置
    var self = null, object = _.reject(this.state.data, function (item) {
      if (item.col == data.source.col && item.row == data.source.row) {
        self = _.extend(item, {
          col: data.col, row: data.row,
          rowSpan: data.source.rowSpan,
          colSpan: data.source.colSpan
        });
        return true;
      }
    });

    // 在原来位置上，填上空组件
    for (var i = data.source.col; i < data.source.col + data.source.colSpan; i++) {
      object.push({row: data.source.row, col: i, rowSpan: 1, colSpan: 1});
    }

    // 删除 将要移动到的位置上的组件，移动位置上有组件在，则不删除，并缩小组件的宽度
    var isStopReject = false;
    object = _.reject(_.sortBy(object, "col"), function (item) {
      if (item.row != data.row || isStopReject) {
        return false;
      }

      if (item.col >= data.col && item.col < data.col + data.source.colSpan) {
        if (item.type) {
          self.colSpan = item.col - self.col;
          isStopReject = true;
          return false;
        }
        return true;
      }
      return false;
    });

    // 如果组件宽度超过了编辑框的宽度，则缩小组件的宽度
    self.colSpan = self.col + self.colSpan > Widget.Config.Width ? Widget.Config.Width - self.col : self.colSpan;

    // 设定自己的位置
    object.push(self);

    this.state.option.selected = [];
    this.setState({data: object, option: this.state.option});
  },

  onExpand: function (event, data) {

    // 删除 扩展需要占用的位置上的组件
    var object = _.reject(this.state.data, function (item) {
      return item.col == data.col + data.colSpan && item.row == data.row;
    });

    // 修改组件的宽度
    var node = _.find(object, function (item) {
      return item.col == data.col && item.row == data.row;
    });

    node.colSpan = node.colSpan + 1;
    this.setState({data: object});
  },

  /**
   * 返回8x4的空组件
   * @returns {Array}
   */
  getBlankItems: function () {

    var W = Widget.Config.Width, H = this.props.h || 8;

    return _.flatten(_.map(_.range(H), function (row) {
      return _.map(_.range(W), function (col) {
        return {row: row, col: col, rowSpan: 1, colSpan: 1};
      });
    }));
  },

  addRow: function (data) {
    _.each(this.state.data, function (item) {
      if (item.row > data.row) {
        item.row = item.row + 1;
      }
    });

    var row = _.map(_.range(Widget.Config.Width), function (col) {
      return {row: data.row + 1, col: col, rowSpan: 1, colSpan: 1};
    });

    this.setState({data: _.union(this.state.data, row)});
  },

  removeRow: function (data) {
    this.state.data = _.reject(this.state.data, function (item) {
      var remove = (data.row == item.row);

      if (item.row > data.row) {
        item.row = item.row - 1;
      }

      return remove;
    });

    this.state.option.selected = [];
    this.setState({data: this.state.data, option: this.state.option});
  },

  setOption: function (data) {
    _.extend(_.find(this.state.data, function (item) {
      return data.col == item.col && data.row == item.row;
    }), data);

    this.setState({data: this.state.data});
  },

  setOptionItem: function (data) {
    if (_.isEmpty(this.state.option.selected)) {
      return;
    }

    _.extend(_.find(this.state.data, function (item) {
      return this.state.option.selected[1] == item.col && this.state.option.selected[0] == item.row;
    }.bind(this)), data);

    this.setState({data: this.state.data});
  },

  removeComponent: function (data) {
    this.state.data = _.reject(this.state.data, function (item) {
      return data.col == item.col && data.row == item.row;
    });

    for (var i = data.col; i < data.col + data.colSpan; i++) {
      this.state.data.push({row: data.row, rowSpan: data.rowSpan, col: i, colSpan: 1});
    }

    this.state.option.selected = [];
    this.setState({data: this.state.data, option: this.state.option});
  },

  setFormData: function (data) {
    this.setState({data: data || this.getBlankItems()});
  },

  getFormData: function () {
    return this.state.data;
  },

  getFormValue: function () {

    var result = [];

    _.each(this.state.data, function (val) {
      if (!val.type || !val.name) {
        return;
      }

      var value = _.isUndefined(val.value) ? val.defaults : val.value
        , options = _.object(_.map(val.selectOption, function (option) {

        var val = Widget.normalize(option);
        return [val.value, val.text];
      }));

      result.push({
        options: options,
        value: value || null,
        title: val.title,
        name: val.name,
        type: val.type
      });
    });

    return result;
  }
});

Widget.Node = React.createClass({

  getDefaultProps: function () {
    return {
      button: [
        {name: "Input", title: "单行文本", icon: "terminal", color: "blue"},
        {name: "TextArea", title: "多行文本", icon: "list-alt", color: "blue"},
        {name: "Calendar", title: "日期选择", icon: "calendar", color: "blue"},
        {name: "Number", title: "数字输入", icon: "jpy", color: "blue"},
        {name: "Tag", title: "标签", icon: "tags", color: "blue"},
        {name: "CheckBox", title: "多选", icon: "check-square", color: "orange"},
        {name: "RadioBox", title: "单选", icon: "dot-circle-o", color: "orange"},
        {name: "ComboBox", title: "下拉列表", icon: "list", color: "orange"},
        {name: "SelectButton", title: "选择按钮", icon: "square-o", color: "orange"},
        {name: "Switch", title: "开关按钮", icon: "toggle-on", color: "orange"},
        {name: "Image", title: "图片", icon: "file-image-o", color: "dark-blue"},
        {name: "Video", title: "视频", icon: "file-video-o", color: "dark-blue"},
        {name: "File", title: "附件", icon: "file-text-o", color: "dark-blue"},
        {name: "Label", title: "文字", icon: "font", color: "purple"},
        {name: "Grid", title: "表格", icon: "table", color: "purple"},
        {name: "Line", title: "分割线", icon: "minus", color: "purple"},
        {name: "Block", title: "分组", icon: "th-large", color: "purple"}
      ]
    };
  },

  componentDidMount: function () {
    $(ReactDOM.findDOMNode(this)).find("button").tooltip();
  },

  render: function () {
    return React.DOM.div({style: this.style()}, this.widget());
  },

  style: function () {
    if (this.props.fixed) {
      return {
        padding: "8px",
        borderRadius: "3px !important",
        background: "rgba(0,0,0,.85)",
        position: "relative",
        zIndex: 10
      };
    }

    return {
      padding: "5px",
      borderRadius: "3px !important",
      background: "rgba(0,0,0,.85)",
      position: "absolute",
      zIndex: 10
    };
  },

  widget: function () {
    return this.button().map(function (button) {
      return React.DOM.button({
        className: "tooltips btn-u btn-u-" + button.color,
        name: button.name,
        title: button.title,
        type: "button",
        style: {padding: "5px"},
        "data-toggle": "tooltip",
        "data-placement": "right"
      }, React.DOM.i({className: "fa fa-fw fa-" + button.icon}));
    });
  },

  button: function () {
    if (!this.props.filter) {
      return this.props.button;
    }

    return _.filter(this.props.button, function (item) {
      return _.contains(this.props.filter, item.name);
    }.bind(this));
  }
});

Widget.createForm = function (widget, node, option) {
  return ReactDOM.render(
    React.createElement(widget, option),
    document.getElementById(node)
  );
};

if (isNode) {
  module.exports = Widget;
}
