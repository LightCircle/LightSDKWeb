
light.widget = light.widget || {};

/**
 * 常量定义
 */
light.widget.LABEL  = "Label";
light.widget.SELECT = "Select";
light.widget.TEXT   = "Text";
light.widget.FILE   = "File";
light.widget.GRID   = "Grid";

/**
 * 加载模板，在画面显示模板控件
 * @param templates
 * @param container
 * @param canEdit
 */
light.widget.loadTemplate = function(templates, container, canEdit) {

  container.html("");

  // 添加项目
  _.each(templates, function(item) {

    item.canEdit = canEdit;
    container.append(_.template($("#tmpl" + item.type).html(), item));

    if (item.type === light.widget.TEXT) {
      if (item.textType === "2") {// 日期
        $("#_" + item.key).datepicker({}, $.datepicker.regional[ "zh-CN" ]);
      }
    }

    if (item.type === light.widget.SELECT) {
      new ButtonGroup("_" + item.key, item.default).init();
    }

    if (item.type === light.widget.FILE) {
      // 图片
      if (item.fileType === "1") {
        light.initFileUploadWithImage(
            "_" + item.key + "_filename"
          , "_" + item.key + "_file"
          , {
            accept: light.file.TYPE_IMAGE,
            multiple: true,
            success: function(data) {
              return false;
            }
          });
      }

      // 普通文件
      if (item.fileType === "2") {
        light.initFileUploadWithContainer(
            "_" + item.key + "_filename"
          , "_" + item.key + "_file"
          , {
            accept: light.file.TYPE_IMAGE,
            multiple: true,
            success: function(data) {
              return false;
            }
          });
      }
    }
  });
};

/**
 * 加载模板，在画面显示模板控件
 * @param templates
 * @param container
 * @param canEdit
 */
light.widget.loadTemplateView = function(templates, container) {

  container.html(light.widget.TEMPLATE_TABLE_VIEW);
  container = container.find("tbody");

  _.each(templates, function(item) {
    var tmpl = {};
    if (item.type === light.widget.TEXT) {
      tmpl = light.widget.TEMPLATE_TEXT_VIEW();
    };
    if (item.type === light.widget.SELECT) {
      tmpl = light.widget.TEMPLATE_SELECT_VIEW();
    };
    if (item.type === light.widget.FILE && item.fileType === "1") {
      tmpl = light.widget.TEMPLATE_IMAGE_VIEW();
    };
    if (item.type === light.widget.FILE && item.fileType === "2") {
      tmpl = light.widget.TEMPLATE_ATTACH_VIEW();
    };
    if (item.type === light.widget.GRID) {
      tmpl = light.widget.TEMPLATE_GRID_VIEW();
    };

    container.append(_.template(tmpl, item));
  });
};

/**
 * 设定模板数据
 * @param templates
 * @param data
 */
light.widget.setTemplateData = function(templates, data) {

  _.each(templates, function(template) {

    var val = _.find(data, function(d) {return d.key == template.key});

    if (val) {
      // text
      if (template.type === light.widget.TEXT) {
        $("#_" + template.key).val(val.value);
      }

      // select
      if (template.type === light.widget.SELECT) {

        if (template.selectType === "1") {
        }
        if (template.selectType === "2") {
        }
        if (template.selectType === "3") {
        }
      }

      // file
      if (template.type === light.widget.FILE) {

        // 图片
        if (template.fileType === "1") {
        }

        // 文件
        if (template.fileType === "2") {
        }
      }

      // grid
      if (template.type === light.widget.GRID) {
        var rowCount = template.gridRow
          , colCount = template.gridTitle.length;

        for (var i = 0; i < rowCount; i++) {
          var row = [];
          for (var j = 0; j < colCount; j++) {
            $("#_" + template.key + "_" + i + "_" + j).val();
          }
        }
      }
    }
  });
};

/**
 * 保存模板数据
 * @param templates
 * @returns {Array}
 */
