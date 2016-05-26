/**
 * @file 表单组件
 * @module define.widget
 * @author r2space@gmail.com
 * @version 1.0.0
 */

"use strict";

var isNode = (typeof module !== "undefined" && module.exports);
if (isNode) {
  var React = require("react"), _ = light.util.underscore, moment = light.util.moment;
}

/**
 * 组件库
 */
var Widget = {

  Config: {
    SampleVideo: "http://qiniu.alphabets.cn/mov.mp4",
    SampleImage: "/static/images/empty-image.png",
    FileUploadAPI: "/api/file/add",
    FileImageAPI: "/api/file/image?id=",
    Width: 1,
    Height: 7
  },

  EVENT: {
    SELECT: "select",         // 组件: 选择组件
    SELECTFORM: "selectform", // 组件: 选择表单
    EXPAND: "expand",         // 组件: 调整宽度
    ADD: "add",               // 组件: 添加
    MOVE: "move",             // 组件: 移动
    CHANGE: "change",         // 组件: 值变更
    MORE: "more"              // 组件: 显示附加项
  },

  KEY: {
    BACKSPACE: 8,
    DELETE: 46,
    ENTER: 13
  },

  MODEL: {
    VIEW: "view",             // 视图模式
    READONLY: "readonly",     // 只读模式
    INPUT: "input",           // 编辑模式
    DESIGN: "design"          // 设计模式
  }
};

/**
 * 将字符串格式的option值，变成数组对象，方便组件内部逻辑容易操作
 * 如 1:name -> [1, name]  name -> [name, name]
 * @param option
 * @returns {*}
 */
Widget.normalize = function (option) {
  if (!option) {
    return option;
  }

  if (_.isObject(option)) {
    return option;
  }

  var match = option.match(/^(.*)[ ]*:[ ]*(.*)$/);
  if (match) {
    //return [match[1], match[2]];
    return {value: match[1], text: match[2]};
  }
  //return [option, option];
  return {value: option, text: option};
};

Widget.Base = {

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
    return _.isUndefined(this.props.data.value) ? this.props.data.defaults : this.props.data.value;
  },

  disabled: function () {
    if (this.props.option.model == Widget.MODEL.VIEW) {
      return "disabled";
    }

    if (this.props.option.model == Widget.MODEL.READONLY) {
      return "disabled";
    }

    return this.boolean(this.props.data.disabled) ? "disabled" : "";
  },

  change: function (value, name) {
    this.props.emit(Widget.EVENT.CHANGE, {
      value: value,
      name: name,
      col: this.props.data.col,
      row: this.props.data.row
    }, ReactDOM.findDOMNode(this));
  },

  normalize: Widget.normalize,

  /**
   * 获取文字数，一个汉字计数2，英文字母计数1
   * @param str
   * @returns {number}
   */
  count: function (str) {
    if (!str) {
      return 0;
    }

    var len = 0;
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) len++;
      len++;
    }
    return len;
  },

  /**
   * 字符串转换为Boolean
   * @param string
   * @returns {*}
   */
  boolean: function (string) {
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

  /**
   * 上传文件
   * TODO: 支持CDN
   * @param event
   * @returns {boolean}
   */
  upload: function (event) {
    var files = event.target.files;
    if (!files || files.length <= 0) {
      return false;
    }

    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    light.multipart(
      Widget.Config.FileUploadAPI, {data: this.props.data.fileOption}, formData, this.onFinish, this.onProcess
    );
  }
};

