# light-sdk-web

[DOCS API](http://dl.alphabets.cn/jsdoc/index.html)

### Introduction

    light-sdk-web  encapsulates a series of methods and  a series of front-end 

    components which are developed based on react.js and part third party 

    components.

### Dependencies

     react(After installing light-sdk-web, you don't need to introduce it)
- x-editable    [install](http://vitalets.github.io/x-editable/)
- jstree    [install](https://www.jstree.com/)
- bootstrap [install](http://getbootstrap.com)
- bootstrap-multiselect [install](http://davidstutz.github.io/bootstrap-multiselect/)
- moment    [install](http://momentjs.com/docs/)
- eonasdan-bootstrap-datetimepicker [install](http://eonasdan.github.io/bootstrap-datetimepicker/Installing/)
- alertifyjs    [install](https://alertifyjs.org/)
- underscore    [install](http://underscorejs.org)
- jquery    [install](https://github.com/jquery/jquery-dist)
- fontawesome [install](http://fontawesome.io/)

### Install

- First you need to make sure that the bower is installed.
    Reference to [bower](https://bower.io/)
- Try to install light-sdk-web in the project folder，save new dependencies to your bower.json using the following command
    `bower install light-sdk-web --save`
    Reference to [bower](https://bower.io/)
- View version
    `bower info light-sdk-web`

### Use light-sdk-web

- Only need to refer to the bundle.js or bundle.min.js file
    `<script src="bower_components/light-sdk-web/bundle.js"></script>`
    or
    `<script src="bower_components/light-sdk-web/bundle.min.js"></script>`
- Call functions
    - Call a component and its methods
    `light.<methodname>('<container>', <options>);`
    Example:
    Define a div(id='button-group') in HTML
```
var option = {
    data: [
        {value: '1', title: '表示'},
        {value: '0', title: '非表示'}
    ],
    value: '1',
    disabled: false
};
var bg = light.buttongroup('button-group', option);
bg.onClick = function (val) {
  console.log(val);
};
```
    - Call a method
    `light.<methodname>(<options>);`
Example:
```
light.get('/api/account/login', {id: username, password: password}, function (err) {
        if (err) {
          return light.alertify.error("用户名或密码不正确");
        }
        light.alertify.info("登录成功");
});
```


