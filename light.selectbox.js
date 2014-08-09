
var light = smart; // TODO: 临时对应，将来smart名称全部改成light

light.selectbox = light.selectbox || {};

/**
 * 被选中的项目
 * @type {{}}
 */
light.selectbox.selected = {};

/**
 * 选择用户的回调函数
 */
light.selectbox.callback = undefined;

/**
 * 常量
 * @type {string}
 */
light.selectbox.user = "user";
light.selectbox.group = "group";
light.selectbox.category = "category";
light.selectbox.role = "role";

/**
 * 依赖的API
 *  /user/list
 *  /group/list
 *  /category/list
 *  /role/list
 */
$(function () {

  /**
   * 显示选择对话框
   * @param type
   */
  light.selectbox.show = function(type) {

    light.selectbox.selected = {};
    if (type === light.selectbox.user) {
      getUserList();
    }
    if (type === light.selectbox.group) {
      getGroupList();
    }
    if (type === light.selectbox.category) {
      getCategoryList();
    }
    if (type === light.selectbox.role) {
      getRoleList();
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

    light.doget("/user/list", function(err, result) {
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
   * 获取组一览
   */
  var getGroupList = function() {
  };

  /**
   * 获取分类一览
   */
  var getCategoryList = function() {
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