Widget.Tag = React.createClass({

  mixins: [Widget.Base],

  getInitialState: function () {
    return {size: 1, editor: -1};
  },

  componentDidUpdate: function () {
    if (this.state.editor > -1) {
      this.current.children("input").focus();
    }
  },

  render: function () {
    return React.DOM.div({className: "bootstrap-tagsinput", onClick: this.onFocus}, this.tags(), this.widget());
  },

  /**
   * 获取输入框Component
   * size为隐藏的输入框宽度，当值为空时，为了显示placeholder内容，调整size为placeholder长度
   * @returns {*}
   */
  widget: function () {
    if (this.disabled()) {
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
      size: this.getValue().length <= 0 ? this.count(this.props.data.placeholder) : this.state.size,
      placeholder: this.getValue().length <= 0 ? this.props.data.placeholder : "",
      onKeyDown: this.onKeyDown,
      onChange: this.onChange
    });
  },

  getValue: function () {
    if (!this.value()) {
      return [];
    }
    if (_.isString(this.value())) {
      return this.value().split(",");
    }
    return this.value();
  },

  /**
   * 生成Tag的Component
   * @returns {*}
   */
  tags: function () {
    if (this.getValue() <= 0) {
      return null;
    }

    return this.getValue().map(function (value, index) {

      var remove = null, style = null, text = null;

      // 只读状态下，去除删除按钮的宽度
      if (this.disabled()) {
        style = {paddingRight: "8px"};
      } else {
        remove = React.DOM.span({"data-role": "remove", "data-index": index, onClick: this.onRemove});
      }

      // 编辑模式时, 显示输入框
      if (!this.disabled() && index == this.state.editor) {
        text = React.DOM.input({style: {backgroundColor: "#18568C"}, value: value,
          onChange: this.onEditorChange, onBlur: this.onEditorDone
        });
      } else {
        text = value;
      }

      return React.DOM.span({
          className: "tag label label-info", style: style, onClick: this.onEdit, "data-index": index
        }, text, remove);
    }.bind(this));
  },

  /**
   * 点击tag的某个项目, 进入编辑模式
   * @param event
   */
  onEdit: function (event) {
    this.current = $(event.target).parent();
    this.setState({editor: Number($(event.target).parent().attr("data-index"))});
  },

  /**
   * 编辑模式下, 修改文本框的内容
   * @param event
   */
  onEditorChange: function (event) {

    var index = Number($(event.target).parent().attr("data-index"))
      , result = this.getValue();

    result[index] = $(event.target).val();
    this.change(_.compact(result), this.props.data.name);
  },

  /**
   * 编辑模式结束
   */
  onEditorDone: function () {
    this.setState({editor: -1});
  },

  onFocus: function (event) {
    $(event.target).children("input").focus();
  },

  /**
   * 输入框里输入值时，为了显示输入的所有文字，调整输入框的宽度
   * @param event
   */
  onChange: function (event) {
    var size = this.count(event.target.value);
    this.setState({size: size < 1 ? 1 : size});
  },

  onKeyDown: function (event) {

    var result = this.getValue();

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

        // 如果输入有 [:] 符号，:号前面的文字不能包含 [.]
        var match = event.target.value.match(/^(.*)[ ]*:[ ]*(.*)$/);
        if (match) {
          match[1] = match[1].replace(/\./g, "");
          match = (match[1] + ":" + match[2]).replace(/^:*|:*$/g, "");
        }

        result.push(match || event.target.value);
        $(event.target).val("");
        this.setState({size: 1});
      }
    }

    this.change(_.compact(result), this.props.data.name);
  },

  /**
   * 删除按钮
   * @param event
   */
  onRemove: function (event) {
    var result = this.getValue();
    result.splice($(event.target).attr("data-index"), 1);
    this.change(_.compact(result), this.props.data.name);
  }
});

