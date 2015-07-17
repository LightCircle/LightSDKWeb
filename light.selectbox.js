
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
 * 显示对象的请求API
 * @type String
 */
light.selectbox.url = "";

/**
 * 选择用户的回调函数
 */
light.selectbox.callback = undefined;

/**
 * 常量
 * @type {string}
 */
light.selectbox.user      = "user";
light.selectbox.authority = "authority";
light.selectbox.group     = "group";
light.selectbox.category  = "category";
light.selectbox.role      = "role";
light.selectbox.tag       = "tag";
light.selectbox.file      = "file";
light.selectbox.route     = "route";
light.selectbox.function  = "function";
light.selectbox.board     = "board";
light.selectbox.custom    = "custom";

/**
 * 选择数据对象
 */
light.selectbox.dataType  = "";


/**
 * 是否单选
 * @type {boolean}
 */
light.selectbox.single    = false;

/**
 * 依赖的API
 *  /api/user/list
 *  /api/group/list
 *  /api/category/list
 *  /api/role/list
 *  /api/tag/list
 */
$(function () {

  /**
   * 显示选择对话框
   * @param type
   * @param selected 选中的项目一览
   * @param url 可以自定URL，如果指定，则使用该URL获取后台数据
   */
  light.selectbox.show = function(type, selected, url) {
    light.selectbox.dataType = type;
    var defaults = selected && selected.length > 0 ? selected.split(",") : undefined;

    light.selectbox.selected = {};
    light.selectbox.condition= {};

    light.selectbox.url = url;

    switch (type) {
      case light.selectbox.user:
        getUserList(defaults);
        break;
      case light.selectbox.authority:
        getAuthorityList(defaults);
        break;
      case light.selectbox.group:
        getGroupList(defaults);
        break;
      case light.selectbox.category:
        getCategoryList(defaults);
        break;
      case light.selectbox.role:
        getRoleList(defaults);
        break;
      case light.selectbox.tag:
        getTagList(defaults);
        break;
      case light.selectbox.file:
        getFileList(defaults);
        break;
      case light.selectbox.route:
        getRouteList(defaults);
        break;
      case light.selectbox.function:
        getFunctionList(defaults);
        break;
      case light.selectbox.board:
        getBoardList(defaults);
        break;
      case light.selectbox.custom:
        getCustomList(defaults, all);
        break;
    }

    $("#searchKeyword").val("");
    $("#dlgSelectBox").modal("show");
  };

  light.selectbox.hide = function() {
    $("#dlgSelectBox").modal("hide");
  };

  /**
   * 获取用户一览
   */
  var getUserList = function(selected) {
    var url = light.selectbox.url || "/api/user/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        alertify.error("加载错误");
        // light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {
          var checked = _.indexOf(selected, item.id) >= 0;
          if (checked) {
            light.selectbox.selected[item._id] = {
              name: item.id,
              option: item.name
            };
          }

          dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
            index: index + 1,
            id: item._id,
            icon: "user",
            name: item.id,
            option1: item.name,
            option2: "",
            checked: checked
          }));
        });
      }
    });
  };

  /**
   * 获取标签一览
   */
  var getTagList = function(selected) {
    var url = light.selectbox.url || "/api/tag/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        alertify.error("加载错误");
        // light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {
          var checked = _.indexOf(selected, item.name) >= 0;
          if (checked) {
            light.selectbox.selected[item._id] = {
              name: item.name,
              option: ""
            };
          }

          dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
            index: index + 1,
            id: item._id,
            icon: "tag",
            name: item.name,
            option1: "",
            option2: "",
            checked: checked
          }));
        });
      }
    });
  };

  /**
   * 获取组一览
   */
  var getGroupList = function(selected) {
    var url = light.selectbox.url || "/api/group/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        alertify.error("加载错误");
        // light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {
          var checked = _.indexOf(selected, item.name) >= 0;
          if (checked) {
            light.selectbox.selected[item._id] = {
              name: item.name,
              option: ""
            };
          }

          dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
            index: index + 1,
            id: item._id,
            icon: "group",
            name: item.name,
            option1: "",
            option2: "",
            checked: checked
          }));
        });
      }
    });
  };

  /**
   * 获取分类一览
   */
  var getCategoryList = function(selected) {
    var url = light.selectbox.url || "/api/category/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        alertify.error("加载错误");
        // light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {
          var checked = _.indexOf(selected, item.name) >= 0;
          if (checked) {
            light.selectbox.selected[item._id] = {
              name: item.name,
              option: ""
            };
          }

          dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
            index: index + 1,
            id: item._id,
            icon: "bookmark",
            name: item.name,
            option1: item.categoryId,
            option2: item.parent,
            checked: checked
          }));
        });
      }
    });
  };

  /**
   * 获取文件一览
   */
  var getFileList = function(selected) {
    var url = light.selectbox.url || "/api/file/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        // light.error(err, result.message, false);
        alertify.error("加载错误");
      } else {

        var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {
          var checked = _.indexOf(selected, item.name) >= 0;
          if (checked) {
            light.selectbox.selected[item._id] = {
              name: item.name,
              option: Math.ceil(item.length / 1024) + " KB"
            };
          }

          dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
            index: index + 1,
            id: item._id,
            icon: "file",
            name: item.name,
            option1: Math.ceil(item.length / 1024) + " KB",
            option2: "",
            checked: checked
            // checked: (defaults && _.contains(defaults, item._id)) ? "checked" : ""
          }));
        });
      }
    });
  };

  /**
   * 获取角色一览
   */
  var getRoleList = function(selected) {
    var url = light.selectbox.url || "/api/role/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        alertify.error("加载错误");
        // light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {

          var checked = _.indexOf(selected, item.name) >= 0;
          dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
            index: index + 1,
            id: item._id,
            icon: "lock",
            name: item.name,
            option1: item.description,
            option2: "",
            checked: checked
          }));

          if (checked) {
            light.selectbox.selected[item._id] = {
              name: item.name,
              option: item.description
            };
          }
        });
      }
    });
  };

  /**
   * 获取权限一览
   */
  var getAuthorityList = function(selected) {
    var url = light.selectbox.url || "/api/authority/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        alertify.error("加载错误");
        // light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {

          var checked = _.indexOf(selected, item.name) >= 0;
          dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
            index: index + 1,
            id: item._id,
            icon: "lock",
            name: item.name,
            option1: item.description,
            option2: "",
            checked: checked
          }));

          if (checked) {
            light.selectbox.selected[item._id] = {
              name: item.name,
              option: item.description
            };
          }
        });
      }
    });
  };

  /**
   * 获取路径一览
   */
  var getRouteList = function(selected) {
    var url = light.selectbox.url || "/api/route/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        alertify.error("加载错误");
        // light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {

          var checked = _.indexOf(selected, item.url) >= 0;
          dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
            index: index + 1,
            id: item._id,
            icon: "load",
            name: item.url,
            option1: item.description,
            option2: "",
            checked: checked
          }));

          if (checked) {
            light.selectbox.selected[item._id] = {
              name: item.url,
              option: item.description
            };
          }
        });
      }
    });
  };

  /**
   * 获取菜单一览
   */
  var getFunctionList = function(selected) {
    var url = light.selectbox.url || "/api/function/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        alertify.error("加载错误");
        // light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {
          var checked = _.indexOf(selected, item.url) >= 0;
          dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
            index: index + 1,
            id: item._id,
            icon: item.icon,
            name: item.url,
            option1: item.description,
            option2: "",
            checked: checked
          }));

          if (checked) {
            light.selectbox.selected[item._id] = {
              name: item.url,
              option: item.description
            };
          }
        });
      }
    });
  };

  /**
   * 获取路径一览
   */
  var getBoardList = function(selected) {
    var url = light.selectbox.url || "/api/board/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        alertify.error("加载错误");
        // light.error(err, result.message, false);
      } else {

        var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
          , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

        _.each(result.items, function(item, index) {

          var checked = _.indexOf(selected, item.api) >= 0;
          dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
            index: index + 1,
            id: item._id,
            icon: "bars",
            name: item.api,
            option1: item.description,
            option2: "",
            checked: checked
          }));

          if (checked) {
            light.selectbox.selected[item._id] = {
              name: item.api,
              option: item.description
            };
          }
        });
      }
    });
  };

  /**
   * 显示自定义一览 TODO: 确认可用
   */
  var getCustomList = function(selected, all) {

    var tmplDlgSelectBoxBody = _.template($("#tmplDlgSelectBoxBody").html())
      , dlgSelectBoxBody = $("#dlgSelectBoxBody").html("");

    _.each(all, light.selectbox.condition, function (item, index) {

      var checked = _.indexOf(selected, item._id) >= 0;
      dlgSelectBoxBody.append(tmplDlgSelectBoxBody({
        index: index + 1,
        id: item._id,
        icon: "bookmark-o",
        name: item.name,
        option1: item.option1,
        option2: item.option1,
        checked: checked
      }));

      if (checked) {
        light.selectbox.selected[item._id] = {
          name: item.name,
          option: item.option1
        };
      }
    });
  };

  /**
   * 事件绑定
   */
  var events = function() {

    // 选择行
    $("#dlgSelectBoxBody").on("click", "tr", function(event) {
      selectRow($(event.currentTarget));
    });

    // 点击确定按钮
    $("#btnOK").bind("click", function() {
      if (light.selectbox.callback) {
        light.selectbox.callback(light.selectbox.selected);
      }
      light.selectbox.hide();
    });

    // 点击检索
    $("#btnDoSearch").bind("click", function(){
      searchData();
    });
    $("#searchKeyword").keyup(function(){
      if (!_.str.isBlank($(this).val())) {
        searchData();
      }
    });

    // 选择过滤字符
    $("#btnAlphabet").on("click", "a", function() {
      // TODO: 加用户过滤
      console.log($(event.target).html());

      // TODO: 加选择字符及清楚选择的功能
    });
  };

  /**
   * 检索方法
   */
  var searchData = function() {
    // IE下汉字需要手动encode
    // var keyword = encodeURI($("#searchKeyword").val());
    light.selectbox.condition = {
      condition: {
        keyword : $("#searchKeyword").val()
      }
    };

    var selected = [];
    _.each(light.selectbox.selected, function(val, key){
      selected.push(val.name);
    });

    switch (light.selectbox.dataType) {
      case light.selectbox.user:
        getUserList(selected);
        break;
      case light.selectbox.authority:
        getAuthorityList(selected);
        break;
      case light.selectbox.group:
        getGroupList(selected);
        break;
      case light.selectbox.category:
        getCategoryList(selected);
        break;
      case light.selectbox.role:
        getRoleList(selected);
        break;
      case light.selectbox.tag:
        getTagList(selected);
        break;
      case light.selectbox.file:
        getFileList(light.selectbox.selected);
        break;
      case light.selectbox.route:
        getRouteList(light.selectbox.selected);
        break;
      case light.selectbox.function:
        getFunctionList(light.selectbox.selected);
        break;
      case light.selectbox.board:
        getBoardList(light.selectbox.selected);
        break;
    }
  };

  /**
   * 选择行
   * @param target
   */
  var selectRow = function(target) {
    var key = target.attr("key")
      , check = target.children(":last")
      , tmplCheck = $("#tmplCheck").html()
      , tmplUnCheck = $("#tmplUnCheck").html();

    // 单选，则清除前面的选择
    if (light.selectbox.single) {
      if (preChecked) {
        preChecked.removeAttr("checked");
        preChecked.html(tmplUnCheck);
      }

      check.attr("checked", "checked");
      check.html(tmplCheck);
      light.selectbox.selected = {};
      light.selectbox.selected[key] = {
        name: target.attr("value"),
        option: target.attr("option1")
      };

      preChecked = check;
      return;
    }

    if (check.attr("checked")) {
      check.removeAttr("checked");
      check.html(tmplUnCheck);
      delete light.selectbox.selected[key];
    } else {
      check.attr("checked", "checked");
      check.html(tmplCheck);
      light.selectbox.selected[key] = {
        name: target.attr("value"),
        option: target.attr("option1")
      };
    }
  };
  var preChecked = undefined;

  /**
   * 显示字母过滤标题
   */
  var setAlphabet = function() {
    var btnAlphabet = $("#btnAlphabet")
      , tmplAlphabet = _.template($("#tmplAlphabet").html());

    if (!tmplAlphabet) {
      return;
    }

    for (var cc = 65; cc < 90; cc++) {
      btnAlphabet.append(tmplAlphabet({code: String.fromCharCode(cc)}));
    }
  };

  /**
   * 初始化对话框，并执行
   */
  var init = function() {
    //setAlphabet();
    events();
  }();
});
