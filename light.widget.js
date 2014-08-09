
light.widget = light.widget || {};

/**
 * 常量定义
 */
light.widget.LABEL  = "Label";
light.widget.SELECT = "Select";
light.widget.TEXT   = "Text";
light.widget.FILE   = "File";
light.widget.GRID   = "Grid";
light.widget.SPLIT  = "Split";

/**
 * 加载模板，在画面显示模板控件
 * @param templates
 * @param container
 * @param canEdit
 */
function loadTemplate(templates, container, canEdit) {

  container.html("");

  // 添加项目
  _.each(templates, function(item) {

    item.canEdit = canEdit;
    container.append(_.template($("#tmpl" + item.type).html(), item));

    // 选择框
    if (item.type === light.widget.SELECT) {
      new ButtonGroup("_" + item.key, item.default).init();
    }

    // 文件
    if (item.type === light.widget.FILE) {
      $("#_" + item.key + "_file").on("click", "button", function() {
        $("#_uploadfile").attr("src", item.key);
        $("#_uploadfile").trigger("click");
        return false;
      });
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
function saveTemplateData(templates) {

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
      item.value = $("#_" + template.key).attr("value");


      item.name = template.selectOption[parseInt(item.value)];
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