Widget.Calendar = React.createClass({

  // 日期组件, 依赖 eonasdan-bootstrap-datetimepicker, moment, moment-locales
  mixins: [Widget.Base],

  componentDidMount: function () {

    var node = $(ReactDOM.findDOMNode(this)).find("input");

    node.datetimepicker({
      locale: this.locale(),
      format: this.format(),
      defaultDate: this.props.data.defaults
    });

    if (this.props.data.textMin) {
      node.data("DateTimePicker").minDate(moment(this.props.data.textMin, this.format()));
    }

    if (this.props.data.textMax) {
      node.data("DateTimePicker").maxDate(moment(this.props.data.textMax, this.format()));
    }

    node.on("dp.change", function (event) {
      this.change(event.date.format(this.format()), event.target.name);
    }.bind(this));
  },

  componentDidUpdate: function () {

    var node = $(ReactDOM.findDOMNode(this)).find("input")
      , option = {format: this.format(), defaultDate: this.props.data.defaults};

    if (this.props.data.textMin) {

      var textMin = moment(this.props.data.textMin, this.format());

      // 缺省值要比最小值大
      if (this.props.data.defaults && moment(this.props.data.defaults, this.format()).isBefore(textMin)) {
        delete option["defaultDate"];
      }
      node.data("DateTimePicker").minDate(textMin);
    }

    if (this.props.data.textMax) {

      var textMax = moment(this.props.data.textMax, this.format());

      // 缺省值要比最大值小
      if (this.props.data.defaults && moment(this.props.data.defaults, this.format()).isAfter(textMin)) {
        delete option["defaultDate"];
      }
      node.data("DateTimePicker").maxDate(textMax);
    }

    node.data("DateTimePicker").options(option);
  },

  render: function () {
    return React.DOM.div({className: this.className()}, this.icon(), this.widget());
  },

  className: function () {
    return "input" + (this.props.data.disabled == "true" ? " state-disabled" : "");
  },

  getValue: function () {
    if (this.value()) {
      return moment().format(this.value(), this.format());
    }

    return "";
  },

  format: function () {
    return this.props.data.textDateFormat || "YYYY-MM-DD";
  },

  locale: function () {
    return this.props.data.locale || "zh-cn";
  },

  widget: function () {
    return React.DOM.input({
      type: "text",
      disabled: this.disabled(),
      placeholder: this.props.data.textPlaceholder,
      value: this.getValue(),
      name: this.props.data.name
    });
  }
});

Widget.Input = React.createClass({

  mixins: [Widget.Base],

  render: function () {
    return React.DOM.div({className: this.className()}, this.icon(), this.widget());
  },

  className: function () {
    return "input" + (this.props.data.disabled == "true" ? " state-disabled" : "");
  },

  getValue: function () {
    if (_.isObject(this.value())) {
      return _.isEmpty(this.value()) ? "" : JSON.stringify(this.value());
    }

    return this.value();
  },

  widget: function () {
    return React.DOM.input({
      type: "text",
      disabled: this.disabled(),
      placeholder: this.props.data.textPlaceholder,
      onChange: this.onChange,
      value: this.getValue(),
      name: this.props.data.name
    });
  },

  onChange: function (event) {
    this.change(event.target.value, event.target.name);
  }
});

Widget.TextArea = React.createClass({

  mixins: [Widget.Base],

  render: function () {
    return React.DOM.div({className: this.className()}, this.icon(), this.widget());
  },

  className: function () {
    return "textarea" + (this.props.data.disabled == "true" ? " state-disabled" : "");
  },

  widget: function () {
    return React.DOM.textarea({
      rows: this.props.data.textRows || "3",
      disabled: this.disabled(),
      placeholder: this.props.data.textPlaceholder,
      onChange: this.onChange,
      value: this.value(),
      name: this.props.data.name
    });
  },

  onChange: function (event) {
    this.change(event.target.value, event.target.name);
  }
});

Widget.Number = React.createClass({

  mixins: [Widget.Base],

  render: function () {
    return React.DOM.div({className: this.className()}, this.icon(), this.widget());
  },

  className: function () {
    return "input" + (this.props.data.disabled == "true" ? " state-disabled" : "");
  },

  widget: function () {
    return React.DOM.input({
      type: "text",
      disabled: this.disabled(),
      placeholder: this.props.data.textPlaceholder,
      onChange: this.onChange,
      value: this.getValue(),
      name: this.props.data.name
    });
  },

  getValue: function () {
    var result = Number(this.value());
    return _.isNaN(result) ? "" : result;
  },

  onChange: function (event) {
    // 数字型，只接受数字
    if (!event.target.value.match(/^[0-9\/\-: ]*$/i)) {
      return;
    }
    this.change(event.target.value, event.target.name);
  }
});

