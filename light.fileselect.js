/**
 * FileSelect.
 *
 * @param id
 * @param option
 *   accept   [string]   Allowed file types (.gif, .jpg, .png). default: *
 *   multiple [boolean]  Allows to select multiple files at once. default: false
 *   size     [number]   Allowed file size. default: 5M
 *   url      [string]   Upload URL
 *   nometa   [boolean]  Whether to create META information, the default is to create
 *   check    [function] Custom validation function,
 *                       if you need to upload files to do a special check, you can expand the method
 *   error    [function] When a file upload exception occurs, the function is called
 *   success  [function] When the upload file is success, call the function
 *   progress [function] Upload progress
 *   data     [object]   The custom information that is saved with the file
 *     extend      [object] extra information
 *     type        [string] custom file type
 *     description [string] file description
 *     path        [string] file logical path
 *
 * @returns {*}
 */

'use strict';

var net = require('./light.net')
  , alertify = require('./light.alertify');

module.exports = function (id, option) {

  option = option || {};
  option.accept = option.accept || '*';
  option.button = option.button || 'right';
  option.size = option.size || '5242880';
  option.url = option.url || (option.nometa ? '/api/file/upload' : '/api/file/add');

  option.check = function () {
  };
  option.success = function () {
  };
  option.progress = function (val) {
    console.log(val);
  };
  option.error = function (error) {
    alertify.error(error);
  };

  return ReactDOM.render(
    React.createElement(FileSelect, option),
    document.getElementById(id)
  );
};

var FileSelect = React.createClass({
  getInitialState: function () {
    return {}
  },

  render: function () {
    return React.DOM.div({className: 'input-group'},
      this.button('left'),
      React.DOM.input({
        type: 'text',
        className: 'form-control',
        readOnly: true,
        style: {backgroundColor: '#fff'},
        onClick: this.click
      }),
      this.input(),
      this.button('right')
    );
  },

  button: function (side) {
    if (side == this.props.button) {
      return React.DOM.span({className: 'input-group-btn', style: {backgroundColor: '#fff'}},
        React.DOM.button({className: 'btn btn-default', type: 'button', onClick: this.click},
          React.DOM.i({className: 'fa fa-folder-open'}),
          React.DOM.span({}, 'Choose file')
        )
      );
    }

    return undefined;
  },

  input: function () {

    return React.DOM.input({
      style: {display: 'none'},
      accept: this.props.accept,
      multiple: this.props.multiple,
      onChange: this.change,
      type: 'file',
      ref: 'file'
    });
  },

  change: function (event) {
    var files = event.target.files;

    // No files selected
    if (!files || files.length <= 0) {
      return false;
    }

    // Create form data
    var fd = new FormData(), size = 0;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      size += file.size;
      fd.append('files', file);
    }

    // Check file size
    if (size > this.props.size) {
      return this.props.error('The file is too large');
    }

    // Upload file
    net.postData(this.props.url, {data: this.props.data}, fd, function (err, result) {
      if (err) {
        return this.props.error('error');
      }

      this.props.success(result);
    }.bind(this), this.props.progress);
  },

  click: function () {
    $(ReactDOM.findDOMNode(this.refs.file)).trigger('click');
  }

});
