// namespace
var light = {

  // The global setting
  image_prefix: function () {
    return "/picture/"
  },
  scale_width: function (web_w, ipad_w) {
    return web_w / ipad_w;
  },
  scale_height: function (web_h, ipad_h) {
    return web_h / ipad_h;
  },
  rule_wight: 1024,
  rule_height: 723,
  init: function () {
    _.templateSettings = {
      interpolate: /\{\{-(.+?)\}\}/gim,
      evaluate: /\<\$(.+?)\$\>/gim,
      escape: /\{\{([^-]+?)\}\}/gim
    };
  }(),
  datailImageLoader: function () {
    var imgs = $("[data-img]");
    var urlArray = [];
    var countImg = 0;
    imgs.each(function (i, img) {
      urlArray.push($(img).attr("data-img"));
    });
    $.imageloader({
      urls: urlArray,

      smoothing: true,

      onComplete: function (images) {
        $('#complete-icon').animate({opacity: 1}, 600);
      },

      onUpdate: function (ratio, image) {
        if (image) {

          $("[data-img='" + image + "']").delay(countImg * 50).animate({opacity: 1}, 1000);
          $("[data-img='" + image + "']").attr("src", image);

          countImg++;
        }
      },

      onError: function (err) {
        console.log(err);
      }
    });
  },
  imageLoader: function () {
    var imgs = $("[data-img]");
    var urlArray = [];
    var countImg = 0;
    imgs.each(function (i, img) {
      urlArray.push($(img).attr("data-img"));
    });
    $.imageloader({
      urls: urlArray,

      smoothing: true,

      onComplete: function (images) {
        $('#complete-icon').animate({opacity: 1}, 600);
      },

      onUpdate: function (ratio, image) {
        if (image) {

          $("[data-img='" + image + "']").delay(countImg * 50).animate({opacity: 1}, 1000);
          $("[data-img='" + image + "']").css("width", "155px");
          //$("[data-img='"+image+"']").css("height","155px");
          $("[data-img='" + image + "']").attr("src", image);

          countImg++;
        }
      },

      onError: function (err) {
        console.log(err);
      }
    });
  },
  /**
   * Create this closure to contain the cached models
   */
  model: function () {

    // Internal model cache.
    var models = {};

    // Create a new model reference scaffold or load an existing model.
    return function (name) {

      // If this model has already been created, return it.
      if (models[name]) {
        return models[name];
      }

      // Create a model and save it under this name
      return models[name] = {};
    };
  }(),

  /**
   * Create this closure to contain the cached views
   */
  view: function () {

    var views = {};

    return function (name) {
      if (views[name]) {
        return views[name];
      }
      return views[name] = {};
    };
  }(),

  /**
   * 获取CSRF Token
   */
  csrf: function () {
    return encodeURIComponent($("#_csrf").val());
  },

  uid: function () {
    return $("#userid").val();
  },

  /**
   * 转换换行符为HTML的<br />
   */
  mutiLineHTML: function (src) {
    // if (src) {
    //   return src.split(/\r\n|\r|\n/).join("<br />");
    // }
    return src;
  },

  date: function (date, format) {
    if (typeof(date) != "string" || date == "")
      return "";
    format = format || "yyyy/MM/dd hh:mm";

    var time = Date.parse(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
//    time += new Date().getTimezoneOffset() * 60 * 1000;

    return new Date(time).Format(format);
  },

  /**
   * 显示发送私信的框
   */
  sendPrivateMessage: function (uid, success) {

    var msgbox = $("#_privatemsg")
      , sendbutton = $("#_privatemsg_send");
    if (msgbox) {

      sendbutton.bind("click", function () {
        var u = uid
          , m = $('#_privatemsg_txt').val();
        light.send(u, m, function () {
          msgbox.modal('hide');
          sendbutton.unbind('click');
          if (success) {
            success();
          }
        });
      });

      msgbox.modal('show');
    }
  },

  /**
   * 发送私信
   */
  send: function (userid, message, callback) {
    if (!userid || !message) {
      return false;
    }

    var self = this;
    $.ajax({
      url: "/shortmail/creat.json?_csrf=" + self.csrf(), async: false, type: "POST", data: {
        "_id": userid, "message": message
      }, success: function (data, type) {
        if (callback) {
          callback(null, data);
        }
      }, error: function (jqXHR, textStatus, errorThrown) {
        if (callback) {
          callback(errorThrown);
        }
      }
    });
  },


  sendNotification: function (userid, content, type) {
    if (!userid || !content) {
      return false;
    }

    var self = this;
    $.ajax({
      url: "/message/notification.json?_csrf=" + self.csrf(), async: false, type: "POST", data: {
        "_id": userid, "content": content, "type": type
      }
    });
  },

  /*
   ******************************
   *      注意
   ******************************
   * html中的...缩略显示推荐使用text-overflow属性实现
   */
  cutString: function (str, len) {
    //length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
      return str;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
      s = s + str.charAt(i);
      if (str.charCodeAt(i) > 128) {
        strlen = strlen + 2;
        if (strlen > len) {
          return s.substring(0, s.length - 1) + "...";
        }
      } else {
        strlen = strlen + 1;
        if (strlen > len) {
          return s.substring(0, s.length - 2) + "...";
        }
      }
    }
    return s;
  },

  dopostData: function (url_, urlData_, data_, callback_, progress_) {

    var self = this;

    data_.append("uid", this.uid());

    urlData_._csrf = decodeURIComponent(self.csrf());
    url_ += '?' + $.param(urlData_);

    $.ajax({
      url: url_, type: "POST", async: true, data: data_, dataType: "json", contentType: false, processData: false, xhr: function () {
        XHR = $.ajaxSettings.xhr();
        if (XHR.upload) {
          XHR.upload.addEventListener('progress', function (e) {
            if (progress_) {
              progress_(parseInt(e.loaded / e.total * 10000) / 100);
            }
          }, false);
        }
        return XHR;
      }, success: function (result) {
        if (result.error) {
          callback_(1, result.error);
        } else {
          callback_(0, result);
        }
      }, error: function (err) {
        callback_(err);
      }
    });
  },

  dopost: function (url_, obj_, callback_) {
    obj_["uid"] = this.uid();
    var self = this;
    $.ajax({
      url: url_ + "?_csrf=" + self.csrf(), type: "POST", async: false, data: JSON.stringify(obj_), dataType: "json", contentType: "application/json", processData: false, success: function (result) {
        console.log("do ajax " + url_ + "  success");
        if (result.error) {
          callback_(1, result.error);
        } else {
          callback_(0, result);
        }
      }, error: function (err) {
        console.log("do ajax " + url_ + "   error");
        callback_(err);
      }
    });
  },

  doput: function (url_, data_, callback_) {
    var self = this;
    $.ajax({
      url: url_ + "?_csrf=" + self.csrf(), type: "PUT", async: false
//      , data: data_
      , data: JSON.stringify(data_), dataType: "json", contentType: "application/json", success: function (result) {
        callback_(result.error, result.data);
      }, error: function (err) {
        callback_(err);
      }
    });
  },

  dodelete: function (url_, data_, callback_) {
    var self = this;
    $.ajax({
      url: url_ + "?_csrf=" + self.csrf(), type: "DELETE", async: false, data: JSON.stringify(data_), dataType: "json", contentType: "application/json", processData: false, success: function (result) {
        callback_(result.error, result.data);
      }, error: function (err) {
        callback_(err);
      }
    });
  },

  doget: function (url_, data_, callback_) {

    var callback = _.isFunction(data_) ? data_ : callback_
      , data = _.isFunction(data_) ? undefined : data_;

    $.ajax({
      type: "GET", url: url_, data: data, dataType: "json", success: function (result) {
        callback(result.error, result.data);
      }, error: function (err) {
        callback(err);
      }
    });
  },
  /* 文件上传 */
  initFileupload: function (sel, option, success, error, progress) {
    var self = this;
    var btn = $(sel);
    var input = $('<input type="file" style="display: none" accept="*" />');
    if(option && option.multiple){
      input.attr('multiple','multiple');
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

      // TODO: URL被限定不能成为共同，这个部分交给调用程序端做比较好
      self.dopostData('/admin/file/add.json', option, fd, function (err, result) {
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
  },
  error: function (err, defaultMsg, moveToErrPage) {
    if (err) {
      if (err.status == 403 || err.status == 400 || err.status == 500) {
        if (moveToErrPage) {
          window.location = "/error/" + err.status;
          return true;
        }
      }

      if (err.responseJSON && err.responseJSON.error && err.responseJSON.error.message) {
        alertify.error(err.responseJSON.error.message);
      } else {
        alertify.error(defaultMsg);
      }
      return true;
    } else {
      return false;
    }
  },

  /**
   * 通过HTML5的FileAPI，实现本地照片文件的预览
   */
  localPreview: function (file, img, callback_) {
    if (!file.type.match("image.*")) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function (event) {
      img.attr("src", event.target.result);
      if (callback_)
        callback_();
    };
    reader.readAsDataURL(file);
  },

  /**
   * 翻页
   */
  paginationInitalized: false,
  paginationScrollTop: true,
  pagination: function (container, totalItems, rowCount, callback) {

    // 初始化一次
    if (this.paginationInitalized) {
      return;
    }
    this.paginationInitalized = true;

    var startPage = 1, pageCount = 5
      , limit = Math.ceil(totalItems / rowCount) > pageCount ? pageCount : Math.ceil(totalItems / rowCount)
      , tmpl = $("#tmpl_pagination").html();

    container.unbind("click").on("click", "a", function (event) {

      var activePage = $(event.target).attr("activePage");

      if (activePage == "prev") {
        if (startPage == 1) {
          return false;
        } else {
          startPage = activePage = startPage - pageCount < 1 ? 1 : startPage - pageCount;
        }
      } else if (activePage == "next") {
        if (Math.ceil((totalItems - (startPage - 1) * rowCount) / rowCount) > pageCount) {
          startPage = activePage = startPage + pageCount;
        }
        else {
          return false;
        }
      }
      callback((activePage - 1) * rowCount);

      var remainder = Math.ceil((totalItems - (startPage - 1) * rowCount) / rowCount)
        , limit = remainder > pageCount ? pageCount : remainder;
      container.html("");
      container.append(_.template(tmpl, {
        "start": startPage, "limit": limit, "active": activePage, "canPrev": startPage > 1, "canNext": (startPage + limit - 1 < Math.ceil(totalItems / rowCount)) && (limit >= pageCount)
      }));
      if (light.paginationScrollTop) {
        return;
      } else {

        return false;
      }

    });

    // 初始化
    container.html("");
    container.append(_.template(tmpl, {
      "start": 1, "limit": limit, "active": 1, "canPrev": false, "canNext": limit < Math.ceil(totalItems / rowCount) && (limit >= pageCount)
    }));
  },

  /**
   * 显示消息框
   *  type: 消息类型 error, warning, success, information
   *  destory: 自动销毁的时间, 单位为秒, 指定的值<=0则不自动销毁
   *  position: 消息框出现的位置, 没设定则显示在画面中间
   */
  show: function (type, title, message, destroy, position) {
    alertify.success(message);

    var tmpl = $("#alert-template").html();

    // // 显示消息框
    // $(document.body).append(_.template(tmpl, {
    //     "type": type
    //   , "title": title
    //   , "message": message
    // }));

    // // 确定位置
    // var msgbody = $("#_alert")
    //   , x = position ? position.x : ($(document).width() - msgbody.width()) / 2
    //   , y = position ? position.y : 5;
    // msgbody.css("top", y);
    // msgbody.css("left", x);

    // // 绑定
    // $("#_alert button").on("click", function(){
    //   msgbody.remove();
    // });

    // // 自动销毁
    // if (destroy > 0) {
    //   setTimeout(function(){ if (msgbody) { msgbody.remove(); } }, destroy * 1000);
    // }
  },

  // 尝试使用浏览器的通知功能
  notify: function (title, message) {
    var nc = window.webkitNotifications;
    if (!nc) {
      console.log("Notifications are not supported for this Browser/OS version yet.");
      return;
    }

    if (nc.checkPermission() == 1) {// 1 = Not Allowed, 2 = Denied, 0 = Allowed
      nc.requestPermission(function () {
        //得到授权之后的回调方法
        light.showNotify(title, options);
      });

    } else if (nc.checkPermission() == 0) {
      // Parameters: string URL_TO_IMAGE, string Title, string Body
      var notif = nc.createNotification(null, title, message);
      notif.show();

    } else if (nc.checkPermission() == 2) {
      console.log('denied notification');
      return;
    }
  },

  dataTableLang: function () {
    return {
      sSearch: "查找:",
      sLengthMenu: "显示 _MENU_ 条记录",
      sInfo: "共 _TOTAL_ 条记录,显示 _START_ 到 _END_ 条",
      sInfoEmpty:"共 0 条记录",
      sEmptyTable: "没有找到记录",
      oPaginate: {
        sPrevious: "上一页",
        sNext: "下一页",
        sLast: "最后页",
        sFirst: "第一页"
      }
    };
  }
};

Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

  return fmt;
};

/**
 * 代替Radio的按钮组合
 * @param id 字符串
 * @param value
 * @constructor
 */
var ButtonGroup = function (id, value, clickCallback) {
  this.id = $("#" + id);
  this.value = value;

  // append event
  var self = this;
  this.id.on("click", "button", function () {
    self.value = $(this).attr("value");
    self.init();

    if (clickCallback) {
      clickCallback(this.value);
    }
  });
};

ButtonGroup.prototype.init = function (initCallback) {

  // set default value
  this.id.attr("value", this.value);

  var child = this.id.children()
    , self = this;

  _.each(child, function (item) {
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
};

ButtonGroup.prototype.set = function (value) {
  this.value = value;
  this.init();
};