Widget.ComboBox = React.createClass({

  mixins: [Widget.Base],

  render: function () {

    this.props.data.selectOption = this.props.data.selectOption || ["1:item1", "2:item2"];

    return React.DOM.div({className: this.className(), style: {marginBottom: 0}}, this.selection(), React.DOM.i());
  },

  className: function () {
    if (this.disabled()) {
      return "select state-disabled";
    }
    return "select";
  },

  selection: function () {

    return React.DOM.select({
        disabled: this.disabled(),
        onChange: this.onChange,
        value: this.value(),
        name: this.props.data.name
      },
      this.options()
    );
  },

  options: function () {
    return (this.props.data.selectOption || []).map(function (option) {
      option = this.normalize(option);
      return React.DOM.option({value: option.value, key: option.value}, option.text);
    }.bind(this));
  },

  onChange: function (event) {
    this.change(event.target.value, event.target.name);
  }
});

Widget.RadioBox = React.createClass({

  mixins: [Widget.Base],

  render: function () {

    this.props.data.selectStyle = this.props.data.selectStyle || "Line";
    this.props.data.selectOption = this.props.data.selectOption || ["1:item1", "2:item2"];

    return React.DOM.div({className: this.className()}, this.widget());
  },

  className: function () {
    return this.props.data.selectStyle == "Line" ? "inline-group" : "row";
  },

  itemClassName: function () {
    if (this.props.data.disabled == "true") {
      return "radio state-disabled";
    }
    return "radio";
  },

  widget: function () {

    var options = this.props.data.selectOption;

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
        React.DOM.label({className: this.itemClassName()},
          options.map(function (option, index) {
            return index % 2 ? null : this.getItem(option);
          }.bind(this))
        )
      ),
      React.DOM.div({className: "col-sm-6"},
        React.DOM.label({className: this.itemClassName()},
          options.map(function (option, index) {
            return index % 2 ? this.getItem(option) : null;
          }.bind(this))
        )
      )
    ];
  },

  getItem: function (option) {

    option = this.normalize(option);

    return React.DOM.label({className: this.itemClassName()},
      React.DOM.input({
        type: "radio",
        name: this.props.data.name,
        checked: option.value == this.value(),
        disabled: this.disabled(),
        value: option.value,
        onChange: this.onChange
      }),
      React.DOM.i({className: "rounded-x"}),
      option.text
    );
  },

  onChange: function (event) {
    this.change(event.target.value, event.target.name);
  }
});

Widget.CheckBox = React.createClass({

  mixins: [Widget.Base],

  render: function () {

    this.props.data.selectStyle = this.props.data.selectStyle || "Line";
    this.props.data.selectOption = this.props.data.selectOption || ["1:item1", "2:item2"];

    return React.DOM.div({className: this.className()}, this.widget());
  },

  className: function () {
    return this.props.data.selectStyle == "Line" ? "inline-group" : "row";
  },

  itemClassName: function () {
    if (this.disabled()) {
      return "checkbox state-disabled";
    }
    return "checkbox";
  },

  widget: function () {

    var options = this.props.data.selectOption;

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
        React.DOM.label({className: this.itemClassName()},
          options.map(function (option, index) {
            return index % 2 ? null : this.getItem(option);
          }.bind(this))
        )
      ),
      React.DOM.div({className: "col-sm-6"},
        React.DOM.label({className: this.itemClassName()},
          options.map(function (option, index) {
            return index % 2 ? this.getItem(option) : null;
          }.bind(this))
        )
      )
    ];
  },

  getItem: function (option) {

    option = this.normalize(option);
    return React.DOM.label({className: this.itemClassName()},
      React.DOM.input({
        type: "checkbox",
        name: this.props.data.name,
        checked: this.checked(option.value),
        disabled: this.disabled(),
        value: option.value,
        onChange: this.onChange
      }),
      React.DOM.i(),
      option.text,
      this.getDetail(option.value)
    );
  },

  getDetail: function (value) {
    if (this.props.data.valueAddition && this.props.data.valueAddition[value]) {
      return React.DOM.a({href: "#", style: {color: "#1ec7da"}, onClick: this.onShowDetail},
        React.DOM.div({className: "fa fa-cog", "data-index": value})
      );
    }
    return null;
  },
  
  onShowDetail: function (event) {
    event.preventDefault();

    this.props.emit(Widget.EVENT.MORE, {
      index: $(event.target).attr("data-index"),
      data: this.props.data
    }, this.props.data, ReactDOM.findDOMNode(this));
  },

  checked: function (option) {
    if (!this.getValue()) {
      return false;
    }

    if (_.isArray(this.getValue())) {
      return _.contains(this.getValue(), option);
    }

    return this.boolean(this.getValue()[option]);
  },

  getValue: function () {
    if (!this.value() || _.isEmpty(this.value())) {
      return [];
    }

    if (_.isObject(this.value())) {
      return this.value();
    }

    return this.value().split(",");
  },

  /**
   * 支持两种格式的数据存储方式
   *  - hash 选择项目为key 值为true或false
   *  - array 选择项目的数组(数组里包含改选择项目, 则为选中)
   * @param event
   */
  onChange: function (event) {
    var value = this.getValue();

    // 数组方式保持数据
    if (_.isArray(value)) {
      if (_.contains(value, event.target.value)) {
        value = _.reject(value, function (val) {
          return val == event.target.value;
        });
      } else {
        value = _.union(value, [event.target.value]);
      }
    }

    // hash方式保持数据
    else {
      value[event.target.value] = !this.boolean(value[event.target.value]);
    }

    this.change(value, event.target.name);
  }
});

