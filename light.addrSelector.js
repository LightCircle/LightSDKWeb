/* 地址选择 */

light.address = light.address || {};

/**
 *
 * @param url 加载地址API
 * @param div 容器ID
 * @param values 地址数据
 *  province: 省
 *    id:   place id
 *    name: place name
 *  city:     市
 *    id:   place id
 *    name: place name
 *  town:     区
 *    id:   place id
 *    name: place name
 * @param selectionChanged  选择事件
 *
 */
light.initAddressSelector = function (url, div, values, selectionChanged) {
  var self = this;

  var sels = $(div + ' select').hide();

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
    self.doget(url, {parent: parent}, function (err, result) {
      if (err) {
        alertify.error("地区信息加载失败。");
      } else {
        callback(result);
      }
    });
  };

  var appendPlace = function (sel, data, index) {

    var target;

    sel.append($("<option />").html('请选择').val(-1));
    _.each(data.items, function (item) {
      if (index !== -1 && values && values[index] && values[index].id === item._id) {
        sel.append($("<option />").html(item.name).val(item._id).attr('selected', 'selected'));
        target = item._id;
      } else {
        sel.append($("<option />").html(item.name).val(item._id));
      }
    });
    sel.show();
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
    } else {
      loadPlace(code, function (result) {
        appendPlace(citySel, result, -1);
      });
    }
    if (townSel) {
      townSel.hide();
    }
    if (selectionChanged) {
      selectionChanged();
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
    } else {
      loadPlace(code, function (result) {
        appendPlace(townSel, result, -1);
      });
    }
    if (selectionChanged) {
      selectionChanged();
    }
  });

  if (townSel) {
    citySel.change(function (event) {
      if (selectionChanged) {
        selectionChanged();
      }
    });
  }
};

/**
 *
 * @param div 容器ID
 * @return data 地址数据
 *  province: 省
 *    id:   place id
 *    name: place name
 *  city:     市
 *    id:   place id
 *    name: place name
 *  town:     区
 *    id:   place id
 *    name: place name
 *
 */
light.getAddressValue = function (div) {
  var sels = $(div + ' select');

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
};
