
light.file = light.file || {};

// TODO: 添加进度条，添加大小限制

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
 * 扩展属性
 * @type {{}}
 */
light.file.extend = {};

/**
 *
 * @param fileButton
 * @param options
 *  accept  : 允许的文件种类
 *  multiple: 是否支持多个文件
 *  url     : 上传URL
 *  nometa  : 是否创建META信息，缺省为创建
 *  check   : {Function}
 *  error   : {Function}
 *  success : {Function}
 *  progress: {Function}
 * @param data
 */
light.initFileUpload = function (fileButton, options) {

  var button    = $("#" + fileButton)
    , id        = options.id || "_fileupload"
    , accept    = options.accept || "*"
    , multiple  = options.multiple ? "multiple" : ""
    , check     = options.check || function() {return true};

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
    if (!check.call(button, files)) {
      return false;
    }

    // create form data
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) {
      fd.append("files", files[i]);
    }

    if (options.progress) {
      options.progress.call(button, 1);
    }

    // upload
    var url = options.url || (options.nometa ? "/file/upload" : "/file/create");
    var extend = options.extend ? options.extend : light.file.extend;
    light.dopostData(url, {extend: extend}, fd, function (err, result) {
        if (err) {
          if (options.error) {
            options.error.call(button, err);
          }
        } else {
          if (options.success) {
            options.success.call(button, result.data.items);
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
 *  nometa  : 是否创建META信息，缺省为创建
 *  check: {Function}
 *  error: {Function}
 *  success: {Function}
 *  progress: {Function}
 */
light.initFileUploadWithContainer = function (containerItem, fileButton, options, data) {

  // clone参数，替换success方法
  var copiedOptions = _.clone(options);
  copiedOptions.success = function(files) {

    // 添加文件标签
    light.file.setFile(containerItem, files);

    // 调用原生success方法
    if (options.success) {
      options.success(files);
    }
    return false;
  };

  light.initFileUpload(fileButton, copiedOptions, data);
};

light.initFileUploadWithImage = function (containerItem, fileButton, options, data) {

  // clone参数，替换success方法
  var copiedOptions = _.clone(options);
  copiedOptions.success = function(files) {

    // 添加文件标签
    light.file.setImage(containerItem, files);

    // 调用原生success方法
    if (options.success) {
      options.success(files);
    }
    return false;
  };

  light.initFileUpload(fileButton, copiedOptions, data);
};

/**
 * 设定图片显示
 * @param containerItem
 * @param files
 */
light.file.setImage = function(containerItem, files) {

  var template = light.file.TEMPLATE_IMAGE()
    , item = $("#" + containerItem)
    , container = item.empty();

  item.addClass("file-container");
  _.each(files, function (file) {
    container.append(_.template(template, {
      url: "/file/download/" + (file.id || file._id),
      id: file.id || file._id,
      name: file.name,
      width: (file.width || "200") + "px"
    }));
  });
};

light.file.clearFile = function(containerItem) {
  $("#" + containerItem).empty();
};

light.file.setFile = function(containerItem, files) {

  var template = light.file.TEMPLATE_FILE()
    , item = $("#" + containerItem);

  item.empty().append("<ol></ol>");
  item.addClass("file-container");

  var container = item.children("ol");
  _.each(files, function (file) {
    container.append(_.template(template, {
      url: "/file/download/" + (file.id || file._id),
      id: file.id || file._id,
      name: file.name
    }));
  });
};

light.file.TEMPLATE_FILE = function() {
  return function(){/*
  <li>
    <span fid='{{id}}' onclick='javascript: window.location="{{url}}"'>{{name}}</span>
    <a fid='{{id}}' fname='{{name}}' onclick='javascript: $(this).parent().remove(); return false;'>
      <i class='fa fa-times'></i>
    </a>
  </li>
  */}.toString().split(/\n/).slice(1, -1).join("\n");
};

light.file.TEMPLATE_IMAGE = function() {
  return function(){/*
   <div class='thumbnail' style='width: {{width}}' fid='{{id}}' fname='{{name}}'>
     <img src='{{url}}'>
     <span>{{name}}</span>
     <a href='#' fid='{{id}}' fname='{{name}}'
         onclick='javascript: $(this).parent().remove(); return false;'>
       <i class='fa fa-times'></i>
     </a>
   </div>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
};