Widget.Switch = React.createClass({

  mixins: [Widget.Base],

  render: function () {

    this.props.data.selectOption = this.props.data.selectOption || [""];

    var checked = _.isUndefined(this.props.data.value)
      ? this.boolean(this.props.data.defaults)
      : this.boolean(this.props.data.value);

    return React.DOM.label({className: this.className()},
      React.DOM.input({
        type: "checkbox",
        name: this.props.data.name,
        checked: checked,
        value: checked,
        disabled: this.disabled(),
        onChange: this.onChange
      }),
      React.DOM.i({className: "rounded-4x"}),
      React.DOM.div({style: {position: "absolute", top: "2px"}}, this.props.data.selectOption[0])
    );
  },

  className: function () {
    if (this.disabled()) {
      return "toggle state-disabled";
    }
    return "toggle";
  },

  onChange: function (event) {
    this.change(!this.boolean(event.target.value), event.target.name);
  }
});

Widget.SelectButton = React.createClass({

  mixins: [Widget.Base],

  render: function () {
    return React.DOM.div({className: "btn-group"}, this.widget());
  },

  className: function (selected) {
    return "btn btn-sm" + (selected ? " btn-info" : " btn-default");
  },

  widget: function () {

    this.props.data.selectOption = this.props.data.selectOption || ["1:item1", "2:item2"];

    return this.props.data.selectOption.map(function (option) {

      option = this.normalize(option);

      return React.DOM.button({
        className: this.className(this.value() == option.value),
        disabled: this.disabled(),
        value: option.value,
        name: this.props.data.name,
        onClick: this.onChange
      }, option.text);
    }.bind(this));
  },

  onChange: function (event) {
    event.preventDefault();
    this.change(event.target.value, event.target.name);
  }
});

Widget.Line = React.createClass({
  render: function () {
    return React.DOM.hr({style: {marginTop: "20px", marginBottom: "20px"}});
  }
});

Widget.Label = React.createClass({

  mixins: [Widget.Base],

  render: function () {
    return React.DOM.span({
      style: {
        fontSize: this.props.data.labelSize,
        color: this.props.data.labelColor,
        textDecoration: this.props.data.labelDecoration
      }
    }, this.value());
  }
});

