/**
 * @module Pagination
 * @desc pagination.
 * @param id
 * @param option
 * @param {number} option.rowCount - row counts of every page
 * @param {number} option.pageSize - Number of rows per increase
 * @param {number} option.totalItems - total items
 * @param {string} option.display - if more button shows
 * @param {boolean} option.pagedisplay - if pages display
 * @param {function} option.show
 * @param {function} option.showMore
 * @returns {*}
 */
'use strict';

var React = require('react')
  , ReactDOM = require('react-dom');

module.exports = function (id, option) {
  option = option || {};
  option.rowCount = option.rowCount || 10;
  option.pageSize = option.pageSize || 40;
  return ReactDOM.render(
    React.createElement(Pagination, option),
    document.getElementById(id)
  );
};

var totalpages;

var Pagination = React.createClass({
  getInitialState: function () {
    totalpages = Math.ceil(this.props.totalItems / this.props.rowCount);
    return {
      limit: totalpages > 5 ? 5 : totalpages,
      totalItems: this.props.totalItems,
      start: 1,
      startPage: 1,
      rowCount: this.props.rowCount,
      activePage: 1,
      skip: 0,
      pageSize: this.props.pageSize
    }
  },

  render: function () {
    return React.DOM.div({},
      React.DOM.div({
          className: 'more',
          style: {
            color: '#72c02c', fontSize: '18px', background: 'none',
            textAlign: 'center', border: 'solid 1px #e67e22', borderRadius: '4px',
            padding: '5px 13px', marginBottom: '5px', display: this.props.display
          },
          onClick:this.click,
          onMouseOver:this.onmouseover,
          onMouseOut:this.onmouseout
        },
        React.DOM.i({className: 'fa fa-flickr', style: {marginRight: '8px'}}), '加载更多'
      ),
      React.DOM.div({className: 'pull-right', style: {display: this.props.pagedisplay}},
        React.DOM.ul({className: 'pagination', style: {marginBottom: '0px', marginTop: '0px'}},
          this.canPrev(),
          this.page(),
          this.canNext()
        )
      )
    )
  },

  page: function () {
    var pages = [];
    for (var i = this.state.start; i < this.state.start + this.state.limit; i++) {
      if (i == this.state.activePage) {
        pages.push(React.DOM.li({className: 'active', key: i},
          React.DOM.a({
            href: 'javascript:void(0)',
            style: {padding: '4px 9px'},
            'data-activePage': i,
            onClick: this.changePage
          }, i)))
      } else {
        pages.push(React.DOM.li({key: i},
          React.DOM.a({
            href: 'javascript:void(0)',
            style: {padding: '4px 9px'},
            'data-activePage': i,
            onClick: this.changePage
          }, i)))
      }
    }
    return pages;
  },

  canPrev: function () {
    if (this.state.startPage > 1) {
      return React.DOM.li({},
        React.DOM.a({
            className: 'pre',
            href: 'javascript:void(0)',
            style: {padding: '4px 9px'},
            'data-activePage': 'prev',
            onClick: this.changePage
          },
          React.DOM.i({
            className: 'fa fa-angle-double-left',
            'data-activePage': 'prev',
            onClick: this.changePage
          }))
      )
    }
  },

  canNext: function () {
    if ((this.state.startPage + this.state.limit - 1 < totalpages) && (this.state.limit >= 5)) {
      return React.DOM.li({},
        React.DOM.a({
            className: 'next',
            href: 'javascript:void(0)',
            style: {padding: '4px 9px'},
            'data-activePage': 'next',
            onClick: this.changePage
          },
          React.DOM.i({
            className: 'fa fa-angle-double-right',
            'data-activePage': 'next',
            onClick: this.changePage
          }))
      )
    }
  },

  paginationMore: function () {
    if (this.state.totalItems <= this.state.skip + this.state.pageSize) {
      $('.more').addClass('hide');
      this.setState({skip: this.state.skip += this.state.rowCount},
        this.showMore(this.state.skip));
    } else {
      $('.more').removeClass('hide');
      this.showMore(this.state.skip + this.state.rowCount);
      this.setState({skip: this.state.skip += this.state.pageSize});
    }
  },

  changePage: function (event) {
    var activePage = event.target.getAttribute('data-activePage');
    if (activePage == 'prev') {
      if (this.state.startPage == 1) {
        return false;
      }
      if (this.state.startPage - 5 < 1) {
        this.show(0);
        this.setState({startPage: 1, activePage: 1});
      } else {
        var prevStart = this.state.startPage - 5;
        this.show((prevStart - 1) * this.state.rowCount);
        this.setState({
          startPage: prevStart, activePage: prevStart, start: prevStart, limit: 5
        });
      }
    } else if (activePage == 'next') {
      var loadedItems = (this.state.startPage - 1) * this.state.rowCount;
      var remainder = Math.ceil((this.state.totalItems - loadedItems) / this.state.rowCount);
      if (remainder > 5) {
        var nextStart = this.state.startPage + 5;
        this.show((nextStart - 1) * this.state.rowCount);
        if (remainder - 5 < 5) {
          this.setState({startPage: nextStart, activePage: nextStart, start: nextStart, limit: remainder - 5});
        }
        this.setState({startPage: nextStart, activePage: nextStart, start: nextStart});
      }
      return false;
    } else {
      this.show((activePage - 1) * this.state.rowCount);
      this.setState({activePage: activePage});
    }
  },

  click:function(){
    this.paginationMore();
  },

  onmouseover: function (event) {
    event.target.style.backgroundColor = '#e67e22';
    event.target.style.cursor = 'pointer';
  },

  onmouseout: function (event) {
    event.target.style.backgroundColor = '#fff';
  },

  /**
   * Show the data on each page
   * @param skip
   */
  show: function (skip) {
    this.props.show(skip);
  },

  /**
   * load more
   * @param skip
   */
  showMore: function (skip) {
    this.props.showMore(skip)
  }
});