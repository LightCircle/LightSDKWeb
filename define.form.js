$(function () {
  "use strict";

  var W = 4, H = 8;

  /**
   * 组件 : Label， Text， Select， File， Grid， Line
   */
  Widget.Section = React.createClass({
    render: function () {
      return React.DOM.section({
          className: this.className(), style: this.style(),
          onClick: this.onClick,
          onMouseOut: this.onMouseOut,
          onMouseOver: this.onMouseOver
        },
        React.DOM.label({className: "label"}, this.props.data.title), this.widget(), this.expander()
      );
    },

    className: function () {
      var name = "col-sm-" + (3 * this.props.data.colSpan);

      if (this.props.draft) {
        name = name + " widget";
      }

      return name;
    },

    style: function () {
      return {backgroundColor: this.backgroundColor()};
    },

    backgroundColor: function () {
      if (!this.props.draft) {
        return "#ffffff";
      }
      return this.props.data.row == this.props.selected[0] && this.props.data.col == this.props.selected[1] ? "#edf9ff" : "#fafcfd";
    },

    /**
     * 横向扩展组件
     * @returns {*}
     */
    expander: function () {

      if (!this.props.draft) {
        return null;
      }

      if (!this.props.data.type) {
        return null;
      }

      if (!this.sibling() || this.sibling().type) {
        return null;
      }

      return React.DOM.div({className: "ui-resizable-handle ui-resizable-e", onClick: this.expand});
    },

    expand: function () {
      Widget.Emitter.trigger(Widget.EVENT.EXPAND, {
        col: this.props.data.col, colSpan: this.props.data.colSpan, row: this.props.data.row
      });
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
      if (!this.props.draft) {
        return;
      }

      var node = $(ReactDOM.findDOMNode(this));

      if (!node.droppable("instance")) {
        node.droppable({
          accept: "#widget button, section", activeClass: "widget-active", hoverClass: "widget-hover",
          drop: function (event, ui) {

            var type = $(ui.draggable).attr("name");

            // 添加组件
            if (type) {
              return Widget.Emitter.trigger(Widget.EVENT.ADD, {
                col: this.props.data.col,
                row: this.props.data.row,
                type: type
              });
            }

            // 移动组件
            return Widget.Emitter.trigger(Widget.EVENT.MOVE, {
              col: this.props.data.col,
              row: this.props.data.row,
              rowSpan: this.props.data.rowSpan,
              colSpan: this.props.data.colSpan,
              source: Widget.temporal
            });
          }.bind(this)
        });
      }

      node.droppable(this.props.data.type ? "disable" : "enable");
    },

    draggable: function () {
      if (!this.props.draft) {
        return;
      }

      var node = $(ReactDOM.findDOMNode(this));

      if (!node.draggable("instance")) {
        node.draggable({
          revert: "invalid", opacity: 0.7,
          helper: function () {
            return node.clone().css({"z-index": "10"}).removeAttr("data-reactid");
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
      return _.find(this.props.parents, function (item) {
        return item.col > this.props.data.col;
      }.bind(this));
    },

    onClick: function () {
      if (!this.props.draft) {
        return;
      }

      Widget.Emitter.trigger(Widget.EVENT.SELECT, this.props.data);
    },

    widget: function () {
      if (this.props.data.type == Widget.Type.Select) {
        return React.createElement(Widget.Select, {data: this.props.data, draft: this.props.draft});
      }

      if (this.props.data.type == Widget.Type.Text) {
        return React.createElement(Widget.Input, {data: this.props.data, draft: this.props.draft});
      }

      if (this.props.data.type == Widget.Type.Line) {
        return React.createElement(Widget.Line, {data: this.props.data, draft: this.props.draft});
      }

      if (this.props.data.type == Widget.Type.Label) {
        return React.createElement(Widget.Label, {data: this.props.data, draft: this.props.draft});
      }

      return null;
    }
  });

  Widget.Row = React.createClass({
    cols: function () {
      return this.props.data.map(function (col) {
        return React.createElement(Widget.Section, {
          data: col,
          parents: this.props.data,
          selected: this.props.selected,
          draft: this.props.draft
        });
      }.bind(this));
    },
    render: function () {
      return React.DOM.div({className: "row"}, this.cols());
    }
  });

  Widget.FieldSet = React.createClass({
    rows: function () {

      var totalRow = _.max(this.props.data, function (item) {
          return item.row;
        }).row + 1;

      return _.map(_.range(totalRow), function (row) {
        return React.createElement(Widget.Row, {
          data: _.sortBy(_.where(this.props.data, {row: row}), "col"),
          selected: this.props.selected,
          draft: this.props.draft
        });
      }.bind(this));
    },

    render: function () {
      return React.DOM.fieldset({style: {display: this.props.closed ? "none" : "block"}}, this.rows());
    }
  });

  Widget.Header = React.createClass({

    render: function () {

      // 如果指定了closed属性的值，则右上角显示折叠按钮
      var expander = _.isUndefined(this.props.closed)
        ? null
        : React.DOM.a({style: {float: "right"}, onClick: this.onClick}, React.DOM.i({className: this.className()}));

      return React.DOM.header(null, this.props.title, expander);
    },

    className: function () {
      return "fa fa-angle-" + (this.props.closed ? "up" : "down");
    },

    onClick: function (event) {
      event.preventDefault();
      this.props.onFold();
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

  Widget.Form = React.createClass({
    getInitialState: function () {
      return {
        data: [],             // 保存数据
        selected: [],         // 选中的单元格
        draft: Widget.Draft,  // 表单模式，Draft为编辑模式
        disabled: false,      // 表单状态，操作按钮等受该状态控制
        closed: undefined     // 表单是否可折叠
      };
    },

    render: function () {
      return React.DOM.form({className: "sky-form"},
        React.createElement(Widget.Header, {title: "表单编辑", onFold: this.onFold, closed: this.state.closed}),
        React.createElement(Widget.FieldSet, {
          data: this.state.data,
          selected: this.state.selected,
          draft: this.state.draft,
          closed: this.state.closed
        }),
        React.createElement(Widget.Footer, {
          button: [
            {key: "cancel", name: "取消", onClick: this.onCancel, style: "btn-u-default", disabled: this.state.disabled},
            {key: "save", name: "保存", onClick: this.onOk, disabled: this.state.disabled}
          ]
        })
      );
    },

    componentDidMount: function () {

      this.onFetch();

      Widget.Emitter.on(Widget.EVENT.FETCH, this.onFetch);          // 初始化，获取初始数据
      Widget.Emitter.on(Widget.EVENT.SET, this.onSet);              // 由属性框，设定属性
      Widget.Emitter.on(Widget.EVENT.REMOVE, this.onRemove);        // 由属性框，删除组件
      Widget.Emitter.on(Widget.EVENT.SELECT, this.onSelect);        // 选择组件
      Widget.Emitter.on(Widget.EVENT.EXPAND, this.onExpand);        // 扩大组件
      Widget.Emitter.on(Widget.EVENT.ADD, this.onAdd);              // 添加组件
      Widget.Emitter.on(Widget.EVENT.MOVE, this.onMove);            // 移动组件
      Widget.Emitter.on(Widget.EVENT.CHANGE, this.onChange);        // 组件值发生变化
      Widget.Emitter.on(Widget.EVENT.ADD_ROW, this.onAddRow);       // 添加行
      Widget.Emitter.on(Widget.EVENT.REMOVE_ROW, this.onRemoveRow); // 删除行
    },

    onFold: function () {
      this.setState({closed: !this.state.closed});
    },

    onAddRow: function (event, data) {
      _.each(this.state.data, function (item) {
        if (item.row > data.row) {
          item.row = item.row + 1;
        }
      });

      var row = _.map(_.range(W), function (col) {
        return {row: data.row + 1, col: col, rowSpan: 1, colSpan: 1};
      });

      this.setState({data: _.union(this.state.data, row)});
    },

    onRemoveRow: function (event, data) {
      this.state.data = _.reject(this.state.data, function (item) {
        var remove = (data.row == item.row);

        if (item.row > data.row) {
          item.row = item.row - 1;
        }

        return remove;
      });

      this.setState({data: this.state.data, selected: []});
    },

    onChange: function (event, data) {
      if (this.state.draft) {
        return;
      }

      var node = _.find(this.state.data, function (item) {
        return item.col == data.col && item.row == data.row;
      });
      node.value = data.value;
      this.setState({data: this.state.data});
    },

    onFetch: function (event, data) {
      this.setState({data: data ? data.items : this.getBlankItems()});
    },

    onSelect: function (event, data) {
      this.setState({selected: [data.row, data.col]});
    },

    onSet: function (event, data) {
      _.extend(_.find(this.state.data, function (item) {
        return data.col == item.col && data.row == item.row;
      }), data);

      this.setState({data: this.state.data});
    },

    onRemove: function (event, data) {
      this.state.data = _.reject(this.state.data, function (item) {
        return data.col == item.col && data.row == item.row;
      });

      for (var i = data.col; i < data.col + data.colSpan; i++) {
        this.state.data.push({row: data.row, rowSpan: data.rowSpan, col: i, colSpan: 1});
      }

      this.setState({data: this.state.data, selected: []});
    },

    onAdd: function (event, data) {
      var component = _.find(this.state.data, function (item) {
        return item.col == data.col && item.row == data.row;
      });

      if (data.type == Widget.Type.Text) {
        _.extend(component, {type: data.type, title: data.type, textType: Widget.Type.TextNormal});
      }

      if (data.type == Widget.Type.Label) {
        _.extend(component, {type: data.type, title: data.type});
      }

      if (data.type == Widget.Type.Line) {
        _.extend(component, {type: data.type, title: data.type});
      }

      if (data.type == Widget.Type.Select) {
        _.extend(component, {
          type: data.type,
          title: data.type,
          textType: Widget.Type.SelectList,
          selectType: "Line",
          selectOption: []
        });
      }

      component.name = light.randomGUID4();

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
      self.colSpan = self.col + self.colSpan > W ? W - self.col : self.colSpan;

      // 设定自己的位置
      object.push(self);
      this.setState({data: object, selected: []});
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

    onOk: function (event) {
      event.preventDefault();
      Widget.save(this.state.data);
    },

    onCancel: function (event) {
      event.preventDefault();
      Widget.cancel();
    },

    /**
     * 返回8x4的空组件
     * @returns {Array}
     */
    getBlankItems: function () {
      return _.flatten(_.map(_.range(H), function (row) {
        return _.map(_.range(W), function (col) {
          return {row: row, col: col, rowSpan: 1, colSpan: 1};
        });
      }));
    }
  });

  ReactDOM.render(
    React.createElement(Widget.Form, null),
    document.getElementById("form")
  );
});