Widget.Video = React.createClass({

  mixins: [Widget.Base],

  componentDidUpdate: function () {
    ReactDOM.findDOMNode(this).load();
  },

  render: function () {
    return React.DOM.video({
      style: {width: "100%"},
      controls: this.props.data.videoControls ? "controls" : null,
      autoPlay: (this.props.data.videoAutoplay || "autoplay")
    }, React.DOM.source({src: this.src(), type: this.props.data.videoType || "video/mp4"}));
  },

  src: function () {
    return this.value() ? this.value() : Widget.Config.SampleVideo;
  }
});

Widget.File = React.createClass({

  mixins: [Widget.Base],

  getInitialState: function () {
    return {name: "选择"};
  },

  render: function () {

    this.props.data.value = this.props.data.value || [];

    return React.DOM.div({className: "input input-file"},
      React.DOM.span({className: "button"},
        React.DOM.input({
          type: "file",
          disabled: this.disabled(),
          accept: this.props.data.fileAccept,
          multiple: this.props.data.fileMultiple,
          onChange: this.onChange
        }), this.state.name),
      React.DOM.input({type: "text", readOnly: "readonly", value: this.getValue()})
    );
  },

  getValue: function () {
    return _.pluck(this.props.data.value, "name").join(",");
  },

  onChange: function (event) {
    this.upload(event);
  },

  onProcess: function (progress) {
    this.setState({name: (progress < 1 || progress > 99) ? "选择" : (progress + "%")});
  },

  onFinish: function (error, result) {
    if (error) {
      return this.onError(error);
    }

    var files = _.map(result.data, function (item) {
      return {id: item._id, name: item.name, type: item.contentType, length: item.length};
    });

    this.change(files, this.props.data.name)
  }
});

Widget.Image = React.createClass({

  mixins: [Widget.Base],

  render: function () {

    this.props.data.fileAccept = this.props.data.fileAccept || "image/*";
    this.props.data.fileMultiple = this.props.data.fileMultiple || "multiple";

    return React.DOM.div(null, this.widget());
  },

  widget: function () {

    // 横向最多显示3张图片
    var width = 12 / this.getValue().length;
    width = width < 4 ? 4 : width;

    return this.getValue().map(function (file) {
      return React.DOM.div({className: "col-sm-" + width, style: {padding: "1px"}},
        React.DOM.image({src: this.src(file), style: {width: "100%"}},
          React.DOM.ul({
            style: {
              left: 0,
              top: "90%",
              zIndex: 1,
              padding: 0,
              width: "100%",
              marginTop: "-18px",
              textAlign: "center",
              position: "absolute",
              transition: "all 0.2s ease-in-out"
            }
          }, this.getSelectButton(file), this.getRemoveButton(file))
        )
      )
    }.bind(this));
  },

  getValue: function () {
    if (!this.value() || _.isEmpty(this.value())) {
      return [{}];
    }
    return this.value();
  },

  getSelectButton: function (file) {
    if (this.disabled()) {
      return null;
    }

    return React.DOM.li({style: {display: "inline-block", margin: "0 5px"}},
      React.DOM.i({
        className: "fa fa-border fa-plus",
        style: {
          color: "#eee",
          borderWidth: "2px",
          borderColor: "#eee",
          width: "25px"
        },
        "data-action": "select",
        "data-id": file.id,
        onClick: this.onClick,
        onMouseOver: this.onMouseover,
        onMouseOut: this.onMouseout
      }),
      React.DOM.input({
        style: {display: "none"},
        type: "file",
        accept: this.props.data.fileAccept,
        multiple: this.props.data.fileMultiple,
        onChange: this.onChange
      })
    );
  },

  getRemoveButton: function (file) {
    if (_.isEmpty(file)) {
      return null;
    }

    if (this.disabled()) {
      return null;
    }

    return React.DOM.li({style: {display: "inline-block", margin: "0 5px"}},
      React.DOM.i({
        className: "fa fa-border fa-trash",
        style: {
          color: "#eee",
          borderWidth: "2px",
          borderColor: "#eee",
          width: "25px"
        },
        "data-action": "remove",
        "data-id": file.id,
        onClick: this.onClick,
        onMouseOver: this.onMouseover,
        onMouseOut: this.onMouseout
      })
    );
  },

  src: function (file) {
    return _.isEmpty(file) ? Widget.Config.SampleImage : Widget.Config.FileImageAPI + file.id;
  },

  onClick: function (event) {
    var action = $(event.target).attr("data-action")
      , id = $(event.target).attr("data-id");

    if (action == "select") {
      this.current = id;
      return $(event.target).next().trigger("click");
    }

    if (action == "remove") {
      var files = _.reject(this.getValue(), function (item) {
        return item.id == id;
      });

      this.change(files, this.props.data.name);
    }
  },

  onMouseover: function (event) {
    $(event.target).css({color: "#e74c3c", "border-color": "#e74c3c"});
  },

  onMouseout: function (event) {
    $(event.target).css({color: "#eee", "border-color": "#eee"});
  },

  onChange: function (event) {
    this.upload(event);
  },

  onProcess: function (progress) {
  },

  onFinish: function (error, result) {
    if (error) {
      return this.onError(error);
    }

    // 其余的照片不动, 只替换选择的图片
    var files = [], item = result.data[0];
    _.each(this.getValue(), function (file) {
      if (file.id == this.current) {
        files.push({id: item._id, name: item.name, type: item.contentType, length: item.length});
      } else {
        files.push(file);
      }
    }.bind(this));

    // 多余的照片补充道最后
    for (var i = 1; i < result.data.length; i++) {
      item = result.data[i];
      files.push({id: item._id, name: item.name, type: item.contentType, length: item.length});
    }

    this.change(files, this.props.data.name)
  }
});

