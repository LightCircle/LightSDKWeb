
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
    item.defaultValue = item.default || "";
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
            }, check: function(files){
              for (var i = 0; i < files.length; i++) {
                if(files[i].size > 50*1024*1024){
                  alertify.error("图片大小不能超过50MB");
                  return false;
                }
              }
              return true;
            }
          });
      }

      // 普通文件
      if (item.fileType === "2") {
        light.initFileUploadWithContainer(
            "_" + item.key + "_filename"
          , "_" + item.key + "_file"
          , {
            multiple: true,
            success: function(data) {
              return false;
            }, check: function(files){
              for (var i = 0; i < files.length; i++) {
                if(files[i].size > 50*1024*1024){
                  alertify.error("文件大小不能超过50MB");
                  return false;
                }
              }
              return true;
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

    if (!_.isEmpty(tmpl)) {
      container.append(_.template(tmpl, item));
    }

    $(".fancybox").fancybox({
      openEffect  : "fade",
      closeEffect : "fade",
      type : "image"
    });

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

        // button group
        if (template.selectType === "1") {
          light.buttongroup.set("_" + template.key, val.value);
        }

        // radio
        if (template.selectType === "2") {
          $("input:radio[name='_" + template.key + "']").val([val.value]);
        }

        // checkbox
        if (template.selectType === "3") {
          $("input:checkbox[name='_" + template.key + "']").val(val.value);
        }

        // pulldown
        if (template.selectType === "4") {
          $("select[name*='_" + template.key + "']").find("option[value='" + val.value + "']").attr("selected", true);
        }
      }

      // file
      if (template.type === light.widget.FILE) {

        // 图片
        if (template.fileType === "1") {
          var images = [];
          _.each(val.value, function(id, index) {
            images.push({ id: id, name: val.name[index], width: val.width });
          });
          light.file.setImage("_" + template.key + "_filename", images);
        }

        // 文件
        if (template.fileType === "2") {
          var files = [];
          _.each(val.value, function(id, index) {
            files.push({ id: id, name: val.name[index] });
          });
          light.file.setFile("_" + template.key + "_filename", files);
        }
      }

      // grid
      if (template.type === light.widget.GRID) {
        var rowCount = template.gridRow
          , colCount = template.gridTitle.length;

        _.each(val.value, function(cols, i) {
          _.each(cols, function(col, j) {
            $("#_" + template.key + "_" + i + "_" + j).val(col);
          });
        });
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
      if (template.selectType === "4") {
        var optionNode = $("select[name*='_" + template.key + "']").find("option:selected");
        item.value = $(optionNode).val();
        item.name = template.selectOption[parseInt(item.value)];
      }

      result.push(item);
    }

    // file
    if (template.type === light.widget.FILE) {

      // 图片
      if (template.fileType === "1") {
        item.value = [];
        item.name = [];
        item.width = [];
        item.fileType = template.fileType;
        $("#_" + template.key + "_filename>div").each(function() {
          item.value.push($(this).attr("fid"));
          item.name.push($(this).attr("fname"));
          item.width.push($(this).css("width"));
        });
        result.push(item);
      }

      // 文件
      if (template.fileType === "2") {
        item.value = [];
        item.name = [];
        item.fileType = template.fileType;
        $("#_" + template.key + "_filename span").each(function() {
          item.value.push($(this).attr("fid"));
          item.name.push($(this).html());
        });
        result.push(item);
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
// 模板
///////////////////////////////////////////////////////////

light.widget.TEMPLATE_TABLE_VIEW = function() {
  return "<table class='table table-bordered'><tbody></tbody></table>";
};

light.widget.TEMPLATE_TEXT_VIEW = function() {
  var tmpl = function () {/*
   <tr>
   <td class="title">{{title}}</td>
   <td>{{-_.escape(value).split('\n').join('<br>')}}</td>
   </tr>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
  return tmpl;
};

light.widget.TEMPLATE_SELECT_VIEW = function() {
  var tmpl = function(){/*
   <tr>
   <td class="title">{{title}}</td>
   <td>{{name}}</td>
   </tr>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
  return tmpl;
};

light.widget.TEMPLATE_IMAGE_VIEW = function() {
  var tmpl = function(){/*
   <tr>
   <td class="title">{{title}}</td>
   <td>
   <$ _.each(value, function(f, index) { $>
   <a class="fancybox" rel="group" href="/file/image/{{f}}">
   <img src="/file/image/{{f}}" style="width: {{width[index]}}">
   </a>
   <$ }); $>
   </td>
   </tr>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
  return tmpl;
};

light.widget.TEMPLATE_ATTACH_VIEW = function() {
  var tmpl = function(){/*
   <tr>
   <td class="title">{{title}}</td>
   <td>
   <$ _.each(value, function(f, index) { $>
   <a href="/file/download/{{f}}">{{name[index]}}</a>
   <$ }); $>
   </td>
   </tr>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
  return tmpl;
};

light.widget.TEMPLATE_GRID_VIEW = function() {
  var tmpl = function(){/*
   <tr>
   <td class="title">{{title}}</td>
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

