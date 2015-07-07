(function ($) {

  /*
   一、用法示例：

   1.无数据初始化

   a.使用默认参数
   $('#your_div').addresspicker(null);

   b.使用自定义的option
   $('#your_div').addresspicker(null,your_options);

   2.带数据初始化

   a.使用默认参数
   $('#your_div').addresspicker(your_data);

   b.使用自定义的option
   $('#your_div').addresspicker(your_data,your_options);

   3.从控件获取值

   $('#your_div').addresspicker();

   二、option说明

   {
   level: 3,              //可选值[2,3] 2-省市选择 3-省市区选择

   changed: null,         //选择改变时触发的函数

   error: null,           //加载错误是处罚的函数

   class: 'form-control', //每个select元素的class,可为数组
   //当为数组时,数组第一个元素对应第一个select的class,第二个元素对应第二个select的class,第三个同理

   wrap: $('<div>').addClass('col-sm-4')
   //每个select的外层元素,可为jQuery对象,可为字符串,或者两者构成的数组
   //当为数组时,数组的第一个元素对应第一个select的外层元素,数组的第一个元素对应第一个select的外层元素,第三个同理
   };

   当不传option或者option中项不全时,空缺的option项为默认值.
   各个option的默认值见 $.fn.addresspicker.defaults

   */



  $.fn.addresspicker = function () {

    var getData, data, opt;
    if (arguments.length == 0) {
      getData = true;
    } else if (arguments.length == 1) {
      data = arguments[0];
    } else if (arguments.length == 2) {
      data = arguments[0];
      opt = arguments[1];
    }

    if (getData) {

      var sels = this.first().find('select');

      var provinceSel = sels[0] ? $(sels[0]) : null;
      var citySel = sels[1] ? $(sels[1]) : null;
      var townSel = sels[2] ? $(sels[2]) : null;

      var data = {};
      if (provinceSel && provinceSel.is(':visible') && provinceSel.find(":selected").val() && provinceSel.find(":selected").val() != -1) {
        data.province = {name: provinceSel.find(":selected").text(), id: provinceSel.find(":selected").val()};
      }
      if (citySel && citySel.is(':visible') && citySel.find(":selected").val() && citySel.find(":selected").val() != -1) {
        data.city = {name: citySel.find(":selected").text(), id: citySel.find(":selected").val()};
      }
      if (townSel && townSel.is(':visible') && townSel.find(":selected").val() && townSel.find(":selected").val() != -1) {
        data.town = {name: townSel.find(":selected").text(), id: townSel.find(":selected").val()};
      }
      return data;


    } else {

      var opts = $.extend({}, $.fn.addresspicker.defaults, opt);

      // 数据加载
      var curData = {};

      if (data) {
        var target = data._id
          , parent = data.parent;
        // 省
        if (parent == "root") {
          curData = {
            province: target ,
            city    : "",
            town    : ""
          }
          opts.level = 1;

        } else if (data.options && data.options.place) {
          var grand = data.options.place[parent].parent;
          // 市
          if (grand && grand == "root") {

            curData = {
              province: parent ,
              city    : target,
              town    : ""
            }
            opts.level = 2;

            // 县
          } else {
            curData = {
              province: grand,
              city    : parent,
              town    : target
            }

          }
        }
      }

      return this.each(function () {
        $(this).empty();
        for (var i = 0; i < opts.level; i++) {

          var sel = $('<select>').hide().prop('disabled',$(this).attr('aria-disabled') == 'true');
          var sel_cls = _.isArray(opts.class) ? opts.class[i] : opts.class;
          sel.addClass(sel_cls);

          var wrap = _.isArray(opts.wrap) ? opts.wrap[i] : opts.wrap;

          if (opts.styled) {
            wrap = wrap.clone();
            sel = $('<label>').hide().addClass('select').append(sel).append($('<i>'));
          }

          $(this).append(wrap.append(sel));
        }
        init($(this), curData, opts);
      });
    }

  };


  function init(div, curData, opt) {

    var sels = div.find('select');

    var provinceSel = sels[0] ? $(sels[0]) : null;
    var citySel = sels[1] ? $(sels[1]) : null;
    var townSel = sels[2] ? $(sels[2]) : null;
    if (provinceSel) {
      provinceSel.empty().unbind("change");
    }
    if (citySel) {
      citySel.empty().unbind("change");
    }
    if (townSel) {
      townSel.empty().unbind("change");
    }

    var loadPlace = function (parent, callback) {
      light.doget(opt.url, {condition: {parent: parent, valid: 1}, order: "sort"}, function (err, result) {

        if (err) {
          alertify.error("加载错误");
          if (opt.error) {
            opt.error(err);
          }
        } else {
          callback(result);
        }
      });
    };

    var appendPlace = function (sel, data, index) {

      var target;

      sel.append($("<option />").html('请选择').val(-1));
      _.each(data.items, function (item) {
        if (index !== -1 && curData && curData[index] === item._id) {
          sel.append($("<option />").html(item.name).val(item._id).attr('selected', 'selected'));
          target = item._id;
        } else {
          sel.append($("<option />").html(item.name).val(item._id));
        }
      });
      sel.show();
      sel.parent().show();
      return target;
    };

    if (provinceSel) {
      loadPlace('root', function (result) {
        var targetPcode = appendPlace(provinceSel, result, 'province');
        if (citySel && targetPcode) {
          loadPlace(targetPcode, function (result) {
            var targetCcode = appendPlace(citySel, result, 'city');
            if (townSel && targetCcode) {
              loadPlace(targetCcode, function (result) {
                var targetTcode = appendPlace(townSel, result, 'town');
              });
            }
          });
        }
      });
    }

    provinceSel.change(function (event) {
      var code = event.target.value;
      citySel.empty();
      if (code == -1) {
        citySel.hide();
        citySel.parent().hide();
      } else {
        loadPlace(code, function (result) {
          appendPlace(citySel, result, -1);
        });
      }
      if (townSel) {
        townSel.hide();
        townSel.parent().hide();
      }
      if (opt.changed) {
        opt.changed();
      }
    });

    citySel.change(function (event) {
      if (!townSel) {
        return;
      }
      var code = event.target.value;
      townSel.empty();
      if (code == -1) {
        townSel.hide();
        townSel.parent().hide();
      } else {
        loadPlace(code, function (result) {
          appendPlace(townSel, result, -1);
        });
      }
      if (opt.changed) {
        opt.changed();
      }
    });

    if (townSel) {
      citySel.change(function (event) {
        if (opt.changed) {
          opt.changed();
        }
      });
    }
  };


  $.fn.addresspicker.defaults = {
    url:'/api/place/list',
    level: 3,
    changed: null,
    error: null,
    class: 'form-control',
    styled: true,
    wrap: [
      $('<div>').addClass('col-sm-4').css('padding', '2px'),
      $('<div>').addClass('col-sm-4').css('padding', '2px'),
      $('<div>').addClass('col-sm-4').css('padding', '2px')]
  };

})(jQuery);