Widget.Grid = React.createClass({

  mixins: [Widget.Base],

  render: function () {

    if (!this.props.data.gridTitle) {
      this.props.data.gridTitle = ["column1", "column2"];
    }

    this.props.data.gridBordered = _.isUndefined(this.props.data.gridBordered) ? true : this.props.data.gridBordered;

    return React.DOM.table({className: this.className(), style: {marginBottom: 0}}, this.thead(), this.tbody());
  },

  className: function () {

    var bordered = (this.boolean(this.props.data.gridBordered) ? " table-bordered" : "")
      , striped = (this.boolean(this.props.data.gridStriped) ? " table-striped" : "");

    return "table" + bordered + striped;
  },

  thead: function () {

    var columns = this.props.data.gridTitle.map(function (title) {
      return React.DOM.th(null, title);
    });

    return React.DOM.thead(null, React.DOM.tr({
      style: {
        color: this.props.data.gridTitleColor,
        backgroundColor: this.props.data.gridTitleColorBackground
      }
    }, columns));
  },

  getValue: function () {
    return this.value() || ["", "", "", ""];
  },

  tbody: function () {
    var rows = [], columns = [], count = this.props.data.gridTitle.length;
    this.getValue().map(function (value, index) {

      columns.push(
        React.DOM.td({style: {padding: "3px"}}, this.disabled() ? value : React.DOM.input({
          type: "text",
          value: value,
          style: {width: "100%"},
          onChange: this.onChange
        }))
      );

      if ((index + 1) % count == 0 || index == this.getValue().length) {
        rows.push(React.DOM.tr(null, columns));
        columns = [];
      }
    }.bind(this));

    return React.DOM.tbody(null, rows);
  },

  onChange: function (event) {

    var node = $(ReactDOM.findDOMNode(this)).find("input"), value = _.map(node, function (item) {
      return $(item).val();
    });

    this.change(value, this.props.data.name);
  }
});

Widget.Block = React.createClass({

  mixins: [Widget.Base],

  render: function () {
    return React.DOM.table({style: {width: "100%", backgroundColor: "#bfbfbf"}},
      React.DOM.tbody(null,
        React.DOM.tr(null,
          React.DOM.td({style: {color: "#fff", fontSize: "14px"}},
            React.DOM.i({className: "fa fa-" + this.className(), style: {margin: "16px"}}),
            this.props.data.description
          )
        )
      )
    );
  },

  className: function () {
    return this.props.data.blockIcon || "th-large";
  }
});

if (isNode) {
  module.exports = Widget;
}
