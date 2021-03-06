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
    var name = "col-sm-" + (12 / this.props.option.w * this.props.data.colSpan);

    if (this.props.option.model == Widget.MODEL.DESIGN) {
      name = name + " widget";
    }

    return name;
  },

  backgroundColor: function () {
    if (this.props.option.model != Widget.MODEL.DESIGN) {
      return "#FFFFFF";
    }

    var isRow = this.props.data.row == this.props.option.selected[0]
      , isCol = this.props.data.col == this.props.option.selected[1];

    return isRow && isCol ? "#F5F5F5" : "#FAFCFD";
  },

  /**
   * 横向扩展组件, 光标移动到边缘时有右向剪头出现
   * @returns {React.DOM}
   */
  expander: function () {

    if (this.props.option.model != Widget.MODEL.DESIGN) {
      return null;
    }

    if (!this.props.data.type) {
      return null;
    }

    if ((this.props.data.col + this.props.data.colSpan) >= this.props.option.w) {
      return null;
    }

    if (this.sibling()) {
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
    if (this.props.option.model != Widget.MODEL.DESIGN) {
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
    if (this.props.option.model != Widget.MODEL.DESIGN) {
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
      return item.col == this.props.data.col + 1;
    }.bind(this));
  },

  onClick: function () {
    if (this.props.option.model != Widget.MODEL.DESIGN) {
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

    var items = [], col = 0;
    for (var index = 0; index < this.props.option.w; index++) {

      var item = _.findWhere(this.props.data, {col: col});
      item = item || {row: this.props.row, col: col, rowSpan: 1, colSpan: 1};
      col++;

      items.push(React.createElement(Widget.Section, {data: item, option: this.props.option, emit: this.props.emit}));
      if (item.colSpan > 1) {
        index = index + item.colSpan - 1;
      }
    }

    return React.DOM.div({className: "row"}, items);
  }
});

Widget.FieldSet = React.createClass({
  render: function () {

    // 获取行数, 通过查看数据中最大的row值来获取总行数
    var totalRow = _.max(this.props.data, function (item) {
        return item.row;
      }).row + 1;

    // 设计模式时, 最小行数为7
    if (this.props.option.model == Widget.MODEL.DESIGN) {
      totalRow = (_.isNaN(totalRow) || totalRow < Widget.Config.Height) ? Widget.Config.Height : totalRow;
    }

    return React.DOM.fieldset({style: this.style()}, _.map(_.range(totalRow), function (row, index) {

      // 获取行数据, 并以col字段排序显示
      return React.createElement(Widget.Row, {
        data: _.where(this.props.data, {row: row}),
        row: index,
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
 *   model: 'view'              view 视图模式, readonly 只读模式, input 编辑模式, design 设计模式
 *   accept: "additionWidget",  接受的组件, 一个画面使用多个form并且每个form允许添加的组件不同时, 可以指定
 *   h: 4,                      默认的form行数
 *   button: [],                操作按钮
 *   node: "addition"           form的id, 多个form时用来区分每个form的js事件
 *
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
      data: this.props.data || [],                                // 保存数据
      option: {
        closed: undefined,                                        // 表单是否可折叠, undefined为不显示折叠按钮, false为关闭状态
        selected: [],                                             // 表单单元格选中状态, [row, col]
        model: this.props.model || Widget.MODEL.DESIGN,
        accept: this.props.accept,
        button: this.props.button,
        node: this.props.node,
        w: this.props.w || Widget.Config.Width
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

    if (!component) {
      component = {col: data.col, row: data.row, colSpan: 1, rowSpan: 1};
      this.state.data.push(component);
    }

    _.extend(component, {type: data.type, title: data.type});
    component.name = light.randomGUID4();

    this.emit(Widget.EVENT.SELECT, component, node);
    this.setState({data: this.state.data});
  },

  onMove: function (event, data) {

    // 被移走了组件的行, 后续组件位置加1
    _.each(this.state.data, function (item) {
      if (item.row == data.source.row && item.col > data.source.col) {
        item.col = item.col + data.source.colSpan - 1;
      }
    });

    var node = _.find(this.state.data, function (item) {
      return item.col == data.source.col && item.row == data.source.row;
    });

    node.row = data.row;
    node.col = data.col;
    node.rowSpan = data.source.rowSpan;
    node.colSpan = data.source.colSpan;

    // 移动位置上有组件在，则缩小组件的宽度
    for (var index = data.col + 1; index < data.col + data.source.colSpan; index++) {
      var blocker = _.find(this.state.data, function (item) {
        return item.col == index && item.row == data.row;
      });

      if (blocker && blocker.type) {
        node.colSpan = index - data.col;
        break;
      }
    }

    // 如果超出了表单宽度, 则缩小组件宽度
    if (node.col + node.colSpan > this.state.option.w) {
      node.colSpan = this.state.option.w - node.col;
    }

    // 如果设定了span, 所以后续组件位置减1
    if (node.colSpan > 1) {
      _.each(this.state.data, function (item) {
        if (item.row == data.row && item.col > data.col) {
          item.col = item.col - node.colSpan + 1;
        }
      });
    }

    this.state.option.selected = [];
    this.setState({data: this.state.data, option: this.state.option});
  },

  onExpand: function (event, data) {

    // 修改组件的宽度
    var node = _.find(this.state.data, function (item) {
      return item.col == data.col && item.row == data.row;
    });

    node.colSpan = node.colSpan + 1;

    // 设定了span, 所以后续组件位置减1
    _.each(this.state.data, function (item) {
      if (item.row == data.row && item.col > data.col) {
        item.col = item.col - 1;
      }
    });

    this.setState({data: this.state.data});
  },

  addRow: function (data) {
    _.each(this.state.data, function (item) {
      if (item.row > data.row) {
        item.row = item.row + 1;
      }
    });

    var row = _.map(_.range(this.props.w || 1), function (col) {
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

  setWidth: function (width) {

    // 删除宽度以外都组件
    this.state.data = _.reject(this.state.data, function (item) {
      return item.col >= width;
    });

    // span超过宽度, 则缩小组件
    _.each(this.state.data, function (item) {
      if (item.col + item.colSpan > width) {
        item.colSpan = width - item.col;
      }
    }.bind(this));

    this.state.option.w = width;
    this.setState({option: this.state.option});
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
    this.setState({data: data || []});
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
        background: "rgba(0,0,0,.85)",
        position: "relative",
        zIndex: 10
      };
    }

    return {
      padding: "5px",
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
        style: {padding: "5px", backgroundColor: "#333"},
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
