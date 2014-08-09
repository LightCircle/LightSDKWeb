
/* 文件上传 */
light.initFileupload = function (sel, option, success, error, progress) {
  var btn = $(sel);
  var input = $('<input type="file" style="display: none" accept="*" />');
  if (option && option.multiple) {
    input.attr('multiple', 'multiple');
  }
  input.insertAfter(btn).bind("change", function (event) {
    var files = event.target.files;

    if (!files || files.length <= 0) {
      return false;
    }

    var fd = new FormData();

    //file type check
    if (option && option.accept) {
      var accept = option.accept.split(',');
      for (var i = 0; i < files.length; i++) {
        if (!_.contains(accept, files[i].name.split('.').pop())) {
          alertify.error("只支持 " + option.accept + " 格式的文件上传。");
          event.target.value = "";
          return;
        }
      }
    }

    //size limit check
    if (option && option.sizeLimit) {
      for (var i = 0; i < files.length; i++) {
        if (files[i].size > option.sizeLimit) {
          alertify.error("文件: " + files[i].name + " 太大。");
          event.target.value = "";
          return;
        }
      }
    }

    for (var i = 0; i < files.length; i++) {
      fd.append("files", files[i]);
    }

    light.dopostData('/file/upload', option, fd, function (err, result) {
        event.target.value = "";
        if (err) {
          if (error) {
            error.call(btn, err);
          }
        } else {
          if (success) {
            success.call(btn, result.data);
          }
        }
      }, function (progress_value) {
        if (progress) {
          progress.call(btn, progress_value);
        }
      }
    );

  });

  btn.bind("click", function () {
    input.trigger("click");
    return false;
  });
};

/* 文件上传,带filelabel */
light.initFileuploadWithContainer = function (sel, containerSel, option, success, error, progress) {
  var container = $(containerSel).empty().append('<ol></ol>');

  function initFileLabel(files) {
    var ol = container.children("ol");

    _.each(files, function (file) {

      var name = file.name || file.fileName;
      var id = file._id || file.fileId;
      var xBtn = $('<a/>').attr('fid', id).attr('fname', name).append('<i class="fa fa-times"></i>');
      xBtn.bind('click', function () {
        $(this).parent().remove();
      });

      var title = $("<span/>").html(name).attr('fid', id);
      title.bind('click', function () {
        window.location = "/file/download.json?fileId=" + $(this).attr('fid');
      });

      var item = $('<li/>').append(title).append(xBtn);
      ol.append(item);

    });
  }

  light.initFileupload(sel, option
    , function (files) {
      initFileLabel(files);
      success(files);
    }, error, progress);

  if (option && option.data) {
    initFileLabel(option.data);
  }
};