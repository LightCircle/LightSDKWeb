/**
 *
 * @type {}
 */
var Widget = {
  FormID: null,
  Draft: false,
  Emitter: $({}),
  Type: {
    Label: "Label",
    File: "File",
    Grid: "Grid",
    Line: "Line",
    Select: "Select",
    SelectList: "listbox",
    SelectMultiple: "multiple",
    SelectButton: "selectbox",
    SelectRadio: "radiobox",
    SelectCheck: "checkbox",
    SelectToggle: "toggle",
    Text: "Text",
    TextNormal: "text",
    TextArea: "textarea",
    TextDate: "date",
    TextNumber: "number",
    TextTag: "tag"
  },
  EVENT: {
    SELECT: "select",         // 组件: 选择组件
    EXPAND: "expand",         // 组件: 调整宽度
    ADD: "add",               // 组件: 添加
    REMOVE: "remove",         // 组件: 删除
    ADD_ROW: "addrow",        // 组件: 添加
    REMOVE_ROW: "removerow",  // 组件: 删除
    MOVE: "move",             // 组件: 移动
    CHANGE: "change",         // 组件: 值变更
    SET: "set",               // 表单: 设定值
    FETCH: "fetch"            // 表单: 获取数据
  },
  KEY: {
    BACKSPACE: 8,
    DELETE: 46,
    ENTER: 13
  },
  Addation: {}
};

