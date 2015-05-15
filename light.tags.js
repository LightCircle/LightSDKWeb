
light.tags = light.tags || {};

var Tags = function(id, callback) {

  var self = this;
  this.id = $("#" + id);

  this.id.on("click", "a", function(){
    self.setSelected($(this), !$(this).attr("selected"));
    if (callback) {
      callback($(this).attr("name"), $(this).attr("selected"));
    }
  });
};

Tags.prototype.init = function(values) {

  var self = this
    , template = _.template(light.tags.TEMPLATE_ITEM());

  self.id.html("");

  if (!values || values.length <= 0) {
    return this;
  }

  _.each(values, function (val) {
    self.id.append(template({value: val}));
  });

  return this;
};

Tags.prototype.set = function(values) {

  var self = this;
  values = values || [];

  this.id.find("a").each(function () {
    self.setSelected($(this), _.contains(values, $(this).attr("name")));
  });
};

Tags.prototype.get = function() {
  var result = [];
  this.id.find("a[selected='selected']").each(function () {
    result.push($(this).attr("name"));
  });

  return result;
};

Tags.prototype.setSelected = function(item, selected) {
  if (selected) {
    item.css("background-color", "#5bc0de");
    item.css("color", "white");
    item.attr("selected", "true");
  } else {
    item.css("background-color", "");
    item.css("color", "");
    item.removeAttr("selected");
  }
};

light.tags.TEMPLATE_ITEM = function() {
  return function(){/*
   <li><a href='#' name='{{ value }}'><i class='fa fa-tags'></i> {{ value }}</a></li>
   */}.toString().split(/\n/).slice(1, -1).join("\n");
};