light.widget.getTemplateData = function(templates) {

  var result = [];

  _.each(templates, function(template) {
    var item = {};

    item.type = template.type;
    item.key = template.key;
    item.title = template.title;

    // text
    if (template.type === light.widget.TEXT) {
      item.value = $("#_" + template.key).val();
      result.push(item);
    }

    // select
    if (template.type === light.widget.SELECT) {

      if (template.selectType === "1") {
        item.value = $("#_" + template.key).attr("value");
        item.name = template.selectOption[parseInt(item.value)];
      }
      if (template.selectType === "2") {
        item.value = $("input[name*='_" + template.key + "']:checked").val();
        item.name = template.selectOption[parseInt(item.value)];
      }
      if (template.selectType === "3") {
        item.value = [];
        item.name = [];
        $("input[name*='_" + template.key + "']:checked").each(function(){
          item.value.push($(this).val());
          item.name.push(template.selectOption[parseInt($(this).val())]);
        });
      }

      // TODO 下拉框

      result.push(item);
    }

    // file
    if (template.type === light.widget.FILE) {

      // 图片
      if (template.fileType === "1") {
        item.value = [];
        item.name = [];
        item.fileType = template.fileType;
        $("#_" + template.key + "_filename>div").each(function() {
          item.value.push($(this).attr("fid"));
          item.name.push($(this).attr("fname"));
          result.push(item);
        });
      }

      // 文件
      if (template.fileType === "2") {
        item.value = [];
        item.name = [];
        item.fileType = template.fileType;
        $("#_" + template.key + "_filename span").each(function() {
          item.value.push($(this).attr("fid"));
          item.name.push($(this).html());
          result.push(item);
        });
      }
    }

    // grid
    if (template.type === light.widget.GRID) {

      item.name = template.gridTitle;
      item.value = [];

      var rowCount = template.gridRow
        , colCount = template.gridTitle.length;

      for (var i = 0; i < rowCount; i++) {
        var row = [];
        for (var j = 0; j < colCount; j++) {
          row.push($("#_" + template.key + "_" + i + "_" + j).val());
        }
        item.value.push(row);
      }
      result.push(item);
    }
  });

  return result;
};

///////////////////////////////////////////////////////////

light.widget.TEMPLATE_TABLE_VIEW = function() {
  return "<table class='table table-bordered'><tbody></tbody></table>";
};

light.widget.TEMPLATE_TEXT_VIEW = function() {
  var tmpl = function () {/*
   <tr>
   <td>{{title}}</td>
   <td>{{value}}</td>
   </tr>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
  return tmpl;
};

light.widget.TEMPLATE_SELECT_VIEW = function() {
  var tmpl = function(){/*
   <tr>
   <td>{{title}}</td>
   <td>{{name}}</td>
   </tr>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
  return tmpl;
};

light.widget.TEMPLATE_IMAGE_VIEW = function() {
  var tmpl = function(){/*
   <tr>
   <td>{{title}}</td>
   <td>
    <$ _.each(value, function(f) { $>
    <img src="/file/download/{{value}}">
    <$ }); $>
   </td>
   </tr>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
  return tmpl;
};

light.widget.TEMPLATE_ATTACH_VIEW = function() {
  var tmpl = function(){/*
   <tr>
   <td>{{title}}</td>
   <td>
     <$ _.each(value, function(f, index) { $>
     <a href="/file/download/{{value}}">{{name[index]}}</a>
     <$ }); $>
   </td>
   </tr>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
  return tmpl;
};

light.widget.TEMPLATE_GRID_VIEW = function() {
  var tmpl = function(){/*
   <tr>
   <td>{{title}}</td>
   <td>
    <table class="table table-striped">
     <tbody>
      <tr>
      <$ _.each(name, function(col) { $>
       <td>{{col}}</td>
      <$ }); $>
      </tr>
      <$ _.each(value, function(col) { $>
       <tr>
       <$ _.each(col, function(row, index) { $>
        <td>{{row}}</td>
       <$ }); $>
       </tr>
      <$ }); $>
     </tbody>
    </table>
   </td>
   </tr>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
  return tmpl;
};

///////////////////////////////////////////////////////////

/**
 * 代替Radio的按钮组合
 * @param id 字符串
 * @param value
 * @param clickCallback
 * @constructor
 */
var ButtonGroup = function(id, value, clickCallback) {
  this.id = $("#" + id);
  this.value = value;

  // append event
  var self = this;
  this.id.on("click", "button", function(){
    self.value = $(this).attr("value");
    self.init();

    if (clickCallback) {
      clickCallback(self.value);
    }
  });
};

ButtonGroup.prototype.init = function(initCallback) {

  // set default value
  this.id.attr("value", this.value);

  var child = this.id.children()
    , self = this;

  _.each(child, function(item){
    if (self.value == $(item).attr("value")) {
      $(item).addClass("btn-info");
//      $(item).removeClass("btn-white"); //TODO 检讨必要
      $(item).attr("active", "on");
    } else {
      $(item).removeClass("btn-info");
//      $(item).addClass("btn-white");  //TODO 检讨必要
      $(item).removeAttr("active");
    }
  });

  if (initCallback) {
    initCallback(self.value);
  }

  return this;
};

ButtonGroup.prototype.set = function(value) {
  this.value = value;
  this.init();
};

///////////////////////////////////////////////////////////