
light.file = light.file || {};

/**
 * 允许选择的文件类型, 可以指定多个
 * 个别的，可以使用.xxx的形式指定。如：.xml, .css
 * @type {string}
 */
light.file.TYPE_AUDIO = "audio/*";
light.file.TYPE_IMAGE = "image/*";
light.file.TYPE_VIDEO = "video/*";
light.file.TYPE_PDF   = "application/pdf";
light.file.TYPE_CSV   = "text/csv";
light.file.TYPE_TEXT  = "text/plain";
light.file.TYPE_EXCEL = "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

/**
 *
 * @param fileButton
 * @param options
 *  accept: 允许的文件种类
 *  multiple: 是否支持多个文件
 *  url: 上传URL
 *  check: {Function}
 *  error: {Function}
 *  success: {Function}
 *  progress: {Function}
 * @param data
 */
light.initFileUpload = function (fileButton, options, data) {

  var button   = $("#" + fileButton)
    , id       = options.id || "_fileupload"
    , accept   = options.accept || "*"
    , multiple = options.multiple ? "multiple" : ""
    , check    = options.check || function() {return true};

  // add file item
  var input = $(_.str.sprintf("<input type='file' id='%s' style='display: none;' accept='%s' %s />"
    , id
    , accept
    , multiple));

  // bind event
  input.insertAfter(button).bind("change", function (event) {
    var files = event.target.files;
    if (!files || files.length <= 0) {
      return false;
    }

    // do check
    if (options.check && !options.check.call(button, files)) {
      return false;
    }

    // create form data
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) {
      fd.append("files", files[i]);
    }

    // upload
    light.dopostData(options.url || "/file/upload", data || {}, fd, function (err, result) {
        if (err) {
          if (options.error) {
            options.error.call(button, err);
          }
        } else {
          if (options.success) {
            options.success.call(button, result.data);
          }
        }
      }, function (progressValue) {
        if (options.progress) {
          options.progress.call(button, progressValue);
        }
      }
    );

  });

  button.bind("click", function () {
    input.trigger("click");
    return false;
  });
};

/**
 * 文件上传,带filelabel
 * @param containerItem
 * @param fileButton
 * @param options
 * @param data
 *  accept: 允许的文件种类
 *  multiple: 是否支持多个文件
 *  url: 上传URL
 *  download: 下载URL
 *  check: {Function}
 *  error: {Function}
 *  success: {Function}
 *  progress: {Function}
 */
light.initFileUploadWithContainer = function (containerItem, fileButton, options, data) {

  // 添加css
  var item = $("#" + containerItem);
  item.addClass("file-container");

  // 文件标签容器
  var container = item.empty().append("<ol></ol>");
  function initFileLabel(files) {

    var ol = container.children("ol");
    _.each(files, function (file) {

      var name = file.name || file.fileName
        , id = file._id || file.fileId;

      // 删除按钮
      var xBtn = $("<a/>").attr("fid", id).attr("fname", name).append("<i class='fa fa-times'></i>");
      xBtn.bind("click", function () {
        $(this).parent().remove();
      });

      // 名称标签
      var title = $("<span/>").html(name).attr("fid", id);
      title.bind("click", function () {
        window.location = options.download || "/file/download/" + $(this).attr("fid");
      });

      ol.append($("<li/>").append(title).append(xBtn));
    });
  }

  // clone参数，替换success方法
  var copiedOptions = _.clone(options);
  copiedOptions.success = function(files) {

    // 添加文件标签
    initFileLabel(files);

    // 调用原生success方法
    if (options.success) {
      options.success(files);
    }
    return false;
  };

  light.initFileUpload(fileButton, copiedOptions, data);
};

light.initFileUploadWithImage = function (containerItem, fileButton, options, data) {

  // 添加css
  var item = $("#" + containerItem);
  item.addClass("file-container");

  // 文件标签容器
  var container = item.empty();
  function initFileLabel(files) {

    _.each(files, function (file) {
      var name = file.name || file.fileName
        , id = file._id || file.fileId;

      var div = $("<div class='thumbnail'></div>");
      div.css("width", (options.width || "200") + "px");
      div.attr("fid", id);
      div.attr("fname", name);

      // 名称标签
      var img = $("<img src=''>");
      img.attr("src", "/file/download/" + id);
      div.append(img)
      container.append(div);
    });
  }

  // clone参数，替换success方法
  var copiedOptions = _.clone(options);
  copiedOptions.success = function(files) {

    // 添加文件标签
    initFileLabel(files);

    // 调用原生success方法
    if (options.success) {
      options.success(files);
    }
    return false;
  };

  light.initFileUpload(fileButton, copiedOptions, data);
};