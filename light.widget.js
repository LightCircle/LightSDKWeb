
light.widget = light.widget || {};

/**
 * 常量定义
 */
light.widget.LABEL  = "Label";
light.widget.SELECT = "Select";
light.widget.TEXT   = "Text";
light.widget.FILE   = "File";
light.widget.GRID   = "Grid";
light.widget.Label  = "Label";

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
      console.log(item);

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

  // 绑定上传文件事件
  $("#_uploadfile").bind("change", function(event){
    uploadFiles(event.target.files, "/file/add", function(err, result) {

      var ids = [], names = [];
      _.each(result.data, function(data) {
        ids.push(data._id);
        names.push(data.name);
      });

      // 将文件id和名字设定到指定控件
      var src = $(event.target).attr("src");
      $("#_" + src).val(ids.join(","));
      $("#_" + src + "_filename").html(names.join(","));
    });
  });
}

/**
 * 保存模板数据
 * @param templates
 * @returns {Array}
 */
light.widget.saveTemplateData = function(templates) {

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

      result.push(item);
    }

    // file
    if (template.type === light.widget.FILE) {
      item.value = $("#_" + template.key).val();
      item.name = $("#_" + template.key + "_filename").html();
      result.push(item);
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

  console.log(result);
  return result;
}

///////////////////////////////////////////////////////////

/**
 * 上传文件
 * @param files
 * @param url
 * @param callback
 * @returns {boolean}
 */
function uploadFiles(files, url, callback) {

  if (!files || files.length <= 0) {
    return false;
  }

  var fd = new FormData();
  for (var i = 0; i < files.length; i++) {
    fd.append("files", files[i]);
  }

  // 显示进度条
  $("#upload_progress_dlg").modal("show");

  // 发送文件
  light.dopostData(url, fd, function(err, result){

      $("#_upload_progress_dlg").modal("hide");
      if (callback) {
        callback(err, result);
      }
    }, function(progress){
      $("#_upload_progress_bar").css("width", progress + "%");
    }
  );
}

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