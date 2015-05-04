
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
light.selectbox.authority = "authority";
light.selectbox.group     = "group";
light.selectbox.category  = "category";
light.selectbox.role      = "role";
light.selectbox.tag       = "tag";
light.selectbox.file      = "file";

/**
 * 选择数据对象
 */
light.selectbox.dataType = "";

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
   */
  light.selectbox.show = function(type, selected) {
    light.selectbox.dataType = type;
    var defaults = selected && selected.length > 0 ? selected.split(",") : undefined;

    light.selectbox.selected = {};
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
  var getUserList = function(selected, url) {
    url = url || "/api/user/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
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
  var getTagList = function(selected, url) {
    url = url || "/api/tag/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
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
  var getGroupList = function(selected, url) {
    url = url || "/api/group/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
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
  var getCategoryList = function(selected, url) {
    url = url || "/api/category/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
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
  var getFileList = function(selected, url) {
    url = url || "/api/file/list";
    light.doget(url, light.selectbox.condition, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
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
            checked: (defaults && _.contains(defaults, item._id)) ? "checked" : ""
          }));
        });
      }
    });
  };

  /**
   * 获取角色一览
   */
  var getRoleList = function(selected, url) {
    url = url || "/api/role/list";
    light.doget(url, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
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
  var getAuthorityList = function(selected, url) {
    url = url || "/api/authority/list";
    light.doget(url, function(err, result) {
      if (err) {
        light.error(err, result.message, false);
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
    var keyword = encodeURI($("#searchKeyword").val());
    var selected = [];
    _.each(light.selectbox.selected, function(val, key){
      selected.push(val.name);
    });

    switch (light.selectbox.dataType) {
      case light.selectbox.user:
        getUserList(selected, "/api/user/search?keyword="+keyword);
        break;
      case light.selectbox.authority:
        getAuthorityList(selected, "/api/authority/search?keyword="+keyword);
        break;
      case light.selectbox.group:
        getGroupList(selected, "/api/group/search?keyword="+keyword);
        break;
      case light.selectbox.category:
        getCategoryList(selected, "/api/category/search?keyword="+keyword);
        break;
      case light.selectbox.role:
        getRoleList(selected, "/api/role/search?keyword="+keyword);
        break;
      case light.selectbox.tag:
        getTagList(selected, "/api/tag/search?keyword="+keyword);
        break;
      case light.selectbox.file:
        getFileList(light.selectbox.selected, "/api/file/search?keyword="+keyword);
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
