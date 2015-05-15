
light.buttongroup = light.buttongroup || {};

/**
 * 通过ID设定ButtonGroup的值
 * 主要用于初始化完成以后，设定值
 * @param id
 * @param value
 */
light.buttongroup.set = function(id, value) {

  var button = $("#" + id);
  button.attr("value", value);

  var child = button.children();
  _.each(child, function(item){
    if (value == $(item).attr("value")) {
      $(item).addClass("btn-info");
      $(item).attr("active", "on");
    } else {
      $(item).removeClass("btn-info");
      $(item).removeAttr("active");
    }
  });
};

/**
 * 代替Radio的按钮组合
 * @param id 字符串
 * @param value
 * @param clickCallback
 * @constructor
 */
var ButtonGroup = function(id, value, clickCallback) {
  this.id = $("#" + id);
  this.value = value;

  // append event
  var self = this;
  this.id.on("click", "button", function(){
    self.value = $(this).attr("value");
    self.init();

    if (clickCallback) {

      // find button options
      var option = {};
      $(this).parent().each(function () {
        $.each(this.attributes, function () {
          if (this.specified) {
            option[this.name] = this.value;
          }
        });
      });
      clickCallback(self.value, option);
    }
  });
};

ButtonGroup.prototype.init = function(initCallback) {

  // set default value
  this.id.attr("value", this.value);

  var child = this.id.children()
    , self = this;

  _.each(child, function(item){
    if (self.value == $(item).attr("value")) {
      $(item).addClass("btn-info");
      $(item).attr("active", "on");
    } else {
      $(item).removeClass("btn-info");
      $(item).removeAttr("active");
    }
  });

  if (initCallback) {
    initCallback(self.value);
  }

  return this;
};

ButtonGroup.prototype.set = function(value) {
  this.value = value;
  this.init();
};

ButtonGroup.prototype.disable = function(disable) {
  var child = this.id.children();
  _.each(child, function(item){
    if (disable) {
      $(item).attr("disabled", true);
    } else {
      $(item).removeAttr("disabled");
    }
  });
};
