
light.selectbox = light.selectbox || {};

/**
 * 被选中的项目
 * @type {{}}
 */
light.selectbox.selected = {};

/**
 * 显示对象的附加条件
 * @type {{}}
 */
light.selectbox.condition = {};

/**
 * 选择用户的回调函数
 */
light.selectbox.callback = undefined;

/**
 * 常量
 * @type {string}
 */
light.selectbox.user      = "user";
light.selectbox.group     = "group";
light.selectbox.category  = "category";
light.selectbox.role      = "role";
light.selectbox.tag       = "tag";
light.selectbox.file      = "file";

/**
 * 依赖的API
 *  /user/list
 *  /group/list
 *  /category/list
 *  /role/list
 *  /tag/list
 */
$(function () {

  /**
   * 显示选择对话框
   * @param type
   */
  light.selectbox.show = function(type) {

    light.selectbox.selected = {};
    switch (type) {
      case light.selectbox.user:
        getUserList();
        break;
      case light.selectbox.user:
        break;
      case light.selectbox.group:
        getGroupList();
        break;
      case light.selectbox.category:
        getCategoryList();
        break;
      case light.selectbox.role:
        getRoleList();
        break;
      case light.selectbox.tag:
        getTagList();
        break;
      case light.selectbox.file:
        getFileList();
        break;
    }

    $("#dlgSelectBox").modal("show");
  };

  light.selectbox.hide = function() {
    $("#dlgSelectBox").modal("hide");
  };

  /**
   * 获取用户一览
   */
  var getUserList = function() {

    light.doget("/user/list", light.selectbox.condition, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = $("#tmplDlgSelectBoxBody").html()
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {
          dlgSelectBoxBody.append(_.template(tmplDlgSelectBoxBody, {
            index: index + 1,
            id: item._id,
            icon: "user",
            name: item.id,
            option1: item.name,
            option2: ""
          }));
        });
      }
    });
  };

  /**
   * 获取标签一览
   */
  var getTagList = function() {
    light.doget("/tag/list", light.selectbox.condition, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = $("#tmplDlgSelectBoxBody").html()
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {
          dlgSelectBoxBody.append(_.template(tmplDlgSelectBoxBody, {
            index: index + 1,
            id: item._id,
            icon: "tag",
            name: item.name,
            option1: "",
            option2: ""
          }));
        });
      }
    });
  };

  /**
   * 获取组一览
   */
  var getGroupList = function() {
    light.doget("/group/list", light.selectbox.condition, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = $("#tmplDlgSelectBoxBody").html()
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {

          dlgSelectBoxBody.append(_.template(tmplDlgSelectBoxBody, {
            index: index + 1,
            id: item._id,
            icon: "group",
            name: item.name,
            option1: "",
            option2: ""
          }));
        });
      }
    });
  };

  /**
   * 获取分类一览
   */
  var getCategoryList = function() {
  };

  /**
   * 获取文件一览
   */
  var getFileList = function() {
    light.doget("/file/list", light.selectbox.condition, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = $("#tmplDlgSelectBoxBody").html()
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {
          console.log(item);
          dlgSelectBoxBody.append(_.template(tmplDlgSelectBoxBody, {
            index: index + 1,
            id: item._id,
            icon: "file",
            name: item.name,
            option1: Math.ceil(item.length / 1024) + " KB",
            option2: ""
          }));
        });
      }
    });
  };

  /**
   * 获取角色一览
   */
  var getRoleList = function() {
    light.doget("/role/list", function(err, result) {
      if (err) {
        light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = $("#tmplDlgSelectBoxBody").html()
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {
          dlgSelectBoxBody.append(_.template(tmplDlgSelectBoxBody, {
            index: index + 1,
            id: item._id,
            icon: "lock",
            name: item.name,
            option1: item.description,
            option2: ""
          }));
        });
      }
    });
  };

  /**
   * 事件绑定
   */
  var events = function() {

    // 选择行
    $("#dlgSelectBoxBody").on("click", "tr", function(event) {
      var target = $(event.currentTarget)
        , key = target.attr("key")
        , check = target.children(":last")
        , tmplCheck = $("#tmplCheck").html();

      if (check.prop("checked")) {
        check.removeProp("checked");
        check.html("");
        delete light.selectbox.selected[key];
      } else {
        check.prop("checked", "checked");
        check.html(tmplCheck);
        light.selectbox.selected[key] = {
          name: target.attr("value"),
          option: target.attr("option1")
        };
      }
    });

    // 点击确定按钮
    $("#btnOK").bind("click", function() {
      if (light.selectbox.callback) {
        light.selectbox.callback(light.selectbox.selected);
      }
      light.selectbox.hide();
    });

    // 选择过滤字符
    $("#btnAlphabet").on("click", "a", function() {
      // TODO: 加用户过滤
      console.log($(event.target).html());

      // TODO: 加选择字符及清楚选择的功能
    });
  };

  /**
   * 显示字母过滤标题
   */
  var setAlphabet = function() {
    var btnAlphabet = $("#btnAlphabet")
      , tmplAlphabet = $("#tmplAlphabet").html();

    for (var cc = 65; cc < 90; cc++) {
      btnAlphabet.append(_.template(tmplAlphabet, {code: String.fromCharCode(cc)}));
    }
  };

  /**
   * 初始化对话框，并执行
   */
  var init = function() {
    setAlphabet();
    events();
  }();
});