$(function () {
  "use strict";

  /**
   * 标签组件
   */
  Widget.Tag = React.createClass({
    getInitialState: function () {
      return {size: 1};
    },

    render: function () {
      return React.DOM.div({className: "bootstrap-tagsinput", onClick: this.onFocus}, this.tags(), this.input());
    },

    /**
     * 获取文字数，一个汉字计数2，英文字母计数1
     * @param str
     * @returns {number}
     */
    mLength: function (str) {
      var len = 0;
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) len++;
        len++;
      }
      return len;
    },

    /**
     * 获取输入框Component
     * size为隐藏的输入框宽度，当值为空时，为了显示placeholder内容，调整size为placeholder长度
     * @returns {*}
     */
    input: function () {
      if (this.props.disabled) {
        return null;
      }

      return React.DOM.input({
        style: {
          border: "none",
          outline: "none",
          padding: "1px",
          margin: 0,
          width: "auto !important",
          backgroundColor: "transparent",
          boxShadow: "none",
          maxWidth: "inherit",
          paddingLeft: "10px"
        },
        type: "text",
        size: this.values().length <= 0 ? this.mLength(this.props.placeholder) : this.state.size,
        placeholder: this.values().length <= 0 ? this.props.placeholder : "",
        onKeyDown: this.onKeyDown,
        onChange: this.onChange
      });
    },

    values: function () {
      if (_.isString(this.props.value)) {
        return this.props.value.split(",");
      }
      return this.props.value;
    },

    /**
     * 生成Tag的Component
     * @returns {*}
     */
    tags: function () {
      if (this.values() <= 0) {
        return null;
      }

      return this.values().map(function (value, index) {

        var remove = null, style = null;

        // 只读状态下，去除删除按钮的宽度
        if (this.props.disabled) {
          style = {paddingRight: "8px"};
        } else {
          remove = React.DOM.span({"data-role": "remove", "data-index": index, onClick: this.onRemove});
        }

        return React.DOM.span({className: "tag label label-info", style: style}, value, remove);
      }.bind(this));
    },

    onFocus: function (event) {
      $(event.target).children("input").focus();
    },

    /**
     * 输入框里输入值时，为了显示输入的所有文字，调整输入框的宽度
     * @param event
     */
    onChange: function (event) {
      var size = this.mLength(event.target.value);
      this.setState({size: size < 1 ? 1 : size});
    },

    onKeyDown: function (event) {

      var result = this.values();

      if (event.keyCode == Widget.KEY.BACKSPACE) {
        if (event.target.value.length == 0) {
          result.splice(result.length - 1, 1);
        }
      }

      if (event.keyCode == Widget.KEY.DELETE) {
        result.splice(result.length - 1, 1);
      }

      if (event.keyCode == Widget.KEY.ENTER) {
        event.preventDefault();

        if (event.target.value.length > 0) {
          result.push(event.target.value);
          $(event.target).val("");
          this.setState({size: 1});
        }
      }

      this.updateValue(result);
    },

    /**
     * 删除按钮
     * @param event
     */
    onRemove: function (event) {
      var result = this.values();
      result.splice($(event.target).attr("data-index"), 1);
      this.updateValue(result);
    },

    updateValue: function (result) {
      if (this.props.onChange) {
        this.props.onChange({target: {value: _.compact(result), name: this.props.name}});
      }
    }
  });

  /**
   * 输入框 : text, textarea, date, number
   */
  Widget.Input = React.createClass({
    render: function () {
      return React.DOM.div({className: this.className()}, this.icon(), this.widget());
    },

    className: function () {
      if (this.props.data.textType == Widget.Type.TextTag) {
        return null;
      }

      if (this.props.data.textType == Widget.Type.TextArea) {
        return "textarea" + (this.props.data.disabled == "true" ? " state-disabled" : "");
      }

      return "input" + (this.props.data.disabled == "true" ? " state-disabled" : "");
    },

    icon: function () {

      if (!this.props.data.textIcon) {
        return null;
      }

      // 图标显示的位置 append: 在前面显示 prepend: 在后端显示
      var append = "icon-" + (this.props.data.textIconAppend == "append" ? "append" : "prepend")
        , icon = "fa-" + this.props.data.textIcon;

      return React.DOM.i({className: append + " fa " + icon});
    },

    value: function () {

      var result = _.isUndefined(this.props.data.value) ? this.props.data.defaults : this.props.data.value;

      // tag组件时要返回对象，在tag组件里进行显示处理
      if (this.props.data.textType == Widget.Type.TextTag) {
        return result;
      }

      // 其他类型，转换成字符串显示
      if (_.isObject(result)) {
        result = _.isEmpty(result) ? "" : JSON.stringify(result);
      }

      return result;
    },

    widget: function () {

      var disabled = this.props.data.disabled == "true" ? "disabled" : "";

      if (this.props.data.textType == Widget.Type.TextTag) {
        return React.createElement(Widget.Tag, {
          disabled: disabled,
          placeholder: this.props.data.textPlaceholder,
          onChange: this.onChange,
          value: this.value(),
          name: this.props.data.name
        });
      }

      if (this.props.data.textType == Widget.Type.TextArea) {
        return React.DOM.textarea({
          rows: this.props.data.textRows || "3",
          disabled: disabled,
          placeholder: this.props.data.textPlaceholder,
          onChange: this.onChange,
          value: this.value(),
          name: this.props.data.name
        });
      }

      return React.DOM.input({
        type: "text",
        disabled: disabled,
        placeholder: this.props.data.textPlaceholder,
        onChange: this.onChange,
        value: this.value(),
        name: this.props.data.name
      });
    },

    onChange: function (event) {
      if (this.props.draft) {
        return;
      }

      // 数字型，只接受数字
      if (this.props.data.textType == Widget.Type.TextNumber && _.isNaN(Number(event.target.value))) {
        return;
      }

      // 数字型，只接受数字
      if (this.props.data.textType == Widget.Type.TextDate && !event.target.value.match(/^[0-9\/\-: ]*$/i)) {
        return;
      }

      Widget.Emitter.trigger(Widget.EVENT.CHANGE, {
        value: event.target.value,
        name: event.target.name,
        col: this.props.data.col,
        row: this.props.data.row
      });
    }
  });

  /**
   * 选择框 : selectbox, radiobox, checkbox, combobox
   */
  Widget.Select = React.createClass({
    render: function () {
      if (this.props.data.selectType == Widget.Type.SelectRadio) {
        return React.createElement(Widget.SelectRadio, {
          data: this.props.data,
          draft: this.props.draft,
          normalize: this.normalize
        });
      }

      if (this.props.data.selectType == Widget.Type.SelectCheck) {
        return React.createElement(Widget.SelectCheck, {
          data: this.props.data,
          draft: this.props.draft,
          normalize: this.normalize
        });
      }

      if (this.props.data.selectType == Widget.Type.SelectToggle) {
        return React.createElement(Widget.SelectToggle, {
          data: this.props.data,
          draft: this.props.draft,
          normalize: this.normalize
        });
      }

      if (this.props.data.selectType == Widget.Type.SelectButton) {
        return React.createElement(Widget.SelectButton, {
          data: this.props.data,
          draft: this.props.draft,
          normalize: this.normalize
        });
      }

      return React.createElement(Widget.SelectList, {
        data: this.props.data,
        draft: this.props.draft,
        normalize: this.normalize
      });
    },

    normalize: function (option) {
      if (_.isObject(option)) {
        return option;
      }

      var match = option.match(/^([^ ]*)[ ]*:[ ]*([^ ]*)$/);
      if (match) {
        return {value: match[1], text: match[2]};
      }
      return {text: option, value: option};
    }
  });

  Widget.SelectList = React.createClass({
    render: function () {
      return React.DOM.div({className: this.className(), style: {marginBottom: 0}}, this.selection(), React.DOM.i());
    },

    className: function () {
      if (this.props.data.disabled == "true") {
        return "select state-disabled";
      }
      return "select";
    },

    selection: function () {

      return React.DOM.select({
          disabled: this.props.data.disabled == "true" ? "disabled" : "",
          onChange: this.onChange,
          value: this.props.data.value || this.props.data.defaults,
          name: this.props.data.name
        },
        this.options()
      );
    },

    options: function () {
      return (this.props.data.selectOption || []).map(function (option) {
        option = this.props.normalize(option);
        return React.DOM.option({value: option.value, key: option.value}, option.text);
      }.bind(this));
    },

    onChange: function (event) {
      if (this.props.draft) {
        return;
      }

      Widget.Emitter.trigger(Widget.EVENT.CHANGE, {
        value: event.target.value,
        name: event.target.name,
        col: this.props.data.col,
        row: this.props.data.row
      });
    }
  });

  Widget.SelectRadio = React.createClass({
    render: function () {
      return React.DOM.div({className: this.props.data.selectStyle == "Line" ? "inline-group" : "row"}, this.items());
    },

    className: function () {
      if (this.props.data.disabled == "true") {
        return "radio state-disabled";
      }
      return "radio";
    },

    items: function () {

      var options = this.props.data.selectOption || [];

      if (this.props.data.selectStyle == "Line") {
        return options.map(function (option) {
          return this.getItem(option);
        }.bind(this));
      }

      if (this.props.data.selectStyle == "List") {
        return React.DOM.div({className: "col-sm-12"},
          options.map(function (option) {
            return this.getItem(option);
          }.bind(this))
        );
      }

      return [
        React.DOM.div({className: "col-sm-6"},
          React.DOM.label({className: this.className()},
            options.map(function (option, index) {
              return index % 2 ? null : this.getItem(option);
            }.bind(this))
          )
        ),
        React.DOM.div({className: "col-sm-6"},
          React.DOM.label({className: this.className()},
            options.map(function (option, index) {
              return index % 2 ? this.getItem(option) : null;
            }.bind(this))
          )
        )
      ];
    },

    getItem: function (option) {

      option = this.props.normalize(option);

      return React.DOM.label({className: this.className()},
        React.DOM.input({
          type: "radio",
          name: this.props.data.name,
          checked: option.value == (this.props.data.value || this.props.data.defaults),
          disabled: this.props.data.disabled == "true" ? "disabled" : "",
          value: option.value,
          onChange: this.onChange
        }),
        React.DOM.i({className: "rounded-x"}),
        option.text
      );
    },

    onChange: function (event) {
      if (this.props.draft) {
        return;
      }

      Widget.Emitter.trigger(Widget.EVENT.CHANGE, {
        value: event.target.value,
        name: event.target.name,
        col: this.props.data.col,
        row: this.props.data.row
      });
    }
  });

  Widget.SelectCheck = React.createClass({
    render: function () {
      return React.DOM.div({className: this.props.data.selectStyle == "Line" ? "inline-group" : "row"}, this.items());
    },

    className: function () {
      if (this.props.data.disabled == "true") {
        return "checkbox state-disabled";
      }
      return "checkbox";
    },

    items: function () {

      var options = this.props.data.selectOption || [];

      if (this.props.data.selectStyle == "Line") {
        return options.map(function (option) {
          return this.getItem(option);
        }.bind(this));
      }

      if (this.props.data.selectStyle == "List") {
        return React.DOM.div({className: "col-sm-12"},
          options.map(function (option) {
            return this.getItem(option);
          }.bind(this))
        );
      }

      return [
        React.DOM.div({className: "col-sm-6"},
          React.DOM.label({className: this.className()},
            options.map(function (option, index) {
              return index % 2 ? null : this.getItem(option);
            }.bind(this))
          )
        ),
        React.DOM.div({className: "col-sm-6"},
          React.DOM.label({className: this.className()},
            options.map(function (option, index) {
              return index % 2 ? this.getItem(option) : null;
            }.bind(this))
          )
        )
      ];
    },

    getItem: function (option) {

      option = this.props.normalize(option);

      return React.DOM.label({className: this.className()},
        React.DOM.input({
          type: "checkbox",
          name: this.props.data.name,
          checked: _.contains((this.props.data.value || this.geDefault()), option.value),
          disabled: this.props.data.disabled == "true" ? "disabled" : "",
          value: option.value,
          onChange: this.onChange
        }),
        React.DOM.i(),
        option.text
      );
    },

    geDefault: function () {
      return _.isEmpty(this.props.data.defaults) ? [] : this.props.data.defaults.split(",");
    },

    onChange: function (event) {
      if (this.props.draft) {
        return;
      }

      var value = this.props.data.value || this.geDefault();
      if (_.contains(value, event.target.value)) {
        value = _.reject(value, function (val) {
          return val == event.target.value;
        });
      } else {
        value = _.union(value, [event.target.value]);
      }

      Widget.Emitter.trigger(Widget.EVENT.CHANGE, {
        value: value,
        name: event.target.name,
        col: this.props.data.col,
        row: this.props.data.row
      });
    }
  });

  Widget.SelectToggle = React.createClass({
    render: function () {
      var options = this.props.data.selectOption || [""]
        , checked = _.isUndefined(this.props.data.value)
          ? this.toBoolean(this.props.data.defaults)
          : this.toBoolean(this.props.data.value);

      return React.DOM.label({className: this.className()},
        React.DOM.input({
          type: "checkbox",
          name: this.props.data.name,
          checked: checked,
          value: checked,
          disabled: this.props.data.disabled == "true" ? "disabled" : "",
          onChange: this.onChange
        }),
        React.DOM.i({className: "rounded-4x"}),
        React.DOM.div({style: {position: "absolute", top: "2px"}}, options[0])
      );
    },

    className: function () {
      if (this.props.data.disabled == "true") {
        return "toggle state-disabled";
      }
      return "toggle";
    },

    toBoolean: function (string) {
      if (_.isNull(string) || _.isUndefined(string)) {
        return false;
      }

      if (_.isBoolean(string)) {
        return string;
      }

      switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "on":
        case "1":
          return true;
        case "false":
        case "no":
        case "off":
        case "0":
        case null:
          return false;
        default:
          return true;
      }
    },

    onChange: function (event) {
      if (this.props.draft) {
        return;
      }

      Widget.Emitter.trigger(Widget.EVENT.CHANGE, {
        value: !this.toBoolean(event.target.value),
        name: event.target.name,
        col: this.props.data.col,
        row: this.props.data.row
      });
    }
  });

  Widget.SelectButton = React.createClass({
    render: function () {
      return React.DOM.div({className: "btn-group"}, this.buttons());
    },

    className: function (selected) {
      return "btn btn-sm" + (selected ? " btn-info" : " btn-default");
    },

    buttons: function () {

      var options = this.props.data.selectOption || []
        , value = _.isUndefined(this.props.data.value) ? this.props.data.defaults : this.props.data.value;

      return options.map(function (option) {

        option = this.props.normalize(option);

        return React.DOM.button({
          className: this.className(value == option.value),
          disabled: this.props.data.disabled == "true" ? "disabled" : "",
          value: option.value,
          name: this.props.data.name,
          onClick: this.onChange
        }, option.text);
      }.bind(this));
    },

    onChange: function (event) {
      event.preventDefault();

      if (this.props.draft) {
        return;
      }

      Widget.Emitter.trigger(Widget.EVENT.CHANGE, {
        value: event.target.value,
        name: event.target.name,
        col: this.props.data.col,
        row: this.props.data.row
      });
    }
  });

  /**
   * 分割线
   */
  Widget.Line = React.createClass({
    render: function () {
      return React.DOM.hr({style: {marginTop: "20px", marginBottom: "20px"}});
    }
  });

  /**
   * 静态文本
   */
  Widget.Label = React.createClass({
    render: function () {
      return React.DOM.span({
        style: {
          fontSize: this.props.data.labelSize,
          color: this.props.data.labelColor,
          textDecoration: this.props.data.labelDecoration
        }
      }, this.props.data.defaults);
    }
  });

});